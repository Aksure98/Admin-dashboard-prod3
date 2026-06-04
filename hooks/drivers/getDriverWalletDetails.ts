import { driverWalletDetails } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useDriverWalletDetails = (id: string) => {
  return useQuery({
    queryKey: ["driver-wallet-details", id],
    queryFn: () => driverWalletDetails(id),
    enabled: !!id,
  });
};
