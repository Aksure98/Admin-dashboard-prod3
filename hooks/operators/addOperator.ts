import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { addOperatorMember } from "@/api/operators";
import { OperatorMemberResponse } from "@/@types";

export const useAddOperator = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addOperatorMember,

    onSuccess: (data: OperatorMemberResponse) => {
      notify({
        type: "success",
        title: "User Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["operators"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Add User Failed",
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
