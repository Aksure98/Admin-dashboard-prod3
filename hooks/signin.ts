import { useMutation } from "@tanstack/react-query";
import { login as loginUser } from "../api/auth";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { setUser } from "@/store/slices/userSlice";
import { store } from "@/store";

export const useSignIn = () => {
  return useMutation({
    mutationFn: loginUser,
    onMutate: () => {
      localStorage.removeItem("token");
    },

    onSuccess: (data: ApiResponse<SignInData>) => {
      localStorage.setItem("token", data?.data?.token);
      // localStorage.setItem("refreshToken", data.data.refresh_token);
      store.dispatch(
        setUser({
          full_name: data?.data?.admin?.full_name,
          email: data?.data?.admin?.email,
          role: data?.data?.admin?.role?.name,
          status: data?.data?.admin?.status,
          created_at: data?.data?.admin?.created_at,
          id: data?.data?.admin?.id,
          logo: "https://i.pravatar.cc/150?img=6",
        }),
      );
      console.log(data?.data?.admin);

      notify({
        type: "success",
        title: "Login Successful",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },
    onError: (error: AxiosError) => {
      console.log(error);
      notify({
        type: "danger",
        title: "Login Failed",
        autoClose: true,
        autoCloseDelay: 3000,
        message:
          (error.response?.data as ErrorResponse)?.message ||
          "Something went wrong",
      });
    },
  });
};
