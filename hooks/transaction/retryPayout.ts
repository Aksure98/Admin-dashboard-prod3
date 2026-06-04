import { TeamMemberResponse } from "@/@types";
import { retryPayout } from "@/api/transactions";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useRetryPayout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => retryPayout(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Payout Retry Successful",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Payout Retry Failed",
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
