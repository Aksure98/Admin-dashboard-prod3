import { DriversWalletParams } from "@/@types";
import { cargoWallet } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useCargoWallet = (params?: DriversWalletParams) => {
  return useQuery({
    queryKey: ["cargo-wallet", params],
    queryFn: () => cargoWallet(params),
  });
};
