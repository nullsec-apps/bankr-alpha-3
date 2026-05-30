import { useEffect, useState, useRef } from 'react'
import { getBlockNumber } from '../lib/baseChain'

export function useBlockTicker() {
  const [blockHeight, setBlockHeight] = useState(0)
  const [secondsToNext, setSecondsToNext] = useState(2)
  const [lastRefresh, setLastRefresh] = useState(Date.now())
  const lastBlockTime = useRef(Date.now())

  useEffect(() => {
    let mounted = true
    const poll = async () => {
      const bn = await getBlockNumber()
      if (mounted && bn > 0) {
        setBlockHeight(prev => {
          if (bn !== prev) {
            lastBlockTime.current = Date.now()
            setLastRefresh(Date.now())
          }
          return bn
        })
      }
    }
    poll()
    const id = setInterval(poll, 2000)
    return () => { mounted = false; clearInterval(id) }
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      const elapsed = (Date.now() - lastBlockTime.current) / 1000
      setSecondsToNext(Math.max(0, 2 - (elapsed % 2)))
    }, 100)
    return () => clearInterval(id)
  }, [])

  return { blockHeight, secondsToNext, lastRefresh }
}