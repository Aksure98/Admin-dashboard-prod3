"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";
import {
  CalendarDotsIcon,
  CalendarIcon,
  EnvelopeSimpleIcon,
  LockIcon,
  MagnifyingGlassIcon,
  PauseIcon,
  PencilSimpleIcon,
  PhoneCallIcon,
  UserIcon,
  PlayIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import EditTeamForm from "../edit-team";
import { useSuspendTeam } from "@/hooks/team-members/suspendTeam";
import { useResetPasswordTeam } from "@/hooks/team-members/resetPassword";
import { useActivateTeam } from "@/hooks/team-members/activateTeam";
import { Input } from "@/components/inputs";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { useParams } from "next/navigation";
import { useGetSingleAdmin } from "@/hooks/team-members/getSingleTeamMember";
import { formatDate } from "@/utils/utils";
import { ActivityLogs } from "@/@types";

const activityLog: ActivityLogs[] = [
  {
    id: "1",
    eventType: "Profile update",
    description: "Lorem lorem lorem",
    time: "15 May 2020 8:30 am",
  },
];

const UserDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleAdmin(id);
  const userDetail = data?.data;

  const [openEditTeam, setOpenEditTeam] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const suspendMutation = useSuspendTeam();
  const resetPasswordMutation = useResetPasswordTeam();
  const activateTeamMutation = useActivateTeam();

  const handleOpenEditTeam = () => setOpenEditTeam(true);
  const handleCloseEditTeam = () => setOpenEditTeam(false);

  const handleSuspendTeam = async () => {
    if (!userDetail?.id) return;
    await suspendMutation.mutateAsync(userDetail.id);
  };

  const handleResetPasswordTeam = async () => {
    if (!userDetail?.id) return;
    await resetPasswordMutation.mutateAsync(userDetail.id);
  };

  const handleActivateTeam = async () => {
    if (!userDetail?.id) return;
    await activateTeamMutation.mutateAsync(userDetail.id);
  };

  const columns = [
    {
      header: "Event Type",
      accessor: "event" as keyof ActivityLogs,
      render: (row: ActivityLogs) => <p>{row?.eventType}</p>,
    },
    {
      header: "Description",
      accessor: "description" as keyof ActivityLogs,
      render: (row: ActivityLogs) => <p>{row?.description}</p>,
    },
    {
      header: "Time",
      accessor: "time" as keyof ActivityLogs,
      render: (row: ActivityLogs) => <p>{row?.time}</p>,
    },
  ];

  const totalPages = Math.ceil(activityLog.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = activityLog.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  // ✅ Loading skeleton
  if (isLoading) {
    return (
      <div className="grid grid-cols-4 gap-5 mt-24 animate-pulse">
        <div className="col-span-3 border-r border-grey-200 pr-5">
          <div className="border border-grey-200 rounded-lg shadow">
            <div className="p-4 border-b border-gray-200">
              <div className="h-7 bg-grey-200 rounded w-40" />
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="flex gap-4 px-6 py-4 border-b border-grey-200"
              >
                <div className="h-3 bg-grey-200 rounded w-1/4" />
                <div className="h-3 bg-grey-200 rounded w-1/2" />
                <div className="h-3 bg-grey-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        </div>

        <div className="col-span-1 flex flex-col gap-5">
          <div className="flex gap-5 items-center pb-3">
            <div className="h-12 w-12 bg-grey-200 rounded-full" />
            <div className="flex flex-col gap-2 flex-1">
              <div className="h-4 bg-grey-200 rounded w-3/4" />
              <div className="h-3 bg-grey-200 rounded w-1/2" />
            </div>
          </div>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 items-center pb-3">
              <div className="h-10 w-10 bg-grey-200 rounded-full" />
              <div className="flex flex-col gap-1 flex-1">
                <div className="h-3 bg-grey-200 rounded w-1/3" />
                <div className="h-3 bg-grey-200 rounded w-1/2" />
              </div>
            </div>
          ))}
          <div className="border-t border-grey-100 pt-6 flex flex-col gap-4">
            <div className="h-5 bg-grey-200 rounded w-20" />
            <div className="h-10 bg-grey-200 rounded-lg w-full" />
            <div className="h-10 bg-grey-200 rounded-lg w-full" />
            <div className="h-10 bg-grey-200 rounded-lg w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-4 gap-5 mt-24">
      <div className="col-span-3 border-r border-grey-200 pr-5">
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h1 className="text-grey-800 text-2xl font-bold">
                Activity Logs
              </h1>
              <div className="flex items-center space-x-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={20} color="#667085" />}
                  name="search"
                  placeholder="search"
                  size="md"
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
          <Table columns={columns} data={paginatedData} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={activityLog.length}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      <div className="col-span-1">
        <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
          <div className="flex gap-5 items-center pb-3">
            <Avatar>
              <AvatarImage
                src={userDetail?.image?.[0]?.url}
                alt={userDetail?.full_name || ""}
              />
              <AvatarFallback>
                {userDetail?.full_name ? userDetail.full_name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <h1 className="text-grey-800 text-xl font-bold">
                {userDetail?.full_name}
              </h1>
              <div>
                <p className="text-grey-800 text-sm">{userDetail?.email}</p>
                <p className="bg-brand-500 px-5 py-1 rounded-full text-brand-25 w-fit text-center">
                  {userDetail?.role?.name}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <UserIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Full Name</h1>
              <p className="text-grey-600 text-sm">{userDetail?.full_name}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <UserIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Status</h1>
              <h4
                className={`uppercase font-bold ${userDetail?.status === "SUSPENDED" ? "text-error-900" : "text-success-600"}`}
              >
                {userDetail?.status}
              </h4>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <PhoneCallIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Phone Number</h1>
              <p className="text-grey-600 text-sm">
                {userDetail?.phone_number}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <EnvelopeSimpleIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Email</h1>
              <p className="text-grey-600 text-sm">{userDetail?.email}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <CalendarIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Created at</h1>
              <p className="text-grey-600 text-sm">
                {userDetail?.created_at
                  ? formatDate(userDetail.created_at)
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <CalendarDotsIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Last Login</h1>
              <p className="text-grey-600 text-sm">
                {userDetail?.last_login_at
                  ? formatDate(userDetail.last_login_at)
                  : "Yet to login"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-grey-100 p-6 flex flex-col gap-5">
          <h1 className="text-xl font-bold text-grey-800">Action</h1>
          <Button
            hierarchy="secondary"
            leftIcon={<PencilSimpleIcon size={24} />}
            onClick={handleOpenEditTeam}
            size="lg"
            className="cursor-pointer w-full"
          >
            Edit
          </Button>

          {userDetail?.status === "ACTIVE" ? (
            <Button
              hierarchy="secondary"
              leftIcon={<PauseIcon size={24} />}
              onClick={handleSuspendTeam}
              isLoading={suspendMutation.isPending}
              size="lg"
              className="cursor-pointer w-full"
            >
              Suspend
            </Button>
          ) : (
            <Button
              hierarchy="secondary"
              leftIcon={<PlayIcon size={24} />}
              onClick={handleActivateTeam}
              isLoading={activateTeamMutation.isPending}
              size="lg"
              className="cursor-pointer w-full"
            >
              Activate
            </Button>
          )}

          <Button
            hierarchy="primary"
            leftIcon={<LockIcon size={24} />}
            size="lg"
            className="cursor-pointer w-full"
            onClick={handleResetPasswordTeam}
            isLoading={resetPasswordMutation.isPending}
          >
            Reset Password
          </Button>
        </div>
      </div>

      {openEditTeam && userDetail && (
        <EditTeamForm
          isOpen={openEditTeam}
          onClose={handleCloseEditTeam}
          user={userDetail}
        />
      )}
    </div>
  );
};

export default UserDetails;
