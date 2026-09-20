import { Link } from "react-router-dom";
import { LogOut, MessageSquare, User } from "lucide-react";
import { useAppSelector } from "@/store/hooks";
import { useAuth } from "@/features/auth/hooks/useAuth";
import NotificationsDropdown from "./NotificationsDropdown";
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

      <div className="flex items-center gap-2 sm:gap-3">
        <NotificationsDropdown />

        <Link
          to="/chat"
          aria-label="المحادثات"
          className="group relative flex size-9 items-center justify-center rounded-[10px] border border-line bg-paper text-teal-dark transition-all duration-200 hover:border-gold hover:bg-white sm:size-10"
        >
          <MessageSquare className="size-4 sm:size-5" />
          <span className="absolute -top-1 -left-1 flex size-[16px] items-center justify-center rounded-full border-2 border-white bg-gold text-[10px] font-bold text-white sm:size-[18px] sm:text-[11px]">
            2
          </span>
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
    </header>
  );
};

export default StudentHeader;