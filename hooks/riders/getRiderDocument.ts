import { DriversDocumentParams } from "@/@types";
import { ridersDocument } from "@/api/riders";
import { useQuery } from "@tanstack/react-query";

export const useRidersDocument = (params?: DriversDocumentParams) => {
  return useQuery({
    queryKey: ["riders-document", params],
    queryFn: () => ridersDocument(params),
  });
};
