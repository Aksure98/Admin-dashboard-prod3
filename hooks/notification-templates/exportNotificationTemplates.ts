import { useMutation } from "@tanstack/react-query";
import { exportNotificationTemplates } from "@/api/notification-template";
import { notify } from "@/utils/toastStore";

export const useExportNotificationTemplates = () => {
  return useMutation({
    mutationFn: (format: string) => exportNotificationTemplates(format),
    onSuccess: (data: Blob, format: string) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `notification-templates.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "Notification templates exported successfully",
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
