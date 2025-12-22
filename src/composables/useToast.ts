import { useToast as useVueToast } from "vue-toastification";
import type { ToastOptions } from "vue-toastification/dist/types/types";

export function useToast() {
  const toast = useVueToast();

  function success(message: string, options?: Omit<ToastOptions, 'type'>) {
    return toast.success(message, {
      timeout: 3000,
      ...options,
    });
  }

  function error(message: string, options?: Omit<ToastOptions, 'type'>) {
    return toast.error(message, {
      timeout: 5000,
      ...options,
    });
  }

  function warning(message: string, options?: Omit<ToastOptions, 'type'>) {
    return toast.warning(message, {
      timeout: 4000,
      ...options,
    });
  }

  function info(message: string, options?: Omit<ToastOptions, 'type'>) {
    return toast.info(message, {
      timeout: 3000,
      ...options,
    });
  }

  return {
    success,
    error,
    warning,
    info,
  };
}

