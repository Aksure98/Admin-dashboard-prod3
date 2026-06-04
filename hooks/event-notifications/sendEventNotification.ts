import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { sendEventNotification } from "@/api/event-notification";
import {
  SendEventNotificationPayload,
  SendEventNotificationResponse,
} from "@/@types";

export const useSendEventNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendEventNotificationPayload) =>
      sendEventNotification(payload),
    onSuccess: (data: ApiResponse<SendEventNotificationResponse>) => {
      notify({
        type: "success",
        title: "Notification Sent",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Send Failed",
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
