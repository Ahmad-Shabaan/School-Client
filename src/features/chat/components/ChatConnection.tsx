import useChatConnection from "../hooks/useChatConnection";

/**
 * Mounts the single app-wide chat SignalR connection for the authenticated
 * session. Rendered inside the authenticated route guard next to the
 * notifications connection so both hubs share one connection lifecycle.
 */
const ChatConnection = () => {
  useChatConnection();
  return null;
};

export default ChatConnection;
