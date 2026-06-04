import { useQuery } from "@tanstack/react-query";
import { getDeliveryStat } from "@/api/delivery";

export const useGetDeliveryStat = () => {
  return useQuery({
    queryKey: ["delivery-stat"],
    queryFn: getDeliveryStat,
  });
};
