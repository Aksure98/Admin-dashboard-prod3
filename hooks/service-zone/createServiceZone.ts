import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { CreateServiceZoneProps, TeamMemberResponse } from "@/@types";
import { createServiceZone } from "@/api/service-zone";

export const useCreateServiceZone = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateServiceZoneProps) => createServiceZone(data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Service zone Created",
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
        title: "Creation Failed",
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
