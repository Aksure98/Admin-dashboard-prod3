import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useState } from "react";
import ViewTransaction from "./viewTransaction";
import { formatDate, formatPrice } from "@/utils/utils";
import {
  useGetCustomerPaymentDetails,
  useGetCustomerWallet,
} from "@/hooks/customer/customerPayment";
import { CustomerPaymentMethod, CustomerTransaction } from "@/@types";

interface PaymentProps {
  allCard: CustomerPaymentMethod[];
  id: string;
}

const PaymentDetails: React.FC<PaymentProps> = ({ allCard, id }) => {
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [openTransaction, setOpenTransaction] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<CustomerTransaction | null>(null);

  const { data: customerTransactions, isLoading } =
    useGetCustomerPaymentDetails(id);
  const { data: customerWallet } = useGetCustomerWallet(id);

  const customerTransactionDetails = customerTransactions?.data;

  console.log(customerTransactionDetails, "transaction DETAILS");

  const totalPages = Math.ceil(
    (customerTransactionDetails?.total ?? 0) /
      (customerTransactionDetails?.limit ?? 0),
  );

  const paginatedData = customerTransactionDetails?.transactions || [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleViewTransaction = (transaction: CustomerTransaction) => {
    setSelectedTransaction(transaction);
    setOpenTransaction(true);
  };
  const handleCloseTransaction = () => {
    setSelectedTransaction(null);
    setOpenTransaction(false);
  };

  const columns = [
    {
      header: "Id",
      accessor: "transaction_id" as keyof CustomerTransaction,
    },
    {
      header: "Category",
      accessor: "category" as keyof CustomerTransaction,
    },
    {
      header: "Description",
      accessor: "description" as keyof CustomerTransaction,
    },
    {
      header: "Previous Balance",
      accessor: "previous_balance" as keyof CustomerTransaction,
      render: (row: CustomerTransaction) => (
        //@ts-expect-error will work on it later
        <p>{formatPrice(row?.previous_balance ?? 0)}</p>
      ),
    },
    {
      header: "Amount",
      accessor: "amount" as keyof CustomerTransaction,
      render: (row: CustomerTransaction) => (
        <p>{formatPrice(row?.amount ?? 0)}</p>
      ),
    },
    {
      header: "New Balance",
      accessor: "new_balance" as keyof CustomerTransaction,
      render: (row: CustomerTransaction) => (
        //@ts-expect-error will work on it later
        <p>{formatPrice(row?.new_balance ?? 0)}</p>
      ),
    },
    {
      header: "Payment Method",
      accessor: "transaction_type" as keyof CustomerTransaction,
    },
    {
      header: "Status",
      accessor: "status" as keyof CustomerTransaction,
      render: (row: CustomerTransaction) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
            row?.status === "SUCCESS"
              ? "bg-success-100 text-success-600"
              : row?.status === "PENDING"
                ? "bg-warning-50 text-warning-600"
                : "bg-error-100 text-error-600"
          }`}
        >
          {row?.status}
        </p>
      ),
    },
    {
      header: "Date",
      accessor: "created_at" as keyof CustomerTransaction,
      render: (row: CustomerTransaction) => (
        <p>{formatDate(row?.created_at ?? 0)}</p>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof CustomerTransaction,
      sortable: false,
      render: (row: CustomerTransaction) => (
        <div
          className="text-brand-600 text-sm font-bold cursor-pointer"
          onClick={() => handleViewTransaction(row)}
        >
          View
        </div>
      ),
    },
  ];

  const column = [
    {
      header: "Method",
      sortable: false,
      accessor: "method" as keyof CustomerPaymentMethod,
    },
    {
      header: "Details",
      sortable: false,
      accessor: "details" as keyof CustomerPaymentMethod,
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Spend
          </h3>

          <p className="text-grey-800 text-4xl font-bold">
            {customerWallet?.data?.total || "0"}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Pay Later Limit
          </h3>

          <p className="text-grey-800 text-4xl font-bold">
            {customerWallet?.data?.pay_later_limit || "0"}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Outstanding Pay Later Balance
          </h3>

          <p className="text-grey-800 text-4xl font-bold">
            {customerWallet?.data?.outstanding_balance || "0"}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Transactions</h1>
        </div>

        <Table
          //@ts-expect-error will work on it later
          columns={columns}
          //@ts-expect-error will work on it later
          data={paginatedData}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={customerTransactionDetails?.total || 0}
          itemsPerPage={customerTransactionDetails?.limit || 20}
          onPageChange={isLoading ? () => {} : handlePageChange}
        />
      </div>
      {/* <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">
            Linked Payment Methods
          </h1>
        </div>

        <Table columns={column} data={allCard} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={allCard.length}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
        />
      </div> */}
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

export default PaymentDetails;
