import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationPanel from "./NotificationPanel";
import { useUnreadNotificationsCount } from "../hooks/useNotifications";
import { MAX_BADGE_COUNT } from "../constants/notification.constants";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data } = useUnreadNotificationsCount(true);
  const unreadCount = data?.data ?? 0;

  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((open) => !open);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="الإشعارات"
        aria-expanded={isOpen}
        onClick={toggle}
        className="group relative flex size-10 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -left-1 flex min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gold px-1 text-[11px] font-bold leading-[16px] text-white">
            {unreadCount > MAX_BADGE_COUNT ? `${MAX_BADGE_COUNT}+` : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            className="fixed inset-0 z-40 cursor-default"
            onClick={close}
          />
          <div className="fixed inset-x-3 top-[4.5rem] z-50 sm:absolute sm:inset-x-auto sm:right-auto sm:left-0 sm:top-[50px] sm:w-[360px]">
            <NotificationPanel onClose={close} />
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
