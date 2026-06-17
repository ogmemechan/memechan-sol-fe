import { TokenCard } from "@/components/TokenCard";
import { Button } from "@/memechan-ui/Atoms";
import TextInput from "@/memechan-ui/Atoms/Input/TextInput";
import { Tabs } from "@/memechan-ui/Atoms/Tabs";
import TopBar from "@/memechan-ui/Atoms/TopBar/TopBar";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { formatNumberForDisplay } from "@/utils/formatNumber";
import { formatNumberForTokenCard } from "@/utils/formatNumbersForTokenCard";
import { timeSince } from "@/utils/timeSpents";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { useRouter } from "next/router";
import { useMemo, useState } from "react";

const tabs = ["Chart", "Comments"];

type MockComment = {
  id: number;
  creator: string;
  message: string;
  likes: number;
  liked: boolean;
  replies: number;
  creationDate: number;
  isCreator?: boolean;
};

const initialMockComments: MockComment[] = [
  {
    id: 3,
    creator: "PumpScout1111111111111111111111111111111111",
    message: ">> First. Fast replies, faster candles. wagmi",
    likes: 31,
    liked: false,
    replies: 4,
    creationDate: Date.now() - 1000 * 60 * 18,
    isCreator: true,
  },
  {
    id: 2,
    creator: "MockTrader111111111111111111111111111111111",
    message: "chart actually printing green candles now, lfg",
    likes: 14,
    liked: false,
    replies: 1,
    creationDate: Date.now() - 1000 * 60 * 9,
  },
  {
    id: 1,
    creator: "DemoWallet222222222222222222222222222222222",
    message: "aped 0.5 SOL on the dip, see you on the moon",
    likes: 9,
    liked: false,
    replies: 0,
    creationDate: Date.now() - 1000 * 60 * 3,
  },
];

export function MockCoin({ coinMetadata, tab }: { coinMetadata: SolanaToken; tab: string }) {
  const router = useRouter();
  const activeTab = tabs.includes(tab) ? tab : "Chart";
  const progressInfo = formatNumberForTokenCard({ token: coinMetadata });
  const progress = progressInfo?.progress ?? (coinMetadata.status === "LIVE" ? 100 : 0);
  const chart = useMemo(() => buildChartData(coinMetadata), [coinMetadata]);

  const onTabChange = (nextTab: string) => {
    router.push(
      {
        pathname: `/coin/[coinType]`,
        query: { coinType: coinMetadata.address, tab: nextTab },
      },
      undefined,
      { shallow: true },
    );
  };

  return (
    <>
      <TopBar tokenAddress={coinMetadata.address} tokenSymbol={coinMetadata.symbol} rightIcon={coinMetadata.image} />
      <div className="grid grid-cols-1 gap-3 px-3 xl:px-0 w-full lg:grid-cols-3">
        <div className="flex flex-col gap-3 lg:col-span-2">
          <Tabs className="justify-start items-center gap-x-6" tabs={tabs} onTabChange={onTabChange} activeTab={activeTab} />

          {activeTab === "Chart" && (
            <Card>
              <Card.Header>
                <div className="flex w-full items-center justify-between">
                  <Typography variant="h4">Market</Typography>
                  <Typography variant="body" color={chart.change >= 0 ? "green-100" : "red-100"}>
                    {chart.change >= 0 ? "+" : ""}
                    {chart.change.toFixed(2)}%
                  </Typography>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric label="Price" value={formatMockPrice(chart.lastPrice)} />
                  <Metric label="24h Vol" value={`$${formatNumberForDisplay(chart.volume24h)}`} />
                  <Metric label="High" value={formatMockPrice(chart.high)} />
                  <Metric label="Low" value={formatMockPrice(chart.low)} />
                </div>
                <MockMarketChart chart={chart} accent={chart.change >= 0 ? "up" : "down"} progress={progress} />
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Metric label="Status" value={coinMetadata.status === "LIVE" ? "Live" : "Presale"} />
                  <Metric label="Marketcap" value={`$${coinMetadata.marketcap.toLocaleString()}`} />
                  <Metric label="Holders" value={(coinMetadata.holdersCount ?? 0).toLocaleString()} />
                  <Metric label="Age" value={timeSince(coinMetadata.creationTime)} />
                </div>
              </Card.Body>
            </Card>
          )}

          {activeTab === "Comments" && <MockComments coinAddress={coinMetadata.address} />}
        </div>

        <div className="flex flex-col gap-3">
          <TokenCard token={coinMetadata} progressInfo={progressInfo} showLinks disableContent={false} />
        </div>
      </div>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <Typography variant="body" color="mono-500">
        {label}
      </Typography>
      <Typography variant="h4">{value}</Typography>
    </div>
  );
}

