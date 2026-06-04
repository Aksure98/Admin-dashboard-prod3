import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editDriver } from "@/api/drivers";
import { AddDriverProps, TeamMemberResponse } from "@/@types";

interface AddDriver {
  id: string;
  values: AddDriverProps;
}

export const useEditDriver = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: AddDriver) => editDriver(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["drivers"] });
      queryClient.invalidateQueries({ queryKey: ["single-driver"] });
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
