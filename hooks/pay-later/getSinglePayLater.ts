import { getSinglePayLater } from "@/api/pay-later";
import { useQuery } from "@tanstack/react-query";

export const useGetSinglePayLater = (id: string) => {
  return useQuery({
    queryKey: ["pay-later", id],
    queryFn: () => getSinglePayLater(id),
    enabled: !!id,
  });
};
