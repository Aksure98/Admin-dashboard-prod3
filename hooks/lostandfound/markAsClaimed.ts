import { TeamMemberResponse } from "@/@types";
import { claimLostItem } from "@/api/lost-found";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useClaimLostItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      ticket_id,
      claim_notes,
    }: {
      ticket_id: string;
      claim_notes: string;
    }) => claimLostItem(ticket_id, claim_notes),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Item Marked as Claimed",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["lost"] });
      queryClient.invalidateQueries({ queryKey: ["single-lost"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Failed to Mark as Claimed",
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
