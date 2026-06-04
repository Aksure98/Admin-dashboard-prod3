import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editNotificationTemplate } from "@/api/notification-template";
import {
  NotificationTemplatePayload,
  NotificationTemplate,
} from "@/@types";

interface EditNotificationPayload {
  id: string;
  values: NotificationTemplatePayload;
}

export const useEditNotificationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<NotificationTemplate>, AxiosError<ErrorResponse>, EditNotificationPayload>({
    mutationFn: ({ id, values }: EditNotificationPayload) =>
      editNotificationTemplate(id, values),
    onSuccess: (data: ApiResponse<NotificationTemplate>) => {
      notify({
        type: "success",
        title: "Template Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications-templates"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Update Failed",
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
