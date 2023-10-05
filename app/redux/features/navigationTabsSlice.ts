import { Page } from "@/lib/utils";
import { createSlice } from "@reduxjs/toolkit";

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
    setSelectedTab: (state, action) => {
      state.selectedTab = action.payload;
    },
  },
});

export const { setSelectedTab } = NavigationTabsSlice.actions;

export default NavigationTabsSlice.reducer;
