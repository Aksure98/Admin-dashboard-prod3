import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { notify } from "@/utils/toastStore";
import { forceEndRides } from "@/api/trips";
import { ForceEndRideProps } from "@/@types";

export const useForceEndRides = (id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (values: ForceEndRideProps) => forceEndRides(id, values),
    onSuccess: (response) => {
      notify({
        type: "success",
        title: "Force End Ride",
        message: response.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["trip-stat"] });
      queryClient.invalidateQueries({ queryKey: ["single-trips", id] });
      queryClient.invalidateQueries({ queryKey: ["available-operators", id] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Force End Ride Failed",
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
