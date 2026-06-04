import { GetNotificationParams } from "@/@types";
import { getCargoNotification } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoNotification = (params?: GetNotificationParams) => {
  return useQuery({
    queryKey: ["cargo-notifications", params],
    queryFn: () => getCargoNotification(params),
  });
};
