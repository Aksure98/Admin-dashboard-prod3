import { DriversDocumentParams } from "@/@types";
import { cargoDocument } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useCargoDocument = (params?: DriversDocumentParams) => {
  return useQuery({
    queryKey: ["cargo-document", params],
    queryFn: () => cargoDocument(params),
  });
};
