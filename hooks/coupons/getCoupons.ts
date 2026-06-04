import { GetCouponsParams } from "@/@types";
import { getCouponsList } from "@/api/coupons";
import { useQuery } from "@tanstack/react-query";

export const useGetCoupons = (params: GetCouponsParams) => {
  return useQuery({
    queryKey: ["coupons", params],
    queryFn: () => getCouponsList(params),
  });
};
