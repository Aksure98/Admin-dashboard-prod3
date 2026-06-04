import {
  CreateServiceZoneProps,
  ServiceZoneParams,
  ServiceZoneResponse,
  ServiceZoneStatsResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getServiceZoneStat = async () => {
  const response = await axiosInstanceWithAuth.get<ServiceZoneStatsResponse>(
    "admin/service-zones/stats",
  );
  return response.data;
};

export const getServiceZoneList = async (params?: ServiceZoneParams) => {
  const response = await axiosInstanceWithAuth.get<ServiceZoneResponse>(
    `admin/service-zones`,
    { params },
  );
  return response.data;
};

export const createServiceZone = async (data: CreateServiceZoneProps) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/service-zones`,
    data,
  );
  return response.data;
};

export const updateServiceZone = async (
  id: string,
  data: CreateServiceZoneProps,
) => {
  const response = await axiosInstanceWithAuth.put(
    `admin/service-zones/${id}`,
    data,
  );
  return response.data;
};

export const deleteServiceZone = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `admin/service-zones/${id}`,
  );
  return response.data;
};

export const UpdateServiceZoneStatus = async (id: string) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/service-zones/${id}/toggle-status`,
  );
  return response.data;
};
