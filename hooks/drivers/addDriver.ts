import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { DriverMemberResponse } from "@/@types";
import { addDriver } from "@/api/drivers";

export const useAddDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addDriver,

    onSuccess: (data: DriverMemberResponse) => {
      notify({
        type: "success",
        title: "User Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["driver-stat"] });
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
