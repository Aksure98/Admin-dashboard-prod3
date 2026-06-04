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
import AddCargoForm from "./add-operator";
import { useGetCargoOperatorStat } from "@/hooks/cargo/getCargoStats";
import { useGetCargoList } from "@/hooks/cargo/getCargoList";
import { Driver } from "@/@types";
import { useExportCargo } from "@/hooks/cargo/exportCargo";
import { useActivateCargo } from "@/hooks/cargo/activateCargo";
import SuspendCargo, { SuspendAccountPayload } from "./[id]/suspendCargo";
import { useSuspendCargo } from "@/hooks/cargo/suspendCargo";

export default function AllCargoOperators() {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openAddCargo, setOpenAddCargo] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedCargo, setSelectedCargo] = useState<Driver | null>(null);
  const [openEditCargo, setOpenEditCargo] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [cargoToSuspend, setCargoToSuspend] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const exportMutation = useExportCargo();
  const itemsPerPage = 10;

  const { data: cargoStat, isLoading } = useGetCargoOperatorStat();
  const { data: cargoList } = useGetCargoList({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const cargoStatDetails = cargoStat?.data;
  const cargoListData = cargoList?.data;

  const suspendMutation = useSuspendCargo();
  const activateMutation = useActivateCargo();

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format);
  };

  const handleOpenAddCargo = () => setOpenAddCargo(true);
  const handleCloseAddCargo = () => setOpenAddCargo(false);

  const handleOpenEditCargo = (cargo: Driver) => {
    setSelectedCargo(cargo);
    setOpenEditCargo(true);
  };

  const handleCloseEditCargo = () => {
    setOpenEditCargo(false);
    setSelectedCargo(null);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleOpenSuspend = (userId: string) => {
    setCargoToSuspend(userId);
    setIsSuspendOpen(true);
  };

  const handleCloseSuspend = () => {
    setIsSuspendOpen(false);
    setCargoToSuspend(null);
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
      header: "Verification",
      accessor: "verification" as keyof Driver,
      render: (row: Driver) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.verification_status === "VERIFIED"
              ? "bg-success-100 text-success-600"
              : row.verification_status === "UNVERIFIED"
                ? "bg-error-100 text-error-600"
                : "bg-warning-50 text-warning-600"
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
            onClick={() => handleOpenEditCargo(row)}
          >
            Edit
          </div>
          <Link
            href={`/cargo-operator/${row.user_id}`}
            className="text-brand-600 text-sm font-bold"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (cargoList?.data?.total ?? 0) / (cargoList?.data?.limit ?? 20),
  );

  const paginatedData = cargoListData?.operators || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSelectAll = (checked: boolean) => {
    console.log(checked);
  };

  const handleRowClick = (row: Driver) => {
    console.log("Row clicked:", row);
  };

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (cargoToSuspend) {
      await suspendMutation.mutateAsync({
        id: cargoToSuspend,
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
            Cargo Drivers
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
            onClick={handleOpenAddCargo}
            className="cursor-pointer"
          >
            Add Cargo Driver
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            All Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.total ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.active ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Inactive Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.inactive ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Verified Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.verified ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Unverified Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.unverified ?? 0)}
          </p>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pending Verification
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.pending_verification ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Banned Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.banned ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Suspended Cargo Drivers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(cargoStatDetails?.suspended ?? 0)}
          </p>
        </div>
      </div>

      <div className="">
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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

                <div className="relative">
                  <select
                    value=""
                    onChange={() => {
                      setCurrentPage(1);
                    }}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="suspend">Suspend Riders</option>
                    <option value="verify">Verify Riders</option>
                    <option value="delete">Delete Riders</option>
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
          <Table
            columns={columns}
            data={paginatedData}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={cargoList?.data?.total || 0}
            itemsPerPage={cargoList?.data?.limit || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}

      {openAddCargo && (
        <AddCargoForm isOpen={openAddCargo} onClose={handleCloseAddCargo} />
      )}

      {openEditCargo && selectedCargo && (
        <AddCargoForm
          isOpen={openEditCargo}
          onClose={handleCloseEditCargo}
          mode="edit"
          editData={{
            id: selectedCargo.user_id,
            fullName: `${selectedCargo.first_name} ${selectedCargo.last_name}`,
            email: selectedCargo.email,
            phoneNumber: selectedCargo.phone_number ?? "",
            state: selectedCargo.state ?? "",
            city: selectedCargo.city ?? "",
            streetAddress: selectedCargo.streetAddress ?? "",
          }}
        />
      )}

      <SuspendCargo
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />
    </div>
  );
}
