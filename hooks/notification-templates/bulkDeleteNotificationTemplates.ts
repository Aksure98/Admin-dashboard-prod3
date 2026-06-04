import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { bulkDeleteNotificationTemplates } from "@/api/notification-template";

export const useBulkDeleteNotificationTemplates = () => {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, AxiosError<ErrorResponse>, string[]>({
    mutationFn: (ids: string[]) => bulkDeleteNotificationTemplates(ids),
    onSuccess: (data) => {
      notify({
        type: "success",
        title: "Templates Deleted",
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