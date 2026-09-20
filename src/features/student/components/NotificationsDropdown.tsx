import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import { cn } from "@/lib/utils";
import type { StudentNotification } from "../type/student";
import { initialNotificationsData } from "../data/mockStudentData";

const unreadCount = initialNotificationsData.filter(
  (notification) => notification.unread,
).length;

const NotificationItem = ({
  notification,
  isLast,
}: {
  notification: StudentNotification;
  isLast: boolean;
}) => (
  <li
    className={cn(
      "flex flex-col px-4 py-3 text-sm text-body",
      notification.unread && "bg-teal-soft",
      !isLast && "border-b border-line",
    )}
  >
    <span>{notification.message}</span>
    <span className="mt-1 text-xs text-body-mute">{notification.time}</span>
  </li>
);

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
        onClick={() => setIsOpen((open) => !open)}
        className="group relative flex size-10 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white"
      >
        <Bell className="size-5" />
        <span className="absolute -top-1 -left-1 flex size-[18px] items-center justify-center rounded-full border-2 border-white bg-gold text-[11px] font-bold text-white">
          {unreadCount}
        </span>
      </button>

      {isOpen && (
        <div className="fixed inset-x-3 top-[4.5rem] z-50 overflow-hidden rounded-[10px] border border-line bg-white shadow-[0_4px_15px_rgba(0,0,0,0.08)] sm:absolute sm:inset-x-auto sm:top-[50px] sm:w-[280px] sm:left-0 sm:right-auto">
          <div className="border-b border-line bg-paper px-4 py-3 font-bold text-teal-dark">
            الإشعارات
          </div>
          <ul>
            {initialNotificationsData.map((notification, index) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                isLast={index === initialNotificationsData.length - 1}
              />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;