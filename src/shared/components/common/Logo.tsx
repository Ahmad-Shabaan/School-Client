import { cn } from "@/lib/utils";
// import useTheme from "@/shared/hooks/useTheme";
import { useAppSelector } from "@/store/hooks";
import { Link } from "react-router-dom";

const Logo = ({ className }: { className?: string }) => {
  // const [theme] = useTheme();
  const theme = useAppSelector((state) => state.theme);
  return (
    <Link to="/">
      {theme === "dark" ? (
        <>
          <img
            src="/images/phone-dark-logo.webp"
            alt="logo"
            width={36}
            className={cn("lg:hidden size-9", className)}
          />
          <img
            src="/images/dark-logo.webp"
            alt="logo"
            className="hidden lg:inline-block  md:h-8"
          />
        </>
      ) : (
        <>
          <img
            src="/images/phone-light-logo.webp"
            alt="logo"
            // className=" md:hidden size-9"
            className={cn("lg:hidden size-9", className)}
          />
          <img
            src="/images/light-logo.webp"
            alt="logo"
            // width={175}
            className="hidden lg:inline-block md:h-8 "
          />
        </>
      )}
    </Link>
  );
};

export default Logo;
