import { GetTransactionsParams } from "@/@types";
import { getTransactionList } from "@/api/transactions";
import { useQuery } from "@tanstack/react-query";

export const useGetTransactionList = (params: GetTransactionsParams) => {
  return useQuery({
    queryKey: ["transaction", params],
    queryFn: () => getTransactionList(params),
  });
};
