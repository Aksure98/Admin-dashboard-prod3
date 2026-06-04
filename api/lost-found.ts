import {
  GetLostParams,
  LostAndFoundStatsResponse,
  LostItemsResponse,
  SingleLostItemResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getLostAndFoundStat = async ({
  period = "today",
  state = "string",
}) => {
  const response = await axiosInstanceWithAuth.get<LostAndFoundStatsResponse>(
    "admin/lost-and-found/stats",
    {
      params: { period, state },
    },
  );
  return response.data;
};

export const exportLostAndFoundList = async (
  format: string,
  state?: string,
) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/lost-and-found/export`,
    {
      params: {
        format: typeMap[format] ?? format,
        state: state === "All States" ? undefined : state,
      },
      responseType: "blob",
    },
  );
  return response.data;
};

export const getLostAndFoundList = async (params?: GetLostParams) => {
  const response = await axiosInstanceWithAuth.get<LostItemsResponse>(
    "admin/lost-and-found",
    {
      params,
    },
  );
  return response.data;
};

export const getSingleLostItem = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleLostItemResponse>(
    `admin/lost-and-found/${id}`,
  );
  return response.data;
};

export const claimLostItem = async (ticket_id: string, claim_notes: string) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/lost-and-found/${ticket_id}/claim`,
    { claim_notes },
  );
  return response.data;
};
