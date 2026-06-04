import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { CreateVehicleCategoryProps, TeamMemberResponse } from "@/@types";
import { updateVehicleCategory } from "@/api/vehicle";

export const useUpdateVehicleCategory = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleCategoryProps) =>
      updateVehicleCategory(id, data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Vehicle Category Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["vehicle-categories"] });
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
