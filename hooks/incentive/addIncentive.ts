import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { IncentiveListResponse } from "@/@types";
import { addIncentive } from "@/api/incentive";

export const useAddIncentive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addIncentive,

    onSuccess: (data: IncentiveListResponse) => {
      notify({
        type: "success",
        title: "Incentive Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["incentive"] });
      queryClient.invalidateQueries({ queryKey: ["incentive-stats"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Add Incentive Failed",
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
