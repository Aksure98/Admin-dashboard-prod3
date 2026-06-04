import { getSingleCustomer } from "@/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleCustomer = (id: string) => {
  return useQuery({
    queryKey: ["single-customer", id],
    queryFn: () => getSingleCustomer(id),
    enabled: !!id,
  });
};
