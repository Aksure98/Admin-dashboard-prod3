"use client";

import { Coupon } from "@/@types";
import { useGetSingleCoupon } from "@/hooks/coupons/getSingleCoupon";
import { useToggleStatus } from "@/hooks/coupons/toggleStatusCoupon";
import { formatDate, formatPrice } from "@/utils/utils";
import { TrashIcon, XIcon } from "@phosphor-icons/react";

interface ViewCouponProps {
  isOpen: boolean;
  onClose: () => void;
  coupon: Coupon | null;
}

const ViewCoupon = ({ isOpen, onClose, coupon }: ViewCouponProps) => {
  const { data: couponDetails, isLoading } = useGetSingleCoupon(
    coupon?.id ?? "",
  );
  const couponData = couponDetails?.data;

  const toggleStatusMutation = useToggleStatus();
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
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="grid grid-cols-2 gap-y-4">
                {[0, 1].map((j) => (
                  <div key={j} className="flex flex-col gap-2">
                    <div className="animate-pulse bg-grey-100 rounded h-3 w-24" />
                    <div className="animate-pulse bg-grey-100 rounded h-4 w-32" />
                  </div>
                ))}
              </div>
            ))}
          </div>

          {/* Footer skeleton */}
          <div className="animate-pulse bg-grey-100 rounded-lg h-10 w-32" />
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
            {coupon?.name ?? "Coupon Details"}
          </h2>

          <div
            onClick={onClose}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>

        <div className="flex flex-col gap-6 flex-1 bg-grey-50 rounded-lg px-5 py-3">
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">Coupon Code</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.code ?? "N/A"}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">Cities</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.city ?? "N/A"}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">Service</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.applicable_services ?? "N/A"}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">Category</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.applicable_tiers ?? "N/A"}
              </h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">Coupon Type</p>

              <h3
                className={`px-3 py-1 text-xs leading-5 font-bold rounded-full w-fit
${
  couponData?.discount_type === "PERCENTAGE"
    ? "bg-warning-50 text-warning-600"
    : "bg-brand-50 text-brand-600"
}
`}
              >
                {couponData?.discount_type}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">Amount</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatPrice(couponData?.max_discount_amount ?? 0)}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">Start Date</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatDate(couponData?.starts_at ?? "N/A")}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">Expires at</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {formatDate(couponData?.expires_at ?? "N/A")}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">
                Usage Per Coupon
              </p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.max_usage_total ?? "N/A"}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">
                Usage Per User
              </p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.max_usage_per_user ?? "N/A"}
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-y-4 text-sm">
            <div>
              <p className="text-grey-600 font-normal text-sm">User Type</p>
              <h3 className="text-grey-600 font-bold text-sm">
                {couponData?.user_type ?? "N/A"}
              </h3>
            </div>
            <div>
              <p className="text-grey-600 font-normal text-sm">Status</p>
              <h3
                className={`px-3 py-1 text-xs leading-5 font-bold rounded-full w-fit
${
  couponData?.is_active === true
    ? "bg-success-50 text-success-600"
    : "bg-error-50 text-error-600"
}
`}
              >
                {couponData?.is_active ? "Active" : "Inactive"}
              </h3>
            </div>
          </div>

          <div>
            <p className="text-grey-600 font-normal text-sm">Description</p>
            <h3 className="text-grey-600 font-bold text-sm">
              {couponData?.description ?? "N/A"}
            </h3>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <div
            onClick={() =>
              toggleStatusMutation.mutate({
                id: coupon?.id ?? "",
                value: { is_active: !couponData?.is_active },
              })
            }
            className={`flex items-center cursor-pointer gap-4 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
              couponData?.is_active
                ? "bg-error-100 text-error-800 hover:bg-error-200"
                : "bg-success-100 text-success-800 hover:bg-success-200"
            }`}
          >
            <TrashIcon />
            {couponData?.is_active ? "Deactivate" : "Activate"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCoupon;
