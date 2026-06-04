import { IntegrationResponse } from "@/@types";
import { toggleIntegrationStatus } from "@/api/integration";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useToggleIntegrationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      value,
    }: {
      id: string;
      value: { is_active: boolean };
    }) => toggleIntegrationStatus(id, value),

    onSuccess: (data: IntegrationResponse) => {
      notify({
        type: "success",
        title: "Integration Status Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["integrations"] });
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
