"use client";
import { cn } from "@/lib/utils/stringUtils/cn";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import Link from "next/link";

type PageItem = {
  label: string;
  link: string;
  icon: React.ElementType;
};

const MobileTabsListItem = ({ page }: { page: PageItem }) => {
  const elementRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();
  const isActive = pathname === page.link;

  useEffect(() => {
    if (isActive && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [isActive, elementRef]);

  return (
    <Link
      href={page.link}
      key={page.link}
      type="button"
      ref={elementRef}
      className={cn(
        "inline-flex h-full w-full flex-col items-center justify-center md:px-5 group",
        isActive && "active-tab"
      )}
    >
      <page.icon className="w-5 h-5 mb-2 text-muted-foreground group-[.active-tab]:text-primary" />
      <span className="text-xs md:text-sm text-muted-foreground group-[.active-tab]:text-primary">
        {page.label}
      </span>
    </Link>
  );
};
export default MobileTabsListItem;
