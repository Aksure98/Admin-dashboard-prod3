import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editOperator } from "@/api/operators";
import { AddOperatorProps, TeamMemberResponse } from "@/@types";

interface AddOperator {
  id: string;
  values: AddOperatorProps;
}

export const useEditOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: AddOperator) => editOperator(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["operators"] });
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
