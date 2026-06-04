import { PricingSummaryResponse, PricingTierResponse } from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getPricingSummary = async () => {
  const response = await axiosInstanceWithAuth.get<PricingSummaryResponse>(
    `admin/pricing/summary`,
  );
  return response.data;
};

export const getPricingTiers = async () => {
  const response =
    await axiosInstanceWithAuth.get<PricingTierResponse>(
      `/admin/pricing/tiers`,
    );
  return response.data;
};

export const updateBaseFare = async (id: string, amount: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/base-fare/${id}`,
    { amount },
  );
  return response.data;
};
export const updateDistance = async (id: string, per_km: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/distance/${id}`,
    { per_km },
  );
  return response.data;
};
export const updateTime = async (id: string, per_min: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/distance/${id}`,
    { per_min },
  );
  return response.data;
};
export const updateTraffic = async (level: string, multiplier: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/traffic/${level}`,
    { multiplier },
  );
  return response.data;
};
export const updateTrafficToggle = async (
  level: string,
  value: { is_active: boolean },
) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/traffic/${level}/toggle`,
    value,
  );
  return response.data;
};
export const updateSurge = async (id: string, multiplier: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/surge/${id}`,
    { multiplier },
  );
  return response.data;
};
export const updateSurgeToggle = async (
  id: string,
  value: { is_active: boolean },
) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/surge/${id}/toggle`,
    value,
  );
  return response.data;
};

export const updateExtraCharge = async (id: string, amount: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/extra-charges/${id}`,
    { amount },
  );
  return response.data;
};
export const updateBookingFees = async (id: string, amount: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/booking-fee/${id}`,
    { amount },
  );
  return response.data;
};
export const updateMinFare = async (id: string, amount: number) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/minimum-fare/${id}`,
    { amount },
  );
  return response.data;
};
export const updateDriverCommission = async (
  id: string,
  percentage: number,
) => {
  const response = await axiosInstanceWithAuth.patch(
    `admin/pricing/commission/${id}`,
    { percentage },
  );
  return response.data;
};
