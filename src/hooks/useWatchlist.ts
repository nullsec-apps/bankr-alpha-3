import { useEffect, useState, useCallback } from 'react'

const KEY = 'bankr-alpha-watchlist'

export function useWatchlist() {
  const [pinned, setPinned] = useState<string[]>([])

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setPinned(JSON.parse(raw))
    } catch {}
  }, [])

  const pin = useCallback((addr: string) => {
    setPinned(prev => {
      if (prev.includes(addr)) return prev
      const next = [...prev, addr]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const unpin = useCallback((addr: string) => {
    setPinned(prev => {
      const next = prev.filter(a => a !== addr)
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  const toggle = useCallback((addr: string) => {
    setPinned(prev => {
      const next = prev.includes(addr) ? prev.filter(a => a !== addr) : [...prev, addr]
      try { localStorage.setItem(KEY, JSON.stringify(next)) } catch {}
      return next
    })
  }, [])

  return { pinned, pin, unpin, toggle }
}