import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editRoles } from "@/api/roles";
import { AddRoleProps, TeamMemberResponse } from "@/@types";

interface EditRole {
  id: string;
  values: AddRoleProps;
}

export const useEditRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: EditRole) => editRoles(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Update Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["roles"] });
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
