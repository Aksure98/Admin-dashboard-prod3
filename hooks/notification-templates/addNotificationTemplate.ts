import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { addNotificationTemplate } from "@/api/notification-template";
import {
  NotificationTemplatePayload,
  NotificationTemplate,
} from "@/@types";

export const useAddNotificationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<NotificationTemplate>, AxiosError<ErrorResponse>, NotificationTemplatePayload>({
    mutationFn: (payload: NotificationTemplatePayload) =>
      addNotificationTemplate(payload),
    onSuccess: (data: ApiResponse<NotificationTemplate>) => {
      notify({
        type: "success",
        title: "Template Created",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications-templates"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Create Failed",
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
