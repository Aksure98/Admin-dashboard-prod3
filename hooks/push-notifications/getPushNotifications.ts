import { GetPushNotificationsParams } from "@/@types";
import { getPushNotifications } from "@/api/push-notification";
import { useQuery } from "@tanstack/react-query";

export const useGetPushNotifications = (
  params: GetPushNotificationsParams = {},
) => {
  return useQuery({
    queryKey: ["push-notifications", params],
    queryFn: () => getPushNotifications(params),
  });
};
