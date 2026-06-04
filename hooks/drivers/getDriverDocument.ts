import { DriversDocumentParams } from "@/@types";
import { driversDocument } from "@/api/drivers";
import { useQuery } from "@tanstack/react-query";

export const useDriversDocument = (params?: DriversDocumentParams) => {
  return useQuery({
    queryKey: ["drivers-document", params],
    queryFn: () => driversDocument(params),
  });
};
