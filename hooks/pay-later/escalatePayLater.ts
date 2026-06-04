import { TeamMemberResponse } from "@/@types";
import { escalatePayLater } from "@/api/pay-later";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useEscalatePayLater = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => escalatePayLater(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Escalated Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["pay-later-list"] });
      queryClient.invalidateQueries({ queryKey: ["payLater-stats"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Escalation Failed",
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
