import { getLostAndFoundStat } from "@/api/lost-found";
import { useQuery } from "@tanstack/react-query";

type Period = "today" | "this_week" | "this_month" | "all_time";

interface LostAndFoundStatParams {
  period?: Period;
  state?: string;
}

export const useLostAndFoundStat = ({
  period = "today",

  state,
}: LostAndFoundStatParams = {}) => {
  return useQuery({
    queryKey: ["lostAndFound-stat", period, state],
    queryFn: () => getLostAndFoundStat({ period, state }),
  });
};
