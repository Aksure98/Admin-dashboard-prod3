import { TeamMemberResponse } from "@/@types";
import { resolveTransaction } from "@/api/transactions";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useResolveTransaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      resolution_note,
    }: {
      id: string;
      resolution_note: string;
    }) => resolveTransaction(id, resolution_note),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Transaction Resolved",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Resolution Failed",
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
