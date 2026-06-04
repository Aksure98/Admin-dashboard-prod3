import { getSingleTow } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleTow = (id: string) => {
  return useQuery({
    queryKey: ["single-tow", id],
    queryFn: () => getSingleTow(id),
    enabled: !!id,
  });
};
