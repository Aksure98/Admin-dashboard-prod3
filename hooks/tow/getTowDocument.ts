import { DriversDocumentParams } from "@/@types";
import { towDocument } from "@/api/tow";
import { useQuery } from "@tanstack/react-query";

export const useTowDocument = (params?: DriversDocumentParams) => {
  return useQuery({
    queryKey: ["tow-document", params],
    queryFn: () => towDocument(params),
  });
};
