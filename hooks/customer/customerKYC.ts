import { getCustomerKYC } from "@/api/customer";
import { useQuery } from "@tanstack/react-query";

export const useGetCustomerKyc = (id: string) => {
  return useQuery({
    queryKey: ["customer-kyc", id],
    queryFn: () => getCustomerKYC(id),
    enabled: !!id,
  });
};
