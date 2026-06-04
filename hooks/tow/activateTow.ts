import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { activateTow } from "@/api/tow";

export const useActivateTow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateTow(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Activate Tow",
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
