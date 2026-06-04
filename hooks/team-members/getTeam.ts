import { useQuery } from "@tanstack/react-query";
import { getTeamMember } from "@/api/team";
import { GetTeamMemberParams } from "@/@types";

export const useGetTeamMember = (params: GetTeamMemberParams = {}) => {
  return useQuery({
    queryKey: ["teams", params],
    queryFn: () => getTeamMember(params),
  });
};
// import { useQuery } from "@tanstack/react-query";
// import { getTeamMember } from "@/api/team";

// export const useGetTeamMember = (page: number = 1) => {
//   return useQuery({
//     queryKey: ["teams", page], // ✅ page in queryKey triggers refetch on change
//     queryFn: () => getTeamMember(page),
//   });
// };
