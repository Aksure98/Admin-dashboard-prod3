import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useState } from "react";
import ViewTransaction from "./viewTransaction";
import { formatPrice } from "@/utils/utils";
import {
  DriverPaymentMethod,
  DriverTransaction,
  EarningItem,
} from "@/@types";
import { useGetTowEarning } from "@/hooks/tow/getEarning";
import { useGetTowEarningList } from "@/hooks/tow/earningList";

interface EarningProps {
  id: string;
}

const TowEarnings: React.FC<EarningProps> = ({ id }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: earningData } = useGetTowEarning(id);
  const { data: earningList, isLoading: earningLoading } =
    useGetTowEarningList(id, {
      page: currentPage,
      limit: itemsPerPage,
    });

  const totalPages = Math.ceil(
    (earningList?.data?.total ?? 0) / (earningList?.data?.limit ?? 20),
  );

  const paginatedData = earningList?.data?.earnings || [];

  const [openTransaction, setOpenTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<DriverTransaction | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleCloseTransaction = () => {
    setSelectedTransaction(null);
    setOpenTransaction(false);
  };

  const columns = [
    {
      header: "Id",
      accessor: "id" as keyof EarningItem,
    },
    {
      header: "Type",
      accessor: "source" as keyof EarningItem,
    },
    {
      header: "Amount",
      accessor: "amount" as keyof EarningItem,
      render: (row: EarningItem) => <p>{formatPrice(row?.amount)}</p>,
    },
    {
      header: "Date",
      accessor: "created_at" as keyof EarningItem,
    },
  ];

  const column = [
    {
      header: "Bank Name",
      sortable: false,
      accessor: "bankName" as keyof DriverPaymentMethod,
    },
    {
      header: "Account number",
      sortable: false,
      accessor: "accountNumber" as keyof DriverPaymentMethod,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Earnings
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(earningData?.data?.total_earning ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Withdrawn Amount
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(earningData?.data?.withdraw_amount ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Available Balance
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatPrice(earningData?.data?.balance ?? 0)}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Transactions</h1>
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="border border-grey-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <button className="bg-brand-600 hover:bg-brand-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-colors">
              Search
            </button>
          </div>
        </div>

        <Table
          columns={columns}
          data={paginatedData}
          isLoading={earningLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={earningList?.data?.total ?? 0}
          itemsPerPage={earningList?.data?.limit || 20}
          onPageChange={earningLoading ? () => {} : handlePageChange}
        />
      </div>
      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">
            Linked Bank Accounts
          </h1>
        </div>
      </div>
      {openTransaction && selectedTransaction && (
        <ViewTransaction
          isOpen={openTransaction}
          onClose={handleCloseTransaction}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default TowEarnings;
