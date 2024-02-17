import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GenericConfirmState {
  visible: boolean;
  title: string;
  message: string;
  primaryActionLabel: string;
  primaryAction: () => Promise<any> | void;
  primaryActionResult: any | null;
}

const initialState: GenericConfirmState = {
  visible: false,
  title: "",
  message: "",
  primaryActionLabel: "",
  primaryAction: () => {},
  primaryActionResult: null,
};

const genericConfirmSlice = createSlice({
  name: "genericConfirm",
  initialState,
  reducers: {
    showGenericConfirm: (
      state,
      action: PayloadAction<{
        title: string;
        message: string;
        primaryActionLabel: string;
        primaryAction: () => Promise<any> | void;
        resolveCallback: (result: any, cleanUp: any) => void;
      }>
    ) => {
      const {
        title,
        message,
        primaryActionLabel,
        primaryAction,
        resolveCallback,
      } = action.payload;

      state.visible = true;
      state.title = title;
      state.message = message;
      state.primaryActionLabel = primaryActionLabel;
      state.primaryAction = primaryAction;

      const primaryActionWithCallback = async () => {
        const result = await primaryAction();
        resolveCallback(result, cleanUp);
      };

      state.primaryAction = primaryActionWithCallback;
    },
    setPrimaryActionResult: (state, action: PayloadAction<any>) => {
      state.primaryActionResult = action.payload;
    },
    callPrimaryAction: (state) => {
      const result = state.primaryAction();
      state.primaryActionResult = result;
    },
    cleanUp: (state) => {
      state.visible = false;
      state.title = "";
      state.message = "";
      state.primaryActionLabel = "";
      state.primaryAction = async () => {};
      state.primaryActionResult = null;
    },
  },
});

export const {
  showGenericConfirm,
  setPrimaryActionResult,
  callPrimaryAction,
  cleanUp,
} = genericConfirmSlice.actions;

export default genericConfirmSlice.reducer;
