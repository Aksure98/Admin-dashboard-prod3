import { GetNotificationParams } from "@/@types";
import { getTowNotification } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetTowNotification = (params?: GetNotificationParams) => {
  return useQuery({
    queryKey: ["tow-notifications", params],
    queryFn: () => getTowNotification(params),
  });
};
