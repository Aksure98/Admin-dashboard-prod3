import {
  EventNotification,
  ToggleEventNotificationPayload,
} from "@/@types";
import { toggleEventNotificationStatus } from "@/api/event-notification";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

interface ToggleEventNotificationMutationPayload {
  id: string;
  values: ToggleEventNotificationPayload;
}

export const useToggleEventNotificationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<EventNotification>,
    AxiosError<ErrorResponse>,
    ToggleEventNotificationMutationPayload
  >({
    mutationFn: ({ id, values }: ToggleEventNotificationMutationPayload) =>
      toggleEventNotificationStatus(id, values),
    onSuccess: (data) => {
      notify({
        type: "success",
        title: "Status Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["event-notifications"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Status Update Failed",
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
