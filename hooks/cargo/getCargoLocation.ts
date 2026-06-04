import { cargoLocationList } from "@/api/freight-cargo";
import { useQuery } from "@tanstack/react-query";

export const useGetCargoLocationList = (availability_status: string) => {
  return useQuery({
    queryKey: ["cargo-location-list", availability_status],
    queryFn: () => cargoLocationList(availability_status),
  });
};
