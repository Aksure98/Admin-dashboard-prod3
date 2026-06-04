import { useQuery } from "@tanstack/react-query";
import { getCustomerStat } from "@/api/customer";

export const useGetCustomerStat = () => {
  return useQuery({
    queryKey: ["customer-stat"],
    queryFn: getCustomerStat,
  });
};
