import { Bell } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import NotificationPanel, {
  type NotificationVariant,
} from "./NotificationPanel";
import { useUnreadNotificationsCount } from "../hooks/useNotifications";
import { MAX_BADGE_COUNT } from "../constants/notification.constants";

interface NotificationBellProps {
  /** Contextual theme: `admin` matches the admin navbar tokens, `student` keeps the teal design system. */
  variant?: NotificationVariant;
}

const BELL_STYLES: Record<
  NotificationVariant,
  { button: string; badge: string }
> = {
  student: {
    button:
      "group relative flex size-10 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/50",
    badge:
      "absolute -top-1 -left-1 flex min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-gold px-1 text-[11px] font-bold leading-[16px] text-white",
  },
  admin: {
    // Matches the neighboring navbar action buttons (logout = h-9 w-9) and the
    // admin token system instead of the student teal/gold palette.
    button:
      "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
    badge:
      "absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold leading-none text-primary-foreground ring-2 ring-background z-10",
  },
};

const NotificationBell = ({
  variant = "student",
}: NotificationBellProps = {}) => {
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

  const styles = BELL_STYLES[variant];

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        aria-label="الإشعارات"
        aria-expanded={isOpen}
        onClick={toggle}
        className={styles.button}
      >
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className={styles.badge}>
            {unreadCount > MAX_BADGE_COUNT
              ? `${MAX_BADGE_COUNT}+`
              : unreadCount}
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
          <div className="fixed inset-x-3 top-[calc(64px+8px)] z-50 sm:absolute sm:inset-x-auto sm:left-0 sm:top-[calc(100%+8px)] sm:w-[360px]">
            <NotificationPanel onClose={close} variant={variant} />
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationBell;
