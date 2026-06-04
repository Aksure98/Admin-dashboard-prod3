import { GetNotificationParams } from "@/@types";
import { getRidersNotification } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useGetRiderNotification = (params?: GetNotificationParams) => {
  return useQuery({
    queryKey: ["rider-notifications", params],
    queryFn: () => getRidersNotification(params),
  });
};
