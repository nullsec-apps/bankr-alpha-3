interface Props { data: number[]; color?: string; width?: number; height?: number }
export default function TokenSparkline({ data, color = '#FF6B1A', width = 80, height = 24 }: Props) {
  if (!data || data.length < 2) return <div className="text-[#5A6671] text-xs">—</div>
  const min = Math.min(...data)
  const max = Math.max(...data)
  const range = max - min || 1
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * width
    const y = height - ((d - min) / range) * height
    return `${x.toFixed(1)},${y.toFixed(1)}`
  }).join(' ')
  const trendUp = data[data.length - 1] >= data[0]
  const c = trendUp ? '#1AE5A0' : color
  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}