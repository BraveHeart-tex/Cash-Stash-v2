import { create } from "zustand";

interface GenericModalState {
  entityId: string;
  isGenericModalOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  mode: "edit" | "create";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  props: Record<string, any>;
  data: Record<string, any>;
}

const useGenericModalStore = create<GenericModalState>((set) => ({
  entityId: "",
  isGenericModalOpen: false,
  mode: "create",
  dialogTitle: "",
  dialogDescription: "",
  key: "",
  props: {},
  data: {},
  openGenericModal: (params: GenericModalState) => {
    const { entityId, mode, dialogTitle, dialogDescription, key, props } =
      params;

    set((state) => ({
      ...state,
      entityId,
      key,
      isGenericModalOpen: true,
      dialogTitle,
      dialogDescription,
      mode,
      props,
      data: params.data,
    }));
  },
  closeGenericModal: () => {
    set((state) => ({
      ...state,
      entityId: "",
      isGenericModalOpen: false,
      mode: "create",
      dialogTitle: "",
      dialogDescription: "",
      key: "",
      props: {},
      data: {},
    }));
  },
}));

export default useGenericModalStore;
