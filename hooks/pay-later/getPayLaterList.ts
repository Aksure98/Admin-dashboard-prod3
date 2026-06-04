import { GetPayLaterParams } from "@/@types";
import { getPayLaterList } from "@/api/pay-later";
import { useQuery } from "@tanstack/react-query";

export const useGetPayLaterList = (params?: GetPayLaterParams) => {
  return useQuery({
    queryKey: ["pay-later-list", params],
    queryFn: () => getPayLaterList(params),
  });
};
