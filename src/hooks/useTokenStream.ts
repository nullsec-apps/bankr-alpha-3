import { useQuery } from '@tanstack/react-query'
import { useMemo, useRef, useEffect, useState } from 'react'
import { fetchBaseTokens, type Token } from '../lib/baseScreener'
import { qualifies, isContender } from '../lib/tokenMath'
import { useTokenFilters } from './useTokenFilters'

export interface StreamToken extends Token { isNew?: boolean; prevRatio?: number; isRising?: boolean }

export function useTokenStream() {
  const { capMax, ratioMin, ageWindow } = useTokenFilters()
  const { data: raw = [], isLoading, isError, refetch } = useQuery({
    queryKey: ['baseTokens'],
    queryFn: fetchBaseTokens,
    refetchInterval: 12000,
    staleTime: 6000
  })

  const prevSnapshot = useRef<Map<string, number>>(new Map())
  const expiredBuffer = useRef<StreamToken[]>([])
  const newSet = useRef<Set<string>>(new Set())
  const [, force] = useState(0)

  const filtered = useMemo(() => {
    const now = Date.now()
    return raw.filter(t => {
      if (ageWindow === '24h' && t.createdAt && now - t.createdAt > 86400000) return false
      if (ageWindow === '7d' && t.createdAt && now - t.createdAt > 604800000) return false
      return true
    })
  }, [raw, ageWindow])

  const { qualifying, contenders, expired } = useMemo(() => {
    const q: StreamToken[] = []
    const c: StreamToken[] = []
    const prev = prevSnapshot.current
    const currentQualified = new Set<string>()

    for (const t of filtered) {
      const prevRatio = prev.get(t.tokenAddress)
      const isRising = prevRatio != null && t.ratio > prevRatio
      if (t.marketCap <= capMax && t.ratio >= ratioMin && qualifies(t.marketCap, t.ratio)) {
        currentQualified.add(t.tokenAddress)
        q.push({ ...t, prevRatio, isRising, isNew: !prev.has(t.tokenAddress) || (prevRatio != null && prevRatio < ratioMin) })
      } else if (isContender(t.marketCap, t.ratio) || (t.marketCap <= capMax && t.ratio >= 0.24 && t.ratio < ratioMin)) {
        c.push({ ...t, prevRatio, isRising })
      }
    }

    for (const [addr, r] of prev.entries()) {
      if (r >= 0.3 && !currentQualified.has(addr)) {
        const tok = filtered.find(x => x.tokenAddress === addr)
        if (tok && !expiredBuffer.current.find(e => e.tokenAddress === addr)) {
          expiredBuffer.current.unshift({ ...tok })
          expiredBuffer.current = expiredBuffer.current.slice(0, 3)
        }
      }
    }

    q.sort((a, b) => b.ratio - a.ratio)
    c.sort((a, b) => b.ratio - a.ratio)
    return { qualifying: q, contenders: c, expired: expiredBuffer.current }
  }, [filtered, capMax, ratioMin])

  useEffect(() => {
    if (raw.length === 0) return
    const snap = new Map<string, number>()
    for (const t of filtered) snap.set(t.tokenAddress, t.ratio)
    prevSnapshot.current = snap
    const id = setTimeout(() => { newSet.current.clear(); force(x => x + 1) }, 1500)
    return () => clearTimeout(id)
  }, [filtered, raw.length])

  return {
    qualifying,
    contenders,
    expired,
    counts: { qualifying: qualifying.length, contenders: contenders.length, total: filtered.length },
    isLoading,
    isError,
    refetch
  }
}