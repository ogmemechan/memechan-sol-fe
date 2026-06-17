import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { ThreadsSortBy, ThreadsSortDirection, ThreadsSortStatus } from "./types";

const minute = 60 * 1000;
const hour = 60 * minute;
const quoteLimit = 100_000_000_000;
const updateWindow = 5_000;

type MockTokenSeed = Omit<SolanaToken, "creationTime" | "holdersCount" | "lastReply" | "marketcap" | "quoteIn"> & {
  ageMinutes: number;
  baseHolders: number;
  baseMarketcap: number;
  baseProgress: number;
  volatility: number;
};

const mockTokenSeeds: MockTokenSeed[] = [
  {
    name: "Desk Cat",
    address: "DeskCat1111111111111111111111111111111111111",
    decimals: 6,
    symbol: "$NAP",
    description: "Sleepy chart watcher. Paw on buy button, one eye on candle.",
    image: "/Pepe.jpg",
    creator: "7n3DeskCreator111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-desk-cat",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 180,
    baseHolders: 128,
    baseMarketcap: 184_250,
    baseProgress: 38,
    volatility: 13_400,
  },
  {
    name: "Pixel Cop",
    address: "PixelCop111111111111111111111111111111111111",
    decimals: 6,
    symbol: "$SIREN",
    description: "Blows whistle on weak memes. Strong vibes only.",
    image: "/cop-pepe.jpg",
    creator: "5irenCreator11111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-pixel-cop",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 1320,
    baseHolders: 742,
    baseMarketcap: 925_000,
    baseProgress: 100,
    volatility: 48_000,
  },
  {
    name: "Banner Guy",
    address: "BannerGuy11111111111111111111111111111111111",
    decimals: 6,
    symbol: "$WAVE",
    description: "Always above fold. Refuses to be cropped.",
    image: "/memechan_logo.jpg",
    creator: "WaveCreator111111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-banner-guy",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 480,
    baseHolders: 64,
    baseMarketcap: 64_200,
    baseProgress: 18,
    volatility: 8_250,
  },
  {
    name: "No Claim",
    address: "NoClaim1111111111111111111111111111111111111",
    decimals: 6,
    symbol: "$WAIT",
    description: "Patient meme, loud ticker. Waiting room energy, live market.",
    image: "/NoClaimImage.png",
    creator: "WaitCreator111111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-no-claim",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 2880,
    baseHolders: 309,
    baseMarketcap: 341_000,
    baseProgress: 100,
    volatility: 21_000,
  },
  {
    name: "Dark Theme",
    address: "DarkTheme1111111111111111111111111111111111",
    decimals: 6,
    symbol: "$NITE",
    description: "Turns contrast into conviction. Terminal glow included.",
    image: "/dark-theme.png",
    creator: "NiteCreator111111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-dark-theme",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 90,
    baseHolders: 97,
    baseMarketcap: 128_900,
    baseProgress: 61,
    volatility: 12_800,
  },
  {
    name: "Long Banner",
    address: "LongBanner111111111111111111111111111111111",
    decimals: 6,
    symbol: "$WIDE",
    description: "Stretched, centered, never nervous. Built for big row.",
    image: "/long-banner.png",
    creator: "WideCreator111111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-long-banner",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 5760,
    baseHolders: 512,
    baseMarketcap: 497_500,
    baseProgress: 100,
    volatility: 31_500,
  },
  {
    name: "Pump Scout",
    address: "PumpScout1111111111111111111111111111111111",
    decimals: 6,
    symbol: "$SCOUT",
    description: "Pump.fun-style watchlist pick. Fast replies, faster candles.",
    image: "/android-chrome-512x512.png",
    creator: "ScoutCreator11111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-pump-scout",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 14,
    baseHolders: 43,
    baseMarketcap: 41_600,
    baseProgress: 24,
    volatility: 16_000,
  },
  {
    name: "Mint Sprint",
    address: "MintSprint111111111111111111111111111111111",
    decimals: 6,
    symbol: "$SPRINT",
    description: "Fresh-mint feed energy. Everyone pretending to be early.",
    image: "/short-banner.png",
    creator: "SprintCreator111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-mint-sprint",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 28,
    baseHolders: 58,
    baseMarketcap: 78_400,
    baseProgress: 31,
    volatility: 18_600,
  },
  {
    name: "Candle Wick",
    address: "CandleWick11111111111111111111111111111111",
    decimals: 6,
    symbol: "$WICK",
    description: "Vertical candle cosplay. Briefly sensible, mostly loud.",
    image: "/diamond.png",
    creator: "WickCreator11111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-candle-goblin",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 720,
    baseHolders: 886,
    baseMarketcap: 1_420_000,
    baseProgress: 100,
    volatility: 82_000,
  },
  {
    name: "Sol Banana",
    address: "SolBanana1111111111111111111111111111111111",
    decimals: 6,
    symbol: "$NANA",
    description: "Yellow chart, green holders. Snack-sized chaos.",
    image: "/heart.png",
    creator: "NanaCreator11111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-sol-banana",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 52,
    baseHolders: 112,
    baseMarketcap: 136_700,
    baseProgress: 46,
    volatility: 11_700,
  },
  {
    name: "404 Rich",
    address: "FourOhFourRich11111111111111111111111111111",
    decimals: 6,
    symbol: "$FOUND",
    description: "Used to be missing. Now shows up and asks for liquidity.",
    image: "/nothingFound.png",
    creator: "FoundCreator1111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-404-rich",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 7,
    baseHolders: 26,
    baseMarketcap: 22_200,
    baseProgress: 12,
    volatility: 9_700,
  },
  {
    name: "Pepe Prime",
    address: "PepePrime111111111111111111111111111111111",
    decimals: 6,
    symbol: "$PRIME",
    description: "Old meme, new wallet smell. Wants one more cycle.",
    image: "/Pepe.jpg",
    creator: "PrimeCreator1111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-pepe-prime",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 2040,
    baseHolders: 1320,
    baseMarketcap: 2_630_000,
    baseProgress: 100,
    volatility: 115_000,
  },
  {
    name: "Ticker Soup",
    address: "TickerSoup11111111111111111111111111111111",
    decimals: 6,
    symbol: "$SOUP",
    description: "Letters first, thesis later. Warm, volatile, questionable.",
    image: "/light-theme.png",
    creator: "SoupCreator11111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-ticker-soup",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 36,
    baseHolders: 81,
    baseMarketcap: 92_300,
    baseProgress: 29,
    volatility: 15_200,
  },
  {
    name: "Liquidity Chair",
    address: "LiquidityChair1111111111111111111111111111",
    decimals: 6,
    symbol: "$CHAIR",
    description: "Everyone has seat. Nobody knows who brought table.",
    image: "/memechan-button.png",
    creator: "ChairCreator111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-liquidity-chair",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 4320,
    baseHolders: 604,
    baseMarketcap: 718_000,
    baseProgress: 100,
    volatility: 44_000,
  },
  {
    name: "Dev Slept",
    address: "DevSlept111111111111111111111111111111111",
    decimals: 6,
    symbol: "$NAP2",
    description: "Roadmap says nap. Community says send.",
    image: "/NoClaimImage.png",
    creator: "SleptCreator1111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-dev-slept",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 73,
    baseHolders: 104,
    baseMarketcap: 118_300,
    baseProgress: 55,
    volatility: 14_800,
  },
  {
    name: "Pats Hat",
    address: "PatsHat1111111111111111111111111111111111",
    decimals: 6,
    symbol: "$PATS",
    description: "Hat stays on. Chart does what chart wants.",
    image: "/veCHAN_log.png",
    creator: "PatsCreator1111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-pats-hat",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 960,
    baseHolders: 469,
    baseMarketcap: 562_400,
    baseProgress: 100,
    volatility: 36_200,
  },
  {
    name: "Refresh Meta",
    address: "RefreshMeta111111111111111111111111111111",
    decimals: 6,
    symbol: "$TICK",
    description: "Every refresh has new conviction. Same joke, new candle.",
    image: "/short-banner-staking.png",
    creator: "TickCreator1111111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("memechan"),
    txDigest: "mock-refresh-meta",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 18,
    baseHolders: 52,
    baseMarketcap: 58_800,
    baseProgress: 22,
    volatility: 19_500,
  },
  {
    name: "Pink Button",
    address: "PinkButton11111111111111111111111111111111",
    decimals: 6,
    symbol: "$CLICK",
    description: "UI token. Bullish on hover states.",
    image: "/memechan-button.png",
    creator: "ClickCreator111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-pink-button",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 1680,
    baseHolders: 377,
    baseMarketcap: 438_900,
    baseProgress: 100,
    volatility: 29_100,
  },
  {
    name: "Pump Arcade",
    address: "PumpArcade1111111111111111111111111111111",
    decimals: 6,
    symbol: "$ARCADE",
    description: "Pump.fun-style arcade cabinet. Insert SOL, receive lore.",
    image: "/long-banner-staking.png",
    creator: "ArcadeCreator11111111111111111111111111111",
    status: "PRESALE",
    socialLinks: social("pumpfun"),
    txDigest: "mock-pump-arcade",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 122,
    baseHolders: 156,
    baseMarketcap: 202_600,
    baseProgress: 67,
    volatility: 26_400,
  },
  {
    name: "Final Boss",
    address: "FinalBoss11111111111111111111111111111111",
    decimals: 6,
    symbol: "$BOSS",
    description: "End-screen energy. Big marketcap bar, tiny patience.",
    image: "/og-image.jpeg",
    creator: "BossCreator1111111111111111111111111111111",
    status: "LIVE",
    socialLinks: social("memechan"),
    txDigest: "mock-final-boss",
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    ageMinutes: 7200,
    baseHolders: 1840,
    baseMarketcap: 3_900_000,
    baseProgress: 100,
    volatility: 210_000,
  },
];

