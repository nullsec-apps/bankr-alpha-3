import { ScrollArea } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import HeatPulseBar from './HeatPulseBar'
import TokenSparkline from './TokenSparkline'
import EmptyDeck from './EmptyDeck'
import FilterChips from './FilterChips'
import { useTokenStream } from '../hooks/useTokenStream'
import { useTokenDetail } from '../hooks/useTokenDetail'
import { useWatchlist } from '../hooks/useWatchlist'
import { fmtUsd, fmtPct, fmtAge, shortAddr } from '../lib/formatters'
import { ChevronDown, Star, ExternalLink, ShieldCheck, WifiOff } from 'lucide-react'
import { cn } from '../lib/utils'

export default function MobileStream() {
  const { qualifying, contenders, expired, isLoading, isError } = useTokenStream()
  const { pinned, toggle } = useWatchlist()
  const [open, setOpen] = useState<string | null>(null)

  return (
    <div className="h-full flex flex-col bg-[#0A0C0E]">
      <div className="flex-shrink-0 px-3 py-2 border-b border-[#1F252B] bg-[#0E1216] overflow-x-auto">
        <FilterChips />
      </div>
      <ScrollArea className="flex-1">
        {isError && qualifying.length === 0 ? (
          <div className="p-10 flex flex-col items-center text-center">
            <WifiOff size={26} className="text-[#5A6671] mb-3" strokeWidth={1.5} />
            <p className="text-sm text-[#5A6671]">Couldn't reach DexScreener. Retrying…</p>
          </div>
        ) : isLoading && qualifying.length === 0 ? (
          <div className="p-3 space-y-2">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-16 w-full bg-[#13171B]" />)}</div>
        ) : qualifying.length === 0 ? (
          <EmptyDeck contenders={contenders} expired={expired} onSelect={(a) => setOpen(a)} />
        ) : (
          <div className="p-3 space-y-3">
            <AnimatePresence initial={false}>
              {qualifying.map(t => (
                <motion.div
                  key={t.tokenAddress}
                  initial={t.isNew ? { opacity: 0, y: -12 } : false}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('rounded-lg bg-[#13171B] border border-[#1F252B] overflow-hidden', t.isNew && 'flash-in')}
                >
                  <HeatPulseBar ratio={t.ratio} isRising={t.isRising} vertical={false} />
                  <div className="p-3" onClick={() => setOpen(open === t.pairAddress ? null : t.pairAddress)}>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-bold text-[#E8EDF0]">${t.symbol}</span>
                      {t.ratio >= 0.3 && <span>🔥</span>}
                      <Badge className={cn('ml-auto mono text-xs border-0', t.ratio >= 0.3 ? 'bg-[#FF6B1A]/15 text-[#FF6B1A]' : 'bg-[#1F252B] text-[#5A6671]')}>{fmtPct(t.ratio)}</Badge>
                      <button onClick={(e) => { e.stopPropagation(); toggle(t.tokenAddress) }} className="p-1">
                        <Star size={16} className={pinned.includes(t.tokenAddress) ? 'text-[#FF6B1A] fill-[#FF6B1A]' : 'text-[#5A6671]'} />
                      </button>
                      <ChevronDown size={16} className={cn('text-[#5A6671] transition-transform duration-200', open === t.pairAddress && 'rotate-180')} />
                    </div>
                    <div className="flex gap-4 mt-2 text-xs mono">
                      <span className="text-[#5A6671]">MC <span className="text-[#E8EDF0]">{fmtUsd(t.marketCap)}</span></span>
                      <span className="text-[#5A6671]">VOL <span className="text-[#E8EDF0]">{fmtUsd(t.volume24h)}</span></span>
                      <span className={t.priceChange24h >= 0 ? 'text-[#1AE5A0]' : 'text-[#FF6B1A]'}>{t.priceChange24h >= 0 ? '+' : ''}{t.priceChange24h?.toFixed(1)}%</span>
                      <span className="text-[#5A6671] ml-auto">{fmtAge(t.createdAt)}</span>
                    </div>
                  </div>
                  {open === t.pairAddress && <MobileDrawer pairAddress={t.pairAddress} />}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </ScrollArea>
    </div>
  )
}

function MobileDrawer({ pairAddress }: { pairAddress: string }) {
  const { data, isLoading } = useTokenDetail(pairAddress)
  if (isLoading || !data) return <div className="px-3 pb-3 text-xs mono text-[#5A6671]">Loading depth…</div>
  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="px-3 pb-3 border-t border-[#1F252B] pt-3">
      <div className="grid grid-cols-2 gap-2 text-xs mono">
        <DRow label="Liquidity" value={fmtUsd(data.liquidity)} />
        <DRow label="FDV" value={fmtUsd(data.fdv)} />
        <DRow label="Buys 24h" value={data.buys24h.toLocaleString()} accent />
        <DRow label="Sells 24h" value={data.sells24h.toLocaleString()} />
      </div>
      <div className="flex items-center justify-between mt-3">
        <span className="text-xs mono text-[#5A6671]">Trend</span>
        <TokenSparkline data={[data.priceChange24h - 6, data.priceChange6h - 2, data.priceChange6h, data.priceChange24h]} width={120} height={26} />
      </div>
      <div className="flex items-center gap-1.5 mt-3 text-xs mono text-[#1AE5A0]"><ShieldCheck size={12} /> {shortAddr(data.tokenAddress)}</div>
      <a href={data.url} target="_blank" rel="noreferrer" className="mt-3 flex items-center justify-center gap-1 bg-[#FF6B1A] hover:bg-[#ff7d33] transition-all duration-200 text-black font-semibold rounded h-11 text-xs">
        Open DexScreener <ExternalLink size={14} />
      </a>
    </motion.div>
  )
}

function DRow({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="bg-[#0E1216] rounded p-2">
      <span className="text-[10px] text-[#5A6671] uppercase block">{label}</span>
      <span className={cn('font-semibold', accent ? 'text-[#1AE5A0]' : 'text-[#E8EDF0]')}>{value}</span>
    </div>
  )
}