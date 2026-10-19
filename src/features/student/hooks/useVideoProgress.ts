import { useCallback, useEffect, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { LESSONS_QUERY_KEY } from "@/features/admin/constants/lessons.constants";
import { submitProgressReport } from "@/features/admin/services/lessonService";
import type { YouTubePlayerLike } from "../components/YouTubePlayer";
import { YT_PLAYER_STATE } from "../components/YouTubePlayer";
import { store } from "@/store/store";
import { config } from "@/config/env";

const REPORT_INTERVAL_MS = 10_000;
const POLL_INTERVAL_MS = 500;
const SEEK_THRESHOLD_SECONDS = 2;
const MIN_SEGMENT_SECONDS = 0.5;
// mirrors the backend's LearningPlatform:MaxWatchSegmentSeconds
const MAX_SEGMENT_SECONDS = 120;

export const useVideoProgress = (
  lessonId: number,
  playerRef: React.RefObject<YouTubePlayerLike | null>,
) => {
  const queryClient = useQueryClient();

  const lastTickRef = useRef<number | null>(null);
  const windowStartRef = useRef<number | null>(null);
  const lastReportAtRef = useRef<number>(0);
  const isPlayingRef = useRef(false);

  const invalidateProgress = useCallback(() => {
    queryClient.invalidateQueries({
      queryKey: LESSONS_QUERY_KEY.progress(lessonId),
    });
    queryClient.invalidateQueries({
      queryKey: LESSONS_QUERY_KEY.access(lessonId),
    });
    queryClient.invalidateQueries({
      queryKey: LESSONS_QUERY_KEY.details(lessonId),
    });
    queryClient.invalidateQueries({
      queryKey: LESSONS_QUERY_KEY.all(),
    });
  }, [lessonId, queryClient]);

  const report = useCallback(
    async (options?: { currentTime?: number; segmentEnd?: number }) => {
      const player = playerRef.current;
      if (!player) return;

      let duration = 0;
      let current = 0;
      try {
        duration = player.getDuration();
        current = options?.currentTime ?? player.getCurrentTime();
      } catch {
        return;
      }
      if (!duration || duration <= 0) return;

      const segmentEnd = options?.segmentEnd ?? current;
      const rawStart = windowStartRef.current;
      const segmentStart =
        rawStart == null
          ? null
          : Math.max(rawStart, segmentEnd - MAX_SEGMENT_SECONDS);

      const hasSegment =
        segmentStart != null &&
        segmentEnd - segmentStart >= MIN_SEGMENT_SECONDS;

      try {
        await submitProgressReport(lessonId, {
          currentTimeSeconds: current,
          durationSeconds: duration,
          ...(hasSegment
            ? {
                watchedSegmentStartSeconds: segmentStart,
                watchedSegmentEndSeconds: segmentEnd,
              }
            : {}),
        });
        windowStartRef.current = current;
        lastReportAtRef.current = Date.now();
        invalidateProgress();
      } catch {
        // progress reporting must never break playback; the next interval retries
      }
    },
    [lessonId, playerRef, invalidateProgress],
  );

  const handlePlaying = useCallback(() => {
    isPlayingRef.current = true;
    const player = playerRef.current;
    if (!player) return;

    const current = player.getCurrentTime();
    if (windowStartRef.current == null) {
      windowStartRef.current = current;
    }
    if (lastReportAtRef.current === 0) {
      lastReportAtRef.current = Date.now();
    }
    lastTickRef.current = current;
  }, [playerRef]);

  const handlePaused = useCallback(() => {
    if (!isPlayingRef.current) return;
    isPlayingRef.current = false;
    void report();
  }, [report]);

  const handleEnded = useCallback(() => {
    isPlayingRef.current = false;
    void report();
  }, [report]);

  useEffect(() => {
    const interval = setInterval(() => {
      const player = playerRef.current;
      if (!player || !isPlayingRef.current) return;

      let current = 0;
      try {
        current = player.getCurrentTime();
      } catch {
        return;
      }
      const last = lastTickRef.current;

      if (last != null && Math.abs(current - last) > SEEK_THRESHOLD_SECONDS) {
        // seeking: close the pre-jump window at the pre-jump position
        void report({ currentTime: current, segmentEnd: last });
      }

      lastTickRef.current = current;
      if (windowStartRef.current == null) windowStartRef.current = current;

      if (Date.now() - lastReportAtRef.current >= REPORT_INTERVAL_MS) {
        void report();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [playerRef, report]);

  useEffect(() => () => void report(), [report]);

  useEffect(() => {
    const flushWithKeepalive = () => {
      const player = playerRef.current;
      if (!player || !isPlayingRef.current) return;

      let current = 0;
      let duration = 0;
      try {
        current = player.getCurrentTime();
        duration = player.getDuration();
      } catch {
        return;
      }

      const rawStart = windowStartRef.current;
      if (!duration || rawStart == null) return;

      const start = Math.max(rawStart, current - MAX_SEGMENT_SECONDS);
      if (current - start < MIN_SEGMENT_SECONDS) return;

      const token = store.getState().auth.accessToken;
      void fetch(`${config.apiUrl}/lessons/${lessonId}/progress`, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          currentTimeSeconds: current,
          durationSeconds: duration,
          watchedSegmentStartSeconds: start,
          watchedSegmentEndSeconds: current,
        }),
      }).catch(() => undefined);
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") flushWithKeepalive();
    };

    window.addEventListener("pagehide", flushWithKeepalive);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("pagehide", flushWithKeepalive);
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange,
      );
    };
  }, [lessonId, playerRef]);

  return {
    handlePlaying,
    handlePaused,
    handleEnded,
    YT_PLAYER_STATE,
  };
};
