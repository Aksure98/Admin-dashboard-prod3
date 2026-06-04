import { SosParams } from "@/@types";
import { getSosList } from "@/api/sos";
import { useQuery } from "@tanstack/react-query";

export const useGetSosList = (params?: SosParams) => {
  return useQuery({
    queryKey: ["sos-list", params],
    queryFn: () => getSosList(params),
  });
};
