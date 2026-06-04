import { useQuery } from "@tanstack/react-query";
import { getCustomerWallet, getCustomerPaymentDetails } from "@/api/customer";

export const useGetCustomerWallet = (id: string) => {
  return useQuery({
    queryKey: ["customer-wallet", id],
    queryFn: () => getCustomerWallet(id),
    enabled: !!id,
  });
};

export const useGetCustomerPaymentDetails = (id: string) => {
  return useQuery({
    queryKey: ["customer-payment-details", id],
    queryFn: () => getCustomerPaymentDetails(id),
    enabled: !!id,
  });
};
