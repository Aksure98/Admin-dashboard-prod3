import { TeamMemberResponse } from "@/@types";
import { markPayLaterAsPaid } from "@/api/pay-later";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMarkPayLaterAsPaid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => markPayLaterAsPaid(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Marked as Paid",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["pay-later-list"] });
      queryClient.invalidateQueries({ queryKey: ["pay-later"] });
      queryClient.invalidateQueries({ queryKey: ["payLater-stats"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Failed to Mark as Paid",
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
