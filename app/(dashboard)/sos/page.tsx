"use client";

import { SOSAlert } from "@/@types";
import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import TabNavigation from "@/components/tabNavigation";
import { useExportSosList } from "@/hooks/sos/exportSosList";
import { useGetSosList } from "@/hooks/sos/getSosList";
import { useGetSosStats } from "@/hooks/sos/getSosStats";
import { formatDate, NIGERIAN_STATES } from "@/utils/utils";
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";

type Period = "THIS_MONTH" | "LAST_MONTH" | "LAST_7_DAYS" | "LAST_30_DAYS";

const Tabs = [
  { id: "ALL", label: "All SOS Report" },
  { id: "PENDING", label: "Pending" },
  { id: "ACTIVE", label: "Active" },
  { id: "RESOLVED", label: "Resolved" },
];

const SOS = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("THIS_MONTH");
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("ALL");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const exportMutation = useExportSosList();

  const { data: sosStats } = useGetSosStats(selectedState);
  const { data: sosList, isLoading } = useGetSosList({
    limit: itemsPerPage,
    state: selectedState === "All States" ? undefined : selectedState,
    page: currentPage,
    period: selectedPeriod,
    search: searchQuery,
  });
  const sosData = sosStats?.data;
  const sosListDetails = sosList?.data?.alerts;
  console.log(sosListDetails);

  console.log(sosStats);
  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);
  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync({
      format,
      state: selectedState === "All States" ? undefined : selectedState,
      period: selectedPeriod,
    });
  };

  const columns = [
    {
      header: "Trip Id",
      accessor: "id" as keyof SOSAlert,
    },
    {
      header: "Report",
      accessor: "report" as keyof SOSAlert,
    },
    {
      header: "User Details",
      accessor: "user_name" as keyof SOSAlert,
    },
    {
      header: "Operator Details",
      accessor: "operator_name" as keyof SOSAlert,
    },
    {
      header: "Date",
      accessor: "created_at" as keyof SOSAlert,
      render: (row: SOSAlert) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      header: "Status",
      accessor: "status" as keyof SOSAlert,
      render: (row: SOSAlert) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row?.status === "ACTIVE"
              ? "bg-success-100 text-success-600"
              : "bg-error-100 text-error-600"
          }`}
        >
          {row?.status}
        </span>
      ),
    },

    // {
    //   header: "Actions",
    //   accessor: "id" as keyof SOSAlert,
    //   sortable: false,
    //   render: (row: SOSAlert) => (
    //     <div className="flex items-center space-x-2">
    //       <Link
    //         href={`/sos/${row?.id}`}
    //         className="text-brand-600 text-sm font-bold"
    //       >
    //         View
    //       </Link>
    //     </div>
    //   ),
    // },
  ];

  const totalPages = Math.ceil(
    (sosList?.data?.total ?? 0) / (sosList?.data?.limit ?? 20),
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            SOS Reports
          </h1>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
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
          <div className="flex items-center gap-2 border border-grey-400 bg-grey-0 rounded-xl px-3 py-2 text-sm">
            <CalendarIcon size={20} className="text-grey-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="border-none bg-transparent text-grey-800 focus:outline-none cursor-pointer"
            >
              <option value="all_time">All time</option>
              <option value="this_month">This month</option>
              <option value="this_week">This week</option>
              <option value="today">Today</option>
            </select>
          </div>
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total SOS Reports
          </h3>
          <p className="text-grey-800 text-4xl font-bold">{sosData?.total}</p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Pending Sos Reports
          </h3>
          <p className="text-grey-800 text-4xl font-bold">{sosData?.pending}</p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            RESOLVED
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {sosData?.resolved}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active
          </h3>
          <p className="text-grey-800 text-4xl font-bold">{sosData?.active}</p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Resolved Rate
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {sosData?.resolve_rate}%
          </p>
        </div>
      </div>

      <TabNavigation
        tabs={Tabs}
        onTabChange={(tabId) => setSelectedTab(tabId)}
      />

      <div>
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
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

            {selectedTab === "ALL" && (
              <div>
                <Table
                  columns={columns}
                  data={sosListDetails ?? []}
                  isLoading={isLoading}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sosList?.data?.total || 0}
                  itemsPerPage={sosList?.data?.limit || 20}
                  onPageChange={isLoading ? () => {} : handlePageChange}
                />
              </div>
            )}
            {selectedTab === "PENDING" && (
              <div>
                <Table
                  columns={columns}
                  data={sosListDetails ?? []}
                  isLoading={isLoading}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sosList?.data?.total || 0}
                  itemsPerPage={sosList?.data?.limit || 20}
                  onPageChange={isLoading ? () => {} : handlePageChange}
                />
              </div>
            )}
            {selectedTab === "ACTIVE" && (
              <div>
                <Table
                  columns={columns}
                  data={sosListDetails ?? []}
                  isLoading={isLoading}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sosList?.data?.total || 0}
                  itemsPerPage={sosList?.data?.limit || 20}
                  onPageChange={isLoading ? () => {} : handlePageChange}
                />
              </div>
            )}
            {selectedTab === "RESOLVED" && (
              <div>
                <Table
                  columns={columns}
                  data={sosListDetails ?? []}
                  isLoading={isLoading}
                />

                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  totalItems={sosList?.data?.total || 0}
                  itemsPerPage={sosList?.data?.limit || 20}
                  onPageChange={isLoading ? () => {} : handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default SOS;
