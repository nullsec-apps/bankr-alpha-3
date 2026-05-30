import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import SignalRow from './SignalRow'
import EmptyDeck from './EmptyDeck'
import { useTokenStream } from '../hooks/useTokenStream'
import { useWatchlist } from '../hooks/useWatchlist'
import { WifiOff } from 'lucide-react'

interface Props { selected: string | null; onSelect: (a: string) => void }
export default function SignalStream({ selected, onSelect }: Props) {
  const { qualifying, contenders, expired, isLoading, isError } = useTokenStream()
  const { pinned, toggle } = useWatchlist()
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <div className="flex-1 flex flex-col min-w-0 border-r border-[#1F252B] bg-[#0A0C0E]">
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1F252B] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-sm text-[#E8EDF0]">Signal Stream</span>
          <span className="text-xs mono text-[#FF6B1A]">{qualifying.length}</span>
        </div>
        <div className="flex items-center gap-3 text-[10px] mono text-[#5A6671] uppercase">
          <span className="hidden sm:inline">SPARK</span><span>MC</span><span>VOL</span><span>RATIO</span>
        </div>
      </div>
      <ScrollArea className="flex-1">
        {isError && qualifying.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <WifiOff size={28} className="text-[#5A6671] mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[#5A6671]">Couldn't reach DexScreener. Retrying on next block…</p>
          </div>
        ) : isLoading && qualifying.length === 0 ? (
          <div className="p-3 space-y-2">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 w-full bg-[#13171B]" />)}
          </div>
        ) : qualifying.length === 0 ? (
          <EmptyDeck contenders={contenders} expired={expired} onSelect={onSelect} />
        ) : (
          <AnimatePresence initial={false}>
            {qualifying.map(t => (
              <SignalRow
                key={t.tokenAddress}
                token={t}
                selected={selected === t.pairAddress}
                pinned={pinned.includes(t.tokenAddress)}
                onSelect={() => onSelect(t.pairAddress)}
                onPin={() => toggle(t.tokenAddress)}
                dimmed={hovered != null && hovered !== t.tokenAddress}
                onHover={setHovered}
              />
            ))}
          </AnimatePresence>
        )}
      </ScrollArea>
    </div>
  )
}