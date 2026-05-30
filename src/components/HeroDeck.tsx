import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import ProofTicker from './ProofTicker'
import { ArrowRight, Activity, Zap } from 'lucide-react'

interface Props { onEnter: () => void }
export default function HeroDeck({ onEnter }: Props) {
  return (
    <div className="min-h-screen w-full bg-[#0A0C0E] flex flex-col items-center justify-center px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(circle at 50% 0%, rgba(255,107,26,0.10), transparent 60%)' }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#FF6B1A]/40 to-transparent" />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-2xl py-12"
      >
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="flex items-center gap-2 mb-6 flex-wrap"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1AE5A0]" style={{ animation: 'pulseHeat 1.5s ease-in-out infinite' }} />
            <span className="text-xs mono text-[#5A6671] uppercase tracking-widest">Base · Live On-Chain</span>
          </div>
          <Badge className="bg-[#13171B] text-[#FF6B1A] border border-[#1F252B] mono text-[10px]">BANKR ALPHA</Badge>
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12, duration: 0.55 }}
          className="font-display font-extrabold text-4xl sm:text-6xl text-[#E8EDF0] leading-[0.95] tracking-tight"
        >
          Catch them<br/>before they <span className="text-[#FF6B1A]">move.</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.55 }}
          className="mt-5 text-[#5A6671] text-sm sm:text-base leading-relaxed max-w-lg"
        >
          Live feed of Base tokens under <span className="text-[#E8EDF0] mono">$300k</span> cap with trading volume <span className="text-[#E8EDF0] mono">≥30%</span> of market cap — verified on-chain, refreshed every block.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mt-8"
        >
          <ProofTicker />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.42, duration: 0.5 }}
          className="mt-8 flex flex-col sm:flex-row gap-3 items-start sm:items-center"
        >
          <Button onClick={onEnter} className="bg-[#FF6B1A] hover:bg-[#ff7d33] transition-all duration-200 text-black font-semibold h-12 px-6 text-base group w-full sm:w-auto">
            Open the live deck
            <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-200" size={20} />
          </Button>
          <div className="flex items-center gap-4 text-xs mono text-[#5A6671]">
            <span className="flex items-center gap-1.5"><Activity size={14} className="text-[#1AE5A0]" strokeWidth={2} /> Per-block refresh</span>
            <span className="flex items-center gap-1.5"><Zap size={14} className="text-[#FF6B1A]" strokeWidth={2} /> Heat Pulse signals</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}