import { useMutation } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { exportLostAndFoundList } from "@/api/lost-found";

export const useExportLostAndFoundList = () => {
  return useMutation({
    mutationFn: ({ format, state }: { format: string; state?: string }) =>
      exportLostAndFoundList(format, state),

    onSuccess: (data: Blob, { format }) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `lostandfound.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "List exported successfully",
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
