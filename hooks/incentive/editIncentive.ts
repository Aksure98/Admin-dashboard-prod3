import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { AddIncentiveResponse, IncentiveListResponse } from "@/@types";
import { editIncentive } from "@/api/incentive";

interface AddIncentive {
  id: string;
  values: AddIncentiveResponse;
}

export const useEditIncentive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: AddIncentive) => editIncentive(id, values),

    onSuccess: (data: IncentiveListResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["incentive-stats"] });
      queryClient.invalidateQueries({ queryKey: ["incentive"] });
      queryClient.invalidateQueries({ queryKey: ["single-incentive"] });
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
