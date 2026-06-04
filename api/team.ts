import {
  AddUserProps,
  GetTeamMemberParams,
  SingleTeamMemberResponse,
  TeamMemberResponse,
  TeamStatResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const addTeamMember = async (
  values: AddUserProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    "admin/create",
    values,
  );
  return response.data;
};

export const getTeamMember = async (params: GetTeamMemberParams = {}) => {
  const { page = 1, limit = 20, region, search } = params;

  const queryParams = new URLSearchParams();
  queryParams.set("page", String(page));
  queryParams.set("limit", String(limit));
  if (region && region !== "All States") queryParams.set("region", region);
  if (search) queryParams.set("search", search);

  const response = await axiosInstanceWithAuth.get<
    ApiResponse<TeamMemberResponse>
  >(`admin/list?${queryParams.toString()}`);
  return response.data;
};

// export const getTeamMember = async (page: number = 1) => {
//   const response = await axiosInstanceWithAuth.get<
//     ApiResponse<TeamMemberResponse>
//   >(
//     "admin/list",
//     { params: { page } }, // ✅ let axios handle the query string
//   );
//   return response.data;
// };
export const getTeamStat = async () => {
  const response =
    await axiosInstanceWithAuth.get<TeamStatResponse>("admin/stats");
  return response.data;
};
export const exportTeamList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(`admin/export`, {
    params: { type: typeMap[format] ?? format },
    responseType: "blob",
  });
  return response.data;
};

export const getSingleAdmin = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleTeamMemberResponse>(
    `admin/${id}`,
  );
  return response.data;
};

export const editTeamMember = async (
  id: string,
  values: AddUserProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/${id}`,
    values,
  );
  return response.data;
};

export const resetPasswordTeamMember = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/${id}/reset-password/`,
  );
  return response.data;
};

export const suspendTeamMember = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/${id}/suspend`,
  );
  return response.data;
};
export const activateTeamMember = async (id: string) => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/${id}/activate`,
  );
  return response.data;
};