export const mockTokens = buildMockTokens();

export function getMockTokens({
  status,
  sortBy,
  direction,
}: {
  status: ThreadsSortStatus;
  sortBy: ThreadsSortBy;
  direction: ThreadsSortDirection;
}) {
  const tokens = buildMockTokens();
  const filteredTokens =
    status === "all" ? tokens : tokens.filter((token) => token.status === (status === "live" ? "LIVE" : "PRESALE"));

  return filteredTokens.sort((firstToken, secondToken) => {
    const firstValue = getTokenSortValue(firstToken, sortBy);
    const secondValue = getTokenSortValue(secondToken, sortBy);

    return direction === "asc" ? firstValue - secondValue : secondValue - firstValue;
  });
}

export function getMockToken(address: string) {
  const index = mockTokenSeeds.findIndex((token) => token.address === address);

  if (index !== -1) return makeToken(mockTokenSeeds[index], index, getFeedTick());

  // dynamically-spawned coins are not in the seed list; rebuild from the encoded address
  return getSpawnedToken(address);
}

const NAME_PARTS_A = ["Turbo", "Hyper", "Based", "Degen", "Moon", "Giga", "Frog", "Laser", "Solar", "Pixel", "Cyber", "Pump", "Diamond", "Rocket", "Astro", "Neon"];
const NAME_PARTS_B = ["Pepe", "Cat", "Dog", "Inu", "Chad", "Wojak", "Ape", "Bull", "Coin", "Wizard", "Goblin", "Samurai", "Ninja", "Banana", "Comet", "Yeti"];
const MOCK_IMAGES = ["/Pepe.jpg", "/cop-pepe.jpg", "/memechan_logo.jpg", "/diamond.png", "/heart.png", "/android-chrome-512x512.png", "/og-image.jpeg"];

