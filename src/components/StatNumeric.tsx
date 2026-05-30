import { useCountAnimation } from '../hooks/useCountAnimation'
import { cn } from '../lib/utils'

interface Props { value: number; format?: (n: number) => string; className?: string }
export default function StatNumeric({ value, format, className }: Props) {
  const { display, direction } = useCountAnimation(value)
  const out = format ? format(display) : Math.round(display).toLocaleString()
  return (
    <span
      className={cn('mono tabular-nums transition-colors duration-300', className)}
      style={{ color: direction > 0 ? '#1AE5A0' : direction < 0 ? '#FF6B1A' : undefined }}
    >
      {out}
    </span>
  )
}