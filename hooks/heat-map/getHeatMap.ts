import { HeatMapParams } from "@/@types";
import { getHeatMap } from "@/api/heat-map";
import { useQuery } from "@tanstack/react-query";

export const useGetHeatMap = (params: HeatMapParams) => {
  return useQuery({
    queryKey: ["heat-map", params],
    queryFn: () => getHeatMap(params),
  });
};
