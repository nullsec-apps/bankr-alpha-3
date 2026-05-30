export interface Token {
  pairAddress: string
  tokenAddress: string
  symbol: string
  name: string
  priceUsd: number
  marketCap: number
  fdv: number
  volume24h: number
  volume6h: number
  liquidity: number
  priceChange24h: number
  priceChange6h: number
  ratio: number
  createdAt: number
  txns24h: number
  buys24h: number
  sells24h: number
  dexId: string
  url: string
}

function normalize(pair: any): Token | null {
  try {
    const liquidity = pair.liquidity?.usd ?? 0
    const volume24h = pair.volume?.h24 ?? 0
    const volume6h = pair.volume?.h6 ?? 0
    const marketCap = pair.marketCap ?? pair.fdv ?? 0
    const fdv = pair.fdv ?? marketCap
    const priceUsd = parseFloat(pair.priceUsd ?? '0')
    if (liquidity < 1000) return null
    if (marketCap <= 0) return null
    if (priceUsd <= 0) return null
    const ratio = marketCap > 0 ? volume24h / marketCap : 0
    return {
      pairAddress: pair.pairAddress,
      tokenAddress: pair.baseToken?.address ?? '',
      symbol: pair.baseToken?.symbol ?? '?',
      name: pair.baseToken?.name ?? 'Unknown',
      priceUsd,
      marketCap,
      fdv,
      volume24h,
      volume6h,
      liquidity,
      priceChange24h: pair.priceChange?.h24 ?? 0,
      priceChange6h: pair.priceChange?.h6 ?? 0,
      ratio,
      createdAt: pair.pairCreatedAt ?? 0,
      txns24h: (pair.txns?.h24?.buys ?? 0) + (pair.txns?.h24?.sells ?? 0),
      buys24h: pair.txns?.h24?.buys ?? 0,
      sells24h: pair.txns?.h24?.sells ?? 0,
      dexId: pair.dexId ?? '',
      url: pair.url ?? ''
    }
  } catch {
    return null
  }
}

async function fetchPairs(query: string): Promise<Token[]> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/search?q=${encodeURIComponent(query)}`)
    if (!res.ok) return []
    const j = await res.json()
    const pairs: any[] = j.pairs ?? []
    return pairs
      .filter(p => p.chainId === 'base')
      .map(normalize)
      .filter((t): t is Token => t !== null)
  } catch {
    return []
  }
}

export async function fetchBaseTokens(): Promise<Token[]> {
  const queries = ['base', 'WETH base', 'USDC base', 'meme base', 'cbBTC']
  const results = await Promise.all(queries.map(fetchPairs))
  const map = new Map<string, Token>()
  for (const arr of results) {
    for (const t of arr) {
      const existing = map.get(t.tokenAddress)
      if (!existing || t.liquidity > existing.liquidity) {
        map.set(t.tokenAddress, t)
      }
    }
  }
  return Array.from(map.values())
}

export async function fetchTokenByPair(pairAddress: string): Promise<Token | null> {
  try {
    const res = await fetch(`https://api.dexscreener.com/latest/dex/pairs/base/${pairAddress}`)
    if (!res.ok) return null
    const j = await res.json()
    const pair = (j.pairs ?? j.pair) ? (j.pairs?.[0] ?? j.pair) : null
    if (!pair) return null
    return normalize(pair)
  } catch {
    return null
  }
}