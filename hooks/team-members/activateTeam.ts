import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { activateTeamMember } from "@/api/team";

export const useActivateTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activateTeamMember(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Activate Team Member",
        message: response.message,
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
        title: "Activation Failed",
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
