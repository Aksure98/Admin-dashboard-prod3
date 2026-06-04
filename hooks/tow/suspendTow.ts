import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { suspendTow } from "@/api/tow";

type SuspendTowArgs = {
  id: string;
  payload: { reason: string; duration_days: number; message: string };
};

export const useSuspendTow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: SuspendTowArgs) => suspendTow(id, payload),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Suspend Tow",
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
