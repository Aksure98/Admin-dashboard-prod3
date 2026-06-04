import { useQuery } from "@tanstack/react-query";
import { getRoles } from "@/api/roles";

export const useGetRoles = () => {
  return useQuery({
    queryKey: ["roles"],
    queryFn: getRoles,
  });
};
