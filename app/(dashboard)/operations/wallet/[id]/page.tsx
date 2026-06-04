"use client";

import { useMemo, useState } from "react";
import Button from "@/components/button";
import Table from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { formatPrice } from "@/utils/utils";
import {
  defaultOperatorBankAccounts,
  allOperators,
} from "../../operators-data";
import { useParams } from "next/navigation";
import CreditWallet from "./credit-wallet";
import DebitWallet from "./debit-wallet";
import { PlusIcon } from "@phosphor-icons/react";
import ExportModal from "@/components/exportModal";

type WalletTab = "all" | "earnings" | "withdrawals" | "deductions";

type WalletTransactionStatus = "success" | "pending" | "failed";

interface WalletTransactionRow {
  id: string;
  type: string;
  amount: number;
  status: WalletTransactionStatus;
  date: string;
  balance: number;
}

const OperatorWalletDetailsPage = () => {
  const params = useParams<{ id: string }>();
  const operatorId = params?.id ?? "";
  const operator =
    allOperators.find((operator) => operator.id === operatorId) ?? null;

  const [activeTab, setActiveTab] = useState<WalletTab>("all");
  const [isCreditWalletOpen, setIsCreditWalletOpen] = useState(false);
  const [isDebitWalletOpen, setIsDebitWalletOpen] = useState(false);
  const [openExportModal, setOpenExportModal] = useState(false);

  const handleExport = async (format: string) => {
    // await exportMutation.mutateAsync(format); // ✅ pass format to mutation
  };

  const summary = useMemo(() => {
    const totalEarnings = operator?.totalEarnings ?? 800000;
    const availableBalance = Math.max(0, Math.round(totalEarnings * 0.25));
    const withdrawals = Math.round(totalEarnings * 0.18);
    const pendingDebts = Math.round(totalEarnings * 0.01);

    return {
      availableBalance,
      totalEarnings,
      withdrawals,
      pendingDebts,
    };
  }, [operator?.totalEarnings]);

  const allTransactions: WalletTransactionRow[] = useMemo(() => {
    const baseBalance = summary.availableBalance;
    return [
      {
        id: "TXN-001",
        type: "Delivery Fare",
        amount: 4000,
        status: "success",
        date: "15 May 2020, 10:30am",
        balance: baseBalance,
      },
      {
        id: "TXN-002",
        type: "Commission Deduction",
        amount: 5000,
        status: "success",
        date: "15 May 2020, 10:30am",
        balance: baseBalance,
      },
      {
        id: "TXN-003",
        type: "Delivery Fare",
        amount: 2500,
        status: "success",
        date: "15 May 2020, 10:30am",
        balance: baseBalance,
      },
      {
        id: "TXN-004",
        type: "Withdrawal",
        amount: 12000,
        status: "pending",
        date: "16 May 2020, 09:10am",
        balance: baseBalance,
      },
    ];
  }, [summary.availableBalance]);

  const filteredTransactions = useMemo(() => {
    if (activeTab === "all") return allTransactions;
    if (activeTab === "earnings")
      return allTransactions.filter((t) =>
        t.type.toLowerCase().includes("fare"),
      );
    if (activeTab === "withdrawals")
      return allTransactions.filter((t) =>
        t.type.toLowerCase().includes("withdraw"),
      );
    return allTransactions.filter((t) =>
      t.type.toLowerCase().includes("deduction"),
    );
  }, [activeTab, allTransactions]);

  const bankColumns = useMemo(
    () => [
      {
        header: "Bank Name",
        sortable: false,
        accessor: "bankName" as const,
      },
      {
        header: "Account number",
        sortable: false,
        accessor: "accountNumber" as const,
      },
    ],
    [],
  );

  const transactionColumns = useMemo(
    () => [
      {
        header: "Transaction ID",
        accessor: "id" as const,
      },
      {
        header: "Type",
        accessor: "type" as const,
      },
      {
        header: "Amount",
        accessor: "amount" as const,
        render: (row: WalletTransactionRow) => {
          const isDeduction = row.type.toLowerCase().includes("deduction");
          const isWithdrawal = row.type.toLowerCase().includes("withdraw");
          const isNegative = isDeduction || isWithdrawal;
          return (
            <p className={isNegative ? "text-error-600" : "text-success-600"}>
              {isNegative ? "-" : "+"}
              {formatPrice(row.amount)}
            </p>
          );
        },
      },
      {
        header: "Status",
        accessor: "status" as const,
        render: (row: WalletTransactionRow) => (
          <p
            className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
              row.status === "success"
                ? "bg-success-100 text-success-600"
                : row.status === "pending"
                  ? "bg-warning-50 text-warning-600"
                  : "bg-error-100 text-error-600"
            }`}
          >
            {row.status}
          </p>
        ),
      },
      {
        header: "Date",
        accessor: "date" as const,
      },
      {
        header: "Balance",
        accessor: "balance" as const,
        render: (row: WalletTransactionRow) => (
          <p>{formatPrice(row.balance)}</p>
        ),
      },
      {
        header: "Actions",
        accessor: "id" as const,
        sortable: false,
        render: () => <p className="text-brand-600 text-sm font-bold">View</p>,
      },
    ],
    [],
  );

  if (!operator) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-grey-600">Operator not found</p>
      </div>
    );
  }
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
          <Avatar className="size-12">
            <AvatarImage src={operator.logo?.[0]?.url} alt={operator.name} />
            <AvatarFallback className="text-xl">
              {operator.name ? operator.name.charAt(0).toUpperCase() : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-grey-900">
              {operator.name}
            </h2>
            <p className="text-grey-600 font-normal">
              R-{operator.id} - {operator.email}
            </p>
          </div>
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
            {formatPrice(summary.availableBalance)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Earnings
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(summary.totalEarnings)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Withdrawals
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(summary.withdrawals)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pending Debts
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(summary.pendingDebts)}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">
            Linked Bank Accounts
          </h1>
        </div>
        <Table columns={bankColumns} data={defaultOperatorBankAccounts} />
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-grey-800 text-2xl font-bold">Transactions</h1>
          {/* <Button hierarchy="secondary" size="lg" className="cursor-pointer">
            + Export
          </Button> */}
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
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
            <button
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
            </button>
          </div>
        </div>

        <Table columns={transactionColumns} data={filteredTransactions} />
      </div>

      <CreditWallet
        isOpen={isCreditWalletOpen}
        onClose={() => setIsCreditWalletOpen(false)}
        operatorName={operator?.name || "Operator"}
        operatorId={operatorId}
        currentBalance={summary.availableBalance}
      />
      <DebitWallet
        isOpen={isDebitWalletOpen}
        onClose={() => setIsDebitWalletOpen(false)}
        operatorName={operator?.name || "Operator"}
        operatorId={operatorId}
        currentBalance={summary.availableBalance}
      />
      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default OperatorWalletDetailsPage;
