export function useHeatPulse(ratio: number, isRising?: boolean) {
  if (ratio >= 0.3) {
    const intensity = Math.min(1, (ratio - 0.3) / 0.5 + 0.4)
    const speed = Math.max(0.6, 1.8 - intensity * 1.2)
    return { color: '#FF6B1A', speed, glow: intensity, ratio, molten: true }
  }
  if (isRising && ratio >= 0.24) {
    return { color: '#1AE5A0', speed: 1.6, glow: 0.5, ratio, molten: false }
  }
  if (ratio >= 0.24) {
    return { color: '#8A6230', speed: 2.4, glow: 0.3, ratio, molten: false }
  }
  return { color: '#5A6671', speed: 3, glow: 0.1, ratio, molten: false }
}