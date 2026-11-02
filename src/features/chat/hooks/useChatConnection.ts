import { useEffect } from "react";
import { useAppSelector } from "@/store/hooks";
import { ensureChatConnection, stopChatConnection } from "../services/chatHub";

/**
 * Keeps a single chat SignalR connection alive for the whole authenticated
 * session. Mounted once under the authenticated route guard (PrivateRoute),
 * so both the student chat page and the admin inbox reuse the same
 * connection instead of opening a new one per page.
 */
export default function useChatConnection() {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.isAuthenticated,
  );
  const userId = useAppSelector((state) => state.auth.user?.id ?? null);

  useEffect(() => {
    if (!isAuthenticated || !userId) {
      stopChatConnection();
      return;
    }

    void ensureChatConnection(userId);

    return () => {
      // Keep the connection alive across page navigation; only stop when
      // the user logs out or the guard unmounts.
    };
  }, [isAuthenticated, userId]);
}
