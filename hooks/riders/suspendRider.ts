import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { suspendRider } from "@/api/riders";

type SuspendCustomerArgs = {
  id: string;
  payload: { reason: string; duration_days: number; message: string };
};

export const useSuspendRider = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: SuspendCustomerArgs) =>
      suspendRider(id, payload),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Suspend Rider",
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
