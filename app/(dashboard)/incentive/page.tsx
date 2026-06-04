"use client";
import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import { Input } from "@/components/inputs";
import { useExportIncentiveList } from "@/hooks/incentive/exportIncentive";
import { useGetIncentive } from "@/hooks/incentive/getIncentive";
import { useGetIncentiveStats } from "@/hooks/incentive/getIncentiveStats";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Incentive } from "@/@types";
import { formatDate } from "@/utils/utils";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { useToggleIncentiveStatus } from "@/hooks/incentive/toggleStatusIncentive";
import ViewIncentive from "./view-incentive";
import AddIncentive from "./add-incentive";

const IncentivePage = () => {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [selectedIncentive, setSelectedIncentive] = useState<Incentive | null>(
    null,
  );
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [openAddCoupons, setOpenAddCoupons] = useState(false);
  const [openEditCoupon, setOpenEditCoupon] = useState(false);

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);

  const exportMutation = useExportIncentiveList();
  const { data: incentiveStat } = useGetIncentiveStats();
  const { data: incentiveData, isLoading } = useGetIncentive({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const toggleStatusMutation = useToggleIncentiveStatus();

  const totalPages = Math.ceil(
    (incentiveData?.meta?.total ?? 0) / (incentiveData?.meta?.limit ?? 20),
  );

  const paginatedData = incentiveData?.data || [];
  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleOpenAddCoupon = () => setOpenAddCoupons(true);
  const handleCloseAddCoupon = () => setOpenAddCoupons(false);

  const handleOpenViewIncentive = (incentive: Incentive) => {
    setSelectedIncentive(incentive);
    setIsViewModalOpen(true);
  };

  const handleCloseViewIncentive = () => {
    setSelectedIncentive(null);
    setIsViewModalOpen(false);
  };

  const handleOpenEditCoupon = (incentive: Incentive) => {
    setSelectedIncentive(incentive);
    setOpenEditCoupon(true);
  };

  const handleCloseEditCoupon = () => {
    setOpenEditCoupon(false);
    setSelectedIncentive(null);
  };

  const handleToggleStatus = (row: Incentive) => {
    setTogglingId(row.id);
    toggleStatusMutation.mutate(
      { id: row.id, value: { is_active: !row.is_active } },
      { onSettled: () => setTogglingId(null) },
    );
  };

  const columns = [
    {
      header: "Promotion Name",
      accessor: "name" as keyof Incentive,
    },
    {
      header: "Type",
      accessor: "discount_type" as keyof Incentive,
      render: (row: Incentive) => (
        <p
          className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full w-fit ${
            row.discount_type === "PERCENTAGE"
              ? "bg-warning-50 text-warning-600"
              : "bg-brand-50 text-brand-600"
          }`}
        >
          {row?.discount_type}
        </p>
      ),
    },
    {
      header: "Amount",
      accessor: "discount_value" as keyof Incentive,
    },
    {
      header: "Expires at",
      accessor: "expires_at" as keyof Incentive,
      render: (row: Incentive) => (
        <p className="text-sm text-grey-600">{formatDate(row?.expires_at)}</p>
      ),
    },

    {
      header: "Actions",
      accessor: "id" as keyof Incentive,
      sortable: false,
      render: (row: Incentive) => (
        <div className="flex items-center space-x-2">
          <label
            className={`relative inline-flex items-center ${
              togglingId === row.id
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row?.is_active === true}
              disabled={togglingId === row.id}
              onChange={() => handleToggleStatus(row)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenViewIncentive(row)}
          >
            View
          </div>
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditCoupon(row)}
          >
            Edit
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Incentives
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>

          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddCoupon}
            className="cursor-pointer"
          >
            Add Incentive
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Incentive
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {incentiveStat?.data?.total_incentives}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Incentive
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {incentiveStat?.data?.active_incentives}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Usage Limit
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {incentiveStat?.data?.total_usage_limit}
          </p>
        </div>
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
            totalItems={incentiveData?.meta?.total || 0}
            itemsPerPage={incentiveData?.meta?.limit || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}

      <ViewIncentive
        isOpen={isViewModalOpen}
        onClose={handleCloseViewIncentive}
        incentive={selectedIncentive}
      />

      {openAddCoupons && (
        <AddIncentive
          isOpen={openAddCoupons}
          onClose={handleCloseAddCoupon}
          mode="create"
        />
      )}

      {openEditCoupon && selectedIncentive && (
        <AddIncentive
          isOpen={openEditCoupon}
          onClose={handleCloseEditCoupon}
          mode="edit"
          //@ts-expect-error will work on it later
          editData={{
            id: selectedIncentive?.id,
            name: selectedIncentive?.name,
            discount_type: selectedIncentive?.discount_type,
            discount_value: selectedIncentive?.discount_value,
            starts_at: selectedIncentive?.starts_at,
            expires_at: selectedIncentive?.expires_at,
            user_type: selectedIncentive?.user_type,
            condition: selectedIncentive?.condition,
          }}
        />
      )}
    </div>
  );
};

export default IncentivePage;
