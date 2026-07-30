import { useRef } from "react";
import { useNavAnimation } from "./navbar.animation";

const Navbar = () => {
  const navRef = useRef<HTMLDivElement>(null);
  // Animations
  useNavAnimation({ sectionRef: navRef });
  return (
    <header className="z-50">
      <nav
        ref={navRef}
        className="fixed top-0 w-full px-4 sm:px-6 lg:px-8 py-4 bg-background/95 backdrop-blur border-b border-border/50"
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* <Logo className="h-8 w-8" /> */}
            <h1 className="text-xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              SchoolWise
            </h1>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            {/* Navigation links would go here - preserving existing functionality */}
            <div className="flex space-x-4">
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Dashboard
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Courses
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Members
              </a>
              <a href="#" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                Subscriptions
              </a>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* User actions - preserving existing functionality */}
            <div className="relative">
              {/* <button className="p-2 rounded-md hover:bg-muted/50 transition-colors">
  
              </button> */}
            </div>
            <div className="relative">
              {/* <button className="p-2 rounded-md hover:bg-muted/50 transition-colors">
     
              </button> */}
            </div>
            <div className="relative">
              <div className="relative">
                <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-muted/50 transition-colors">
                  <span className="hidden md:block">Welcome</span>
                  <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {/* Dropdown menu would go here - preserving existing functionality */}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
