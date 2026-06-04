import { GetLostParams } from "@/@types";
import { getLostAndFoundList } from "@/api/lost-found";
import { useQuery } from "@tanstack/react-query";

export const useGetLostAndFoundList = (params?: GetLostParams) => {
  return useQuery({
    queryKey: ["lost", params],
    queryFn: () => getLostAndFoundList(params),
  });
};
