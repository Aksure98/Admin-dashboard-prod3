import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { suspendCargo } from "@/api/freight-cargo";

type SuspendCargoArgs = {
  id: string;
  payload: { reason: string; duration_days: number; message: string };
};

export const useSuspendCargo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: SuspendCargoArgs) =>
      suspendCargo(id, payload),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Suspend Cargo",
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
        title: "Suspension Failed",
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
