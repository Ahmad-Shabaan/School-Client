import useNotificationsConnection from "../hooks/useNotificationsConnection";

/**
 * Mounts the single app-wide SignalR connection for the authenticated
 * session. Rendered inside the authenticated route guard.
 */
const NotificationsConnection = () => {
  useNotificationsConnection();
  return null;
};

export default NotificationsConnection;
