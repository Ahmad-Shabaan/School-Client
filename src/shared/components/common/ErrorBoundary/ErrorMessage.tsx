import { cn } from "@/lib/utils";
type Msg = {
  msg?: string;
  errors?: Record<string, string[]>;
  className?: string;
};
const ErrorMessage = ({
  msg = "Oops! Something went wrong while loading filters. Please try again in a minute.",
  className = "",
  errors = undefined,
}: Msg) => {
  console.log("errors....................", errors);
  return (
    <div
      role="alert"
      className={cn(
        "mx-auto flex-center flex-col gap-3 rounded-xl border border-error/20 bg-error/8 px-4 py-3 text-sm text-error",
        className,
      )}
    >
      <div className="flex-center gap-1 ">
        <span className="pb-1 text-base leading-none">⚠</span>
        <p className="text-error">{msg}</p>
      </div>
      {errors !== undefined && (
        <>
          {Object.entries(errors).map(([field, errors]) => (
            <div key={field} className="w-full ">
              <strong>{field}</strong>
              <ul>
                {errors.map((error) => (
                  <li className="truncate" key={error}>{error}</li>
                ))}
                <li className="truncate">Last name must not be empty you should re assign value to it immediately. then can create new user</li>
              </ul>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
export default ErrorMessage;