function MockComments({ coinAddress }: { coinAddress: string }) {
  const [comments, setComments] = useState<MockComment[]>(() =>
    initialMockComments.map((comment) => (comment.isCreator ? { ...comment, creator: coinAddress } : comment)),
  );
  const [draft, setDraft] = useState("");

  const handlePost = () => {
    const message = draft.trim();
    if (!message) return;

    setComments((prev) => [
      {
        id: Date.now(),
        creator: "You11111111111111111111111111111111111111",
        message,
        likes: 0,
        liked: false,
        replies: 0,
        creationDate: Date.now(),
      },
      ...prev,
    ]);
    setDraft("");
  };

  const toggleLike = (id: number) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === id
          ? { ...comment, liked: !comment.liked, likes: comment.likes + (comment.liked ? -1 : 1) }
          : comment,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      <Card>
        <Card.Header>
          <div>
            <Typography variant="h4" color="mono-600">
              Post a comment
            </Typography>
          </div>
        </Card.Header>
        <Card.Body>
          <div className="flex flex-col gap-3">
            <TextInput
              value={draft}
              setValue={setDraft}
              placeholder="Comment"
              className="primary-border p-[15px] custom-inner-shadow rounded-b-none"
            />
            <div className="flex justify-end">
              <div className="h-10 w-28">
                <Button variant="primary" onClick={handlePost}>
                  Post
                </Button>
              </div>
            </div>
          </div>
        </Card.Body>
      </Card>

      {comments.map((comment) => (
        <MockCommentCard key={comment.id} comment={comment} isCreator={comment.creator === coinAddress} onLike={() => toggleLike(comment.id)} />
      ))}
    </div>
  );
}

function MockCommentCard({
  comment,
  isCreator,
  onLike,
}: {
  comment: MockComment;
  isCreator: boolean;
  onLike: () => void;
}) {
  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Typography variant="h4" color="green-100" truncate>
              {shortAddress(comment.creator)}
            </Typography>
            {isCreator && (
              <Typography variant="body" color="primary-100">
                creator
              </Typography>
            )}
          </div>
          <Typography variant="body" color="mono-500">
            {timeSince(comment.creationDate)}
          </Typography>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col gap-3">
          <Typography variant="body" color="mono-600" className="whitespace-pre-wrap break-words">
            {comment.message}
          </Typography>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onLike}
              className="text-sm font-bold text-primary-100 sm:hover:underline"
            >
              {comment.liked ? "Unlike" : "Like"} [{comment.likes}]
            </button>
            <button type="button" className="text-sm font-bold text-primary-100 sm:hover:underline">
              Reply [{comment.replies}]
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}

type Candle = {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
};

type MockChartData = {
  candles: Candle[];
  high: number;
  low: number;
  lastPrice: number;
  change: number;
  volume24h: number;
};

