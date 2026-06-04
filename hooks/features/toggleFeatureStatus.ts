import { FeatureToggleResponse } from "@/@types";
import { toggleFeatureStatus } from "@/api/feature-toggle";

import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useToggleFeatureStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      value,
    }: {
      id: string;
      value: { is_active: boolean };
    }) => toggleFeatureStatus(id, value),

    onSuccess: (data: FeatureToggleResponse) => {
      notify({
        type: "success",
        title: "Feature Status Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["features"] });
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
