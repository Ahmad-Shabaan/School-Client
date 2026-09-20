import Footer from "@/shared/components/layout/Footer/Footer";
import Navbar from "@/shared/components/layout/Header/Navbar";
import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const AppLayout = () => {
  return (
    <div className="min-h-svh flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <Navbar />
          <div className="flex-1">
            <Outlet />
          </div>
          <Footer />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AppLayout;