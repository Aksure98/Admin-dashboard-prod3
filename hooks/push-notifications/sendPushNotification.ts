import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { sendPushNotification } from "@/api/push-notification";
import {
  SendPushNotificationPayload,
  SendPushNotificationResponse,
} from "@/@types";

export const useSendPushNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: SendPushNotificationPayload) =>
      sendPushNotification(payload),
    onSuccess: (data: ApiResponse<SendPushNotificationResponse>) => {
      notify({
        type: "success",
        title: "Notification Sent",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["push-notifications"] });
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
