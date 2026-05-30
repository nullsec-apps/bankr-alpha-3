export function fmtUsd(n: number): string {
  if (!isFinite(n) || n == null) return '$0'
  const abs = Math.abs(n)
  if (abs >= 1e9) return '$' + (n / 1e9).toFixed(2) + 'B'
  if (abs >= 1e6) return '$' + (n / 1e6).toFixed(2) + 'M'
  if (abs >= 1e3) return '$' + (n / 1e3).toFixed(1) + 'k'
  if (abs >= 1) return '$' + n.toFixed(2)
  if (abs > 0) return '$' + n.toPrecision(3)
  return '$0'
}

export function fmtPct(n: number): string {
  if (!isFinite(n) || n == null) return '0%'
  return (n * 100).toFixed(0) + '%'
}

export function fmtPctSigned(n: number): string {
  if (!isFinite(n) || n == null) return '0.0%'
  const s = n >= 0 ? '+' : ''
  return s + n.toFixed(1) + '%'
}

export function fmtAge(ts: number): string {
  if (!ts) return '—'
  const diff = Date.now() - ts
  const s = Math.floor(diff / 1000)
  if (s < 60) return s + 's ago'
  const m = Math.floor(s / 60)
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  const d = Math.floor(h / 24)
  return d + 'd ago'
}

export function shortAddr(a: string): string {
  if (!a) return ''
  return a.slice(0, 6) + '…' + a.slice(-4)
}