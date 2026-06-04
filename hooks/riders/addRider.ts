import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

import { notify } from "@/utils/toastStore";
import { addRiderMember } from "@/api/riders";
import { RiderMemberResponse } from "@/@types";

export const useAddRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRiderMember,

    onSuccess: (data: RiderMemberResponse) => {
      notify({
        type: "success",
        title: "User Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["riders"] });
      queryClient.invalidateQueries({ queryKey: ["riders-stat"] });
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
