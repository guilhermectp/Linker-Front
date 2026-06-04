import { Toast } from "~/utils/toast-handler";

export default defineNuxtPlugin(() => {
  const toast = useToast();
  Toast.init(toast);

  return {
    provide: {
      toast: Toast,
    },
  };
});
