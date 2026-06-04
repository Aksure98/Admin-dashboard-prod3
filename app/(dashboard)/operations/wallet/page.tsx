"use client";

import { useState } from "react";
import {
  MagnifyingGlassIcon,
  CalendarIcon,
  MoneyIcon,
} from "@phosphor-icons/react";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useTowWallet } from "@/hooks/tow/getTowWallet";
import { WalletItem } from "@/@types";
import Link from "next/link";
import { useExportTowWallet } from "@/hooks/tow/exportTowWallet";
import ExportModal from "@/components/exportModal";

const TowWallet = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(4);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [openExportModal, setOpenExportModal] = useState(false);

  const exportMutation = useExportTowWallet();

  const { data: walletData, isLoading } = useTowWallet();
  const walletDetails = walletData?.data;
  const wallets = (walletData?.data?.wallets ?? []).map((item) => ({
    ...item,
    id: item.wallet_id,
  }));
  const totalPages = Math.ceil((walletData?.data?.total ?? 0) / itemsPerPage);

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync(format);
  };

  const columns = [
    {
      header: "Id",
      accessor: "user_id" as keyof WalletItem,
    },
    {
      header: "Operator Name",
      accessor: "operator_name" as keyof WalletItem,
    },
    {
      header: "Total Earning",
      accessor: "total_earning" as keyof WalletItem,
    },
    {
      header: "Balance",
      accessor: "balance" as keyof WalletItem,
    },
    {
      header: "Pending",
      accessor: "pending" as keyof WalletItem,
    },
    {
      header: "Status",
      accessor: "status" as keyof WalletItem,
    },
    {
      header: "Last Transaction",
      accessor: "last_transaction" as keyof WalletItem,
    },

    {
      header: "Actions",
      accessor: "id",
      sortable: false,

      render: (row: WalletItem) => (
        <Link
          href={`/operators/wallet/${row?.wallet_id}`}
          className="text-brand-600 text-sm font-bold"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Tow Operators Wallet Management
          </h1>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <Button
            hierarchy="secondary"
            size="lg"
            className="cursor-pointer"
            leftIcon={<MoneyIcon size={16} />}
            onClick={handleExportOpen}
          >
            Export Report
          </Button>
          <Button size="lg" className="cursor-pointer">
            Generate Statement
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <p className="text-grey-600 text-sm font-bold">Overview</p>
        <div className="flex items-center gap-2 border border-grey-400 bg-grey-0 rounded-xl px-3 py-2 text-sm">
          <CalendarIcon size={20} className="text-grey-600" />
          <select className="border-none bg-transparent text-grey-800 focus:outline-none cursor-pointer">
            <option value="all">All time</option>
            <option value="month">This month</option>
            <option value="week">This week</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Wallet Balance
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {walletDetails?.total_balance}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pending Settlements
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {walletDetails?.pending ?? 0}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Withdrawals
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {walletDetails?.withdraws ?? 0}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Transactions</h1>
        </div>

        <div className="p-4 border-t border-gray-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-3 flex-wrap">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <select className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm cursor-pointer">
              <option value="all">All Operators</option>
              <option value="active">Active Operators</option>
              <option value="inactive">Inactive Operators</option>
            </select>

            <select className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm cursor-pointer">
              <option value="all">All Regions</option>
              <option value="lagos">Lagos</option>
              <option value="abuja">Abuja</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              inputType="iconLeading"
              icon={<MagnifyingGlassIcon size={20} color="#667085" />}
              name="search"
              placeholder="Search"
              size="md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Button hierarchy="secondary" size="xl" className="cursor-default">
              Search
            </Button>
          </div>
        </div>

        <Table
          // @ts-expect-error same as riders
          columns={columns}
          data={wallets}
          isLoading={isLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={walletData?.data?.wallets.length ?? 0}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default TowWallet;
