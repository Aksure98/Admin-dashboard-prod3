import { useMutation } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { exportDriversWalletList } from "@/api/drivers";

export const useExportDriversWallet = (service_type: string) => {
  return useMutation({
    mutationFn: (format: string) => exportDriversWalletList(format),

    onSuccess: (data: Blob, format: string) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `driver's wallet list.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: " List exported successfully",
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
