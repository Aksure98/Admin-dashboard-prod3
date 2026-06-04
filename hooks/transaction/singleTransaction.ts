import { getSingleTransaction } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleTransaction = (id: string) => {
  return useQuery({
    queryKey: ["single-transaction", id],
    queryFn: () => getSingleTransaction(id),
    enabled: !!id,
  });
};
