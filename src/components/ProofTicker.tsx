import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import HeatPulseBar from './HeatPulseBar'
import { fmtUsd, fmtPct } from '../lib/formatters'
import { useTokenStream } from '../hooks/useTokenStream'

export default function ProofTicker() {
  const { qualifying, contenders } = useTokenStream()
  const top = [...qualifying, ...contenders].slice(0, 12)
  const lead = top[0]

  const sample = lead || {
    symbol: 'PEPL', marketCap: 142000, volume24h: 61000, ratio: 0.43, priceChange24h: 12.4
  }

  return (
    <Card className="bg-[#13171B] border-[#1F252B] overflow-hidden p-0">
      <div className="flex items-stretch gap-3 p-4">
        <HeatPulseBar ratio={sample.ratio} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-display font-bold text-lg text-[#E8EDF0]">${sample.symbol}</span>
            <Badge className="bg-[#FF6B1A]/15 text-[#FF6B1A] border-0 mono text-xs">RATIO {fmtPct(sample.ratio)} {sample.ratio >= 0.3 ? '🔥' : ''}</Badge>
          </div>
          <div className="flex gap-4 mt-1 text-xs mono text-[#5A6671]">
            <span>MC <span className="text-[#E8EDF0]">{fmtUsd(sample.marketCap)}</span></span>
            <span>VOL <span className="text-[#E8EDF0]">{fmtUsd(sample.volume24h)}</span></span>
            <span className={sample.priceChange24h >= 0 ? 'text-[#1AE5A0]' : 'text-[#FF6B1A]'}>{sample.priceChange24h >= 0 ? '+' : ''}{sample.priceChange24h?.toFixed(1)}%</span>
          </div>
        </div>
      </div>
      <div className="relative overflow-hidden border-t border-[#1F252B] bg-[#0E1216] h-8">
        <div className="flex items-center gap-6 absolute whitespace-nowrap" style={{ animation: 'marquee 24s linear infinite' }}>
          {[...top, ...top].map((t, i) => (
            <span key={i} className="text-xs mono text-[#5A6671] flex items-center gap-1">
              <span className="text-[#E8EDF0]">${t.symbol}</span>
              <span className={t.ratio >= 0.3 ? 'text-[#FF6B1A]' : 'text-[#5A6671]'}>{fmtPct(t.ratio)}</span>
            </span>
          ))}
          {top.length === 0 && <span className="text-xs mono text-[#5A6671] px-4">Scanning Base for low-cap momentum…</span>}
        </div>
      </div>
      <style>{`@keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}`}</style>
    </Card>
  )
}