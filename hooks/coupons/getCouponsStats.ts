import { useQuery } from "@tanstack/react-query";

import { getCouponsStats } from "@/api/coupons";

export const useGetCouponsStats = () => {
  return useQuery({
    queryKey: ["coupon-stats"],
    queryFn: getCouponsStats,
  });
};
