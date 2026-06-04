import { TeamMemberResponse } from "@/@types";
import { updateNotificationSetting } from "@/api/settings";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateNotificationSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      event_type,
      data,
    }: {
      event_type: string;
      data: {
        email_enabled: boolean;
        sms_enabled: boolean;
        push_enabled: boolean;
      };
    }) => updateNotificationSetting(event_type, data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Notification Setting Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["notification-settings"] });
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
