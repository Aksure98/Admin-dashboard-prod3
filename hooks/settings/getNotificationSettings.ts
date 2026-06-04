import { getNotificationSettings } from "@/api/settings";
import { useQuery } from "@tanstack/react-query";

export const useGetNotificationSettings = () => {
  return useQuery({
    queryKey: ["notification-settings"],
    queryFn: () => getNotificationSettings(),
  });
};
