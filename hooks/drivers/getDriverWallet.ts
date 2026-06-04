import { DriversWalletParams } from "@/@types";
import { driversWallet } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useDriversWallet = (params?: DriversWalletParams) => {
  return useQuery({
    queryKey: ["drivers-wallet", params],
    queryFn: () => driversWallet(params),
  });
};
