import { useLivePool } from "@/hooks/live/useLivePool";
import { useSeedPool } from "@/hooks/presale/useSeedPool";
import { useToken } from "@/hooks/useToken";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { CoinNotFound } from "./coin-not-found";
import { LiveCoin } from "./live-coin";
import { MockCoin } from "./mock-coin";
import { PresaleCoin } from "./presale-coin";

type CoinProps = {
  coin: string;
  tab: string;
};

export function Coin({ coin, tab }: CoinProps) {
  const { data: token, isLoading: tokenIsLoading } = useToken(coin);
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const { data: seedPool, isLoading: seedPoolIsLoading } = useSeedPool(
    !useMockData && token?.status === "PRESALE" ? token?.address : undefined,
  );
  const { data: livePool, isLoading: livePoolIsLoading } = useLivePool(
    !useMockData && token?.status === "LIVE" ? token.address : undefined,
  );

  if (tokenIsLoading || seedPoolIsLoading || livePoolIsLoading)
    return (
      <div className="text-regular">
        <Typography variant="h4">Loading...</Typography>
      </div>
    );
  if (!token) return <CoinNotFound />;

  if (useMockData) return <MockCoin coinMetadata={token} tab={tab} />;

  if (seedPool) return <PresaleCoin coinMetadata={token} tab={tab} seedPoolData={seedPool} />;
  if (livePool) return <LiveCoin coinMetadata={token} tab={tab} livePoolData={livePool} />;

  return <CoinNotFound />;
}
