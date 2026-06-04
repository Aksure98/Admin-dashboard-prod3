import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { resetPasswordTow } from "@/api/tow";

export const useResetPasswordTow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resetPasswordTow(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Reset Password Tow",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["tow-operators"] });
      queryClient.invalidateQueries({ queryKey: ["single-tow"] });
      queryClient.invalidateQueries({ queryKey: ["tow-stat"] });
      queryClient.invalidateQueries({ queryKey: ["tow-operator-stat"] });
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
