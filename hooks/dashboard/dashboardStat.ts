import { getDashboardStat } from "@/api/dashboard";
import { useQuery } from "@tanstack/react-query";

type Period = "THIS_MONTH" | "LAST_MONTH" | "LAST_7_DAYS" | "LAST_30_DAYS";

interface DashboardStatParams {
  period?: Period;
  service_type?: string;
  state?: string;
}

export const useDashboardStat = ({
  period = "THIS_MONTH",
  service_type,
  state,
}: DashboardStatParams = {}) => {
  return useQuery({
    queryKey: ["dashboard-stat", period, service_type, state],
    queryFn: () => getDashboardStat({ period, service_type, state }),
  });
};
