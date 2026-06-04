import { TeamMemberResponse } from "@/@types";
import { debitDriverWallet } from "@/api/drivers";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDebitDriverWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { amount: string; reason: string };
    }) => debitDriverWallet(id, data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Wallet Debited",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["driver-wallet-details"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Debit Failed",
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
