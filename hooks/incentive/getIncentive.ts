import { GetCouponsParams } from "@/@types";
import { getIncentiveList } from "@/api/incentive";
import { useQuery } from "@tanstack/react-query";

export const useGetIncentive = (params: GetCouponsParams) => {
  return useQuery({
    queryKey: ["incentive", params],
    queryFn: () => getIncentiveList(params),
  });
};
