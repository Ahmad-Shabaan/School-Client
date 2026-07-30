import { Link } from "react-router-dom";
import { Mail, Github } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/95 backdrop-blur">
      <div className="container w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start sm:gap-12">
          {/* Brand + copyright */}
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                School
              </h2>
              <div className="h-8 w-8 flex items-center justify-center bg-primary/10 rounded-md">
                <Mail className="h-4 w-4 text-primary" />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} BookWise. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground/60">
              Made with ❤️ for education
            </p>
          </div>

          {/* Nav links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground/90 mb-2 uppercase tracking-wider">
              Company
            </h3>
            <div className="space-y-1">
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                About Us
              </Link>
              <Link
                to="/privacy"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/terms"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Terms of Service
              </Link>
              <Link
                to="/support"
                className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                Support
              </Link>
            </div>
          </div>

          {/* Social links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-foreground/90 mb-2 uppercase tracking-wider">
              Connect
            </h3>
            <div className="flex flex-wrap gap-3">
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 border border-border/50 rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-200"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Mail className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
              <a
                href="#"
                className="flex items-center justify-center h-9 w-9 border border-border/50 rounded-lg hover:bg-primary/5 hover:text-primary transition-all duration-200"
                rel="noopener noreferrer"
                target="_blank"
              >
                <Github className="h-4 w-4 text-muted-foreground hover:text-primary" />
              </a>
            </div>
          </div>
        </div>
        
        {/* Divider */}
        <div className="mt-12 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground/50 text-center">
            This is a premium educational platform built with modern technologies
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
