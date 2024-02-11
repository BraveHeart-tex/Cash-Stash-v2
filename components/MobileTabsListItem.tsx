"use client";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { createElement, useEffect } from "react";
import Link from "next/link";

type PageItem = {
  label: string;
  link: string;
  icon: React.ElementType;
};

const MobileTabsListItem = ({ page }: { page: PageItem }) => {
  const pathname = usePathname();
  const isActive = pathname === page.link;

  useEffect(() => {
    if (isActive) {
      document.title = `${page.label} - Cash Stash`;

      const element = document.querySelector(".active-tab");
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isActive, page]);

  return (
    <Link
      href={page.link}
      key={page.link}
      type="button"
      className={cn(
        "inline-flex h-full w-full flex-col items-center justify-center px-5 hover:bg-gray-100 dark:hover:bg-background/70 group",
        isActive && "active-tab"
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
  );
};
export default MobileTabsListItem;