function MockMarketChart({ chart, accent, progress }: { chart: MockChartData; accent: "up" | "down"; progress: number }) {
  const width = 900;
  const height = 460;
  const padLeft = 18;
  const padRight = 72;
  const padTop = 22;
  const chartHeight = 286;
  const volumeTop = padTop + chartHeight + 24;
  const volumeHeight = 54;
  const plotWidth = width - padLeft - padRight;
  const priceRange = Math.max(chart.high - chart.low, 0.0000001);
  const maxVolume = Math.max(...chart.candles.map((candle) => candle.volume), 1);
  const upColor = "#179a58";
  const downColor = "#f95292";
  const mutedColor = accent === "up" ? "#203a2d" : "#4d3232";

  const count = chart.candles.length;
  const slot = plotWidth / count;
  const bodyWidth = Math.max(slot * 0.62, 2);

  const priceToY = (price: number) => padTop + chartHeight - ((price - chart.low) / priceRange) * chartHeight;

  const progressX = padLeft + (plotWidth * progress) / 100;
  const labelValues = [chart.high, chart.low + priceRange * 0.5, chart.low];

  return (
    <div className="border border-mono-400 bg-mono-100">
      <svg viewBox={`0 0 ${width} ${height}`} className="block aspect-[2/1] w-full" role="img" aria-label="Mock candlestick chart">
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = padTop + chartHeight * ratio;

          return <line key={ratio} x1={padLeft} x2={width - padRight} y1={y} y2={y} stroke="#3e3e3e" strokeWidth="1" />;
        })}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const x = padLeft + plotWidth * ratio;

          return <line key={ratio} x1={x} x2={x} y1={padTop} y2={volumeTop + volumeHeight} stroke="#2c2c2c" strokeWidth="1" />;
        })}

        {chart.candles.map((candle, index) => {
          const cx = padLeft + slot * (index + 0.5);
          const isUp = candle.close >= candle.open;
          const color = isUp ? upColor : downColor;
          const highY = priceToY(candle.high);
          const lowY = priceToY(candle.low);
          const openY = priceToY(candle.open);
          const closeY = priceToY(candle.close);
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.max(Math.abs(closeY - openY), 1);

          return (
            <g key={index}>
              <line x1={cx} x2={cx} y1={highY} y2={lowY} stroke={color} strokeWidth="1.5" />
              <rect x={cx - bodyWidth / 2} y={bodyTop} width={bodyWidth} height={bodyHeight} fill={color} />
            </g>
          );
        })}

        <line x1={padLeft} x2={width - padRight} y1={volumeTop - 6} y2={volumeTop - 6} stroke="#3e3e3e" strokeWidth="1" />
        {chart.candles.map((candle, index) => {
          const cx = padLeft + slot * (index + 0.5);
          const barHeight = (candle.volume / maxVolume) * volumeHeight;
          const isUp = candle.close >= candle.open;

          return (
            <rect
              key={index}
              x={cx - bodyWidth / 2}
              y={volumeTop + volumeHeight - barHeight}
              width={bodyWidth}
              height={barHeight}
              fill={isUp ? upColor : downColor}
              opacity={index > count - 10 ? 0.95 : 0.48}
            />
          );
        })}

        <line x1={progressX} x2={progressX} y1={padTop} y2={volumeTop + volumeHeight} stroke={mutedColor} strokeDasharray="4 7" strokeWidth="2" />

        {labelValues.map((value, index) => {
          const y = padTop + chartHeight * index * 0.5 + 4;

          return (
            <text key={value} x={width - padRight + 12} y={y} fill="#979797" fontSize="14" fontWeight="700">
              {formatMockPrice(value)}
            </text>
          );
        })}

        {["4h", "3h", "2h", "1h", "now"].map((label, index) => (
          <text key={label} x={padLeft + plotWidth * (index / 4)} y={height - 15} fill="#8f867d" fontSize="13" fontWeight="700">
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}

function buildChartData(token: SolanaToken): MockChartData {
  const seed = hashString(token.address);
  const candleCount = 48;
  const basePrice = Math.max(token.marketcap / 1_000_000_000, 0.00001);
  // deterministic per-candle pseudo-random in [0, 1) so candles vary organically
  const rand = (n: number) => {
    const x = Math.sin((n + 1) * 127.1 + seed * 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const trend = ((seed % 24) + 6) / 1400; // gentle upward bias
  let price = basePrice * (0.7 + (seed % 18) / 100);

  const candles = Array.from({ length: candleCount }).map((_, index) => {
    const open = price;
    const wave = Math.sin((index + seed) * 0.33) * 0.01;
    const noise = (rand(index) - 0.45) * 0.05; // body direction + size varies per candle
    const pump = index > candleCount - 8 ? rand(index * 3) * 0.03 : 0;
    const close = Math.max(open * (1 + trend + wave + noise + pump), basePrice * 0.18);
    // wicks: independent up/down spread so candles don't look uniform
    const bodyTop = Math.max(open, close);
    const bodyBottom = Math.min(open, close);
    const high = bodyTop * (1 + rand(index + 100) * 0.022 + 0.002);
    const low = bodyBottom * (1 - rand(index + 200) * 0.022 - 0.002);
    const volume = (0.35 + rand(index + 300)) * token.marketcap * 0.03 + token.marketcap * 0.004;
    price = close;

    return { open, high, low, close, volume };
  });

  const firstPrice = candles[0].open;
  const lastPrice = candles[candles.length - 1].close;
  const high = Math.max(...candles.map((candle) => candle.high));
  const low = Math.min(...candles.map((candle) => candle.low));

  return {
    candles,
    high,
    low,
    lastPrice,
    change: ((lastPrice - firstPrice) / firstPrice) * 100,
    volume24h: candles.reduce((sum, candle) => sum + candle.volume, 0),
  };
}

function formatMockPrice(value: number) {
  if (value < 0.0001) return value.toExponential(2);
  if (value < 0.01) return value.toFixed(6);
  if (value < 1) return value.toFixed(4);

  return `$${formatNumberForDisplay(value)}`;
}

function hashString(value: string) {
  return value.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 9973, 17);
}

function shortAddress(address: string) {
  if (address.length <= 12) return address;

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
