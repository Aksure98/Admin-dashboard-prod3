"use client";

import { PayLaterList } from "@/@types";
import { Avatar, AvatarFallback } from "@/components/avatar";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import TabNavigation from "@/components/tabNavigation";
import { useGetPayLaterList } from "@/hooks/pay-later/getPayLaterList";
import { useGetPayLaterStats } from "@/hooks/pay-later/getPayLaterStat";
import { formatPrice } from "@/utils/utils";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

const Tabs = [
  { id: "ALL", label: "All" },
  { id: "OVERDUE", label: "Overdue" },
  { id: "PENDING", label: "Pending" },
  { id: "PAID", label: "Paid" },
];

const PayLater = () => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTab, setSelectedTab] = useState("ALL");

  const { data: payLaterStat } = useGetPayLaterStats();
  const { data: payLaterList, isLoading } = useGetPayLaterList({
    page: currentPage,
    page_size: itemsPerPage,
    search: searchQuery,
    status: selectedTab === "ALL" ? undefined : selectedTab,
  });

  const totalPages = Math.ceil(
    (payLaterList?.data?.total ?? 0) / (payLaterList?.data?.page_size ?? 20),
  );

  const paginatedData = payLaterList?.data?.record || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: "id" as keyof PayLaterList,
    },

    {
      header: "User Details",
      accessor: "name" as keyof PayLaterList,
      render: (row: PayLaterList) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            {/* <AvatarImage
                        src={row?.avatar?.[0]?.url}
                        alt={row?.first_name || ""}
                      /> */}
            <AvatarFallback>
              {row?.user_details.name ? row?.user_details?.name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row?.user_details.name}
            </div>
            <div className="text-grey-600 text-sm">
              {row?.user_details.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "service_type" as keyof PayLaterList,
    },
    {
      header: "Amount",
      accessor: "amount" as keyof PayLaterList,
      render: (row: PayLaterList) => <p>{formatPrice(row.amount)}</p>,
    },

    {
      header: "Status",
      accessor: "status" as keyof PayLaterList,
      render: (row: PayLaterList) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row?.status === "PAID"
              ? "bg-success-100 text-success-600"
              : row?.status === "PENDING"
                ? "bg-warning-100 text-warning-600"
                : "bg-error-100 text-error-600"
          }`}
        >
          {row?.status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof PayLaterList,
      sortable: false,
      render: (row: PayLaterList) => (
        <div className="flex items-center space-x-2">
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            // onClick={() => handleOpenViewIncentive(row)}
          >
            View
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
            Pay Later Management
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
      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Outstanding Balance
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(payLaterStat?.data?.total_outstanding_balance ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Due this week
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {payLaterStat?.data?.due_this_week ?? 0}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Paid this week
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {payLaterStat?.data?.paid_this_week ?? 0}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Overdue
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {payLaterStat?.data?.overdue_count ?? 0}
          </p>
        </div>
      </div>

      <TabNavigation
        tabs={Tabs}
        onTabChange={(tabId) => setSelectedTab(tabId)}
      />

      <div className="">
        {selectedTab === "ALL" && (
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
            <Table
              //@ts-expect-error will
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={payLaterList?.data?.total || 0}
              itemsPerPage={payLaterList?.data?.page_size || 20}
              onPageChange={isLoading ? () => {} : handlePageChange}
            />
          </div>
        )}
        {selectedTab === "OVERDUE" && (
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
            <Table
              //@ts-expect-error will
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={payLaterList?.data?.total || 0}
              itemsPerPage={payLaterList?.data?.page_size || 20}
              onPageChange={isLoading ? () => {} : handlePageChange}
            />
          </div>
        )}
        {selectedTab === "PENDING" && (
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
            <Table
              //@ts-expect-error will
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={payLaterList?.data?.total || 0}
              itemsPerPage={payLaterList?.data?.page_size || 20}
              onPageChange={isLoading ? () => {} : handlePageChange}
            />
          </div>
        )}
        {selectedTab === "PAID" && (
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
            <Table
              //@ts-expect-error will
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={payLaterList?.data?.total || 0}
              itemsPerPage={payLaterList?.data?.page_size || 20}
              onPageChange={isLoading ? () => {} : handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default PayLater;
