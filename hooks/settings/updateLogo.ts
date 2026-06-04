import { GeneralSettingsResponse } from "@/@types";
import { updateFavicon, updateLogo } from "@/api/settings";
import { notify } from "@/utils/toastStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useUpdateLogo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateLogo(file),

    onSuccess: (data: GeneralSettingsResponse) => {
      notify({
        type: "success",
        title: "Logo Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["general-settings"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Logo Update Failed",
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

export const useUpdateFavicon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => updateFavicon(file),

    onSuccess: (data: GeneralSettingsResponse) => {
      notify({
        type: "success",
        title: "Favicon Updated",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["general-settings"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Favicon Update Failed",
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
