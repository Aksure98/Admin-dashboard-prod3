"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";

import UploadModal from "@/components/uploadModal";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import AddTeamForm from "./add-team";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Link from "next/link";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import EditTeamForm from "./edit-team";
import { useGetTeamMember } from "@/hooks/team-members/getTeam";
import { useGetTeamStat } from "@/hooks/team-members/getTeamStats";
import { formatDate, NIGERIAN_STATES } from "@/utils/utils";
import { useActivateTeam } from "@/hooks/team-members/activateTeam";
import { useSuspendTeam } from "@/hooks/team-members/suspendTeam";
import { useExportTeamList } from "@/hooks/team-members/exportTeams";
import { TeamDetails } from "@/@types";

const TeamMembers = () => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openAddTeam, setOpenAddTeam] = useState(false);
  const [openEditTeam, setOpenEditTeam] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TeamDetails | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);
  // const itemsPerPage = 10;

  const { data: teamData, isLoading } = useGetTeamMember({
    page: currentPage,
    limit: itemsPerPage,
    region: selectedState,
    search: searchQuery,
  });
  const { data: teamStat, isLoading: isTeamStatLoading } = useGetTeamStat();
  const suspendMutation = useSuspendTeam();
  const activateMutation = useActivateTeam();
  const exportMutation = useExportTeamList();

  console.log(teamData?.data);

  const handleImportOpen = () => {
    setOpenImportModal(true);
  };

  const handleImportClose = () => {
    setOpenImportModal(false);
  };

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };

  const handleExportClose = () => {
    setOpenExportModal(false);
  };

  const handleOpenAddTeam = () => {
    setOpenAddTeam(true);
  };

  const handleCloseAddTeam = () => {
    setOpenAddTeam(false);
  };
  const handleOpenEditTeam = (team: TeamDetails) => {
    setSelectedUser(team);
    setOpenEditTeam(true);
  };

  const handleCloseEditTeam = () => {
    setOpenEditTeam(false);
    setSelectedUser(null);
  };

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format); // ✅ pass format to mutation
  };

  const columns = [
    {
      header: "User Details",
      accessor: "name" as keyof TeamDetails,
      render: (row: TeamDetails) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={row?.image?.[0]?.url} alt={row.full_name || ""} />
            <AvatarFallback>
              {row.full_name ? row.full_name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row.full_name}
            </div>
            <div className="text-grey-600 text-sm">{row.email}</div>
          </div>
        </div>
      ),
    },

    {
      header: "Role",
      accessor: "role" as keyof TeamDetails,
      render: (row: TeamDetails) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.role?.name === "Super Admin"
              ? "bg-brand-50 text-brand-600"
              : row.role?.name === "Admin"
                ? "bg-brand-300 text-brand-800"
                : "bg-brand-500 text-brand-25"
          }`}
        >
          {row?.role?.name}
        </span>
      ),
    },
    // {
    //   header: "Phone Number",
    //   accessor: "phoneNumber" as keyof User,
    //   render: (row: User) => <p>{row.phone}</p>,
    // },

    {
      header: "Status",
      accessor: "status" as keyof TeamDetails,
      render: (row: TeamDetails) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "ACTIVE"
              ? "bg-success-100 text-success-600"
              : "bg-error-100 text-error-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    // {
    //   header: "Region",
    //   accessor: "region" as keyof User,
    //   render: (row: User) => <p>{row.region}</p>,
    // },

    {
      header: "Created At",
      accessor: "created_at" as keyof TeamDetails,
      render: (row: TeamDetails) => {
        return <span>{formatDate(row.created_at)}</span>;
      },
    },
    {
      header: "Last Login",
      accessor: "last_login_at" as keyof TeamDetails,
      render: (row: TeamDetails) => {
        return (
          <span>
            {row.last_login_at ? formatDate(row.last_login_at) : "Yet to login"}
          </span>
        );
      },
    },
    {
      header: "Actions",
      accessor: "id" as keyof TeamDetails,
      sortable: false,
      render: (row: TeamDetails) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.status === "ACTIVE"}
              onChange={async () => {
                if (row.status === "ACTIVE") {
                  await suspendMutation.mutateAsync(row.id);
                } else {
                  await activateMutation.mutateAsync(row.id);
                }
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
          <Link
            href={`/team-members/${row.id}`}
            className="text-brand-600 text-sm font-bold"
          >
            View
          </Link>
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditTeam(row)}
          >
            Edit
          </div>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (teamData?.data?.total ?? 0) / (teamData?.data?.limit ?? 20),
  );
  const paginatedData = teamData?.data?.admins || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (row: TeamDetails) => {
    console.log("Row clicked:", row);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    // if (checked) {
    //   setSelectedRows(paginatedData.map((row) => row.id));
    // } else {
    //   setSelectedRows([]);
    // }
    console.log(checked);
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Team Members
          </h1>

          <select
            value={selectedState}
            onChange={handleStateChange}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
          >
            Export
          </Button>
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleImportOpen}
          >
            Import
          </Button>
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddTeam}
          >
            Add Team Member
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            All Team Members
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {teamStat?.data?.total}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Members
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {teamStat?.data?.active}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Inactive Members
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {teamStat?.data?.inactive}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Suspended Members
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {teamStat?.data?.suspended}
          </p>
        </div>
      </div>

      <div className="">
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm"
                >
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                {/* Bulk Actions dropdown */}
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={() => {
                      setCurrentPage(1);
                    }}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="delete">Bulk Delete</option>
                    <option value="suspend">Bulk Suspend</option>
                  </select>
                </div>

                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  // onClick={() => setIsModalOpen(true)}
                >
                  Apply
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={20} color="#667085" />}
                  name="search"
                  placeholder="search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            data={paginatedData}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            //@ts-expect-error hhh
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={teamData?.data?.total || 0}
            itemsPerPage={teamData?.data?.limit || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openImportModal && <UploadModal setShowModal={handleImportClose} />}
      {/* {openExportModal && <ExportModal setShowModal={handleExportClose} />} */}
      {openExportModal && (
        <ExportModal
          setShowModal={setOpenExportModal} // ✅ pass the setter directly
          onExport={handleExport} // ✅ pass export handler
        />
      )}
      {openAddTeam && (
        <AddTeamForm isOpen={openAddTeam} onClose={handleCloseAddTeam} />
      )}
      {openEditTeam && selectedUser && (
        <EditTeamForm
          isOpen={openEditTeam}
          onClose={handleCloseEditTeam}
          user={selectedUser} // Pass the selected user
        />
      )}
    </div>
  );
};

export default TeamMembers;
