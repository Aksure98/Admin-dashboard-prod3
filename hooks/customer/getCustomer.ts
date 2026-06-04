import { GetCustomerParams } from "@/@types";
import { getCustomer } from "@/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomer = (params: GetCustomerParams = {}) => {
  return useQuery({
    queryKey: ["customers", params],
    queryFn: () => getCustomer(params),
  });
};
