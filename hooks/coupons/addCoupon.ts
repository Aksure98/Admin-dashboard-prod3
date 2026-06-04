import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { CouponListResponse } from "@/@types";
import { addCoupons } from "@/api/coupons";

export const useAddCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addCoupons,

    onSuccess: (data: CouponListResponse) => {
      notify({
        type: "success",
        title: "Coupon Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["coupons"] });
      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Add Coupon Failed",
        autoClose: true,
        autoCloseDelay: 3000,
        message:
          error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      });
    },
  });
};
