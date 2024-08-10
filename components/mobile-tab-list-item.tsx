"use client";
import { cn } from "@/lib/utils/stringUtils/cn";
import { Link } from "@/navigation";
import { usePathname } from "@/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";

type PageItem = {
  label: string;
  link: string;
  icon: React.ElementType;
};

const MobileTabsListItem = ({ page }: { page: PageItem }) => {
  const t = useTranslations("NavigationItems");
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
        "group inline-flex h-full w-full flex-col items-center justify-center md:px-5",
        isActive && "active-tab",
      )}
    >
      <page.icon className="mb-2 h-5 w-5 text-muted-foreground group-[.active-tab]:text-primary" />
      <span className="text-xs text-muted-foreground group-[.active-tab]:text-primary md:text-sm">
        {t(`${page.link}.label` as any)}
      </span>
    </Link>
  );
};
export default MobileTabsListItem;
