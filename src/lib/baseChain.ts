export const BASE_RPC = 'https://mainnet.base.org'
export const BASE_CHAIN_ID = 8453

export async function getBlockNumber(): Promise<number> {
  try {
    const res = await fetch(BASE_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', id: 1, method: 'eth_blockNumber', params: [] })
    })
    const j = await res.json()
    return parseInt(j.result, 16)
  } catch {
    return 0
  }
}