import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { ROLES } from "@/config/constants";
import { ROUTES } from "@/config/routes";
import {
  ChartBar,
  LucideChartColumnIncreasing,
  TvMinimalPlayIcon,
  User2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const handleNavigation = (e: React.PointerEvent<HTMLButtonElement>) => {
    navigate(
      `${ROUTES[ROLES.Admin].basePath}/${e.currentTarget.innerText.toLowerCase()}`,
    );
  };

  return (
    <Sidebar className="border-r border-sidebar-border">
      <SidebarHeader className="pb-4 mb-6">
        <h1 className="text-lg font-semibold text-sidebar-foreground tracking-tighter">
          School
        </h1>
        <p className="text-xs text-sidebar-foreground/50">Admin Panel</p>
      </SidebarHeader>
      <SidebarFooter className="space-y-2">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNavigation}
              isActive={pathname.toLowerCase().includes("dashboard")}
              variant="default"
            >
              <ChartBar className="h-4 w-4" /> Dashboard
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNavigation}
              isActive={pathname.toLowerCase().includes("members")}
              variant="default"
            >
              <User2 className="h-4 w-4" /> Members
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNavigation}
              isActive={pathname.toLowerCase().includes("courses")}
              variant="default"
            >
              <LucideChartColumnIncreasing className="h-4 w-4" /> Courses
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleNavigation}
              isActive={pathname.toLowerCase().includes("subscriptions")}
              variant="default"
            >
              <TvMinimalPlayIcon className="h-4 w-4" /> Subscriptions
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
