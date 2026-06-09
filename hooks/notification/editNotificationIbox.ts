import { NotificationInbox } from "@/@types";
import { markNotificationInboxAsRead } from "@/api/notification";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useMarkNotificationInboxAsRead = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<NotificationInbox>, AxiosError<ErrorResponse>, string>({
    mutationFn: (id: string) => markNotificationInboxAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications-inbox"] });
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
