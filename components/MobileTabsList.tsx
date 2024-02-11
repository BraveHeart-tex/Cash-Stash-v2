"use client";
import { PAGES, cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { createElement } from "react";
import Link from "next/link";

const MobileTabsList = () => {
  const pathname = usePathname();

  if (pathname.startsWith("/login") || pathname.startsWith("/signup"))
    return null;

  const isActive = (link: string) => pathname === link;

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-background border-t border-border">
      <div className="flex items-center justify-between h-full font-medium">
        {PAGES.map((page) => (
          <Link
            href={page.link}
            key={page.link}
            type="button"
            className={cn(
              "inline-flex h-full w-full flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-background/70 group",
              isActive(page.link) && "active-tab"
            )}
          >
            {createElement(page.icon, {
              className:
                "w-5 h-5 mb-2 text-muted-foreground group-hover:text-primary group-[.active-tab]:text-primary",
            })}

            <span className="text-sm text-muted-foreground group-hover:text-primary group-[.active-tab]:text-primary">
              {page.label}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default MobileTabsList;
