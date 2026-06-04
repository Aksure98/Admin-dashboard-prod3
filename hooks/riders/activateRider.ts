import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { activateRider } from "@/api/riders";

export const useActivateRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => activateRider(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Activate Rider",
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
