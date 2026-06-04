import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { activateDriver } from "@/api/drivers";

export const useActivateDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateDriver(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Activate Driver",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["single-driver"] });
      queryClient.invalidateQueries({ queryKey: ["driver-stat"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Activation Failed",
        autoClose: true,
        autoCloseDelay: 3000,
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    },
  });
};
