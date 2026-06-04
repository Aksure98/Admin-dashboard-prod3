import { TeamMemberResponse } from "@/@types";
import { creditDriverWallet } from "@/api/drivers";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useCreditDriverWallet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string;
      data: { amount: string; reason: string };
    }) => creditDriverWallet(id, data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Wallet Credited",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["driver-wallet-details"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Credit Failed",
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
