"use client";

import { useMemo, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import Button from "@/components/button";
import Table from "@/components/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { formatPrice } from "@/utils/utils";
import { defaultOperatorBankAccounts, type Operator } from "../operators-data";

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

interface OperatorsWalletDetailsProps {
  isOpen: boolean;
  onClose: () => void;
  operator: Operator;
}

const OperatorsWalletDetails = ({
  isOpen,
  onClose,
  operator,
}: OperatorsWalletDetailsProps) => {
  const [activeTab, setActiveTab] = useState<WalletTab>("all");

  const summary = useMemo(() => {
    const totalEarnings = operator.totalEarnings ?? 800000;
    const availableBalance = Math.max(0, Math.round(totalEarnings * 0.25));
    const withdrawals = Math.round(totalEarnings * 0.18);
    const pendingDebts = Math.round(totalEarnings * 0.01);

    return {
      availableBalance,
      totalEarnings,
      withdrawals,
      pendingDebts,
    };
  }, [operator.totalEarnings]);

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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end z-50">
      <div className="bg-grey-0 w-full max-w-5xl px-6 py-6 shadow-2xl animate-slide-in flex flex-col gap-6 rounded-lg overflow-x-hidden overflow-y-scroll h-screen scrollbar-hide">
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
            <Button hierarchy="secondary" size="lg" className="cursor-pointer">
              Debit Wallet
            </Button>
            <Button size="lg" className="cursor-pointer">
              Credit Wallet
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
            >
              <XIcon size={20} />
            </button>
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
            <Button hierarchy="secondary" size="lg" className="cursor-pointer">
              + Export
            </Button>
          </div>

          <div className="px-4 pb-4">
            <div className="bg-grey-50 rounded-2xl p-2 flex items-center gap-2 w-fit">
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
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
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
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
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
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
                className={`px-4 py-2 rounded-xl text-sm font-bold ${
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

        <style jsx>{`
          @keyframes slide-in {
            from {
              transform: translateX(100%);
            }
            to {
              transform: translateX(0);
            }
          }

          .animate-slide-in {
            animation: slide-in 0.3s ease-out;
          }
        `}</style>
      </div>
    </div>
  );
};

export default OperatorsWalletDetails;
