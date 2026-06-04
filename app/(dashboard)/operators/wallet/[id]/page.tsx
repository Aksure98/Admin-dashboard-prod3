"use client";

import { useMemo, useState } from "react";
import Button from "@/components/button";
import Table from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { formatPrice } from "@/utils/utils";
// import { defaultDriverBankAccounts, allDrivers } from "../../drivers-data";
import { useParams } from "next/navigation";
import CreditWallet from "./credit-wallet";
import DebitWallet from "./debit-wallet";
import { PlusIcon } from "@phosphor-icons/react";
import ExportModal from "@/components/exportModal";
import { useDriverWalletDetails } from "@/hooks/drivers/getDriverWalletDetails";
import { TransactionSingleItem } from "@/@types";
import Pagination from "@/components/pagination";

type WalletTab = "all" | "earnings" | "withdrawals" | "deductions";

type WalletTransactionStatus = "success" | "pending" | "failed";

const DriverWalletDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  // const driver = allDrivers.find((driver) => driver.id === driverId) ?? null;

  const [activeTab, setActiveTab] = useState<WalletTab>("all");
  const [isCreditWalletOpen, setIsCreditWalletOpen] = useState(false);
  const [isDebitWalletOpen, setIsDebitWalletOpen] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: transactionList, isLoading } = useDriverWalletDetails(id);
  const itemsPerPage = 20;

  const handleExport = async (format: string) => {
    // await exportMutation.mutateAsync(format); // ✅ pass format to mutation
  };

  const transactionColumns = [
    {
      header: "Transaction Id",
      accessor: "transaction_id" as keyof TransactionSingleItem,
    },
    {
      header: "Category",
      accessor: "category" as keyof TransactionSingleItem,
      render: (row: TransactionSingleItem) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.category === "CREDIT"
              ? "bg-success-100 text-success-600"
              : row.category === "DEBIT"
                ? "bg-error-100 text-error-600"
                : "bg-warning-50 text-warning-600"
          }`}
        >
          {row?.category}
        </p>
      ),
    },
    {
      header: "Description",
      accessor: "description" as keyof TransactionSingleItem,
    },
    {
      header: "Transaction Type",
      accessor: "transaction_type" as keyof TransactionSingleItem,
    },
    {
      header: "Amount",
      accessor: "amount" as keyof TransactionSingleItem,
      render: (row: TransactionSingleItem) => <p>{formatPrice(row?.amount)}</p>,
    },
    {
      header: "Previous Balance",
      accessor: "previous_balance" as keyof TransactionSingleItem,
      render: (row: TransactionSingleItem) => (
        <p>{formatPrice(row?.previous_balance)}</p>
      ),
    },
    {
      header: "New Balance",
      accessor: "new_balance" as keyof TransactionSingleItem,
      render: (row: TransactionSingleItem) => (
        <p>{formatPrice(row?.new_balance)}</p>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof TransactionSingleItem,
      render: (row: TransactionSingleItem) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "SUCCESS"
              ? "bg-success-100 text-success-600"
              : row.status === "FAILED"
                ? "bg-error-100 text-error-600"
                : "bg-warning-50 text-warning-600"
          }`}
        >
          {row?.status}
        </p>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (transactionList?.data?.total ?? 0) / (transactionList?.data?.limit ?? 20),
  );

  const paginatedData = transactionList?.data?.transactions || [];

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };

  const handleExportClose = () => {
    setOpenExportModal(false);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center">
          {/* <Avatar className="size-12">
            <AvatarImage src={driver.logo?.[0]?.url} alt={driver.name} />
            <AvatarFallback className="text-xl">
              {driver.name ? driver.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-grey-900">{driver.name}</h2>
            <p className="text-grey-600 font-normal">
              R-{driver.id} - {driver.email}
            </p>
          </div> */}
        </div>

        <div className="flex items-center gap-3">
          <Button
            hierarchy="secondary"
            size="lg"
            className="cursor-pointer"
            onClick={() => setIsDebitWalletOpen(true)}
          >
            Debit Wallet
          </Button>
          <Button
            size="lg"
            className="cursor-pointer"
            onClick={() => setIsCreditWalletOpen(true)}
          >
            Credit Wallet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Available Balance
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {/* {formatPrice(summary.availableBalance)} */}0
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Earnings
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {/* {formatPrice(summary.totalEarnings)} */}0
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Withdrawals
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {/* {formatPrice(summary.withdrawals)} */}0
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pending Debts
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {/* {formatPrice(summary.pendingDebts)} */}0
          </p>
        </div>
      </div>

      {/* <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">
            Linked Bank Accounts
          </h1>
        </div>
        <Table columns={bankColumns} data={defaultDriverBankAccounts} />
      </div> */}

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-grey-800 text-2xl font-bold">Transactions</h1>
          {/* <Button hierarchy="secondary" size="lg" className="cursor-pointer">
            + Export
          </Button> */}
          {/* <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button> */}
        </div>

        <div className="px-4 pb-4">
          <div className="bg-grey-50 rounded-2xl p-2 flex items-center gap-2 w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                activeTab === "all"
                  ? "bg-grey-0 text-brand-600"
                  : "text-grey-600"
              }`}
            >
              All Transactions
            </button>
            {/* <button
              type="button"
              onClick={() => setActiveTab("earnings")}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                activeTab === "earnings"
                  ? "bg-grey-0 text-brand-600"
                  : "text-grey-600"
              }`}
            >
              Earnings
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("withdrawals")}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                activeTab === "withdrawals"
                  ? "bg-grey-0 text-brand-600"
                  : "text-grey-600"
              }`}
            >
              Withdrawals
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("deductions")}
              className={`px-4 py-2 rounded-xl text-sm font-bold cursor-pointer ${
                activeTab === "deductions"
                  ? "bg-grey-0 text-brand-600"
                  : "text-grey-600"
              }`}
            >
              Deductions
            </button> */}
          </div>
        </div>

        <div className="">
          {activeTab === "all" && (
            <div>
              <Table
                columns={transactionColumns}
                //@ts-expect-error will work on it later
                data={paginatedData ?? []}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={transactionList?.data?.total ?? 0}
                itemsPerPage={itemsPerPage}
                onPageChange={isLoading ? () => {} : handlePageChange}
              />
            </div>
          )}
        </div>

        {/* <Table columns={transactionColumns} data={filteredTransactions} /> */}
      </div>

      <CreditWallet
        isOpen={isCreditWalletOpen}
        onClose={() => setIsCreditWalletOpen(false)}
        // driverName={driver?.name || "Driver"}
        driverId={id}
        // currentBalance={summary.availableBalance}
      />
      <DebitWallet
        isOpen={isDebitWalletOpen}
        onClose={() => setIsDebitWalletOpen(false)}
        // driverName={driver?.name || "Driver"}
        driverId={id}
        // currentBalance={summary.availableBalance}
      />
      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default DriverWalletDetailsPage;
