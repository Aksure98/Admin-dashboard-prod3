import { useQuery } from "@tanstack/react-query";
import { getRiderStat } from "@/api/riders";

export const useGetRidersStat = () => {
  return useQuery({
    queryKey: ["riders-stat"],
    queryFn: getRiderStat,
  });
};
