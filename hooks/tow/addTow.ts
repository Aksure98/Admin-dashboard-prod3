import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { notify } from "@/utils/toastStore";
import { addTowMember } from "@/api/tow";
import { OperatorMemberResponse } from "@/@types";

export const useAddTow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTowMember,

    onSuccess: (data: OperatorMemberResponse) => {
      notify({
        type: "success",
        title: "User Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["tow-operators"] });
      queryClient.invalidateQueries({ queryKey: ["tow-operator-stat"] });
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
