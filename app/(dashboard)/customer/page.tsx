"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import Link from "next/link";
import { useState } from "react";
import AddCustomer from "./add-customer";
import { useGetCustomerStat } from "@/hooks/customer/getCustomersStat";
import { useGetCustomer } from "@/hooks/customer/getCustomer";
import { useCustomerList } from "@/hooks/customer/exportCustomer";
import { formatCompactNumber, formatDate } from "@/utils/utils";
import { useActivateCustomer } from "@/hooks/customer/activateCustomer";
import { useSuspendCustomer } from "@/hooks/customer/suspendCustomer";
import SuspendAccountModal, { SuspendAccountPayload } from "./suspend-customer";
import { Customer } from "@/@types";

const CustomerPage = () => {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(
    null,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [openAddCustomer, setAddOpenCustomer] = useState(false);
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [customerToSuspend, setCustomerToSuspend] = useState<string | null>(
    null,
  );
  const [itemsPerPage, setItemsPerPage] = useState<number>(20); // now stateful
  const [selectedStatus, setSelectedStatus] = useState<string>("All"); // status filter
  const [searchInput, setSearchInput] = useState<string>(""); // controlled input
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: customerData, isLoading } = useGetCustomer({
    page: currentPage,
    limit: itemsPerPage,
    status: selectedStatus,
    search: searchQuery,
  });
  const { data: customerStat } = useGetCustomerStat();
  const exportMutation = useCustomerList();
  const activateMutation = useActivateCustomer();
  const suspendMutation = useSuspendCustomer();
  console.log(customerData?.data);

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format);
  };

  const handleOpenAddCustomer = () => setAddOpenCustomer(true);
  const handleCloseAddCustomer = () => setAddOpenCustomer(false);

  const handleOpenSuspend = (userId: string) => {
    setCustomerToSuspend(userId);
    setIsSuspendOpen(true);
  };

  const handleCloseSuspend = () => {
    setIsSuspendOpen(false);
    setCustomerToSuspend(null);
  };

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (customerToSuspend) {
      await suspendMutation.mutateAsync({
        id: customerToSuspend,
        payload: data,
      });
      handleCloseSuspend();
    }
  };

  const handleOpenEditCustomer = (customer: Customer) => {
    setSelectedCustomer(customer);
    setOpenEditCustomer(true);
  };

  const handleCloseEditCustomer = () => {
    setOpenEditCustomer(false);
    setSelectedCustomer(null);
  };

  const columns = [
    {
      header: "User Details",
      accessor: "name" as keyof Customer,
      render: (row: Customer) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={row?.avatar?.[0]?.url}
              alt={row?.first_name || ""}
            />
            <AvatarFallback>
              {row?.first_name ? row?.first_name.charAt(0) : "?"}
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
      header: "Phone Number",
      accessor: "phoneNumber" as keyof Customer,
      render: (row: Customer) => <p>{row?.phone_number}</p>,
    },
    {
      header: "Status",
      accessor: "status" as keyof Customer,
      render: (row: Customer) => (
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
    {
      header: "Created At",
      accessor: "created_at" as keyof Customer,
      render: (row: Customer) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      header: "Last Login",
      accessor: "last_active_at" as keyof Customer,
      render: (row: Customer) => (
        <span>
          {row.last_active_at ? formatDate(row.last_active_at) : "Yet to login"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof Customer,
      sortable: false,
      render: (row: Customer) => (
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
            onClick={() => handleOpenEditCustomer(row)}
          >
            Edit
          </div>
          <Link
            href={`/customer/${row?.user_id}`}
            className="text-brand-600 text-sm font-bold"
          >
            View
          </Link>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (customerData?.data?.total ?? 0) / (customerData?.data?.limit ?? 20),
  );

  const paginatedData = customerData?.data?.customers || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleRowClick = (row: Customer) => {
    console.log("Row clicked:", row);
  };

  const handleSelectRow = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = () => {};

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedStatus(e.target.value);
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
            Customers
          </h1>
        </div>

        <div className="flex items-center gap-3">
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
            onClick={handleOpenAddCustomer}
            className="cursor-pointer"
          >
            Add Customer
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            All Customers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(customerStat?.data?.total ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Customers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(customerStat?.data?.active ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Inactive Customers
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(customerStat?.data?.inactive ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Suspended Customers
          </h3>
          <p className="text-error-800 text-4xl font-bold">
            {formatCompactNumber(customerStat?.data?.suspended ?? 0)}
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

                <select
                  value={selectedStatus}
                  onChange={handleStatusChange}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="SUSPENDED">Suspended</option>
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
            totalItems={customerData?.data?.total || 0}
            itemsPerPage={customerData?.data?.limit || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}

      {openAddCustomer && (
        <AddCustomer
          isOpen={openAddCustomer}
          onClose={handleCloseAddCustomer}
          mode="create"
        />
      )}

      {openEditCustomer && selectedCustomer && (
        <AddCustomer
          isOpen={openEditCustomer}
          onClose={handleCloseEditCustomer}
          mode="edit"
          editData={{
            id: selectedCustomer.user_id,
            first_name: selectedCustomer.first_name,
            last_name: selectedCustomer?.last_name,
            email: selectedCustomer.email,
            //@ts-expect-error will work on it
            phone_number: selectedCustomer.phone_number,
          }}
        />
      )}

      <SuspendAccountModal
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />
    </div>
  );
};

export default CustomerPage;
