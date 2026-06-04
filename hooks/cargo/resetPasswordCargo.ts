import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { resetPasswordCargo } from "@/api/freight-cargo";

export const useResetPasswordCargo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resetPasswordCargo(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Reset Password Cargo",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["cargo-operators"] });
      queryClient.invalidateQueries({ queryKey: ["single-cargo"] });
      queryClient.invalidateQueries({ queryKey: ["cargo-stat"] });
      queryClient.invalidateQueries({ queryKey: ["cargo-operator-stat"] });
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
