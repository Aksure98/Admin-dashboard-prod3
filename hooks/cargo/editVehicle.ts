import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { EditProps, TeamMemberResponse } from "@/@types";
import { editCargoVehicle } from "@/api/freight-cargo";

export const useEditCargoVehicle = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: EditProps) => editCargoVehicle(id, values),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Vehicle Updated Successfully",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["cargo-vehicle", id] });
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
