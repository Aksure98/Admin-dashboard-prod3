import { DriversWalletParams } from "@/@types";
import { ridersWallet } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useRidersWallet = (params?: DriversWalletParams) => {
  return useQuery({
    queryKey: ["riders-wallet", params],
    queryFn: () => ridersWallet(params),
  });
};
