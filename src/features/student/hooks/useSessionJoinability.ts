import { useCallback, useSyncExternalStore } from "react";

const RE_CHECK_INTERVAL_MS = 30_000;

const subscribeToClock = (onStoreChange: () => void) => {
  const interval = setInterval(onStoreChange, RE_CHECK_INTERVAL_MS);
  return () => clearInterval(interval);
};

const isSessionTimeReached = (meetingDateTime: string | null) => {
  if (!meetingDateTime) return true;

  const sessionTime = new Date(meetingDateTime).getTime();
  if (Number.isNaN(sessionTime)) return true;

  return Date.now() >= sessionTime;
};

export const useSessionJoinability = (meetingDateTime: string | null) => {
  const getIsJoinable = useCallback(
    () => isSessionTimeReached(meetingDateTime),
    [meetingDateTime],
  );

  return useSyncExternalStore(subscribeToClock, getIsJoinable);
};
