import { SocialApiInstance } from "@/common/solana";
import { Button } from "@/memechan-ui/Atoms/Button";
import { Typography } from "@/memechan-ui/Atoms/Typography";
import { Card } from "@/memechan-ui/Molecules";
import { CoinThreadWithParsedMessage } from "@/views/coin/coin.types";
import { handleAuthentication } from "@/views/create-coin/create-coin.utils";
import { useWallet } from "@solana/wallet-adapter-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { timeSince } from "@/utils/timeSpents";
import { PostReplyDialog } from "../../post-reply/dialog";
import styles from "./comment.module.css";

type CommentProps = {
  thread: CoinThreadWithParsedMessage;
  updateThreads: () => void;
  coinCreator: string;
  isLiked: boolean;
  refetchLikedThreads: () => Promise<unknown> | void;
};

export function Comment({ thread, updateThreads, coinCreator, isLiked, refetchLikedThreads }: CommentProps) {
  const { publicKey, signMessage } = useWallet();
  const { theme } = useTheme();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isUpdatingLike, setIsUpdatingLike] = useState(false);
  const [localIsLiked, setLocalIsLiked] = useState(isLiked);
  const [localLikeCounter, setLocalLikeCounter] = useState(thread.likeCounter);

  useEffect(() => {
    setLocalIsLiked(isLiked);
  }, [isLiked]);

  useEffect(() => {
    setLocalLikeCounter(thread.likeCounter);
  }, [thread.likeCounter]);

  const handleLike = async () => {
    if (!publicKey || !signMessage) {
      toast.error("Please connect your wallet");
      return;
    }

    try {
      setIsUpdatingLike(true);
      await handleAuthentication(publicKey.toString(), signMessage);

      if (localIsLiked) {
        await SocialApiInstance.unlike({ coinType: thread.coinType, threadId: thread.id });
        setLocalLikeCounter((counter) => Math.max(counter - 1, 0));
      } else {
        await SocialApiInstance.like({ coinType: thread.coinType, threadId: thread.id });
        setLocalLikeCounter((counter) => counter + 1);
      }

      setLocalIsLiked((value) => !value);
      await refetchLikedThreads();
      updateThreads();
    } catch (error) {
      console.error("[Comment] Failed to update like:", error);
      toast.error("Failed to update like");
    } finally {
      setIsUpdatingLike(false);
    }
  };

  const creatorLabel = shortAddress(thread.creator);
  const isCreator = thread.creator === coinCreator;

  return (
    <Card>
      <Card.Header>
        <div className="flex w-full items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2">
            <Typography variant="h4" color="green-100" truncate>
              {creatorLabel}
            </Typography>
            {isCreator && (
              <Typography variant="body" color={theme === "light" ? "mono-200" : "primary-100"}>
                creator
              </Typography>
            )}
          </div>
          <Typography variant="body" color={theme === "light" ? "mono-200" : "mono-500"}>
            {timeSince(thread.creationDate)}
          </Typography>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="flex flex-col gap-3">
          <Typography variant="body" color="mono-600" className="whitespace-pre-wrap break-words">
            {thread.message.message}
          </Typography>

          {thread.message.image && (
            <img
              src={thread.message.image}
              alt="Comment attachment"
              className="max-h-[320px] w-fit max-w-full border border-mono-400 object-contain"
            />
          )}

          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={handleLike}
              disabled={isUpdatingLike}
              className={`${styles["hover-underline"]} text-sm font-bold text-primary-100 disabled:cursor-not-allowed disabled:opacity-60`}
            >
              {localIsLiked ? "Unlike" : "Like"} [{localLikeCounter}]
            </button>
            <button
              type="button"
              onClick={() => setIsReplyOpen((value) => !value)}
              className={`${styles["hover-underline"]} text-sm font-bold text-primary-100`}
            >
              Reply [{thread.replyCounter}]
            </button>
          </div>

          {thread.message.replyTo && (
            <Typography variant="body" color="mono-500">
              Reply to #{thread.message.replyTo}
            </Typography>
          )}

          {isReplyOpen && (
            <div className="border-t border-mono-400 pt-3">
              <PostReplyDialog
                isStatic={false}
                onClose={() => setIsReplyOpen(false)}
                updateThreads={updateThreads}
                coinType={thread.coinType}
                replyThreadId={thread.id}
              />
              <div className="mt-3 h-10 w-28">
                <Button variant="secondary" onClick={() => setIsReplyOpen(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

function shortAddress(address: string) {
  if (address.length <= 12) return address;

  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}
