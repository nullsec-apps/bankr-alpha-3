import { Separator } from '@/components/ui/separator'
import FilterChips from './FilterChips'
import { useBlockTicker } from '../hooks/useBlockTicker'
import { useTokenStream } from '../hooks/useTokenStream'
import { useEffect, useState } from 'react'
import { Boxes } from 'lucide-react'

export default function CommandHeader() {
  const { blockHeight, secondsToNext } = useBlockTicker()
  const { counts } = useTokenStream()
  const [now, setNow] = useState(Date.now())
  useEffect(() => { const id = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(id) }, [])
  const time = new Date(now).toLocaleTimeString('en-US', { hour12: false })

  return (
    <header className="flex-shrink-0 border-b border-[#1F252B] bg-[#0E1216]">
      <div className="flex items-center justify-between px-4 sm:px-6 h-14 gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF6B1A]" style={{ animation: 'pulseHeat 1.2s ease-in-out infinite' }} />
            <span className="font-display font-extrabold text-[#E8EDF0] text-lg tracking-tight">BANKR<span className="text-[#FF6B1A]">ALPHA</span></span>
          </div>
          <Separator orientation="vertical" className="h-6 bg-[#1F252B] hidden sm:block" />
          <div className="hidden sm:flex items-center gap-2 text-xs mono text-[#5A6671]">
            <Boxes size={14} className="text-[#1AE5A0]" strokeWidth={2} />
            <span>#{blockHeight.toLocaleString()}</span>
            <span className="text-[#FF6B1A]">~{secondsToNext.toFixed(1)}s</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center gap-3 text-xs mono">
            <span className="text-[#5A6671]">LIVE</span>
            <span className="text-[#FF6B1A] font-semibold">{counts.qualifying}</span>
            <span className="text-[#5A6671]">signals</span>
            <Separator orientation="vertical" className="h-4 bg-[#1F252B]" />
            <span className="text-[#5A6671] tabular-nums">{time}</span>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-6 py-2 border-t border-[#1F252B] bg-[#0A0C0E] overflow-x-auto">
        <FilterChips />
      </div>
    </header>
  )
}