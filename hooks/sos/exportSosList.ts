import { exportSosList } from "@/api/sos";
import { notify } from "@/utils/toastStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useExportSosList = () => {
  return useMutation({
    mutationFn: ({
      format,
      state,
      period,
    }: {
      format: string;
      state?: string;
      period?: string;
    }) => exportSosList(format, state, period),

    onSuccess: (data: Blob, { format }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sos-alerts.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "SOS alerts exported successfully",
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Export Failed",
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
