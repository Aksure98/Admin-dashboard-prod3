import { useMutation } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { exportCouponList } from "@/api/coupons";

export const useExportCouponList = () => {
  return useMutation({
    mutationFn: (format: string) => exportCouponList(format),

    onSuccess: (data: Blob, format: string) => {
      // ✅ trigger file download
      const url = window.URL.createObjectURL(new Blob([data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `coupon.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      notify({
        type: "success",
        title: "Export Successful",
        message: "Coupon exported successfully",
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
