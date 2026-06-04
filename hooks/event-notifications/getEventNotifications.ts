import { GetEventNotificationsParams } from "@/@types";
import { getEventNotifications } from "@/api/event-notification";
import { useQuery } from "@tanstack/react-query";

export const useGetEventNotifications = (
  params: GetEventNotificationsParams = {},
) => {
  return useQuery({
    queryKey: ["event-notifications", params],
    queryFn: () => getEventNotifications(params),
  });
};