// Each spawned token is fully derived from its address so refreshing /coin/<addr> rebuilds the same coin.
export function generateMockToken(status: ThreadsSortStatus): SolanaToken {
  const a = NAME_PARTS_A[Math.floor(Math.random() * NAME_PARTS_A.length)];
  const b = NAME_PARTS_B[Math.floor(Math.random() * NAME_PARTS_B.length)];
  const name = `${a} ${b}`;
  const symbol = `$${(a.slice(0, 3) + b.slice(0, 2)).toUpperCase()}`;
  const tokenStatus: SolanaToken["status"] = status === "live" ? "LIVE" : "PRESALE";

  // address encodes a base name, padded to a Solana-like 44 chars with unique suffix
  const unique = Math.random().toString(36).slice(2, 8);
  const base = `${a}${b}${unique}`.replace(/[^A-Za-z0-9]/g, "");
  const address = base.padEnd(44, "1").slice(0, 44);

  return buildSpawnedToken({ name, symbol, address, status: tokenStatus });
}

function getSpawnedToken(address: string): SolanaToken {
  // recover a readable name from the leading alpha chars of the address
  const alpha = (address.match(/^[A-Za-z]+/)?.[0] ?? "Memecoin").slice(0, 12);
  const name = alpha.replace(/([A-Z])/g, " $1").trim() || "Mock Coin";
  const symbol = `$${alpha.slice(0, 5).toUpperCase()}`;

  return buildSpawnedToken({ name, symbol, address, status: "PRESALE" });
}

