import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editTow } from "@/api/tow";
import { AddOperatorProps, TeamMemberResponse } from "@/@types";

interface EditTowArgs {
  id: string;
  values: AddOperatorProps;
}

export const useEditTow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: EditTowArgs) => editTow(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["tow-operators"] });
      queryClient.invalidateQueries({ queryKey: ["single-tow"] });
      queryClient.invalidateQueries({ queryKey: ["tow-operator-stat"] });
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
