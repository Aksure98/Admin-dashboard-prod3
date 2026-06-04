import { TeamMemberResponse } from "@/@types";
import { updateBaseFare, updateDistance } from "@/api/pricing";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateDistance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, per_km }: { id: string; per_km: number }) =>
      updateDistance(id, per_km),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Distance Updated",
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
