import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
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
  isVideoCompleted: boolean,
) => {
  const queryClient = useQueryClient();

  const lastTickRef = useRef<number | null>(null);
  const windowStartRef = useRef<number | null>(null);
  const lastReportAtRef = useRef<number>(0);
  const isPlayingRef = useRef(false);
  // Only the latest report may move the watch window; an older response that
  // resolves late must never rewind it over a just-seeked range.
  const reportTokenRef = useRef(0);
  // Bumped on every lesson change so a response from an earlier visit to the
  // same lesson cannot be mistaken for the current one.
  const watchSessionRef = useRef(0);
  // The lesson the async report belongs to; guards ref writes after
  // navigating to another lesson without the component remounting.
  const lessonIdRef = useRef(lessonId);
  useLayoutEffect(() => {
    lessonIdRef.current = lessonId;
    watchSessionRef.current += 1;
  }, [lessonId]);

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
    async (options?: {
      currentTime?: number;
      segmentEnd?: number;
      nextWindowStart?: number;
    }) => {
      if (!isVideoCompleted) return;
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

      const segment =
        segmentStart != null && segmentEnd - segmentStart >= MIN_SEGMENT_SECONDS
          ? {
              watchedSegmentStartSeconds: segmentStart,
              watchedSegmentEndSeconds: segmentEnd,
            }
          : {};

      const token = ++reportTokenRef.current;
      const session = watchSessionRef.current;

      try {
        await submitProgressReport(lessonId, {
          currentTimeSeconds: current,
          durationSeconds: duration,
          ...segment,
        });

        // Only the latest report of the same lesson may advance the watch
        // window; a stale reply from an older request or a previous lesson
        // must not leak into the new one.
        if (
          lessonIdRef.current === lessonId &&
          session === watchSessionRef.current &&
          token === reportTokenRef.current
        ) {
          windowStartRef.current = options?.nextWindowStart ?? current;
          lastReportAtRef.current = Date.now();
        }
        invalidateProgress();
      } catch {
        // progress reporting must never break playback; the next interval retries
      }
    },
    [lessonId, playerRef, isVideoCompleted, invalidateProgress],
  );

  const handlePlaying = useCallback(() => {
    const wasPlaying = isPlayingRef.current;
    isPlayingRef.current = true;

    const player = playerRef.current;
    if (!player) return;

    let current = 0;
    try {
      current = player.getCurrentTime();
    } catch {
      return;
    }

    const last = lastTickRef.current;
    const jumped =
      last != null && Math.abs(current - last) > SEEK_THRESHOLD_SECONDS;

    if (!wasPlaying && jumped && last != null) {
      // The student scrubbed while paused: close the old window at the
      // pre-jump position and start a new one at the new position.
      if (current > last) {
        void report({
          currentTime: current,
          segmentEnd: last,
          nextWindowStart: current,
        });
      }
      windowStartRef.current = current;
    } else if (windowStartRef.current == null) {
      windowStartRef.current = current;
    }

    if (lastReportAtRef.current === 0) {
      lastReportAtRef.current = Date.now();
    }

    // A PLAYING event is also emitted after a seek while already playing
    // (BUFFERING -> PLAYING). Do not reset the last tick in that case or the
    // polling effect can no longer tell that the timeline jumped and would
    // count the skipped range as watched.
    if (!wasPlaying || last == null) {
      lastTickRef.current = current;
    }
  }, [playerRef, report]);

  /**
   * Closes the watch window when playback stops (pause / end).
   *
   * Pausing right after a scrub must not count the scrubbed-over range as
   * watched: on a forward seek the window closes at the pre-jump position
   * (backend-valid because segmentEnd <= currentTime), and on a backward seek
   * only the still-valid part up to the new position is reported because the
   * pre-jump end would be beyond the current position.
   */
  const closePlaybackWindow = useCallback(
    (options: { requiresPlaying: boolean }) => {
      if (options.requiresPlaying && !isPlayingRef.current) return;
      isPlayingRef.current = false;

      const player = playerRef.current;
      if (!player) return;

      let current = 0;
      try {
        current = player.getCurrentTime();
      } catch {
        return;
      }

      const last = lastTickRef.current;
      const seekedForward =
        last != null && current - last > SEEK_THRESHOLD_SECONDS;

      lastTickRef.current = current;

      if (seekedForward && last != null) {
        // close the pre-jump window at the pre-jump position and start the
        // next window at the new position so the gap can never be reported
        void report({
          currentTime: current,
          segmentEnd: last,
          nextWindowStart: current,
        });
        windowStartRef.current = current;
      } else {
        void report({ currentTime: current });
      }
    },
    [playerRef, report],
  );

  const handlePaused = useCallback(
    () => closePlaybackWindow({ requiresPlaying: true }),
    [closePlaybackWindow],
  );

  const handleEnded = useCallback(
    () => closePlaybackWindow({ requiresPlaying: false }),
    [closePlaybackWindow],
  );

  // Navigating between lessons re-uses this component (param change, no
  // remount); reset the tracking refs so previous-lesson positions never
  // leak into the next lesson's reports.
  useEffect(() => {
    lastTickRef.current = null;
    windowStartRef.current = null;
    lastReportAtRef.current = 0;
    isPlayingRef.current = false;
  }, [lessonId]);

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
        if (current > last) {
          // forward seek: close the pre-jump window at the pre-jump position
          // and restart at the new position before any periodic report runs
          void report({
            currentTime: current,
            segmentEnd: last,
            nextWindowStart: current,
          });
          windowStartRef.current = current;
        } else {
          // backward seek: the pre-jump window cannot end at the new
          // position (segmentEnd would exceed currentTimeSeconds), so restart
          // the window there
          windowStartRef.current = current;
        }
      }

      lastTickRef.current = current;
      if (windowStartRef.current == null) windowStartRef.current = current;

      if (Date.now() - lastReportAtRef.current >= REPORT_INTERVAL_MS) {
        void report();
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [playerRef, report]);

  // Closing through the seek-aware path prevents a scrub performed while
  // paused from being counted as watched in the final report.
  useEffect(
    () => () => closePlaybackWindow({ requiresPlaying: false }),
    [closePlaybackWindow],
  );

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

      const last = lastTickRef.current;
      const seekedForward =
        last != null && current - last > SEEK_THRESHOLD_SECONDS;
      // never include a range skipped by a seek in the keepalive flush
      const segmentEnd = seekedForward && last != null ? last : current;
      const start = Math.max(rawStart, segmentEnd - MAX_SEGMENT_SECONDS);
      if (segmentEnd - start < MIN_SEGMENT_SECONDS) return;

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
          watchedSegmentEndSeconds: segmentEnd,
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
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [lessonId, playerRef]);

  return {
    handlePlaying,
    handlePaused,
    handleEnded,
    YT_PLAYER_STATE,
  };
};
