import { HeatMapAreasParams } from "@/@types";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { exportHeatMapAreas } from "@/api/heat-map";
import { notify } from "@/utils/toastStore";

interface ExportHeatMapPayload {
  format: string;
  params?: Omit<HeatMapAreasParams, "tab">;
}

export const useExportHeatMap = () => {
  return useMutation({
    mutationFn: ({ format, params }: ExportHeatMapPayload) =>
      exportHeatMapAreas(format, params),

    onSuccess: (data: Blob, variables: ExportHeatMapPayload) => {
      const fileExtension =
        variables.format === "xlsx" ? "xlsx" : variables.format;
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");

      link.href = url;
      link.setAttribute("download", `heat-map.${fileExtension}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "Heat map data exported successfully",
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
