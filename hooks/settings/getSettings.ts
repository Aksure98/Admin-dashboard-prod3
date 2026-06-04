import { getSettings } from "@/api/settings";
import { useQuery } from "@tanstack/react-query";

export const useGetSettings = () => {
  return useQuery({
    queryKey: ["general-settings"],
    queryFn: () => getSettings(),
  });
};
