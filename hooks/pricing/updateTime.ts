import { TeamMemberResponse } from "@/@types";
import { updateTime } from "@/api/pricing";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateTime = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, per_min }: { id: string; per_min: number }) =>
      updateTime(id, per_min),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Time Updated",
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
