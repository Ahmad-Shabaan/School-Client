import { useEffect, useRef } from "react";

export interface YouTubePlayerLike {
  getCurrentTime(): number;
  getDuration(): number;
  playVideo(): void;
  pauseVideo(): void;
  destroy(): void;
}

interface YouTubePlayerOptions {
  videoId: string;
  playerVars?: Record<string, number | string | boolean>;
  events?: {
    onReady?: (event: { target: YouTubePlayerLike }) => void;
    onStateChange?: (event: { data: number }) => void;
    onError?: (event: { data: number }) => void;
  };
}

interface YouTubePlayerConstructor {
  new (
    target: HTMLElement | string,
    options: YouTubePlayerOptions,
  ): YouTubePlayerLike;
}

interface YouTubeApi {
  Player: YouTubePlayerConstructor;
}

declare global {
  interface Window {
    YT?: YouTubeApi;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export const YT_PLAYER_STATE = {
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

let youtubeApiPromise: Promise<void> | null = null;

const loadYouTubeApi = (): Promise<void> => {
  if (window.YT?.Player) return Promise.resolve();
  if (youtubeApiPromise) return youtubeApiPromise;

  youtubeApiPromise = new Promise((resolve, reject) => {
    const previousCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previousCallback?.();
      resolve();
    };

    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    script.onerror = () => {
      youtubeApiPromise = null;
      reject(new Error("Failed to load the YouTube player API."));
    };
    document.head.appendChild(script);
  });

  return youtubeApiPromise;
};

interface YouTubePlayerProps {
  videoId: string;
  onReady?: (player: YouTubePlayerLike) => void;
  onStateChange?: (state: number) => void;
  onError?: (errorCode: number) => void;
  className?: string;
}

const YouTubePlayer = ({
  videoId,
  onReady,
  onStateChange,
  onError,
  className,
}: YouTubePlayerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YouTubePlayerLike | null>(null);

  const onReadyRef = useRef(onReady);
  const onStateChangeRef = useRef(onStateChange);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onReadyRef.current = onReady;
    onStateChangeRef.current = onStateChange;
    onErrorRef.current = onError;
  });

  useEffect(() => {
    if (!containerRef.current || !videoId) return;
    let cancelled = false;

    loadYouTubeApi()
      .then(() => {
        if (cancelled || !containerRef.current || !window.YT?.Player) return;

        playerRef.current = new window.YT.Player(containerRef.current, {
          videoId,
          playerVars: {
            rel: 0,
            modestbranding: 1,
            playsinline: 1,
            enablejsapi: 1,
            origin: window.location.origin,
          },
          events: {
            onReady: (event) => onReadyRef.current?.(event.target),
            onStateChange: (event) => onStateChangeRef.current?.(event.data),
            onError: (event) => onErrorRef.current?.(event.data),
          },
        });
      })
      .catch(() => onErrorRef.current?.(-1));

    return () => {
      cancelled = true;
      try {
        playerRef.current?.destroy();
      } catch {
        // player may already be destroyed by YouTube
      }
      playerRef.current = null;
    };
  }, [videoId]);

  return (
    <div className={className}>
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
};

export default YouTubePlayer;
