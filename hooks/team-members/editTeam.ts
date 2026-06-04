import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { editTeamMember } from "@/api/team";
import { AddUserProps, TeamMemberResponse } from "@/@types";

interface EditTeamVariables {
  id: string;
  values: AddUserProps;
}

export const useEditTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, values }: EditTeamVariables) =>
      editTeamMember(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Updated Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["teams"] });
      queryClient.invalidateQueries({ queryKey: ["team-member"] });
      queryClient.invalidateQueries({ queryKey: ["stat-teams"] });
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
