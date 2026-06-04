import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { ComposeNotificationsProps, OperatorMemberResponse } from "@/@types";
import { addNotification } from "@/api/drivers";

export const useAddNotification = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ComposeNotificationsProps) => addNotification(values),

    onSuccess: (data: OperatorMemberResponse) => {
      notify({
        type: "success",
        title: "Notification Sent Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["driver-notifications"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Failed to Send Notification",
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
