import { useRef } from "react";
import { useNavAnimation } from "./navbar.animation";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Bell, Search, GraduationCap } from "lucide-react";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  useNavAnimation({ sectionRef: navRef });
  return (
    <header className="sticky top-0 z-40 w-full">
      <nav
        ref={navRef}
        className="flex h-16 w-full items-center gap-4 border-b border-border/40 bg-background/80 backdrop-blur-xl px-4 sm:px-6"
        role="navigation"
        aria-label="Main navigation"
      >
        <SidebarTrigger className="size-8 text-muted-foreground hover:text-foreground" />

        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="hidden sm:flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary shadow-sm">
              <GraduationCap className="h-4 w-4 text-white" />
            </div>
            <span className="text-sm font-semibold text-foreground">
              School
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
              <Search className="h-4 w-4" />
            </button>
            <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-foreground transition-all duration-200">
              <Bell className="h-4 w-4" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l border-border/40">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-linear-to-br from-primary to-secondary text-xs font-bold text-white shadow-sm">
                A
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-medium text-foreground">Admin</span>
                <span className="text-[10px] text-muted-foreground">admin@school.com</span>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;