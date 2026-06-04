import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { AddCouponResponse, Coupon, CouponListResponse } from "@/@types";
import { editCoupons } from "@/api/coupons";

interface AddCoupon {
  id: string;
  values: AddCouponResponse;
}

export const useEditCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: AddCoupon) => editCoupons(id, values),

    onSuccess: (data: CouponListResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["coupon-stats"] });
      queryClient.invalidateQueries({ queryKey: ["coupons"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Update Failed",
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
