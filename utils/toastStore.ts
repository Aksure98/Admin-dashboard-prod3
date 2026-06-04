import { create } from "zustand";

type ToastType = "success" | "warning" | "danger" | "info";

interface ToastState {
  isOpen: boolean;
  type: ToastType;
  title: string;
  message: string;
  autoClose: boolean;
  autoCloseDelay: number;
  onConfirm: (() => void) | null;
  confirmText: string;
  cancelText: string;
  show: (opts: Partial<Omit<ToastState, "isOpen" | "show" | "hide">>) => void;
  hide: () => void;
}

const defaultState = {
  isOpen: false,
  type: "success" as ToastType,
  title: "",
  message: "",
  autoClose: false, // ✅ always resets to false
  autoCloseDelay: 3000,
  onConfirm: null,
  confirmText: "Yes, Proceed",
  cancelText: "No, Cancel",
};

export const useToastStore = create<ToastState>((set) => ({
  ...defaultState,
  show: (opts) => set({ ...defaultState, ...opts, isOpen: true }), // ✅ reset defaults before applying new opts
  hide: () => set(defaultState), // ✅ full reset on hide
}));

export const notify = (
  opts: Partial<Omit<ToastState, "isOpen" | "show" | "hide">>,
) => {
  useToastStore.getState().show(opts);
};
