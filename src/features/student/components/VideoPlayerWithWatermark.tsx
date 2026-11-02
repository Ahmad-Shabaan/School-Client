import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize, Minimize } from "lucide-react";
import type { WatermarkDto } from "@/features/admin/types/lesson.types";
import { cn } from "@/lib/utils";
import LessonWatermark from "./LessonWatermark";
import YouTubePlayer, {
  type YouTubePlayerLike,
} from "./YouTubePlayer";

const YOUTUBE_PLAYER_VARS = { fs: 0 } as const;

/**
 * Safari (macOS < 16.4 / iPhone < 16.4) exposes the Fullscreen API behind the
 * `webkit` prefix only. These types cover both shapes without using `any`.
 */
interface PrefixedDocument extends Document {
  webkitFullscreenElement?: Element | null;
  webkitFullscreenEnabled?: boolean;
  webkitExitFullscreen?: () => Promise<void> | void;
}

interface PrefixedElement extends HTMLElement {
  webkitRequestFullscreen?: () => Promise<void> | void;
}

interface VideoPlayerWithWatermarkProps {
  videoId: string;
  watermark: WatermarkDto | null;
  onReady?: (player: YouTubePlayerLike) => void;
  onStateChange?: (state: number) => void;
  onError?: (errorCode: number) => void;
}

const getFullscreenElement = (): Element | null =>
  document.fullscreenElement ??
  (document as PrefixedDocument).webkitFullscreenElement ??
  null;

const setScrollLocked = (locked: boolean) => {
  if (locked) {
    document.body.style.setProperty("overflow", "hidden");
  } else {
    document.body.style.removeProperty("overflow");
  }
};

const VideoPlayerWithWatermark = ({
  videoId,
  watermark,
  onReady,
  onStateChange,
  onError,
}: VideoPlayerWithWatermarkProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [cssFullscreen, setCssFullscreen] = useState(false);
  const [nativeFullscreen, setNativeFullscreen] = useState(false);
  const isFullscreen = cssFullscreen || nativeFullscreen;

  // Track native (or prefixed) browser fullscreen transitions for Edge, Chrome
  // and Safari; the CSS fallback never fires these events.
  useEffect(() => {
    const handleFullscreenChange = () => {
      setNativeFullscreen(getFullscreenElement() === containerRef.current);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange,
      );
    };
  }, []);

  // Safety net: never leave the scroll lock behind on unmount mid "CSS
  // fullscreen".
  useEffect(
    () => () => {
      setScrollLocked(false);
    },
    [],
  );

  const exitFullscreen = useCallback(() => {
    const fullscreenElement = getFullscreenElement();

    if (fullscreenElement && document.fullscreenElement) {
      document.exitFullscreen().catch(() => {
        // Ignore rejection if the browser already left fullscreen.
      });
      return;
    }

    const prefixedExit = (document as PrefixedDocument).webkitExitFullscreen;
    if (fullscreenElement && typeof prefixedExit === "function") {
      const result = prefixedExit.call(document);
      if (result instanceof Promise) {
        result.catch(() => {
          // Ignore if the browser already exited fullscreen.
        });
      }
      return;
    }

    // CSS fallback exit.
    setCssFullscreen(false);
    setScrollLocked(false);
  }, []);

  const enterNativeFullscreen = useCallback(
    (element: HTMLElement) => {
      const prefixed = element as PrefixedElement;

      if (typeof element.requestFullscreen === "function") {
        element
          .requestFullscreen()
          .catch(() => {
            // Rejected (e.g. missing user gesture or API disabled) — degrade
            // gracefully to the CSS fallback.
            setCssFullscreen(true);
            setScrollLocked(true);
          });
        return;
      }

      if (typeof prefixed.webkitRequestFullscreen === "function") {
        try {
          const result = prefixed.webkitRequestFullscreen();
          (result as Promise<void> | undefined)?.catch?.(() => {
            setCssFullscreen(true);
            setScrollLocked(true);
          });
        } catch {
          setCssFullscreen(true);
          setScrollLocked(true);
        }
        return;
      }

      // No native API at all (iPhone Safari < 16.4) — CSS fullscreen.
      setCssFullscreen(true);
      setScrollLocked(true);
    },
    [],
  );

  const toggleFullscreen = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    if (getFullscreenElement()) {
      exitFullscreen();
      return;
    }

    if (cssFullscreen) {
      exitFullscreen();
      return;
    }

    enterNativeFullscreen(container);
  }, [cssFullscreen, enterNativeFullscreen, exitFullscreen]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "group",
        isFullscreen
          ? cssFullscreen
            ? // CSS fallback (iPhone Safari): fixed overlay above the sticky
              // header; the iframe stays mounted so playback never stops.
              "fixed inset-0 z-80 flex items-center justify-center bg-black"
            : // Native fullscreen (Edge / Chrome / Safari): the element is
              // promoted to the top layer by the browser.
              "flex h-full w-full items-center justify-center bg-black"
          : "relative w-full",
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
        className="flex-center absolute left-2 top-2 z-20 min-h-8 min-w-8 rounded-md bg-black/55 p-1.5 text-white opacity-55 transition-opacity duration-200 hover:bg-black/75 hover:opacity-100 focus-visible:opacity-100 group-hover:opacity-100 sm:left-3 sm:top-3 sm:min-h-0 sm:min-w-0 sm:p-2.5 sm:opacity-0"
      >
        {isFullscreen ? (
          <Minimize className="size-5" />
        ) : (
          <Maximize className="size-5" />
        )}
      </button>
    </div>
  );
};

export default VideoPlayerWithWatermark;
