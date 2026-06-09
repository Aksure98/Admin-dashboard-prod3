import { NotificationInboxPayload } from "@/@types";
import { getNotificationInbox } from "@/api/notification";
import { useQuery } from "@tanstack/react-query";

export const useGetNotificationInbox = (
  params: NotificationInboxPayload,
) => {
  return useQuery({
    queryKey: ["notifications-inbox", params],
    queryFn: () => getNotificationInbox(params),
  });
};
