"use client";

import { ActivityLog } from "@/@types";
import { Avatar, AvatarFallback } from "@/components/avatar";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetLogs } from "@/hooks/activity-log/getLogs";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

const ActivityLogs = () => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: activityData, isLoading } = useGetLogs({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const totalPages = Math.ceil(
    (activityData?.total ?? 0) / (activityData?.data?.length ?? 20),
  );

  const paginatedData = (activityData?.data ?? []).map((item) => ({
    ...item,
    id: item.log_id,
  }));

  const handlePageChange = (page: number) => setCurrentPage(page);

  const columns = [
    {
      header: "ID",
      accessor: "log_id" as keyof ActivityLog,
    },
    {
      header: "Timestamp",
      accessor: "timestamp" as keyof ActivityLog,
      render: (row: ActivityLog) => (
        <span>{new Date(row.timestamp).toLocaleString()}</span>
      ),
    },
    {
      header: "User",
      accessor: "user" as keyof ActivityLog,
      render: (row: ActivityLog) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            {/* <AvatarImage
              src={row?.avatar?.[0]?.url}
              alt={row?.first_name || ""}
            /> */}
            <AvatarFallback>
              {row?.user.initials ? row?.user.initials.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row?.user?.full_name}
            </div>
            <div className="text-grey-600 text-sm">{row?.user?.role}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Modules",
      accessor: "module" as keyof ActivityLog,
    },
    {
      header: "Action",
      accessor: "action" as keyof ActivityLog,
    },
    {
      header: "Description",
      accessor: "description" as keyof ActivityLog,
    },
  ];

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Activity Log
          </h1>
        </div>

        <Button
          hierarchy="secondary"
          leftIcon={<PlusIcon size={16} />}
          // onClick={handleExportOpen}
          className="cursor-pointer"
        >
          Export
        </Button>
      </div>

      <div>
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm"
                >
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={() => setCurrentPage(1)}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm cursor-pointer"
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
                >
                  Apply
                </Button>
              </div>

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

          <Table columns={columns} data={paginatedData} isLoading={isLoading} />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={activityData?.total || 0}
            itemsPerPage={activityData?.data?.length || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
