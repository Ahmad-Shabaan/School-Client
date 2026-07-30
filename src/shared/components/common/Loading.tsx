import { Spinner } from "@/components/ui/spinner";

const Loading = () => {
  return (
    <main className="main-container pt-0 min-h-svh">
      <div className="page-container flex-center min-h-svh">
        <Spinner className="size-10 text-primary" />
      </div>
    </main>
  );
};

export default Loading;
