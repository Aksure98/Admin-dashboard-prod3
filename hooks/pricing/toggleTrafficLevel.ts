import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { AxiosError } from "axios";
import { updateTrafficToggle } from "@/api/pricing";
import { TeamMemberResponse } from "@/@types";

export const useToggleTrafficLevel = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      level,
      value,
    }: {
      level: string;
      value: { is_active: boolean };
    }) => updateTrafficToggle(level, value),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Traffic Updated",
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
