import { useQuery } from '@tanstack/react-query'
import { fetchTokenByPair } from '../lib/baseScreener'

export function useTokenDetail(pairAddress: string | null) {
  const { data = null, isLoading } = useQuery({
    queryKey: ['tokenDetail', pairAddress],
    queryFn: () => pairAddress ? fetchTokenByPair(pairAddress) : Promise.resolve(null),
    enabled: !!pairAddress,
    refetchInterval: 10000
  })
  return { data, isLoading }
}