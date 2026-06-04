import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { TeamMemberResponse } from "@/@types";
import { deleteServiceZone } from "@/api/service-zone";

export const useDeleteServiceZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteServiceZone(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Service Zone Deleted",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["service-zones"] });
      queryClient.invalidateQueries({ queryKey: ["zone-stat"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Delete Failed",
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
