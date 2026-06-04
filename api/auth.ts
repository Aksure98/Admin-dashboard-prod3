import { forgotPasswordProps, resetPasswordProps, signInProps } from "@/@types";
import { axiosInstance, axiosInstanceWithAuth } from "./axiosInstance";

export const login = async (values: signInProps) => {
  return (await axiosInstance.post("admin/auth/login", values)).data;
};

export const forgotPassword = async (value: forgotPasswordProps) => {
  return (await axiosInstance.post("admin/auth/forgot-password", value)).data;
};
export const resetPassword = async (value: resetPasswordProps) => {
  return (await axiosInstance.post("admin/auth/forgot-password/reset", value))
    .data;
};
export const changePassword = async (value: resetPasswordProps) => {
  return (
    await axiosInstanceWithAuth.put("admin/settings/change-password", value)
  ).data;
};
