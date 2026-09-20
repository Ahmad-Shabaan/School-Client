import { useRef } from "react";
import { Outlet } from "react-router-dom";
import { useLoginFormAnimation } from "../animations/form.animation";

const AuthLayout = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  useLoginFormAnimation({ sectionRef: containerRef });
  return (
    // Outer wrapper carries the academy paper background so the
    // login screen matches the landing + student profile identity.
    <main className="min-h-svh overflow-hidden bg-paper">
      <div className="flex min-h-svh" ref={containerRef}>
        <Outlet />
      </div>
    </main>
  );
};

export default AuthLayout;