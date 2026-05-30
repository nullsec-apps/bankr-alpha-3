export function ratioOf(volume: number, marketCap: number) { return marketCap > 0 ? volume / marketCap : 0 }
export function qualifies(cap: number, ratio: number) { return cap > 0 && cap <= 300000 && ratio >= 0.3 }
export function isContender(cap: number, ratio: number) { return cap > 0 && cap <= 300000 && ratio >= 0.24 && ratio < 0.3 }