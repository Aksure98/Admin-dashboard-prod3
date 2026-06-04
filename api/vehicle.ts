import {
  CreateVehicleCategoryProps,
  VehicleCategoryResponse,
  VehicleParams,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getVehicleCategory = async (params?: VehicleParams) => {
  const response = await axiosInstanceWithAuth.get<VehicleCategoryResponse>(
    `admin/vehicle-categories`,
    { params },
  );
  return response.data;
};

export const createVehicleCategory = async (
  data: CreateVehicleCategoryProps,
) => {
  const response = await axiosInstanceWithAuth.post(
    `admin/vehicle-categories`,
    data,
  );
  return response.data;
};

export const updateVehicleCategory = async (
  id: string,
  data: CreateVehicleCategoryProps,
) => {
  const response = await axiosInstanceWithAuth.put(
    `admin/vehicle-categories/${id}`,
    data,
  );
  return response.data;
};

export const deleteVehicleCategory = async (id: string) => {
  const response = await axiosInstanceWithAuth.delete(
    `admin/vehicle-categories/${id}`,
  );
  return response.data;
};
export const singleVehicleCategory = async (id: string) => {
  const response = await axiosInstanceWithAuth.get(
    `admin/vehicle-categories/${id}`,
  );
  return response.data;
};
export const UpdateVehicleCategoryStatus = async (id: string) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/vehicle-categories/${id}/toggle-status`,
  );
  return response.data;
};
