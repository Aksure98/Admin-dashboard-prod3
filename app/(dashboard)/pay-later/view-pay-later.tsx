"use client";

import Button from "@/components/button";
import { useGetSinglePayLater } from "@/hooks/pay-later/getSinglePayLater";
import { formatPrice } from "@/utils/utils";
import {
  CheckIcon,
  DownloadIcon,
  FloppyDiskIcon,
  XIcon,
} from "@phosphor-icons/react";

interface ViewPayLaterProps {
  isOpen: boolean;
  onClose: () => void;
  payLaterId: string | null;
}

const PayLaterDetails = ({
  isOpen,
  onClose,
  payLaterId,
}: ViewPayLaterProps) => {
  const { data: payLaterDetails, isLoading } = useGetSinglePayLater(
    payLaterId ?? "",
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
              {payLaterId ?? "Incentive Details"}
            </h2>
            <p>{payLaterDetails?.created_at}</p>
            <p>{payLaterDetails?.status}</p>
          </div>

          <div
            onClick={onClose}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-neutral-900 text-sm">
          Payment & Settlement Info
        </h2>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Payment Method</p>
            <h3 className="text-grey-600  text-sm">
              {payLaterDetails?.payment_method}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Reference ID</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.tripId}</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Amount</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.amount}</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Due Date</p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.created_at}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Pay Later Status</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.status}</h3>
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-neutral-900 text-sm">Settlement Info</h2>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Payment Method</p>
            <h3 className="text-grey-600  text-sm">
              {payLaterDetails?.payment_method}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">
              payLaterDetails ID
            </p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.payLaterDetailsId}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Amount</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.amount}</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Payment Date</p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.payment_date}
            </h3>
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-neutral-900 text-sm">
          Customer Information{" "}
        </h2>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Customer Name</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {payLaterDetails?.name}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">KYc Level</p>
            <h3 className="text-error-800 text-sm">
              {payLaterDetails?.kyc_level}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">
              Outstanding Pay Later Balance
            </p>
            <h3 className="text-success-800 text-sm">
              {formatPrice(payLaterDetails?.outstanding_balance ?? 0)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Pay Later Limit</p>
            <h3 className="text-success-800 text-sm">
              {formatPrice(payLaterDetails?.pay_later_limit ?? 0)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">
              Number of Active Pay Later Trips
            </p>
            <h3 className="text-error-800 text-sm">
              {payLaterDetails?.active_trips_count}
            </h3>
          </div>
        </div>
      </div>
      <div>
        <h2 className="font-bold text-neutral-900 text-sm">Fare Breakdown </h2>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Base Fare</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {formatPrice(payLaterDetails?.base_fare)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">
              Discount / Promo
            </p>
            <h3 className="text-error-800 text-sm">
              -{formatPrice(payLaterDetails?.discount)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Pay Later Fee</p>
            <h3 className="text-success-800 text-sm">
              +{formatPrice(payLaterDetails?.pay_later_fee)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Service Charge</p>
            <h3 className="text-success-800 text-sm">
              +{formatPrice(payLaterDetails?.service_charge)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Refund</p>
            <h3 className="text-error-800 text-sm">
              +{formatPrice(payLaterDetails?.refund)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Total</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {formatPrice(payLaterDetails?.total)}
            </h3>
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-bold text-neutral-900 text-sm">Trip Information</h2>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Trip ID</p>
            <h3 className="text-grey-600  text-sm">
              {payLaterDetails?.trip_id}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Service</p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.service}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Pick up</p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.pick_up}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Drop off</p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.drop_off}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">
              Distance / Duration
            </p>
            <h3 className="text-grey-600 text-sm">
              {payLaterDetails?.distance} / {payLaterDetails?.duration}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Driver</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.driver}</h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-bold text-sm">Note</p>
            <h3 className="text-grey-600 text-sm">{payLaterDetails?.note}</h3>
          </div>
        </div>
      </div>

      <Button
        hierarchy="secondary"
        leftIcon={<FloppyDiskIcon size={16} />}
        className="cursor-pointer"
      >
        Send Reminder
      </Button>

      <Button
        hierarchy="primary"
        leftIcon={<CheckIcon size={16} />}
        className="cursor-pointer"
      >
        Mark as Paid
      </Button>
      <Button
        hierarchy="tertiary"
        leftIcon={<XIcon size={16} />}
        className="cursor-pointer"
      >
        Mark as Paid
      </Button>
      <Button
        hierarchy="primary"
        leftIcon={<DownloadIcon size={16} />}
        className="cursor-pointer"
      >
        Download Receipt
      </Button>
    </div>
  );
};

export default PayLaterDetails;
