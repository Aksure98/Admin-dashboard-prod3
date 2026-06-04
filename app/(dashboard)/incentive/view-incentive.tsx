"use client";

import { Incentive } from "@/@types";
import { useGetSingleIncentive } from "@/hooks/incentive/getSingleIncentive";
import { useToggleIncentiveStatus } from "@/hooks/incentive/toggleStatusIncentive";
import { formatDate, formatPrice } from "@/utils/utils";
import { TrashIcon, XIcon } from "@phosphor-icons/react";

interface ViewIncentiveProps {
  isOpen: boolean;
  onClose: () => void;
  incentive: Incentive | null;
}

const ViewIncentive = ({ isOpen, onClose, incentive }: ViewIncentiveProps) => {
  const { data: incentiveDetails, isLoading } = useGetSingleIncentive(
    incentive?.id ?? "",
  );

  console.log(incentiveDetails);

  const incentiveData = incentiveDetails?.data;
  const toggleStatusMutation = useToggleIncentiveStatus();

  if (!isOpen) return null;

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end z-50 h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
        <div className="bg-grey-0 w-md px-6 py-6 shadow-2xl flex flex-col gap-6 rounded-lg max-h-[95vh]">
          {/* Header */}
          <div className="flex items-center justify-between flex-shrink-0">
            <div className="animate-pulse bg-grey-100 rounded-lg h-8 w-48" />
            <div onClick={onClose} className="cursor-pointer text-grey-800">
              <XIcon size={20} />
            </div>
          </div>

          {/* Content skeleton */}
          <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="animate-pulse bg-grey-100 rounded h-3 w-24" />
                <div className="animate-pulse bg-grey-100 rounded h-4 w-32" />
              </div>
            ))}
            <div className="animate-pulse bg-grey-100 rounded-lg h-10 w-32 mt-2" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end z-50 h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <div
        className={`bg-grey-0 w-md  px-6 py-6 shadow-2xl animate-slide-in flex flex-col gap-6 rounded-lg max-h-[95vh] `}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="text-3xl font-bold text-grey-900">
            {incentive?.name ?? "Incentive Details"}
          </h2>

          <div
            onClick={onClose}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>
        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Name</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {incentiveData?.name}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Status</p>
            <h3
              className={`px-3 py-1 text-xs leading-5 font-bold rounded-full w-fit
${
  incentiveData?.is_active === true
    ? "bg-success-50 text-success-600"
    : "bg-error-50 text-error-600"
}
`}
            >
              {incentiveData?.is_active ? "Active" : "Inactive"}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm"> Type</p>

            <h3
              className={`px-3 py-1 text-xs leading-5 font-bold rounded-full w-fit
           ${
             incentiveData?.discount_type === "PERCENTAGE"
               ? "bg-warning-50 text-warning-600"
               : "bg-brand-50 text-brand-600"
           }
           `}
            >
              {incentiveData?.discount_type}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm"> Amount</p>

            <h3 className="text-grey-600 font-bold text-sm">
              {formatPrice(incentiveData?.discount_value ?? 0)}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Start Date</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {formatDate(incentiveData?.starts_at ?? "N/A")}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">End Date</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {formatDate(incentiveData?.expires_at ?? "N/A")}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">User Type</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {incentiveData?.user_type}
            </h3>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-grey-600 font-normal text-sm">Condition</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {incentiveData?.condition}
            </h3>
          </div>

          <div className="flex justify-between items-center">
            <div
              onClick={() =>
                toggleStatusMutation.mutate({
                  id: incentive?.id ?? "",
                  value: { is_active: !incentive?.is_active },
                })
              }
              className={`flex items-center cursor-pointer gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                incentiveData?.is_active
                  ? "bg-error-100 text-error-800 hover:bg-error-200"
                  : "bg-success-100 text-success-800 hover:bg-success-200"
              }`}
            >
              <TrashIcon />
              {incentiveData?.is_active ? "Deactivate" : "Activate"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewIncentive;
