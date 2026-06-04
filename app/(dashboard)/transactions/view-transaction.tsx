"use client";

import Button from "@/components/button";
import { useGetSingleTransaction } from "@/hooks/transaction/singleTransaction";
import { formatPrice } from "@/utils/utils";
import { DownloadIcon, WarningIcon, XIcon } from "@phosphor-icons/react";

interface ViewTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transactionId: string | null;
}

const ViewTransaction = ({
  isOpen,
  onClose,
  transactionId,
}: ViewTransactionProps) => {
  const { data: transaction, isLoading } = useGetSingleTransaction(
    transactionId ?? "",
  );

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end z-50 h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <div
        className={`bg-grey-0 w-md  px-6 py-6 shadow-2xl animate-slide-in flex flex-col gap-6 rounded-lg max-h-[95vh] `}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <div>
            <h2 className="text-3xl font-bold text-grey-900">
              {transactionId ?? "Incentive Details"}
            </h2>
            <p>{transaction?.created_at}</p>
            <p>{transaction?.status}</p>
          </div>

          <div
            onClick={onClose}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>

        <div>
          <h2 className="font-bold text-neutral-900 text-sm">Summary </h2>

          <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">
                Transaction ID
              </p>
              <h3 className="text-grey-600 font-bold text-sm">
                {transaction?.id}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">
                Transaction Type
              </p>
              <h3 className="text-grey-600 font-bold text-sm">
                {transaction?.type}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Customer Name</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {transaction?.customer_name}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Status</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {transaction?.status}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Amount</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatPrice(transaction?.amount)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">
                Payment Method
              </p>
              <h3 className="text-grey-600 font-bold text-sm">
                {transaction?.payment_method}
              </h3>
            </div>
          </div>
        </div>
        <div>
          <h2 className="font-bold text-neutral-900 text-sm">
            Fare Breakdown{" "}
          </h2>

          <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Base Fare</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatPrice(transaction?.base_fare)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">
                Discount / Promo
              </p>
              <h3 className="text-error-800 text-sm">
                -{formatPrice(transaction?.discount)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Pay Later Fee</p>
              <h3 className="text-success-800 text-sm">
                +{formatPrice(transaction?.pay_later_fee)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">
                Service Charge
              </p>
              <h3 className="text-success-800 text-sm">
                +{formatPrice(transaction?.service_charge)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Refund</p>
              <h3 className="text-error-800 text-sm">
                +{formatPrice(transaction?.refund)}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Total</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatPrice(transaction?.total)}
              </h3>
            </div>
          </div>
        </div>

        <div>
          <h2 className="font-bold text-neutral-900 text-sm">
            Trip Information
          </h2>

          <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-normal text-sm">Trip ID</p>
              <h3 className="text-grey-600  text-sm">{transaction?.trip_id}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">Service</p>
              <h3 className="text-grey-600 text-sm">{transaction?.service}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">Pick up</p>
              <h3 className="text-grey-600 text-sm">{transaction?.pick_up}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">Drop off</p>
              <h3 className="text-grey-600 text-sm">{transaction?.drop_off}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">
                Distance / Duration
              </p>
              <h3 className="text-grey-600 text-sm">
                {transaction?.distance} / {transaction?.duration}
              </h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">Driver</p>
              <h3 className="text-grey-600 text-sm">{transaction?.driver}</h3>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-grey-600 font-bold text-sm">Note</p>
              <h3 className="text-grey-600 text-sm">{transaction?.note}</h3>
            </div>

            <Button
              hierarchy="primary"
              leftIcon={<DownloadIcon size={16} />}
              className="cursor-pointer"
            >
              Download Receipt
            </Button>

            <Button
              hierarchy="secondary"
              leftIcon={<WarningIcon size={16} />}
              className="cursor-pointer"
            >
              Query Transaction
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransaction;
