import {
  AddCouponResponse,
  Coupon,
  CouponListResponse,
  CouponStatsResponse,
  GetCouponsParams,
  SingleCouponResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const getCouponsStats = async () => {
  const response = await axiosInstanceWithAuth.get<CouponStatsResponse>(
    "admin/promotions/coupons/stats",
  );
  return response.data;
};

export const getCouponsList = async (params?: GetCouponsParams) => {
  const response = await axiosInstanceWithAuth.get<CouponListResponse>(
    "admin/promotions/coupons",
    { params },
  );
  return response.data;
};

export const addCoupons = async (
  values: AddCouponResponse,
): Promise<CouponListResponse> => {
  const response = await axiosInstanceWithAuth.post<CouponListResponse>(
    "admin/promotions/coupons",
    values,
  );
  return response.data;
};

export const editCoupons = async (
  id: string,
  values: AddCouponResponse,
): Promise<CouponListResponse> => {
  const response = await axiosInstanceWithAuth.patch<CouponListResponse>(
    `admin/promotions/coupons/${id}`,
    values,
  );
  return response.data;
};

export const getSingleCoupon = async (id: string) => {
  const response = await axiosInstanceWithAuth.get<SingleCouponResponse>(
    `admin/promotions/coupons/${id}`,
  );
  return response.data;
};

export const toggleStatus = async (
  id: string,
  value: { is_active: boolean },
): Promise<CouponListResponse> => {
  const response = await axiosInstanceWithAuth.patch<CouponListResponse>(
    `admin/promotions/coupons/${id}/toggle`,
    value,
  );
  return response.data;
};

export const exportCouponList = async (format: string) => {
  const typeMap: Record<string, string> = {
    xlsx: "excel",
    csv: "csv",
    pdf: "pdf",
  };

  const response = await axiosInstanceWithAuth.get(
    `admin/promotions/coupons/export`,
    {
      params: { format: typeMap[format] ?? format },
      responseType: "blob",
    },
  );
  return response.data;
};
