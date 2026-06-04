import { DriversWalletParams } from "@/@types";
import { towWallet } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useTowWallet = (params?: DriversWalletParams) => {
  return useQuery({
    queryKey: ["tow-wallet", params],
    queryFn: () => towWallet(params),
  });
};
