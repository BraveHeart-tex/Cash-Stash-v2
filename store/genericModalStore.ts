import type { GenericDialogKeyType } from "@/typings/genericModal";
import { create } from "zustand";

type GenericModalState = {
  entityId: string | number;
  isGenericModalOpen: boolean;
  dialogTitle?: string;
  dialogDescription?: string;
  mode: "edit" | "create";
  key: GenericDialogKeyType | null;
  props: Record<string, unknown>;
  data: Record<string, unknown>;
  openGenericModal: (params: Partial<GenericModalState>) => void;
  closeGenericModal: () => void;
};

const useGenericModalStore = create<GenericModalState>((set) => ({
  entityId: "",
  isGenericModalOpen: false,
  mode: "create",
  dialogTitle: "",
  dialogDescription: "",
  key: null,
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
      key: null,
      props: {},
      data: {},
    }));
  },
}));

export default useGenericModalStore;
