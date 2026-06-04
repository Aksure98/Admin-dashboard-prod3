import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { CreateServiceZoneProps, TeamMemberResponse } from "@/@types";
import { updateServiceZone } from "@/api/service-zone";

export const useUpdateServiceZone = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceZoneProps) => updateServiceZone(id, data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Service Zone Updated",
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
