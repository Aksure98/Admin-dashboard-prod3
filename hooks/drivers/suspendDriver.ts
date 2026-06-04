import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { suspendDriver } from "@/api/drivers";

type SuspendCustomerArgs = {
  id: string;
  payload: { reason: string; duration_days: number; message: string };
};

export const useSuspendDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: SuspendCustomerArgs) =>
      suspendDriver(id, payload),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Suspend Driver",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["single-driver"] });
      queryClient.invalidateQueries({ queryKey: ["driver-stat"] });
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
