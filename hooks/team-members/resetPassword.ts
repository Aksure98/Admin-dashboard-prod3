import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { resetPasswordTeamMember } from "@/api/team";

export const useResetPasswordTeam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resetPasswordTeamMember(id),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Reset Password Member",
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
