import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { activateCargo } from "@/api/freight-cargo";

export const useActivateCargo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateCargo(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Activate Cargo",
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
