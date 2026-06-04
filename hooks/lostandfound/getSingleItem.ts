import { getSingleLostItem } from "@/api/lost-found";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleLostItem = (id: string) => {
  return useQuery({
    queryKey: ["single-lost", id],
    queryFn: () => getSingleLostItem(id),
    enabled: !!id, // ✅ only fetch when id is available
  });
};
