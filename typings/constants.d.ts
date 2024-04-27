export type NavigationItem = {
  label: string;
  icon: IconType;
  link: (typeof PAGE_ROUTES)[keyof typeof PAGE_ROUTES];
  isPrimary?: boolean;
};
