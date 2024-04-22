import { cn } from "@/lib/utils/stringUtils/cn";
import Image from "next/image";

type LogoProps = {
  width?: number;
  height?: number;
  className?: string;
};

const Logo = ({ width = 200, height = 200, className }: LogoProps) => {
  return (
    <Image
      src={"/logo.svg"}
      alt="Cash Stash Application Logo"
      width={width}
      height={height}
      className={cn("block monokai-dark:invert dark:invert", className)}
    />
  );
};

export default Logo;
