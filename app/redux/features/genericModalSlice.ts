import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GenericModalState {
  entityId: number;
  isGenericModalOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  mode: "edit" | "create";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
}

const initialState: GenericModalState = {
  entityId: 0,
  isGenericModalOpen: false,
  mode: "create",
  dialogTitle: "",
  dialogDescription: "",
  key: "",
};

export const genericModalSlice = createSlice({
  name: "genericModal",
  initialState,
  reducers: {
    openGenericModal: (
      state,
      action: PayloadAction<{
        mode: "edit" | "create";
        entityId: number;
        dialogTitle: string;
        dialogDescription: string;
        key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
      }>
    ) => {
      const { entityId, mode, dialogTitle, dialogDescription, key } =
        action.payload;

      state.entityId = entityId;
      state.key = key;
      state.isGenericModalOpen = true;
      state.dialogTitle = dialogTitle;
      state.dialogDescription = dialogDescription;
      state.mode = mode;
    },

    closeGenericModal: (state) => {
      state.entityId = 0;
      state.isGenericModalOpen = false;
      state.mode = "create";
      state.dialogTitle = "";
      state.dialogDescription = "";
      state.key = "";
    },
  },
});

export const { openGenericModal, closeGenericModal } =
  genericModalSlice.actions;

export default genericModalSlice.reducer;
