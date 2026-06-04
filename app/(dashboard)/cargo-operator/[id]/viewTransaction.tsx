import { OperatorTransaction } from "@/@types";
import Button from "@/components/button";
import { formatPrice } from "@/utils/utils";
import {
  CopyIcon,
  EyeIcon,
  FloppyDiskIcon,
  XIcon,
} from "@phosphor-icons/react";
import Link from "next/link";

interface ViewOperatorTransactionProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: OperatorTransaction;
}

const ViewOperatorTransaction = ({
  isOpen,
  onClose,
  transaction,
}: ViewOperatorTransactionProps) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end z-50">
      <div className="bg-grey-0 w-full max-w-2xl px-6 py-6 shadow-2xl animate-slide-in flex flex-col gap-6 rounded-lg overflow-x-hidden overflow-y-scroll h-screen scrollbar-hide">
        <div className="flex justify-between">
          <div>
            <h2 className="text-3xl font-bold text-grey-900">ERN-2025-0453</h2>
            <p className="text-grey-600 font-normal">
              Date Completed : 15 May 2020 9:30 am
            </p>
            <div className="bg-success-100 text-success-600 rounded-2xl w-fit px-5 py-1">
              Completed
            </div>
          </div>
          <div
            onClick={onClose}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="text-neutral-950 font-bold">Summary</h1>

          <div className="bg-grey-50 rounded-2xl py-3 px-5 flex flex-col gap-3 ">
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Transaction ID</p>

              <div className="flex gap-1 items-center">
                <p className="text-grey-600 font-normal">TXN-2025-0453</p>
                <CopyIcon size={24} color="#D0D5DD" />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Type</p>

              <p className="text-grey-600 font-normal">Trip Earnings</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Amount</p>

              <p className=" text-success-600 font-bold">{formatPrice(4600)}</p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="text-neutral-950 font-bold">Trip Information</h1>

          <div className="bg-grey-50 rounded-2xl py-3 px-5 flex flex-col gap-3 ">
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Trip ID</p>

              <div className="flex gap-1 items-center">
                <p className="text-grey-600 font-normal">TRP-2025-0453t</p>
                <CopyIcon size={24} color="#0077B6" />
              </div>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Service</p>

              <p className="text-grey-600 font-normal">Delivery</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Pickup </p>

              <p className="text-grey-600 font-normal">Glover Rd, Ikoyi</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Drop Off </p>

              <p className="text-grey-600 font-normal">Lekki Phase 1</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">
                Distance / Duration
              </p>

              <p className="text-grey-600 font-normal">7.2 km / 15 mins</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Operator</p>

              <div className="flex gap-1 items-center">
                <p className="text-grey-600 font-normal">Alex Johnson</p>
                <Link href={`/operators/${transaction?.id}`}>
                  <EyeIcon size={24} color="#0077B6" />
                </Link>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Customer</p>

              <div className="flex gap-1 items-center">
                <p className="text-grey-600 font-normal">John Doe</p>
              </div>
            </div>

            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Notes</p>

              <p className="text-grey-600 font-normal">
                Handle with care — fragile item
              </p>
            </div>
          </div>
        </div>
        <div className="flex gap-2 flex-col">
          <h1 className="text-neutral-950 font-bold">Earnings Breakdown</h1>

          <div className="bg-grey-50 rounded-2xl py-3 px-5 flex flex-col gap-3 ">
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Total Trip Fare</p>

              <p className="text-grey-600 font-normal">{formatPrice(6000)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">
                Platform Commission
              </p>

              <p className="text-error-600 font-normal">
                - {formatPrice(1000)}
              </p>
            </div>
            <div className="flex justify-between">
              <p className="text-grey-600 font-bold text-sm">Taxes & Fees</p>

              <p className="text-error-600 font-normal">- {formatPrice(400)}</p>
            </div>
            <div className="border-t border-grey-200 pt-3 mt-2">
              <div className="flex justify-between">
                <p className="text-grey-900 font-bold text-sm">Your Earnings</p>

                <p className="text-success-600 font-bold">
                  {formatPrice(4600)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Button
            className="cursor-pointer w-full"
            hierarchy="secondary"
            size="lg"
            leftIcon={<FloppyDiskIcon size={24} />}
          >
            View Receipt
          </Button>
          <Button
            className="cursor-pointer w-full"
            size="lg"
            leftIcon={<FloppyDiskIcon size={24} />}
          >
            Request Payout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewOperatorTransaction;
