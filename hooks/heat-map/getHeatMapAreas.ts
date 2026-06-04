import { HeatMapAreasParams } from "@/@types";
import { useQuery } from "@tanstack/react-query";
import { getHeatMapAreas } from "@/api/heat-map";

export const useGetHeatMapAreas = (params: HeatMapAreasParams) => {
  return useQuery({
    queryKey: ["heat-map-areas", params],
    queryFn: () => getHeatMapAreas(params),
  });
};
