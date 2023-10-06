import { Page } from "@/lib/utils";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface NavigationTabsState {
  selectedTab: Page;
}

const initialState: NavigationTabsState = {
  selectedTab: "Dashboard",
};

const NavigationTabsSlice = createSlice({
  name: "navigationTabs",
  initialState,
  reducers: {
    setSelectedTab: (state, action: PayloadAction<{ selectedTab: Page }>) => {
      state.selectedTab = action.payload.selectedTab;
    },
  },
});

export const { setSelectedTab } = NavigationTabsSlice.actions;

export default NavigationTabsSlice.reducer;
