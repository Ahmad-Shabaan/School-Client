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
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

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
];

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

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
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-dim text-[10px] font-bold text-white">
            A
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium text-sidebar-foreground">
              Admin
            </span>
            <span className="text-[10px] text-sidebar-foreground/40">
              System Administrator
            </span>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
