import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { ROLES } from "@/config/constants";
import { ROUTES } from "@/config/routes";
import {
  Users,
  BookOpen,
  CreditCard,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "@/store/hooks";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "dashboard",
    match: "dashboard",
  },
  { label: "Members", icon: Users, path: "members", match: "members" },
  { label: "Courses", icon: BookOpen, path: "courses", match: "courses" },
  {
    label: "Subscriptions",
    icon: CreditCard,
    path: "subscriptions",
    match: "subscriptions",
  },
  {
    label: "Messages",
    icon: MessageSquare,
    path: "chat",
    match: "chat",
  },
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);

  const displayName = user
    ? `${user.firstName} ${user.lastName}`.trim()
    : "Administrator";
  const roleLabel = user?.roles?.[0]
    ? user.roles[0].charAt(0).toUpperCase() + user.roles[0].slice(1).toLowerCase()
    : "System Administrator";
  const avatarInitial = user?.firstName?.trim().charAt(0) || "S";

  const handleNavigation = (path: string) => {
    navigate(`${ROUTES[ROLES.Admin].basePath}/${path}`);
  };

  return (
    <Sidebar className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="px-3 pt-4 pb-2">
        <div className="flex items-center gap-3 px-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-primary to-secondary shadow-sm">
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-base font-semibold text-sidebar-foreground tracking-tight">
              School
            </h1>
            <p className="text-[11px] text-sidebar-foreground/40 font-medium tracking-wide">
              Admin Panel
            </p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator className="mx-3 w-auto" />
      <SidebarGroup>
        <SidebarGroupLabel className="px-4 text-[11px] font-semibold uppercase tracking-widest text-sidebar-foreground/40">
          Main Menu
        </SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.path}>
                <SidebarMenuButton
                  onClick={() => handleNavigation(item.path)}
                  isActive={pathname.toLowerCase().includes(item.match)}
                  variant="default"
                  size="lg"
                  tooltip={item.label}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarSeparator className="mx-3 w-auto mt-auto" />
      <SidebarFooter className="px-3 pb-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 px-3 py-2.5">
          <div className="flex h-7 w-7 flex-none items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dim text-[10px] font-bold text-white">
            {avatarInitial}
          </div>
          <div className="flex min-w-0 flex-col">
            <span className="truncate text-xs font-medium text-sidebar-foreground">
              {displayName}
            </span>
            <span className="truncate text-[10px] text-sidebar-foreground/40">
              {roleLabel}
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