function buildSpawnedToken({
  name,
  symbol,
  address,
  status,
}: {
  name: string;
  symbol: string;
  address: string;
  status: SolanaToken["status"];
}): SolanaToken {
  const seed = address.split("").reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) % 9973, 7);
  const image = MOCK_IMAGES[seed % MOCK_IMAGES.length];
  const baseMarketcap = status === "LIVE" ? 600_000 + (seed % 50) * 30_000 : 20_000 + (seed % 60) * 1_500;
  const progress = status === "LIVE" ? 100 : clamp(8 + (seed % 40), 5, 96);

  return {
    name,
    address,
    decimals: 6,
    symbol,
    description: `${name} just launched. Fresh mint, faster candles, no thesis required.`,
    image,
    creator: `${address.slice(0, 6)}Creator${"1".repeat(30)}`.slice(0, 44),
    status,
    socialLinks: social(seed % 2 === 0 ? "pumpfun" : "memechan"),
    txDigest: `mock-spawn-${address.slice(0, 8)}`,
    quoteLimit: quoteLimit.toString(),
    quoteSymbol: "SOL",
    creationTime: Date.now(),
    holdersCount: status === "LIVE" ? 200 + (seed % 400) : 5 + (seed % 40),
    lastReply: Date.now(),
    marketcap: baseMarketcap,
    quoteIn: Math.round((quoteLimit * progress) / 100).toString(),
  };
}

function buildMockTokens() {
  const tick = getFeedTick();

  return mockTokenSeeds.map((seed, index) => makeToken(seed, index, tick));
}

function makeToken(seed: MockTokenSeed, index: number, tick: number): SolanaToken {
  const wave = Math.sin((tick + index) / 2);
  const marketMove = Math.round(seed.volatility * wave);
  const replyAgeMinutes = ((tick * (index + 3) + index * 7) % 44) + 1;
  const creationOffset = ((tick * (index + 1) + index * 13) % 27) - 13;
  const progress = seed.status === "LIVE" ? 100 : clamp(seed.baseProgress + ((tick + index * 2) % 11) - 5, 5, 96);
  const holderMove = Math.floor(((tick + 1) * (index + 5)) % 63);

  return {
    ...seed,
    creationTime: Date.now() - Math.max(seed.ageMinutes + creationOffset, 1) * minute,
    holdersCount: seed.baseHolders + holderMove,
    lastReply: Date.now() - replyAgeMinutes * minute,
    marketcap: Math.max(seed.baseMarketcap + marketMove, 1_000),
    quoteIn: Math.round((quoteLimit * progress) / 100).toString(),
  };
}

function getTokenSortValue(token: SolanaToken, sortBy: ThreadsSortBy) {
  if (sortBy === "market_cap") return token.marketcap;
  if (sortBy === "last_reply") return token.lastReply;

  return token.creationTime;
}

function getFeedTick() {
  return Math.floor(Date.now() / updateWindow);
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function social(handle: "memechan" | "pumpfun") {
  const account = handle === "pumpfun" ? "pumpdotfun" : "memechan";

  return {
    telegram: "https://t.me/memechan",
    website: handle === "pumpfun" ? "https://pump.fun" : "https://memechan.gg",
    twitter: `https://x.com/${account}`,
    discord: null,
  };
}
