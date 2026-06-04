import {
  EventNotification,
  UpdateEventNotificationPayload,
} from "@/@types";
import { updateEventNotification } from "@/api/event-notification";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface UpdateEventNotificationMutationPayload {
  id: string;
  values: Partial<UpdateEventNotificationPayload>;
}

export const useUpdateEventNotification = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<EventNotification>,
    AxiosError<ErrorResponse>,
    UpdateEventNotificationMutationPayload
  >({
    mutationFn: ({ id, values }: UpdateEventNotificationMutationPayload) =>
      updateEventNotification(id, values),
    onSuccess: (data) => {
      notify({
        type: "success",
        title: "Notification Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
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
