import { TeamMemberResponse } from "@/@types";
import { sendPayLaterReminder } from "@/api/pay-later";
import { notify } from "@/utils/toastStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useSendPayLaterReminder = () => {
  return useMutation({
    mutationFn: (id: string) => sendPayLaterReminder(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Reminder Sent",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Failed to Send Reminder",
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
