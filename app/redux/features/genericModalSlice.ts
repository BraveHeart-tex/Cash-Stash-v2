import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface GenericModalState {
  entityId: string;
  isGenericModalOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  mode: "edit" | "create";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  props: any;
}

const initialState: GenericModalState = {
  entityId: "",
  isGenericModalOpen: false,
  mode: "create",
  dialogTitle: "",
  dialogDescription: "",
  key: "",
  props: {},
};

export const genericModalSlice = createSlice({
  name: "genericModal",
  initialState,
  reducers: {
    openGenericModal: (
      state,
      action: PayloadAction<{
        mode: "edit" | "create";
        entityId: string;
        dialogTitle: string;
        dialogDescription: string;
        key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
        props?: any;
      }>
    ) => {
      const { entityId, mode, dialogTitle, dialogDescription, key, props } =
        action.payload;

      state.entityId = entityId;
      state.key = key;
      state.isGenericModalOpen = true;
      state.dialogTitle = dialogTitle;
      state.dialogDescription = dialogDescription;
      state.mode = mode;
      state.props = props;
    },

    closeGenericModal: (state) => {
      (state.entityId = ""), (state.isGenericModalOpen = false);
      state.mode = "create";
      state.dialogTitle = "";
      state.dialogDescription = "";
      state.key = "";
      state.props = {};
    },
  },
});

export const { openGenericModal, closeGenericModal } =
  genericModalSlice.actions;

export default genericModalSlice.reducer;
