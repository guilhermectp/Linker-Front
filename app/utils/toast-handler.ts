import type { ToastProps } from "@nuxt/ui";

let toastInstance: any = null;
const errorToast = "Toast não inicializado";

export const Toast = {
  init: (toast: any) => {
    toastInstance = toast;
  },

  success: (description: string, options?: Partial<ToastProps>) => {
    if (!toastInstance) throw new Error(errorToast);
    return toastInstance.add({
      title: "Sucesso",
      description,
      icon: "lucide:circle-check",
      ...options,
      color: "success",
    });
  },

  error: (error: any, options?: Partial<ToastProps>) => {
    if (!toastInstance) throw new Error(errorToast);

    const description =
      typeof error === "string" ? error : getErrorMessage(error);

    return toastInstance.add({
      title: "Erro",
      description: description,
      icon: "lucide:circle-x",
      ...options,
      color: "error",
    });
  },

  info: (options: Partial<ToastProps>) => {
    if (!toastInstance) throw new Error(errorToast);
    return toastInstance.add({
      icon: "lucide:info",
      ...options,
      color: "info",
    });
  },

  warning: (options: Partial<ToastProps>) => {
    if (!toastInstance) throw new Error(errorToast);
    return toastInstance.add({
      icon: "lucide:circle-alert",
      ...options,
      color: "warning",
    });
  },

  neutral: (options: Partial<ToastProps>) => {
    if (!toastInstance) throw new Error(errorToast);
    return toastInstance.add({
      ...options,
      color: "neutral",
    });
  },

  remove: (toastId: string | number) => {
    if (!toastInstance) throw new Error(errorToast);
    toastInstance.remove(toastId);
  },
};
