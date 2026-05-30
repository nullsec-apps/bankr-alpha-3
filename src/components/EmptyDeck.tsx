import { motion } from 'framer-motion'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import HeatPulseBar from './HeatPulseBar'
import { fmtUsd, fmtPct, fmtAge } from '../lib/formatters'
import type { StreamToken } from '../hooks/useTokenStream'
import { Flame, Clock } from 'lucide-react'

interface Props {
  contenders: StreamToken[]
  expired: StreamToken[]
  onSelect: (a: string) => void
}
export default function EmptyDeck({ contenders, expired, onSelect }: Props) {
  const nearest = contenders[0]
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="p-4 sm:p-6 max-w-2xl mx-auto">
      <Card className="bg-[#13171B] border-[#1F252B] p-5">
        <div className="flex items-center gap-2">
          <Flame size={18} className="text-[#8A6230]" strokeWidth={1.5} />
          <span className="font-display font-semibold text-[#E8EDF0]">No live signals</span>
        </div>
        <p className="mt-2 text-sm text-[#5A6671] leading-relaxed">
          {contenders.length} token{contenders.length !== 1 ? 's' : ''} warming up.{' '}
          {nearest && <>Nearest: <span className="text-[#E8EDF0]">${nearest.symbol}</span> at <span className="text-[#FF6B1A]">{fmtPct(nearest.ratio)}</span>.</>}
        </p>
      </Card>

      {contenders.length > 0 && (
        <div className="mt-6">
          <div className="text-xs mono text-[#5A6671] uppercase tracking-widest mb-2">Contenders · 24–29%</div>
          <Card className="bg-[#0E1216] border-[#1F252B] divide-y divide-[#15191D] overflow-hidden p-0">
            {contenders.slice(0, 8).map(t => (
              <div key={t.tokenAddress} onClick={() => onSelect(t.pairAddress)} className="flex items-stretch gap-3 px-3 py-2.5 cursor-pointer hover:bg-[#13171B] opacity-70 hover:opacity-100 transition-all duration-200">
                <HeatPulseBar ratio={t.ratio} isRising={t.isRising} />
                <div className="flex-1 min-w-0">
                  <span className="font-display font-bold text-sm text-[#E8EDF0]">${t.symbol}</span>
                  <span className="text-[10px] mono text-[#5A6671] block">{fmtAge(t.createdAt)}</span>
                </div>
                <span className="text-xs mono text-[#E8EDF0] self-center w-16 text-right">{fmtUsd(t.marketCap)}</span>
                <Badge className="bg-[#1F252B] text-[#8A6230] border-0 mono text-xs self-center">{fmtPct(t.ratio)}</Badge>
              </div>
            ))}
          </Card>
        </div>
      )}

      {expired.length > 0 && (
        <div className="mt-6">
          <Separator className="bg-[#1F252B] mb-4" />
          <div className="text-xs mono text-[#5A6671] uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={12} /> Recently expired</div>
          <div className="flex flex-col gap-2">
            {expired.map(t => (
              <div key={t.tokenAddress} className="flex items-center gap-3 px-3 py-2 rounded bg-[#0E1216] border border-[#15191D] opacity-50">
                <span className="font-display font-bold text-sm text-[#5A6671]">${t.symbol}</span>
                <span className="ml-auto text-xs mono text-[#5A6671]">{fmtPct(t.ratio)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}