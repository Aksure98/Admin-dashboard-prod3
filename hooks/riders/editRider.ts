import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { AddDriverProps, AddRiderProps, RiderMemberResponse } from "@/@types";
import { editDriver } from "@/api/drivers";
import { editRider } from "@/api/riders";

interface AddRider {
  id: string;
  values: AddDriverProps;
}

export const useEditRider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: AddRider) => editRider(id, values),

    onSuccess: (data: RiderMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
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
