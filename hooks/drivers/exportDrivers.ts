import { useMutation } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { exportDriverList } from "@/api/drivers";

export const useExportDrivers = () => {
  return useMutation({
    mutationFn: (format: string) => exportDriverList(format),

    onSuccess: (data: Blob, format: string) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `driver's.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "Drivers list exported successfully",
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },

    onError: () => {
      notify({
        type: "danger",
        title: "Export Failed",
        message: "Something went wrong",
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },
  });
};
