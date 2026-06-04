import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { CouponListResponse } from "@/@types";
import { AxiosError } from "axios";
import { toggleStatus } from "@/api/incentive";

export const useToggleIncentiveStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      value,
    }: {
      id: string;
      value: { is_active: boolean };
    }) => toggleStatus(id, value),
    onSuccess: (data: CouponListResponse) => {
      notify({
        type: "success",
        title: "Incentive status updated successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["incentive"] });
      queryClient.invalidateQueries({ queryKey: ["incentive-stats"] });
      queryClient.invalidateQueries({ queryKey: ["single-incentive"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Failed to update coupon status",
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
