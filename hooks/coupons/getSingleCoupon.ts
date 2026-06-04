import { getSingleCoupon } from "@/api/coupons";
import { useQuery } from "@tanstack/react-query";

export const useGetSingleCoupon = (id: string) => {
  return useQuery({
    queryKey: ["single-coupon", id],
    queryFn: () => getSingleCoupon(id),
    enabled: !!id,
  });
};
