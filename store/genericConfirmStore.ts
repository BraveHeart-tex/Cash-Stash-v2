/* eslint-disable no-unused-vars */
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type GenericConfirmObject = {
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onConfirm: () => void;
  onDeny?: () => void;
};

type GenericConfirmStoreState = {
  visible: boolean;
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel: string;
  loading: boolean;
  onConfirm: () => void;
  onDeny: () => void;
  onConfirmResult: any;
  onDenyResult: any;
  callPrimaryAction: () => void;
  callSecondaryAction: () => void;
  showConfirm: (confirmObject: GenericConfirmObject) => void;
  cleanUp: () => void;
};

export const useGenericConfirmStore = create<
  GenericConfirmStoreState,
  [["zustand/devtools", never]]
>(
  devtools(
    (set, get) => ({
      visible: false,
      title: "",
      message: "",
      primaryActionLabel: "",
      secondaryActionLabel: "",
      onConfirmResult: null,
      onDenyResult: null,
      loading: false,
      onConfirm: () => {},
      onDeny: () => {},
      callPrimaryAction: async () => {
        const { onConfirm } = get();
        if (!onConfirm) return;

        set((state) => ({ ...state, loading: true }));
        const actionResult = await onConfirm();

        set((state) => ({
          ...state,
          visible: false,
          loading: false,
          primaryActionResult: actionResult,
        }));
      },
      callSecondaryAction: async () => {
        const { onDeny } = get();
        if (!onDeny) return;
        const actionResult = await onDeny();

        set((state) => ({
          ...state,
          visible: false,
          secondaryActionResult: actionResult,
        }));
      },
      showConfirm: ({
        title,
        message,
        primaryActionLabel,
        onConfirm,
        onDeny,
        secondaryActionLabel,
      }) => {
        set((state) => ({
          ...state,
          visible: true,
          title,
          message,
          primaryActionLabel,
          secondaryActionLabel,
          onConfirm,
          onDeny,
        }));
      },
      cleanUp: () => {
        set((state) => ({
          ...state,
          visible: false,
          title: "",
          message: "",
          primaryActionLabel: "",
          secondaryActionLabel: "",
          onConfirm: () => {},
          onDeny: () => {},
          onConfirmResult: null,
          onDenyResult: null,
          loading: false,
        }));
      },
    }),
    {
      name: "GenericConfirmStore",
    }
  )
);
