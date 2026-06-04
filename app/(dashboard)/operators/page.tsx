"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Link from "next/link";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import {
  formatCompactNumber,
  formatDate,
  NIGERIAN_STATES,
} from "@/utils/utils";
import AddDriverForm from "./add-driver";
import { useGetDriverStat } from "@/hooks/drivers/getDriversStat";
import { useGetDriver } from "@/hooks/drivers/getDriverList";
import { Driver } from "@/@types";
import { useExportDrivers } from "@/hooks/drivers/exportDrivers";
import { useActivateDriver } from "@/hooks/drivers/activateDriver";
import SuspendDriver, { SuspendAccountPayload } from "./[id]/suspendDriver";
import { useSuspendDriver } from "@/hooks/drivers/suspendDriver";

const SERVICE_OPTIONS = [
  "All Services",
  "RIDES",
  "DELIVERY",
  "TOWING",
  "TRUCK",
];

export default function AllDrivers() {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openAddDriver, setOpenAddDriver] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);
  const [openEditDriver, setOpenEditDriver] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("All");
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [driverToSuspend, setDriverToSuspend] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedService, setSelectedService] =
    useState<string>("All Services");
  const exportMutation = useExportDrivers();
  const itemsPerPage = 10;

  const { data: driversStat, isLoading } = useGetDriverStat({
    service_type:
      selectedService === "All Services" ? undefined : selectedService,
    state: selectedState === "All States" ? undefined : selectedState,
  });
  const { data: driversList, isLoading: isLoadingDriversList } = useGetDriver({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
    state: selectedState === "All States" ? undefined : selectedState,
    service_type:
      selectedService === "All Services" ? undefined : selectedService,
  });
  const driverStatDetails = driversStat?.data;
  const driverListData = driversList?.data;

  const suspendMutation = useSuspendDriver();
  const activateMutation = useActivateDriver();

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setCurrentPage(1);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setCurrentPage(1);
  };

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };

  const handleExportClose = () => {
    setOpenExportModal(false);
  };

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format); // ✅ pass format to mutation
  };

  const handleOpenAddDriver = () => {
    setOpenAddDriver(true);
  };
  const handleCloseAddDriver = () => {
    setOpenAddDriver(false);
  };

  const handleOpenEditDriver = (driver: Driver) => {
    setSelectedDriver(driver);
    setOpenEditDriver(true);
  };

  const handleCloseEditDriver = () => {
    setOpenEditDriver(false);
    setSelectedDriver(null);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleOpenSuspend = (userId: string) => {
    setDriverToSuspend(userId);
    setIsSuspendOpen(true);
  };

  const handleCloseSuspend = () => {
    setIsSuspendOpen(false);
    setDriverToSuspend(null);
  };

  const columns = [
    {
      header: "ID",
      accessor: "user_id" as keyof Driver,
    },
    {
      header: "User Details",
      accessor: "name" as keyof Driver,
      render: (row: Driver) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={row?.avatar || ""} alt={row.first_name || ""} />
            <AvatarFallback>
              {row.first_name ? row.first_name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row?.first_name} {row?.last_name}
            </div>
            <div className="text-grey-600 text-sm">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Service Type",
      accessor: "service_type" as keyof Driver,
      render: (row: Driver) => <p>{row?.service_type}</p>,
    },
    {
      header: "Status",
      accessor: "status" as keyof Driver,
      render: (row: Driver) => (
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
    {
      header: "Availability Status",
      accessor: "availability_status" as keyof Driver,
      render: (row: Driver) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.availability_status === "ONLINE"
              ? "bg-success-100 text-success-600"
              : row.availability_status === "BUSY"
                ? "bg-blue-100 text-blue-600"
                : "bg-grey-100 text-grey-600"
          }`}
        >
          {row.availability_status}
        </span>
      ),
    },
    {
      header: "Verification",
      accessor: "verification" as keyof Driver,
      render: (row: Driver) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.verification_status === "APPROVED"
              ? "bg-success-100 text-success-600"
              : row.verification_status === "PENDING"
                ? "bg-warning-50 text-warning-600"
                : " bg-error-100 text-error-600"
          }`}
        >
          {row.verification_status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "created" as keyof Driver,
      render: (row: Driver) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      header: "Actions",
      accessor: "id" as keyof Driver,
      sortable: false,
      render: (row: Driver) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row.status === "ACTIVE"}
              onChange={async () => {
                if (row.status === "ACTIVE") {
                  handleOpenSuspend(row.user_id);
                } else {
                  await activateMutation.mutateAsync(row.user_id);
                }
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditDriver(row)}
          >
            Edit
          </div>
          <Link
            href={`/operators/${row.user_id}`}
            className="text-brand-600 text-sm font-bold"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (driversList?.data?.total ?? 0) / (driversList?.data?.limit ?? 20),
  );

  const paginatedData = driverListData?.operators || [];

  console.log(paginatedData);

  const handlePageChange = (page: number) => setCurrentPage(page);

  // const handleRowClick = (row: Driver) => {
  //   console.log("Row clicked:", row);
  // };

  // const handleSelectRow = (id: number, checked: boolean) => {
  //   if (checked) {
  //     setSelectedRows([...selectedRows, id]);
  //   } else {
  //     setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
  //   }
  // };

  const handleSelectAll = (checked: boolean) => {
    // Placeholder for select all functionality
    console.log(checked);
  };

  const handleRowClick = (row: Driver) => {
    console.log("Row clicked:", row);
  };

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (driverToSuspend) {
      await suspendMutation.mutateAsync({
        id: driverToSuspend,
        payload: data,
      });
      handleCloseSuspend();
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Operators
          </h1>
          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddDriver}
            className="cursor-pointer"
          >
            Add Operators
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            All Operators
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.total ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Operators
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.active ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Inactive Operators
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.inactive ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Verified Operators
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.verified ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Unverified Operators
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.unverified ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pending Verification
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.pending_verification ?? 0)}
          </p>
        </div>
        {/* <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Banned Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.banned ?? 0)}
          </p>
        </div> */}
        {/* <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Suspended Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(driverStatDetails?.suspended ?? 0)}
          </p>
        </div> */}
      </div>

      {/* Table Section */}
      <div className="">
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={() => {
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm"
                >
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                {/* Bulk Actions dropdown */}
                <div className="relative">
                  <select
                    value=""
                    onChange={() => {
                      setCurrentPage(1);
                    }}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="suspend">Suspend Drivers</option>
                    <option value="verify">Verify Drivers</option>
                    <option value="delete">Delete Drivers</option>
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
            // onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            isLoading={isLoadingDriversList}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={driversList?.data?.total || 0}
            itemsPerPage={driversList?.data?.limit || 20}
            onPageChange={isLoadingDriversList ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}

      {openAddDriver && (
        <AddDriverForm isOpen={openAddDriver} onClose={handleCloseAddDriver} />
      )}

      {openEditDriver && selectedDriver && (
        <AddDriverForm
          isOpen={openEditDriver}
          onClose={handleCloseEditDriver}
          mode="edit"
          editData={{
            id: selectedDriver.user_id,
            first_name: selectedDriver.first_name,
            last_name: selectedDriver.last_name,
            email: selectedDriver.email,
            phone_number: selectedDriver.phone_number ?? "",
            state: selectedDriver.state ?? "",
            city: selectedDriver.city ?? "",
            streetAddress: selectedDriver.streetAddress ?? "",
          }}
        />
      )}

      <SuspendDriver
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />
    </div>
  );
}
