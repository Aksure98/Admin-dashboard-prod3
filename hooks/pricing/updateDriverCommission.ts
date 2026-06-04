import { TeamMemberResponse } from "@/@types";
import { updateDriverCommission } from "@/api/pricing";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateDriverCommission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, percentage }: { id: string; percentage: number }) =>
      updateDriverCommission(id, percentage),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Driver commission Updated",
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
