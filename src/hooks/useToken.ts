import { TokenApiInstance } from "@/common/solana";
import { TOKEN_INTERVAL } from "@/config/config";
import { getMockToken } from "@/views/home/hooks/mockTokens";
import { useQuery } from "@tanstack/react-query";

const fetchToken = async (tokenAddress: string) => {
  const mockToken = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true" ? getMockToken(tokenAddress) : null;

  if (mockToken) return mockToken;

  try {
    const presaleToken = await TokenApiInstance.getToken("PRESALE", tokenAddress);

    if (presaleToken && Object.keys(presaleToken).length > 0) {
      return presaleToken;
    }

    const liveToken = await TokenApiInstance.getToken("LIVE", tokenAddress);

    if (liveToken && Object.keys(liveToken).length > 0) {
      return liveToken;
    }

    return null;
  } catch (e) {
    console.error(`[fetchToken] Failed to fetch token ${tokenAddress}:`, e);
  }
};

export function useToken(tokenAddress: string) {
  return useQuery({
    queryKey: ["token", tokenAddress],
    queryFn: () => fetchToken(tokenAddress),
    enabled: !!tokenAddress,
    refetchInterval: TOKEN_INTERVAL,
    staleTime: Infinity,
  });
}
