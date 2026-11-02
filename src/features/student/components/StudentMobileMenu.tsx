import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bell,
  LogOut,
  MessageSquare,
  User,
  X,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
} from "@/components/ui/sheet";
import { NotificationPanel } from "@/features/notifications/components";
import { useUnreadNotificationsCount } from "@/features/notifications/hooks/useNotifications";
import { MAX_BADGE_COUNT } from "@/features/notifications/constants/notification.constants";
import { useMyUnreadChatCount } from "@/features/chat/hooks/useChat";
import { MAX_CHAT_BADGE_COUNT } from "@/features/chat/constants/chat.constants";
import { studentChatPath } from "@/config/routes";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useAppSelector } from "@/store/hooks";

interface StudentMobileMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const itemClassName =
  "flex w-full cursor-pointer items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold text-body transition-colors hover:bg-teal-soft hover:text-teal-dark focus-visible:bg-teal-soft focus-visible:text-teal-dark focus-visible:outline-none";

const StudentMobileMenu = ({ open, onOpenChange }: StudentMobileMenuProps) => {
  const { logout, isLoggingOut } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data } = useUnreadNotificationsCount(open);
  const { data: chatUnreadData } = useMyUnreadChatCount(true);

  const unreadCount = data?.data ?? 0;
  const chatUnreadCount = chatUnreadData?.data ?? 0;
  const initial = user?.firstName?.trim().charAt(0) || "أ";
  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "طالب";

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) setIsNotificationsOpen(false);
    onOpenChange(nextOpen);
  };

  const closeMenu = () => handleOpenChange(false);

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="right"
        showCloseButton={false}
        className="w-[86%] max-w-xs gap-0 overflow-y-auto border-line bg-white p-0 font-tajawal"
      >
        <SheetTitle className="sr-only">قائمة الحساب</SheetTitle>
        <SheetDescription className="sr-only">
          روابط الحساب والإشعارات والتنقل
        </SheetDescription>

        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur">
          <span className="text-sm font-extrabold text-teal-dark">القائمة</span>
          <button
            type="button"
            onClick={closeMenu}
            aria-label="إغلاق القائمة"
            className="flex size-8 cursor-pointer items-center justify-center rounded-full text-body-mute transition-colors hover:bg-line hover:text-teal-dark"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="mx-3 mt-3 flex items-center gap-3 rounded-xl border border-line bg-paper p-3">
          <span className="flex size-10 flex-none items-center justify-center rounded-full bg-gradient-to-br from-teal-soft to-gold-soft text-sm font-extrabold text-teal-dark">
            {initial}
          </span>
          <span className="min-w-0">
            <span className="block truncate text-sm font-bold text-teal-dark">
              {displayName}
            </span>
            {user?.email && (
              <span className="block truncate text-xs text-body-mute">
                {user.email}
              </span>
            )}
          </span>
        </div>

        <nav className="flex flex-col gap-1 p-3" aria-label="التنقل">
          <button
            type="button"
            onClick={() => setIsNotificationsOpen((current) => !current)}
            aria-expanded={isNotificationsOpen}
            className={`${itemClassName} ${
              isNotificationsOpen ? "bg-teal-soft text-teal-dark" : ""
            }`}
          >
            <Bell className="size-4.5 flex-none" />
            <span>الإشعارات</span>
            {unreadCount > 0 && (
              <span className="ms-auto flex min-w-5 items-center justify-center rounded-full bg-gold px-1.5 py-0.5 text-[10px] font-extrabold leading-none text-white">
                {unreadCount > MAX_BADGE_COUNT
                  ? `${MAX_BADGE_COUNT}+`
                  : unreadCount}
              </span>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="py-1">
              <NotificationPanel
                onClose={() => setIsNotificationsOpen(false)}
              />
            </div>
          )}

          <Link
            to={studentChatPath()}
            onClick={closeMenu}
            className={itemClassName}
          >
            <MessageSquare className="size-4.5 flex-none" />
            <span>المحادثة</span>
            {chatUnreadCount > 0 && (
              <Badge variant="outline" className="text-xs px-2 py-0.5">
                {chatUnreadCount > MAX_CHAT_BADGE_COUNT
                  ? `${MAX_CHAT_BADGE_COUNT}+`
                  : chatUnreadCount}
              </Badge>
            )}
          </Link>

          <Link to="/student" onClick={closeMenu} className={itemClassName}>
            <User className="size-4.5 flex-none" />
            <span>الملف الشخصي</span>
          </Link>

          <button
            type="button"
            onClick={() => {
              closeMenu();
              logout();
            }}
            disabled={isLoggingOut}
            className={`${itemClassName} text-error-dim hover:bg-error/10 hover:text-error-dim`}
          >
            <LogOut className="size-4.5 flex-none" />
            <span>{isLoggingOut ? "جارٍ الخروج..." : "تسجيل الخروج"}</span>
          </button>
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default StudentMobileMenu;
