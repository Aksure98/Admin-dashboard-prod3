import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { TeamMemberResponse } from "@/@types";
import { UpdateVehicleCategoryStatus } from "@/api/vehicle";

export const useUpdateServiceZoneStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => UpdateVehicleCategoryStatus(id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Status Updated",
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
        title: "Status Update Failed",
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
