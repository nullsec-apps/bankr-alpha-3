import { Component, type ReactNode } from 'react'
import { AlertTriangle } from 'lucide-react'

export default class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  state = { hasError: false }
  static getDerivedStateFromError() { return { hasError: true } }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full bg-[#0A0C0E] flex flex-col items-center justify-center px-6 text-center">
          <AlertTriangle size={40} className="text-[#FF6B1A] mb-4" strokeWidth={1.5} />
          <h2 className="font-display font-bold text-xl text-[#E8EDF0]">Signal feed interrupted</h2>
          <p className="mt-2 text-sm text-[#5A6671] max-w-sm">Something broke in the deck. Reload to reconnect to the live Base stream.</p>
          <button onClick={() => window.location.reload()} className="mt-6 bg-[#FF6B1A] hover:bg-[#ff7d33] transition-all duration-200 text-black font-semibold rounded-md h-11 px-6 text-sm">Reconnect</button>
        </div>
      )
    }
    return this.props.children
  }
}