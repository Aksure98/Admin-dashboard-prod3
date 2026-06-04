import { useMutation } from "@tanstack/react-query";
import { changePassword } from "../api/auth";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";

export const useChangePassword = () => {
  return useMutation({
    mutationFn: changePassword,

    onSuccess: (data: ApiResponse<SignInData>) => {
      notify({
        type: "success",
        title: "Password Change",
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
          (error.response?.data as { message: string }).message ||
          "Something went wrong",
      });
    },
  });
};
