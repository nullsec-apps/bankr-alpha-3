import { ScrollArea } from '@/components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import HeatPulseBar from './HeatPulseBar'
import { useWatchlist } from '../hooks/useWatchlist'
import { useTokenStream } from '../hooks/useTokenStream'
import { fmtPct } from '../lib/formatters'
import { Star, X } from 'lucide-react'

interface Props { selected: string | null; onSelect: (a: string) => void }
export default function WatchlistRail({ selected, onSelect }: Props) {
  const { pinned, unpin } = useWatchlist()
  const { qualifying, contenders } = useTokenStream()
  const all = [...qualifying, ...contenders]
  const items = pinned.map(addr => all.find(t => t.tokenAddress === addr)).filter(Boolean) as typeof all

  return (
    <aside className="w-16 lg:w-20 flex-shrink-0 border-r border-[#1F252B] bg-[#0E1216] flex flex-col">
      <div className="py-3 flex items-center justify-center border-b border-[#1F252B]">
        <Star size={16} className="text-[#FF6B1A]" />
      </div>
      <ScrollArea className="flex-1">
        {items.length === 0 ? (
          <div className="p-2 text-center">
            <p className="text-[9px] mono text-[#5A6671] leading-tight mt-4">Pin tokens to watch</p>
          </div>
        ) : (
          <TooltipProvider>
            <div className="py-2 space-y-1">
              {items.map(t => (
                <Tooltip key={t.tokenAddress}>
                  <TooltipTrigger asChild>
                    <div
                      onClick={() => onSelect(t.pairAddress)}
                      className={`group relative mx-1.5 p-1.5 rounded cursor-pointer flex flex-col items-center gap-1 transition-all duration-200 ${selected === t.pairAddress ? 'bg-[#1A2026]' : 'hover:bg-[#13171B]'}`}
                    >
                      <div className="flex items-center gap-1 w-full justify-center">
                        <HeatPulseBar ratio={t.ratio} isRising={t.isRising} />
                      </div>
                      <span className="font-display font-bold text-[10px] text-[#E8EDF0] truncate max-w-full">${t.symbol}</span>
                      <span className={`text-[9px] mono ${t.ratio >= 0.3 ? 'text-[#FF6B1A]' : 'text-[#5A6671]'}`}>{fmtPct(t.ratio)}</span>
                      <button onClick={(e) => { e.stopPropagation(); unpin(t.tokenAddress) }} className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 bg-[#13171B] rounded-full p-0.5 transition-opacity duration-200">
                        <X size={10} className="text-[#5A6671] hover:text-[#FF6B1A]" />
                      </button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="bg-[#13171B] border-[#1F252B] text-[#E8EDF0] mono text-xs">
                    {t.name} · {fmtPct(t.ratio)}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </TooltipProvider>
        )}
      </ScrollArea>
    </aside>
  )
}