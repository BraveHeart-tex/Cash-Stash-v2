"use client";
import { setSelectedTab } from "@/app/redux/features/navigationTabsSlice";
import { useAppDispatch, useAppSelector } from "@/app/redux/hooks";
import { PAGES } from "@/lib/utils";

const MobileTabsList = () => {
  const { selectedTab } = useAppSelector(
    (state) => state.navigationTabsReducer
  );
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-row lg:hidden items-center gap-4 overflow-y-auto fixed bottom-0 left-0 w-full bg-muted font-medium h-[50px]">
      {PAGES.map((page, index) => (
        <button
          type="button"
          aria-label={`Set selected tab to ${page.label}`}
          key={index}
          data-state={selectedTab === page.label ? "active" : "inactive"}
          className="cursor-pointer flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-primary/70 data-[state=active]:text-white transition-all p-2 rounded-sm h-full"
          onClick={(e) => {
            dispatch(setSelectedTab({ selectedTab: page.label }));
            e.currentTarget.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        >
          {<page.icon className="w-6 h-6" />}
          {page.label}
        </button>
      ))}
    </div>
  );
};
export default MobileTabsList;
