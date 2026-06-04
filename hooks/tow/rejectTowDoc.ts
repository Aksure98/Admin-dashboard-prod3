import { TeamMemberResponse } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { AxiosError } from "axios";
import { rejectTowDocument } from "@/api/tow";

export const useRejectTowDocument = (id: string, doc_id: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => rejectTowDocument(id, doc_id),

    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Document Rejected",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });

      queryClient.invalidateQueries({ queryKey: ["tow-document"] });
    },

    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Rejection Failed",
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
