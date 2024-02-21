/* eslint-disable no-unused-vars */
import { create } from "zustand";

interface GenericConfirmObject {
  title: string;
  message: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  onConfirm: () => void;
  onDeny?: () => void;
}

interface GenericConfirmStoreState {
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
  resolvePrimaryAction: (actionResult: any) => void;
  resolveSecondaryAction: (actionResult: any) => void;
  showConfirm: (
    confirmObject: GenericConfirmObject,
    resolveCallback?: (actionResult: any, cleanUp: () => void) => void
  ) => Promise<any>;
  cleanUp: () => void;
}

export const useGenericConfirmStore = create<GenericConfirmStoreState>(
  (set, get) => ({
    visible: false,
    title: "",
    message: "",
    primaryActionLabel: "",
    secondaryActionLabel: "",
    onConfirmResult: null,
    onDenyResult: null,
    loading: false,
    resolvePrimaryAction: () => {},
    resolveSecondaryAction: () => {},
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

      if (get().resolvePrimaryAction) {
        get().resolvePrimaryAction(actionResult);
      }
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

      if (get().resolveSecondaryAction) {
        get().resolveSecondaryAction(actionResult);
      }
    },
    showConfirm: (
      {
        title,
        message,
        primaryActionLabel,
        onConfirm,
        onDeny,
        secondaryActionLabel,
      },
      resolveCallback
    ) => {
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

      const cleanUp = get().cleanUp;

      return new Promise((resolve) => {
        set((state) => ({
          ...state,
          resolvePrimaryAction: (actionResult) => {
            if (resolveCallback && actionResult) {
              resolveCallback(actionResult, cleanUp);
            }
            resolve(actionResult);
          },
          resolveSecondaryAction: (actionResult) => {
            if (resolveCallback && actionResult) {
              resolveCallback(actionResult, cleanUp);
            }
            resolve(actionResult);
          },
        }));
      });
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
  })
);
