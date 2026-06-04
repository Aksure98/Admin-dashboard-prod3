import { TeamMemberResponse } from "@/@types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notify } from "@/utils/toastStore";
import { AxiosError } from "axios";
import { approveDocument } from "@/api/riders";

export const useApproveDocument = (id: string, doc_id: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => approveDocument(id, doc_id),
    onSuccess: (data: TeamMemberResponse) => {
      notify({
        type: "success",
        title: "Document Approved",
        message: data.message,
        autoClose: true,
        autoCloseDelay: 3000,
      });
      queryClient.invalidateQueries({ queryKey: ["riders-document"] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      notify({
        type: "danger",
        title: "Approval Failed",
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
