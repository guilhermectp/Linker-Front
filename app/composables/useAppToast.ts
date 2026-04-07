import type { ToastProps } from "@nuxt/ui";

export const useAppToast = () => {
  const toast = useToast();

  const successToast = (description: string, options?: Partial<ToastProps>) => {
    return toast.add({
      title: "Sucesso",
      description,
      icon: "lucide:circle-check",
      ...options,
      color: "success",
    });
  };

  const errorToast = (error: unknown, options?: Partial<ToastProps>) => {
    const description =
      getErrorStatus(error) === 500
        ? "Erro inesperado. Tente novamente mais tarde. Se o problema persistir comunique o suporte/administrador."
        : getErrorMessage(error);

    return toast.add({
      title: "Erro",
      description,
      icon: "lucide:circle-x",
      ...options,
      color: "error",
    });
  };

  const informativeToast = (options: Partial<ToastProps>) => {
    return toast.add({
      icon: "lucide:info",
      ...options,
      color: "info",
    });
  };

  const warningToast = (options: Partial<ToastProps>) => {
    return toast.add({
      icon: "lucide:circle-alert",
      ...options,
      color: "warning",
    });
  };

  const neutralToast = (options: Partial<ToastProps>) => {
    return toast.add({
      ...options,
      color: "neutral",
    });
  };

  const removeToast = (toastId: string | number) => {
    toast.remove(toastId);
  };

  return {
    successToast,
    errorToast,
    informativeToast,
    warningToast,
    neutralToast,
    removeToast,
  };
};
