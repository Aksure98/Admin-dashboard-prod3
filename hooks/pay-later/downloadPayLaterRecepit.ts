import { downloadPayLaterReceipt } from "@/api/pay-later";
import { notify } from "@/utils/toastStore";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";

export const useDownloadPayLaterReceipt = () => {
  return useMutation({
    mutationFn: (id: string) => downloadPayLaterReceipt(id),

    onSuccess: (data: Blob, id: string) => {
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `pay-later-receipt-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Receipt Downloaded",
        message: "Pay later receipt downloaded successfully",
        autoClose: true,
        autoCloseDelay: 3000,
      });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Download Failed",
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
