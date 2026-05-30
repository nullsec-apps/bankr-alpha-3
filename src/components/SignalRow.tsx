import { motion } from 'framer-motion'
import HeatPulseBar from './HeatPulseBar'
import StatNumeric from './StatNumeric'
import TokenSparkline from './TokenSparkline'
import { Badge } from '@/components/ui/badge'
import { Star, Pin } from 'lucide-react'
import { fmtUsd, fmtPct, fmtAge } from '../lib/formatters'
import type { StreamToken } from '../hooks/useTokenStream'
import { cn } from '../lib/utils'

interface Props {
  token: StreamToken
  selected: boolean
  pinned: boolean
  onSelect: () => void
  onPin: () => void
  dimmed?: boolean
  onHover?: (a: string | null) => void
}

export default function SignalRow({ token, selected, pinned, onSelect, onPin, dimmed, onHover }: Props) {
  const spark = [token.priceChange24h - 8, token.priceChange6h - 2, token.priceChange6h, token.priceChange24h]
  return (
    <motion.div
      initial={token.isNew ? { opacity: 0, y: -16 } : false}
      animate={{ opacity: dimmed ? 0.35 : 1, y: 0 }}
      transition={{ duration: 0.4 }}
      onClick={onSelect}
      onMouseEnter={() => onHover?.(token.tokenAddress)}
      onMouseLeave={() => onHover?.(null)}
      className={cn(
        'group flex items-stretch gap-3 px-3 py-2.5 cursor-pointer border-b border-[#15191D] transition-all duration-200',
        selected ? 'bg-[#1A2026]' : 'hover:bg-[#13171B]',
        token.isNew && 'flash-in'
      )}
    >
      <HeatPulseBar ratio={token.ratio} isRising={token.isRising} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-[#E8EDF0] text-sm truncate">${token.symbol}</span>
          {token.ratio >= 0.3 && <span className="text-xs">🔥</span>}
          <button
            onClick={(e) => { e.stopPropagation(); onPin() }}
            className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 ml-auto sm:ml-1"
          >
            {pinned ? <Star size={14} className="text-[#FF6B1A] fill-[#FF6B1A]" /> : <Pin size={14} className="text-[#5A6671] hover:text-[#FF6B1A] transition-colors duration-200" />}
          </button>
        </div>
        <span className="text-[10px] mono text-[#5A6671] truncate block">{token.name} · {fmtAge(token.createdAt)}</span>
      </div>
      <div className="hidden sm:flex flex-col items-end justify-center w-16">
        <TokenSparkline data={spark} width={56} height={20} />
      </div>
      <div className="flex flex-col items-end justify-center w-16">
        <StatNumeric value={token.marketCap} format={fmtUsd} className="text-xs text-[#E8EDF0]" />
        <span className="text-[9px] mono text-[#5A6671]">MC</span>
      </div>
      <div className="flex flex-col items-end justify-center w-16">
        <StatNumeric value={token.volume24h} format={fmtUsd} className="text-xs text-[#E8EDF0]" />
        <span className="text-[9px] mono text-[#5A6671]">VOL</span>
      </div>
      <div className="flex flex-col items-end justify-center w-14">
        <Badge className={cn('mono text-xs border-0 px-1.5', token.ratio >= 0.3 ? 'bg-[#FF6B1A]/15 text-[#FF6B1A]' : 'bg-[#1F252B] text-[#5A6671]')}>
          {fmtPct(token.ratio)}
        </Badge>
        <span className={cn('text-[9px] mono mt-0.5', token.priceChange24h >= 0 ? 'text-[#1AE5A0]' : 'text-[#FF6B1A]')}>
          {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h?.toFixed(1)}%
        </span>
      </div>
    </motion.div>
  )
}