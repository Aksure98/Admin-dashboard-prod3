import { GetNotificationTemplatesParams } from "@/@types";
import { getNotificationTemplates } from "@/api/notification-template";
import { useQuery } from "@tanstack/react-query";

export const useGetNotificationTemplates = (
  params: GetNotificationTemplatesParams = {},
) => {
  return useQuery({
    queryKey: ["notifications-templates", params],
    queryFn: () => getNotificationTemplates(params),
  });
};
