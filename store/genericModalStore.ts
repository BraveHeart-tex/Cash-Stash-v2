import { create } from "zustand";

type GenericModalState = {
  entityId: string | number;
  isGenericModalOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  mode: "edit" | "create";
  key: "budget" | "goal" | "transaction" | "reminder" | "account" | "";
  props: Record<string, any>;
  data: Record<string, any>;
  // eslint-disable-next-line no-unused-vars
  openGenericModal: (params: Partial<GenericModalState>) => void;
  closeGenericModal: () => void;
};

const useGenericModalStore = create<GenericModalState>((set) => ({
  entityId: "",
  isGenericModalOpen: false,
  mode: "create",
  dialogTitle: "",
  dialogDescription: "",
  key: "",
  props: {},
  data: {},
  openGenericModal: (params: Partial<GenericModalState>) => {
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
