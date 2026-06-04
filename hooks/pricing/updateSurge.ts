import { TeamMemberResponse } from "@/@types";
import { updateSurge } from "@/api/pricing";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateSurge = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, multiplier }: { id: string; multiplier: number }) =>
      updateSurge(id, multiplier),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Surge Updated",
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
