import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Menu, MessageSquare, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useMyUnreadChatCount } from "@/features/chat/hooks/useChat";
import { MAX_CHAT_BADGE_COUNT } from "@/features/chat/constants/chat.constants";
import { studentChatPath } from "@/config/routes";
import { NotificationBell } from "@/features/notifications/components";
import StudentMobileMenu from "./StudentMobileMenu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const StudentHeader = () => {
  const { logout, isLoggingOut } = useAuth();
  const user = useAppSelector((state) => state.auth.user);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { data: unreadCountData } = useMyUnreadChatCount(true);
  const chatUnreadCount = unreadCountData?.data ?? 0;

  const initial = user?.firstName?.trim().charAt(0) || "أ";
  const displayName = user
    ? `${user.firstName} ${user.lastName}`
    : "طالب";

  return (
    <header className="sticky top-0 z-50 flex items-center justify-between gap-3 border-b border-line bg-white/95 px-4 py-2.5 backdrop-blur sm:px-6 sm:py-3">
      <Link
        to="/"
        className="group flex min-w-0 items-center gap-2.5 text-ink"
      >
        <span className="flex size-9 flex-none items-center justify-center rounded-full border border-gold bg-gradient-to-br from-teal to-teal-dark text-base font-extrabold text-gold-soft sm:size-10 sm:text-lg">
          س
        </span>
        <span className="truncate text-base font-extrabold text-teal-dark sm:text-lg">
          المدرسة النُّعمانية
        </span>
      </Link>

      <div className="hidden items-center gap-2 sm:flex sm:gap-3">
        <NotificationBell />

        <Link
          to={studentChatPath()}
          className="group relative flex size-10 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white"
          aria-label="الدردشة مع الإدارة"
        >
          <MessageSquare className="size-5" />
          {chatUnreadCount > 0 && (
            <span className="absolute -top-1 -left-1 flex h-5 min-w-5 items-center justify-center rounded-full border-2 border-white bg-gold px-1 text-[10px] font-bold leading-none text-white">
              {chatUnreadCount > MAX_CHAT_BADGE_COUNT
                ? `${MAX_CHAT_BADGE_COUNT}+`
                : chatUnreadCount}
            </span>
          )}
        </Link>

        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex cursor-pointer items-center gap-2 rounded-full border border-line bg-paper p-1 pr-1 transition-all duration-200 outline-none hover:border-gold hover:bg-white focus-visible:ring-2 focus-visible:ring-gold/50"
            aria-label="قائمة المستخدم"
          >
            <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-teal-soft to-gold-soft text-sm font-extrabold text-teal-dark sm:size-8">
              {initial}
            </span>
            <span className="hidden max-w-24 truncate pe-1 text-[0.8rem] font-bold text-teal-dark lg:block">
              {displayName}
            </span>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="min-w-44 rounded-xl border-line bg-white p-1.5 font-tajawal shadow-[0_8px_24px_rgba(22,48,42,0.12)]"
          >
            <DropdownMenuLabel className="pe-3 text-body-mute">
              <span className="block truncate text-sm font-bold text-body">
                {displayName}
              </span>
              {user?.email && (
                <span className="block truncate text-xs font-normal text-body-mute">
                  {user.email}
                </span>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-line" />
            <DropdownMenuItem
              asChild
              className="cursor-pointer rounded-lg text-body focus:bg-teal-soft focus:text-teal-dark"
            >
              <Link to="/student">
                <User className="size-4 text-teal-dark" />
                الملف الشخصي
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => logout()}
              disabled={isLoggingOut}
              className="cursor-pointer rounded-lg text-error-dim focus:bg-error/10 focus:text-error-dim"
            >
              <LogOut className="size-4" />
              {isLoggingOut ? "جارٍ الخروج..." : "تسجيل الخروج"}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <button
        type="button"
        onClick={() => setIsMenuOpen(true)}
        aria-label="فتح القائمة"
        aria-haspopup="dialog"
        aria-expanded={isMenuOpen}
        className="flex size-9 flex-none cursor-pointer items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white sm:hidden"
      >
        <Menu className="size-4" />
      </button>

      <StudentMobileMenu open={isMenuOpen} onOpenChange={setIsMenuOpen} />
    </header>
  );
};

export default StudentHeader;