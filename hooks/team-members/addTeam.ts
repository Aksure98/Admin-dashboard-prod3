import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { addTeamMember } from "@/api/team";
import { TeamMemberResponse } from "@/@types";

export const useAddTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addTeamMember,

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "User Added Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["teams"] });
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
