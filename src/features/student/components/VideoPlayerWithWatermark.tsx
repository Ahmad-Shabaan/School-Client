import { useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import type { WatermarkDto } from "@/features/admin/types/lesson.types";
import { cn } from "@/lib/utils";
import LessonWatermark from "./LessonWatermark";
import YouTubePlayer, { type YouTubePlayerLike } from "./YouTubePlayer";

const YOUTUBE_PLAYER_VARS = { fs: 0 } as const;

interface VideoPlayerWithWatermarkProps {
  videoId: string;
  watermark: WatermarkDto | null;
  onReady?: (player: YouTubePlayerLike) => void;
  onStateChange?: (state: number) => void;
  onError?: (errorCode: number) => void;
}

const VideoPlayerWithWatermark = ({
  videoId,
  watermark,
  onReady,
  onStateChange,
  onError,
}: VideoPlayerWithWatermarkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () =>
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen();
      return;
    }

    void containerRef.current?.requestFullscreen();
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "group relative",
        isFullscreen
          ? "flex h-full w-full items-center justify-center bg-black"
          : "w-full",
      )}
    >
      <YouTubePlayer
        videoId={videoId}
        className={
          isFullscreen
            ? "aspect-video h-full max-h-full w-auto max-w-full"
            : "aspect-video w-full"
        }
        playerVars={YOUTUBE_PLAYER_VARS}
        onReady={onReady}
        onStateChange={onStateChange}
        onError={onError}
      />

      {watermark && <LessonWatermark watermark={watermark} />}

      <button
        type="button"
        onClick={toggleFullscreen}
        aria-label={isFullscreen ? "الخروج من ملء الشاشة" : "ملء الشاشة"}
        className="absolute left-2 top-2 z-20 min-h-8 min-w-8 rounded-md bg-black/55 p-1.5 text-white opacity-55 transition-opacity duration-200 hover:bg-black/75 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 sm:left-3 sm:top-3 sm:min-h-0 sm:min-w-0 sm:p-2.5 sm:opacity-0"
      >
        {isFullscreen ? (
          <Minimize className="size-3.5 sm:size-4" />
        ) : (
          <Maximize className="size-3.5 sm:size-4" />
        )}
      </button>
    </div>
  );
};

export default VideoPlayerWithWatermark;
