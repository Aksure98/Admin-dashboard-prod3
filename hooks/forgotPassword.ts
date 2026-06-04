import { useMutation } from "@tanstack/react-query";
import { forgotPassword } from "../api/auth";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";

export const useForgotPassword = () => {
  return useMutation({
    mutationFn: forgotPassword,

    onSuccess: (data: ApiResponse<SignInData>) => {
      notify({
        type: "success",
        title: "Reset Password Link Sent",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },
    onError: (error: AxiosError) => {
      notify({
        type: "danger",
        title: "Error",
        autoClose: true,
        autoCloseDelay: 3000,
        message:
          (error.response?.data as ErrorResponse)?.message ||
          "Something went wrong",
      });
    },
  });
};
