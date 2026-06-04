import { useMutation, useQueryClient } from "@tanstack/react-query";
import { activeRoles } from "@/api/roles";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { TeamMemberResponse } from "@/@types";

export const useActiveRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => activeRoles(id),

    onSuccess: (data: TeamMemberResponse) => {
      queryClient.invalidateQueries({ queryKey: ["roles"] });
      notify({
        type: "success",
        title: "Role Activated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },
    onError: (error: AxiosError) => {
      notify({
        type: "danger",
        title: "Error",
        autoClose: true,
        autoCloseDelay: 3000,
        message:
          (error.response?.data as { message: string }).message ||
          "Something went wrong",
      });
    },
  });
};
