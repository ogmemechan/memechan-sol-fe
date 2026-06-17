import { TokenApiInstance } from "@/common/solana";
import { SolanaToken } from "@rinegade/memechan-sol-sdk";
import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useInterval } from "usehooks-ts";
import { generateMockToken, getMockTokens } from "./mockTokens";
import { NSFWStatus, ThreadsSortBy, ThreadsSortDirection, ThreadsSortOptions, ThreadsSortStatus } from "./types";
import {
  getSortBy,
  getStatus,
  isThreadsNSFW,
  isThreadsSortBy,
  isThreadsSortDirection,
  isThreadsSortStatus,
} from "./utils";

export const DEFAULT_SORT_PARAMS: {
  status: ThreadsSortStatus;
  sortBy: ThreadsSortBy;
  direction: ThreadsSortDirection;
  nsfwStatus: NSFWStatus;
} = {
  status: "all",
  sortBy: "creation_time",
  direction: "desc",
  nsfwStatus: "off",
};

export function useCoinApi() {
  const [status, setStatus] = useState<ThreadsSortStatus | null>(null);
  const [sortBy, setSortBy] = useState<ThreadsSortBy | null>(null);
  const [direction, setDirection] = useState<ThreadsSortDirection | null>(null);
  const [nsfwStatus, setNsfwStatus] = useState<NSFWStatus | null>(null);
  const [search, setSearch] = useState<string>("");

  const [items, setItems] = useState<SolanaToken[] | null>(null);
  const [presaleNextPageToken, setPresaleNextPageToken] = useState<string | null>(null);
  const [liveNextPageToken, setLiveNextPageToken] = useState<string | null>(null);
  const [loadedMore, setLoadedMore] = useState<boolean>(false);
  // Mock-mode: freshly "launched" coins that pop in over time, kept separate from the static seed list
  const [mockSpawned, setMockSpawned] = useState<SolanaToken[]>([]);
  const useMockData = process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

  const getFallbackItems = useCallback(() => {
    return getMockTokens({
      status: status ?? DEFAULT_SORT_PARAMS.status,
      sortBy: sortBy ?? DEFAULT_SORT_PARAMS.sortBy,
      direction: direction ?? DEFAULT_SORT_PARAMS.direction,
    });
  }, [status, sortBy, direction]);

  const setFetchedItems = useCallback(
    (fetchedItems: SolanaToken[]) => {
      setItems(fetchedItems.length > 0 ? fetchedItems : getFallbackItems());
    },
    [getFallbackItems],
  );

  // Gettings values from local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const initStatus = localStorage.getItem(ThreadsSortOptions.Status) ?? DEFAULT_SORT_PARAMS.status;
      const initSortBy = localStorage.getItem(ThreadsSortOptions.SortBy) ?? DEFAULT_SORT_PARAMS.sortBy;
      const initDirection = localStorage.getItem(ThreadsSortOptions.Direction) ?? DEFAULT_SORT_PARAMS.direction;
      const nsfwStatus = localStorage.getItem(ThreadsSortOptions.NSFW) ?? null;
      const searchValue = localStorage.getItem(ThreadsSortOptions.Search) ?? "";

      if (isThreadsSortStatus(initStatus)) setStatus(initStatus);
      if (isThreadsSortBy(initSortBy)) setSortBy(initSortBy);
      if (isThreadsSortDirection(initDirection)) setDirection(initDirection);
      if (isThreadsNSFW(nsfwStatus)) setNsfwStatus(nsfwStatus);
      setSearch(searchValue);
    }
  }, []);

  // Setting values into local storage
  useEffect(() => {
    if (status && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.Status, status);
  }, [status]);
  useEffect(() => {
    if (sortBy && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.SortBy, sortBy);
  }, [sortBy]);
  useEffect(() => {
    if (direction && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.Direction, direction);
  }, [direction]);
  useEffect(() => {
    if (nsfwStatus && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.NSFW, nsfwStatus);
  }, [nsfwStatus]);
  useEffect(() => {
    if (search !== undefined && typeof window !== "undefined") localStorage.setItem(ThreadsSortOptions.Search, search);
  }, [search]);

  // Method for fetching data without pagination. Using pagination `load` methods inside will cause bugs.
  const fetchData = useCallback(async () => {
    if (!status || !sortBy || !direction) return;

    if (useMockData) {
      setItems([...mockSpawned, ...getFallbackItems()]);
      setLiveNextPageToken(null);
      setPresaleNextPageToken(null);
      return;
    }

    try {
      let fetchedItems: SolanaToken[] = [];

      if (status === "all") {
        const [presaleRes, liveRes] = await Promise.all([
          TokenApiInstance.queryTokens({
            sortBy: getSortBy(sortBy),
            direction,
            status: "PRESALE",
          }),
          TokenApiInstance.queryTokens({ sortBy: getSortBy(sortBy), direction, status: "LIVE" }),
        ]);

        setPresaleNextPageToken(presaleRes.paginationToken ?? null);
        setLiveNextPageToken(liveRes.paginationToken ?? null);

        fetchedItems = [...liveRes.result, ...presaleRes.result];
      } else {
        const formattedStatus = getStatus(status);

        const res = await TokenApiInstance.queryTokens({
          sortBy: getSortBy(sortBy),
          direction,
          status: formattedStatus,
        });

        formattedStatus === "LIVE"
          ? setLiveNextPageToken(res.paginationToken ?? null)
          : setPresaleNextPageToken(res.paginationToken ?? null);

        fetchedItems = res.result;
      }

      setFetchedItems(fetchedItems);
    } catch (error) {
      console.error(`Failed to fetch data for ${status} status:`, error);
      setLiveNextPageToken(null);
      setPresaleNextPageToken(null);
      setItems(getFallbackItems());
    }
  }, [status, sortBy, direction, useMockData, getFallbackItems, setFetchedItems, mockSpawned]);

  // Pagination methods
  const loadMoreLiveTokens = useCallback(async () => {
    if (!sortBy || !direction) return;

    const { result, paginationToken } = await TokenApiInstance.queryTokens({
      sortBy: getSortBy(sortBy),
      direction,
      status: "LIVE",
      paginationToken: liveNextPageToken,
    });

    setLiveNextPageToken(paginationToken ?? null);

    setItems((prevItems) => (prevItems ? [...prevItems, ...result] : result));
  }, [sortBy, direction, liveNextPageToken]);

  const loadMorePresaleTokens = useCallback(async () => {
    if (!sortBy || !direction) return;

    const { result, paginationToken } = await TokenApiInstance.queryTokens({
      sortBy: getSortBy(sortBy),
      direction,
      status: "PRESALE",
      paginationToken: presaleNextPageToken,
    });

    setPresaleNextPageToken(paginationToken ?? null);

    setItems((prevItems) => (prevItems ? [...prevItems, ...result] : result));
  }, [sortBy, direction, presaleNextPageToken]);

  const loadMoreTokens = useCallback(async () => {
    if (liveNextPageToken) {
      await loadMoreLiveTokens();
    }

    if (presaleNextPageToken) {
      await loadMorePresaleTokens();
    }
  }, [liveNextPageToken, presaleNextPageToken, loadMoreLiveTokens, loadMorePresaleTokens]);

  // The `load more` button click handler
  const loadMore = useCallback(async () => {
    const hasNextPage =
      (status === "live" && liveNextPageToken) ||
      (status === "pre_sale" && presaleNextPageToken) ||
      (status === "all" && (presaleNextPageToken || liveNextPageToken));

    if (!hasNextPage) return;

    if (!loadedMore) {
      setLoadedMore(true);
      toast("Disabled auto tokens update. Reload page to turn it back");
    }

    if (status === "live" && liveNextPageToken) {
      await loadMoreLiveTokens();
      return;
    }

    if (status === "pre_sale" && presaleNextPageToken) {
      await loadMorePresaleTokens();
      return;
    }

    if (status === "all" && (presaleNextPageToken || liveNextPageToken)) {
      await loadMoreTokens();
      return;
    }
  }, [
    loadedMore,
    liveNextPageToken,
    status,
    presaleNextPageToken,
    loadMoreLiveTokens,
    loadMorePresaleTokens,
    loadMoreTokens,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Cleaning all the pagination fields when any of the sort params has changed
  useEffect(() => {
    setLoadedMore(false);
    setLiveNextPageToken(null);
    setPresaleNextPageToken(null);
    setMockSpawned([]);
  }, [status, sortBy, direction]);

  // Intervally fetch the tokens only until user started loading more tokens
  useInterval(fetchData, loadedMore ? null : 5000);

  // Mock-mode: spawn a brand-new coin every 30s so the feed feels live (paused once user loads more)
  useInterval(
    () => {
      if (!status) return;
      setMockSpawned((prev) => [generateMockToken(status), ...prev].slice(0, 30));
    },
    useMockData && !loadedMore ? 30_000 : null,
  );

  return {
    items,
    status,
    setStatus,
    sortBy,
    setSortBy,
    direction,
    setDirection,
    nsfwStatus,
    setNsfwStatus,
    search,
    setSearch,
    presaleNextPageToken,
    liveNextPageToken,
    loadMore,
  };
}
