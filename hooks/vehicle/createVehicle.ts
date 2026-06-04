import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { CreateVehicleCategoryProps, TeamMemberResponse } from "@/@types";
import { createVehicleCategory } from "@/api/vehicle";

export const useCreateVehicleCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateVehicleCategoryProps) =>
      createVehicleCategory(data),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Vehicle Category Created",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["vehicle-categories"] });
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
