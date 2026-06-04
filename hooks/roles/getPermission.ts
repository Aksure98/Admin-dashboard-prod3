import { useQuery } from "@tanstack/react-query";
import { getPermission } from "@/api/roles";

export const useGetPermissions = () => {
  return useQuery({
    queryKey: ["permissions"],
    queryFn: getPermission,
  });
};
