import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { resetPasswordDriver } from "@/api/drivers";

export const useResetPasswordDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resetPasswordDriver(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Reset Password Driver",
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
        title: "Failed",
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
