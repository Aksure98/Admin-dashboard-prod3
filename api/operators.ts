import {
  AddOperatorProps,
  OperatorMemberResponse,
  TeamMemberResponse,
} from "@/@types";
import { axiosInstanceWithAuth } from "./axiosInstance";

export const addOperatorMember = async (
  values: AddOperatorProps,
): Promise<OperatorMemberResponse> => {
  const response = await axiosInstanceWithAuth.post<OperatorMemberResponse>(
    "api/admin/add-operator",
    values,
  );
  return response.data;
};

export const editOperator = async (
  id: string,
  values: AddOperatorProps,
): Promise<TeamMemberResponse> => {
  const response = await axiosInstanceWithAuth.patch<TeamMemberResponse>(
    `api/admin/edit-operator/${id}`,
    values,
  );
  return response.data;
};
