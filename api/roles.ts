import { AddRoleProps, Roles, TeamMemberResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getRoles = async () => {
  const response =
    await axiosInstanceWithAuth.get<ApiResponse<Roles[]>>("admin/roles");
  return response.data;
};

export const addRoles = async (
  values: AddRoleProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    "admin/roles",
    values,
  );
  return response.data;
};
export const editRoles = async (
  id: string,
  values: AddRoleProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.put<TeamMemberResponse>(
    `admin/roles/${id}`,
    values,
  );
  return response.data;
};

export const deleteRoles = async (id: string): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.delete<TeamMemberResponse>(
    `admin/roles/${id}`,
  );
  return response.data;
};
export const suspendRoles = async (id: string): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/roles/${id}/suspend`,
  );
  return response.data;
};
export const activeRoles = async (id: string): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<TeamMemberResponse>(
    `admin/roles/${id}/activate`,
  );
  return response.data;
};

export const getPermission = async () => {
  const response =
    await axiosInstanceWithAuth.get<ApiResponse<Roles[]>>("admin/permissions");
  return response.data;
};
