import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { resetPasswordRider } from "@/api/riders";

export const useResetPasswordRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => resetPasswordRider(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Reset Password Rider",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["single-rider"] });
      queryClient.invalidateQueries({ queryKey: ["rider-stat"] });
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
