import { lazy, Suspense } from "react";

const NotificationsConnection = lazy(
  () =>
    import("@/features/notifications/components/NotificationsConnection"),
);

const ChatConnection = lazy(() =>
  import("@/features/chat/components/ChatConnection"),
);

/**
 * Mounts the app-wide SignalR connections (notifications + chat) for the
 * authenticated session. It is rendered by the authenticated route guards so
 * the connections follow the session lifecycle and are shared by every page
 * instead of being re-created per route or per component render.
 */
const AuthenticatedConnections = () => (
  <Suspense fallback={null}>
    <NotificationsConnection />
    <ChatConnection />
  </Suspense>
);

export default AuthenticatedConnections;
