"use client";

import { TransactionList } from "@/@types";
import { Avatar, AvatarFallback } from "@/components/avatar";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetTransactionList } from "@/hooks/transaction/getTransactionList";
import { useGetTransactionStats } from "@/hooks/transaction/getTransactionStats";
import { formatDate, formatPrice } from "@/utils/utils";
import {
  CalendarIcon,
  MagnifyingGlassIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useState } from "react";

type Period = "THIS_MONTH" | "LAST_MONTH" | "LAST_7_DAYS" | "LAST_30_DAYS";

const Transactions = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("THIS_MONTH");
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: transactionStat } = useGetTransactionStats();
  const { data: transactionData, isLoading } = useGetTransactionList({
    page: currentPage,
    page_size: itemsPerPage,
    search: searchQuery,
  });

  console.log(transactionData);
  const totalPages = Math.ceil(
    (transactionData?.data?.total ?? 0) / (transactionData?.data?.limit ?? 20),
  );

  const paginatedData = transactionData?.data?.transactions || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Transaction ID",
      accessorKey: "transaction_id" as keyof TransactionList,
      render: (row: TransactionList) => <p>{row?.transaction_id}</p>,
    },
    {
      header: "User Details",
      accessor: "name" as keyof TransactionList,
      render: (row: TransactionList) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            {/* <AvatarImage
              src={row?.avatar?.[0]?.url}
              alt={row?.first_name || ""}
            /> */}
            <AvatarFallback>
              {row?.user_details?.name
                ? row?.user_details?.name.charAt(0)
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row?.user_details?.name}
            </div>
            <div className="text-grey-600 text-sm">
              {row?.user_details?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Type",
      accessor: "user_type" as keyof TransactionList,
    },
    {
      header: "Category",
      accessor: "category" as keyof TransactionList,
    },
    {
      header: "Payment Method",
      accessor: "transaction_type" as keyof TransactionList,
    },
    {
      header: "Amount",
      accessor: "amount" as keyof TransactionList,
      render: (row: TransactionList) => <p>{formatPrice(row?.amount)}</p>,
    },
    {
      header: "Status",
      accessor: "status" as keyof TransactionList,
      render: (row: TransactionList) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row?.status === "SUCCESS"
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
      accessor: "created_at" as keyof TransactionList,
      render: (row: TransactionList) => (
        <span>{formatDate(row?.created_at)}</span>
      ),
    },

    {
      header: "Actions",
      accessor: "id" as keyof TransactionList,
      sortable: false,
      render: (row: TransactionList) => (
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
            Transactions
          </h1>
        </div>

        <div className="flex gap-3 items-center">
          <div className="flex items-center gap-2 border border-grey-400 bg-grey-0 rounded-xl px-3 py-2 text-sm">
            <CalendarIcon size={20} className="text-grey-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="border-none bg-transparent text-grey-800 focus:outline-none cursor-pointer"
            >
              <option value="THIS_MONTH">This month</option>
              <option value="LAST_MONTH">Last month</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </select>
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
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Amount
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(transactionStat?.data?.total_volume ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Credit
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(transactionStat?.data?.total_credits ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Debit
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(transactionStat?.data?.total_debits ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Refund
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(transactionStat?.data?.total_refunds ?? 0)}
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

          <Table
            //@ts-expect-error will
            columns={columns}
            data={paginatedData}
            isLoading={isLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={transactionData?.data?.total || 0}
            itemsPerPage={transactionData?.data?.limit || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Transactions;
