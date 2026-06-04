import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { deleteNotificationTemplate } from "@/api/notification-template";
import { NotificationTemplate } from "@/@types";

export const useDeleteNotificationTemplate = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<NotificationTemplate>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id: string) => deleteNotificationTemplate(id),
    onSuccess: (data: ApiResponse<NotificationTemplate>) => {
      notify({
        type: "success",
        title: "Template Removed",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["notifications-templates"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Delete Failed",
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
