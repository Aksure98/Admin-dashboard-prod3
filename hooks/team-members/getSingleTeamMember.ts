import { getSingleAdmin } from "@/api/team";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleAdmin = (id: string) => {
  return useQuery({
    queryKey: ["team-member", id],
    queryFn: () => getSingleAdmin(id),
    enabled: !!id, // ✅ only fetch when id is available
  });
};
