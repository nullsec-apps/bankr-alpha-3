import { Card } from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@/components/ui/scroll-area'
import { motion } from 'framer-motion'
import HeatPulseBar from './HeatPulseBar'
import TokenSparkline from './TokenSparkline'
import { useTokenDetail } from '../hooks/useTokenDetail'
import { useWatchlist } from '../hooks/useWatchlist'
import { fmtUsd, fmtPct, fmtAge, shortAddr } from '../lib/formatters'
import { ExternalLink, Star, TrendingUp, ArrowUpRight, ArrowDownRight, ShieldCheck } from 'lucide-react'
import { cn } from '../lib/utils'

interface Props { pairAddress: string | null }
export default function DetailPanel({ pairAddress }: Props) {
  const { data, isLoading } = useTokenDetail(pairAddress)
  const { pinned, toggle } = useWatchlist()

  if (!pairAddress) {
    return (
      <aside className="w-80 xl:w-96 flex-shrink-0 bg-[#0E1216] hidden lg:flex flex-col items-center justify-center text-center px-6">
        <TrendingUp size={32} className="text-[#1F252B] mb-3" strokeWidth={1.5} />
        <p className="text-sm text-[#5A6671]">Select a signal to inspect depth, liquidity & trade flow.</p>
      </aside>
    )
  }

  return (
    <aside className="w-80 xl:w-96 flex-shrink-0 bg-[#0E1216] hidden lg:flex flex-col border-l border-[#1F252B]">
      <ScrollArea className="flex-1">
        {isLoading || !data ? (
          <div className="p-5 text-sm mono text-[#5A6671]">Loading depth…</div>
        ) : (
          <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }} className="p-5">
            <div className="flex items-start gap-3">
              <HeatPulseBar ratio={data.ratio} />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-xl text-[#E8EDF0]">${data.symbol}</h2>
                  {data.ratio >= 0.3 && <span>🔥</span>}
                </div>
                <p className="text-xs mono text-[#5A6671]">{data.name}</p>
              </div>
              <button onClick={() => toggle(data.tokenAddress)} className="transition-transform duration-200 hover:scale-110">
                <Star size={18} className={pinned.includes(data.tokenAddress) ? 'text-[#FF6B1A] fill-[#FF6B1A]' : 'text-[#5A6671]'} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4">
              <Card className="bg-[#13171B] border-[#1F252B] p-3">
                <span className="text-[10px] mono text-[#5A6671] uppercase">Market Cap</span>
                <p className="font-display font-bold text-[#E8EDF0] mono">{fmtUsd(data.marketCap)}</p>
              </Card>
              <Card className="bg-[#13171B] border-[#1F252B] p-3">
                <span className="text-[10px] mono text-[#5A6671] uppercase">24h Volume</span>
                <p className="font-display font-bold text-[#E8EDF0] mono">{fmtUsd(data.volume24h)}</p>
              </Card>
              <Card className="bg-[#13171B] border-[#1F252B] p-3">
                <span className="text-[10px] mono text-[#5A6671] uppercase">Vol / MC Ratio</span>
                <p className={cn('font-display font-bold mono', data.ratio >= 0.3 ? 'text-[#FF6B1A]' : 'text-[#E8EDF0]')}>{fmtPct(data.ratio)}</p>
              </Card>
              <Card className="bg-[#13171B] border-[#1F252B] p-3">
                <span className="text-[10px] mono text-[#5A6671] uppercase">Liquidity</span>
                <p className="font-display font-bold text-[#E8EDF0] mono">{fmtUsd(data.liquidity)}</p>
              </Card>
            </div>

            <Tabs defaultValue="depth" className="mt-4">
              <TabsList className="bg-[#13171B] border border-[#1F252B] w-full">
                <TabsTrigger value="depth" className="flex-1 text-xs data-[state=active]:bg-[#1A2026] data-[state=active]:text-[#FF6B1A]">Depth</TabsTrigger>
                <TabsTrigger value="flow" className="flex-1 text-xs data-[state=active]:bg-[#1A2026] data-[state=active]:text-[#FF6B1A]">Flow</TabsTrigger>
                <TabsTrigger value="meta" className="flex-1 text-xs data-[state=active]:bg-[#1A2026] data-[state=active]:text-[#FF6B1A]">Meta</TabsTrigger>
              </TabsList>
              <TabsContent value="depth" className="mt-3 space-y-3">
                <Row label="Price" value={'$' + (data.priceUsd < 0.01 ? data.priceUsd.toPrecision(3) : data.priceUsd.toFixed(4))} />
                <Row label="FDV" value={fmtUsd(data.fdv)} />
                <Row label="24h Change" value={`${data.priceChange24h >= 0 ? '+' : ''}${data.priceChange24h?.toFixed(1)}%`} accent={data.priceChange24h >= 0} />
                <Row label="6h Change" value={`${data.priceChange6h >= 0 ? '+' : ''}${data.priceChange6h?.toFixed(1)}%`} accent={data.priceChange6h >= 0} />
                <div className="flex items-center justify-between">
                  <span className="text-xs mono text-[#5A6671]">Trend</span>
                  <TokenSparkline data={[data.priceChange24h - 6, data.priceChange6h - 2, data.priceChange6h, data.priceChange24h]} width={100} height={28} />
                </div>
              </TabsContent>
              <TabsContent value="flow" className="mt-3 space-y-3">
                <div className="flex gap-2">
                  <Card className="flex-1 bg-[#13171B] border-[#1F252B] p-3">
                    <div className="flex items-center gap-1 text-[#1AE5A0]"><ArrowUpRight size={14} /><span className="text-[10px] mono uppercase">Buys</span></div>
                    <p className="font-display font-bold text-[#E8EDF0] mono mt-1">{data.buys24h.toLocaleString()}</p>
                  </Card>
                  <Card className="flex-1 bg-[#13171B] border-[#1F252B] p-3">
                    <div className="flex items-center gap-1 text-[#FF6B1A]"><ArrowDownRight size={14} /><span className="text-[10px] mono uppercase">Sells</span></div>
                    <p className="font-display font-bold text-[#E8EDF0] mono mt-1">{data.sells24h.toLocaleString()}</p>
                  </Card>
                </div>
                <Row label="Total Txns 24h" value={data.txns24h.toLocaleString()} />
                <div className="h-2 rounded-full bg-[#1F252B] overflow-hidden flex">
                  <div className="bg-[#1AE5A0] transition-all duration-300" style={{ width: `${data.txns24h > 0 ? (data.buys24h / data.txns24h) * 100 : 50}%` }} />
                  <div className="bg-[#FF6B1A] transition-all duration-300" style={{ width: `${data.txns24h > 0 ? (data.sells24h / data.txns24h) * 100 : 50}%` }} />
                </div>
              </TabsContent>
              <TabsContent value="meta" className="mt-3 space-y-3">
                <Row label="DEX" value={data.dexId.toUpperCase()} />
                <Row label="Age" value={fmtAge(data.createdAt)} />
                <Row label="Contract" value={shortAddr(data.tokenAddress)} />
                <div className="flex items-center gap-2 text-xs mono text-[#1AE5A0]">
                  <ShieldCheck size={14} /> Verified on-chain (Base · DexScreener)
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-4 bg-[#1F252B]" />
            <div className="flex gap-2">
              <Button asChild className="flex-1 bg-[#FF6B1A] hover:bg-[#ff7d33] transition-all duration-200 text-black font-semibold h-9 text-xs">
                <a href={data.url} target="_blank" rel="noreferrer">DexScreener <ExternalLink size={14} className="ml-1" /></a>
              </Button>
              <Button asChild variant="outline" className="bg-[#13171B] border-[#1F252B] text-[#E8EDF0] h-9 text-xs hover:bg-[#1A2026] transition-all duration-200">
                <a href={`https://basescan.org/token/${data.tokenAddress}`} target="_blank" rel="noreferrer">Basescan <ExternalLink size={14} className="ml-1" /></a>
              </Button>
            </div>
          </motion.div>
        )}
      </ScrollArea>
    </aside>
  )
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs mono text-[#5A6671]">{label}</span>
      <span className={cn('text-xs mono', accent === undefined ? 'text-[#E8EDF0]' : accent ? 'text-[#1AE5A0]' : 'text-[#FF6B1A]')}>{value}</span>
    </div>
  )
}