import { useEffect, useRef, useState } from 'react'

export function useCountAnimation(value: number, duration = 600) {
  const [display, setDisplay] = useState(value)
  const [direction, setDirection] = useState(0)
  const prev = useRef(value)
  const raf = useRef<number>()

  useEffect(() => {
    if (value === prev.current) return
    const from = prev.current
    const to = value
    setDirection(to > from ? 1 : -1)
    const start = performance.now()
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration)
      const eased = 1 - Math.pow(1 - p, 3)
      setDisplay(from + (to - from) * eased)
      if (p < 1) raf.current = requestAnimationFrame(tick)
      else { setDisplay(to); prev.current = to }
    }
    raf.current = requestAnimationFrame(tick)
    const clear = setTimeout(() => setDirection(0), duration + 200)
    return () => { if (raf.current) cancelAnimationFrame(raf.current); clearTimeout(clear) }
  }, [value, duration])

  return { display, direction }
}