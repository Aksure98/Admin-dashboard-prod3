"use client";

import { useGetCustomerKyc } from "@/hooks/customer/customerKYC";
import { CheckCircleIcon, XCircleIcon } from "@phosphor-icons/react";

interface KYCProps {
  id: string;
}

interface VerificationItemProps {
  label: string;
  verified: boolean;
}

const VerificationItem: React.FC<VerificationItemProps> = ({
  label,
  verified,
}) => (
  <div className="flex items-center justify-between p-4 bg-grey border border-grey-200 rounded-lg w-full">
    <p className="text-grey-600 font-bold text-sm">{label}</p>
    <div
      className={`w-6 h-6 rounded-full flex items-center justify-center ${
        verified ? "text-success-600" : "text-grey-400"
      }`}
    >
      {verified ? <CheckCircleIcon size={24} /> : <XCircleIcon size={24} />}
    </div>
  </div>
);

const KYC: React.FC<KYCProps> = ({ id }) => {
  const { data: customerKYC } = useGetCustomerKyc(id);
  const kyc = customerKYC?.data;

  const verifications = {
    //@ts-expect-error will work on it
    email: kyc?.email_verified ?? false,
    //@ts-expect-error will work on it
    phone: kyc?.phone_verified ?? false,
    nin: kyc?.nin_verified ?? false,
    bvn: kyc?.bvn_verified ?? false,
  };

  const completedCount = Object.values(verifications).filter(Boolean).length;
  const totalCount = Object.keys(verifications).length;
  const progressPercentage = (completedCount / totalCount) * 100;

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-white rounded-xl p-6 border border-grey-200">
        {/* KYC Level & Status */}
        <div className="flex items-center gap-3 mb-6">
          <span className="bg-brand-50 text-brand-600 text-xs font-bold px-3 py-1 rounded-full">
            {kyc?.kyc_level ?? "BASIC"}
          </span>
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              kyc?.kyc_status === "VERIFIED"
                ? "bg-success-100 text-success-600"
                : kyc?.kyc_status === "PENDING"
                  ? "bg-warning-100 text-warning-600"
                  : "bg-error-100 text-error-600"
            }`}
          >
            {kyc?.kyc_status ?? "PENDING"}
          </span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-grey-800">
            Verification Progress
          </h2>
          <span className="text-base font-normal text-grey-800">
            {completedCount}/{totalCount} Completed
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-brand-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Verification Items */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <VerificationItem label="Email" verified={verifications.email} />
          <VerificationItem
            label="Phone Number"
            verified={verifications.phone}
          />
          <VerificationItem label="NIN" verified={verifications.nin} />
          <VerificationItem label="BVN" verified={verifications.bvn} />
        </div>
      </div>
    </div>
  );
};

export default KYC;
