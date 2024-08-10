import type { PAGE_ROUTES } from "@/lib/constants";
import type { IconType } from "react-icons/lib";

export type NavigationItem = {
  label: string;
  icon: IconType;
  link: (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];
  isPrimary?: boolean;
};
