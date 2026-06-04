import { GetNotificationParams } from "@/@types";
import { getDriversNotification } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useGetDriverNotification = (
  params?: GetNotificationParams,
) => {
  return useQuery({
    queryKey: ["driver-notifications", params],
    queryFn: () => getDriversNotification( params),
  });
};
