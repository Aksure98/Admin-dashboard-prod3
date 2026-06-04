import { GetLogsParams } from "@/@types";
import { getLogs } from "@/api/logs";
import { useQuery } from "@tanstack/react-query";

export const useGetLogs = (params?: GetLogsParams) => {
  return useQuery({
    queryKey: ["activity-logs", params],
    queryFn: () => getLogs(params),
  });
};
