import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editCargo } from "@/api/freight-cargo";
import { AddOperatorProps, TeamMemberResponse } from "@/@types";

interface EditCargoArgs {
  id: string;
  values: AddOperatorProps;
}

export const useEditCargo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: EditCargoArgs) => editCargo(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["cargo-operators"] });
      queryClient.invalidateQueries({ queryKey: ["single-cargo"] });
      queryClient.invalidateQueries({ queryKey: ["cargo-operator-stat"] });
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
