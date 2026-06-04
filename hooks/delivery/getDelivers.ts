import { GetTripsParams } from "@/@types";
import { getDelivery } from "@/api/delivery";
import { useQuery } from "@tanstack/react-query";

export const useGetDelivery = (params?: GetTripsParams) => {
  return useQuery({
    queryKey: ["delivery", params],
    queryFn: () => getDelivery(params),
  });
};
