import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { addRoles } from "@/api/roles";
import { TeamMemberResponse } from "@/@types";

export const useAddRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addRoles,

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Role Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["roles"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Add Role Failed",
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
