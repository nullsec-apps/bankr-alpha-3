import { useHeatPulse } from '../hooks/useHeatPulse'

interface Props { ratio: number; isRising?: boolean; vertical?: boolean }
export default function HeatPulseBar({ ratio, isRising, vertical = true }: Props) {
  const { color, speed, glow, molten } = useHeatPulse(ratio, isRising)
  if (vertical) {
    return (
      <div className="relative w-[3px] self-stretch flex-shrink-0" aria-hidden>
        <div
          className="absolute inset-0 rounded-full"
          style={{
            background: color,
            boxShadow: `0 0 ${6 + glow * 14}px ${color}`,
            animation: `pulseHeat ${speed}s ease-in-out infinite`,
            opacity: molten ? 1 : 0.7
          }}
        />
      </div>
    )
  }
  return (
    <div className="relative h-[3px] w-full" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background: color,
          boxShadow: `0 0 ${6 + glow * 14}px ${color}`,
          animation: `pulseHeat ${speed}s ease-in-out infinite`,
          opacity: molten ? 1 : 0.7
        }}
      />
    </div>
  )
}