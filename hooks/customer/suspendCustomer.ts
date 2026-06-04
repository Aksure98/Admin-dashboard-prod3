import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { suspendCustomer } from "@/api/customer";

type SuspendCustomerArgs = {
  id: string;
  payload: { reason: string; duration_days: number; message: string };
};

export const useSuspendCustomer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: SuspendCustomerArgs) =>
      suspendCustomer(id, payload),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Suspend customer",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["customers"] });
      queryClient.invalidateQueries({ queryKey: ["single-customer"] });
      queryClient.invalidateQueries({ queryKey: ["customer-stat"] });
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
