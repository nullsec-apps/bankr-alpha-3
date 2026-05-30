import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useTokenFilters } from '../hooks/useTokenFilters'
import { fmtUsd } from '../lib/formatters'
import { SlidersHorizontal } from 'lucide-react'

export default function FilterChips() {
  const { capMax, ratioMin, ageWindow, setCapMax, setRatioMin, setAgeWindow } = useTokenFilters()
  const ages: Array<{ k: 'all' | '24h' | '7d'; l: string }> = [
    { k: 'all', l: 'All' }, { k: '24h', l: '24h' }, { k: '7d', l: '7d' }
  ]
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 bg-[#13171B] border-[#1F252B] text-[#E8EDF0] mono text-xs hover:bg-[#1A2026] hover:text-[#FF6B1A] hover:border-[#FF6B1A]/40 transition-all duration-200">
            Cap ≤ {fmtUsd(capMax)}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#13171B] border-[#1F252B] w-64">
          <div className="text-xs mono text-[#5A6671] mb-3">Max market cap: <span className="text-[#FF6B1A]">{fmtUsd(capMax)}</span></div>
          <Slider min={50000} max={1000000} step={10000} value={[capMax]} onValueChange={([v]) => setCapMax(v)} />
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 bg-[#13171B] border-[#1F252B] text-[#E8EDF0] mono text-xs hover:bg-[#1A2026] hover:text-[#FF6B1A] hover:border-[#FF6B1A]/40 transition-all duration-200">
            Ratio ≥ {(ratioMin * 100).toFixed(0)}%
          </Button>
        </PopoverTrigger>
        <PopoverContent className="bg-[#13171B] border-[#1F252B] w-64">
          <div className="text-xs mono text-[#5A6671] mb-3">Min vol/MC ratio: <span className="text-[#FF6B1A]">{(ratioMin * 100).toFixed(0)}%</span></div>
          <Slider min={0.1} max={1} step={0.01} value={[ratioMin]} onValueChange={([v]) => setRatioMin(v)} />
        </PopoverContent>
      </Popover>
      <div className="flex items-center gap-1 bg-[#13171B] border border-[#1F252B] rounded-md p-0.5">
        {ages.map(a => (
          <button
            key={a.k}
            onClick={() => setAgeWindow(a.k)}
            className={`px-2.5 py-1 rounded text-xs mono transition-all duration-200 ${ageWindow === a.k ? 'bg-[#FF6B1A] text-black font-semibold' : 'text-[#5A6671] hover:text-[#E8EDF0]'}`}
          >
            {a.l}
          </button>
        ))}
      </div>
      <Badge className="bg-transparent border-0 text-[#5A6671] mono text-[10px] hidden lg:flex items-center gap-1">
        <SlidersHorizontal size={12} /> Live filters
      </Badge>
    </div>
  )
}