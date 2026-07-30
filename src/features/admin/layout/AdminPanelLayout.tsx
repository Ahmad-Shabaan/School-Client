import Footer from "@/shared/components/layout/Footer/Footer";
// import Navbar from "@/shared/components/layout/Header/Navbar";
import { Outlet } from "react-router-dom";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const AdminPanelLayout = () => {
  return (
    <div className="min-h-svh flex flex-col">
      <SidebarProvider>
        <AppSidebar />
        <main>
          {/* <Navbar /> */}
          <SidebarTrigger />
          <Outlet />
          <Footer />
        </main>
      </SidebarProvider>
    </div>
  );
};

export default AdminPanelLayout;
