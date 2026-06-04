import { useMutation } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { exportIncentiveList } from "@/api/incentive";

export const useExportIncentiveList = () => {
  return useMutation({
    mutationFn: (format: string) => exportIncentiveList(format),

    onSuccess: (data: Blob, format: string) => {
      // ✅ trigger file download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Incentive.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "Incentive Exported successfully",
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
