import LoginForm from "../components/LoginForm";
import { useAuth } from "../hooks/useAuth";

export default function LoginPage() {
  const { login, isLoggingIn, loginError, isLoginError } = useAuth();
  
  return (
    <div className="min-h-svh flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted/50 p-6">
      <div className="w-full space-y-8 max-w-md">
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-4">
          <h1 className="text-3xl font-bold text-foreground bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            SchoolWise
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to continue to your dashboard
          </p>
        </div>
        
        {/* Form */}
        <LoginForm
          onSubmit={login}
          isLoading={isLoggingIn}
          error={loginError}
          isLoginError={isLoginError}
        />
        
        {/* Footer links */}
        <div className="flex flex-col items-center space-y-4 text-sm">
          <p className="text-muted-foreground">
            Don't have an account?{" "}
            <a href="/register" className="font-medium text-primary hover:text-primary/90 transition-colors">
              Sign up
            </a>
          </p>
          <p className="text-xs text-muted-foreground/50">
            © {new Date().getFullYear()} SchoolWise. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
