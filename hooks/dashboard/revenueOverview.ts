import { getRevenueOverview } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

interface RevenueOverviewParams {
  year?: number;
  service_type?: string;
}

export const useRevenueOverview = ({
  year = new Date().getFullYear(),
  service_type,
}: RevenueOverviewParams = {}) => {
  return useQuery({
    queryKey: ["revenue-overview", year, service_type],
    queryFn: () => getRevenueOverview({ year, service_type }),
  });
};
