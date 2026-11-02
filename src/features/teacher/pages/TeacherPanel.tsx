import { HardHat } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector } from "@/store/hooks";

const TeacherPanel = () => {
  const user = useAppSelector((state) => state.auth.user);

  return (
    <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <section className="col-center w-full max-w-md rounded-2xl border border-border/40 bg-card px-6 py-12 text-center shadow-card">
        <div className="size-16 rounded-2xl bg-linear-to-br from-primary/15 to-secondary/10 border border-border/30 flex items-center justify-center">
          <HardHat className="size-8 text-primary" />
        </div>
        <h1 className="mt-5 text-xl font-bold tracking-tight text-foreground">
          Teacher Panel
        </h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {user ? `Welcome, ${user.firstName}! ` : ""}
          This workspace is coming soon. Manage your courses from the admin
          panel in the meantime.
        </p>
        <div className="mt-6">
          <Button variant="outline" size="sm" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </section>
    </main>
  );
};

export default TeacherPanel;
