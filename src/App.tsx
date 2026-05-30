import { useState } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import ErrorBoundary from './components/ErrorBoundary'
import HeroDeck from './components/HeroDeck'
import CommandHeader from './components/CommandHeader'
import WatchlistRail from './components/WatchlistRail'
import SignalStream from './components/SignalStream'
import DetailPanel from './components/DetailPanel'
import MobileStream from './components/MobileStream'

const qc = new QueryClient()

export default function App() {
  const [entered, setEntered] = useState(false)
  const [selected, setSelected] = useState<string | null>(null)

  return (
    <ErrorBoundary>
      <QueryClientProvider client={qc}>
        <AnimatePresence mode="wait">
          {!entered ? (
            <motion.div key="hero" exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <HeroDeck onEnter={() => setEntered(true)} />
            </motion.div>
          ) : (
            <motion.div key="deck" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }} className="h-screen w-screen flex flex-col overflow-hidden bg-[#0A0C0E]">
              <CommandHeader />
              <div className="hidden md:flex flex-1 overflow-hidden">
                <WatchlistRail selected={selected} onSelect={setSelected} />
                <SignalStream selected={selected} onSelect={setSelected} />
                <DetailPanel pairAddress={selected} />
              </div>
              <div className="md:hidden flex-1 overflow-hidden">
                <MobileStream />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </QueryClientProvider>
    </ErrorBoundary>
  )
}