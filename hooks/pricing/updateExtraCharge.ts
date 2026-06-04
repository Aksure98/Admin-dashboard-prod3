import { TeamMemberResponse } from "@/@types";
import { updateExtraCharge, updateSurge } from "@/api/pricing";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateExtraCharge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, amount }: { id: string; amount: number }) =>
      updateExtraCharge(id, amount),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Extra Charge Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["pricing-summary"] });
      queryClient.invalidateQueries({ queryKey: ["pricing-tiers"] });
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
