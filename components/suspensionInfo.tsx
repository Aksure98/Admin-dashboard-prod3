"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import {
  InfoIcon,
  CopyIcon,
  WalletIcon,
  CarIcon,
  StarIcon,
  CalendarIcon,
  ClockIcon,
} from "@phosphor-icons/react";

interface SuspensionInfoProps {
  entity: {
    id: string;
    name: string;
    avatar?: string;
    verification?: "Verified" | "Unverified" | "In Progress";
  };
  suspensionDetails: {
    reason: string;
    duration: string;
    email?: string;
    phone?: string;
    totalEarnings?: string;
    totalTrips?: number;
    averageRating?: number;
    createdAt?: string;
    lastLogin?: string;
  };
  onExtendClick?: () => void;
}

const SuspensionInfo: React.FC<SuspensionInfoProps> = ({
  entity,
  suspensionDetails,
  onExtendClick,
}) => {
  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
      {/* Header */}
      <div className="flex gap-5 items-center pb-3">
        <Avatar>
          <AvatarImage src={entity.avatar} alt={entity.name} />
          <AvatarFallback>{entity.name.charAt(0)}</AvatarFallback>
        </Avatar>

        <div className="flex flex-col gap-2">
          <h1 className="text-grey-800 text-xl font-bold">{entity.name}</h1>
          <div>
            <p className="text-grey-600 font-normal text-sm">ID : #{entity.id}</p>

            <div className="flex items-center gap-2 mt-2">
              <p className="px-3 py-1 rounded-full w-fit text-center text-xs font-bold bg-error-100 text-error-600">
                Account Suspended
              </p>
              {entity.verification === "Verified" && (
                <p className="bg-brand-100 text-brand-600 px-3 py-1 rounded-full w-fit text-center text-xs font-bold">
                  Verified
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Suspension Reason & Duration */}
      <div className="bg-error-50 rounded-lg p-4 border border-error-200 pt-3 pb-3">
        <div className="flex flex-col gap-3">
          <div>
            <p className="text-grey-600 text-xs font-bold">Reason for Suspension</p>
            <p className="text-grey-900 text-sm font-normal">
              {suspensionDetails.reason}
            </p>
          </div>
          <div>
            <p className="text-grey-600 text-xs font-bold">Suspension Duration</p>
            <p className="text-grey-900 text-sm font-normal">
              {suspensionDetails.duration}
            </p>
          </div>
        </div>
      </div>

      {/* Email */}
      {suspensionDetails.email && (
        <div className="flex gap-4 items-center justify-between pt-3 pb-3">
          <div className="flex gap-4 items-center flex-1">
            <div className="bg-brand-50 rounded-full p-3">
              <InfoIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Email</h1>
              <p className="text-grey-600 text-sm">{suspensionDetails.email}</p>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopyToClipboard(suspensionDetails.email || "")
            }
            className="text-brand-600 hover:text-brand-700 transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            <CopyIcon size={20} />
          </button>
        </div>
      )}

      {/* Phone */}
      {suspensionDetails.phone && (
        <div className="flex gap-4 items-center justify-between pt-3 pb-3">
          <div className="flex gap-4 items-center flex-1">
            <div className="bg-brand-50 rounded-full p-3">
              <InfoIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Phone Number</h1>
              <p className="text-grey-600 text-sm">{suspensionDetails.phone}</p>
            </div>
          </div>
          <button
            onClick={() =>
              handleCopyToClipboard(suspensionDetails.phone || "")
            }
            className="text-brand-600 hover:text-brand-700 transition-colors flex-shrink-0"
            title="Copy to clipboard"
          >
            <CopyIcon size={20} />
          </button>
        </div>
      )}

      {/* Total Earnings */}
      {suspensionDetails.totalEarnings && (
        <div className="flex gap-4 items-center pt-3 pb-3">
          <div className="bg-brand-50 rounded-full p-3">
            <WalletIcon size={24} color="#0077b6" />
          </div>
          <div>
            <h1 className="text-grey-600 text-sm font-bold">Total Earnings</h1>
            <p className="text-grey-600 text-sm">
              {suspensionDetails.totalEarnings}
            </p>
          </div>
        </div>
      )}

      {/* Total Trips */}
      {suspensionDetails.totalTrips !== undefined && (
        <div className="flex gap-4 items-center pt-3 pb-3">
          <div className="bg-brand-50 rounded-full p-3">
            <CarIcon size={24} color="#0077b6" />
          </div>
          <div>
            <h1 className="text-grey-600 text-sm font-bold">Total Trips</h1>
            <p className="text-grey-600 text-sm">
              {suspensionDetails.totalTrips}
            </p>
          </div>
        </div>
      )}

      {/* Average Ratings */}
      {suspensionDetails.averageRating !== undefined && (
        <div className="flex gap-4 items-center pt-3 pb-3">
          <div className="bg-brand-50 rounded-full p-3">
            <StarIcon size={24} color="#0077b6" />
          </div>
          <div>
            <h1 className="text-grey-600 text-sm font-bold">
              Average Ratings
            </h1>
            <p className="text-grey-600 text-sm">
              ⭐ {suspensionDetails.averageRating}
            </p>
          </div>
        </div>
      )}

      {/* Created at */}
      {suspensionDetails.createdAt && (
        <div className="flex gap-4 items-center pt-3 pb-3">
          <div className="bg-brand-50 rounded-full p-3">
            <CalendarIcon size={24} color="#0077b6" />
          </div>
          <div>
            <h1 className="text-grey-600 text-sm font-bold">Created at</h1>
            <p className="text-grey-600 text-sm">{suspensionDetails.createdAt}</p>
          </div>
        </div>
      )}

      {/* Last Login */}
      {suspensionDetails.lastLogin && (
        <div className="flex gap-4 items-center pt-3 pb-3">
          <div className="bg-brand-50 rounded-full p-3">
            <ClockIcon size={24} color="#0077b6" />
          </div>
          <div>
            <h1 className="text-grey-600 text-sm font-bold">Last Login</h1>
            <p className="text-grey-600 text-sm">
              {suspensionDetails.lastLogin}
            </p>
          </div>
        </div>
      )}

      {/* Extend Suspension Button */}
      <div className="pt-3">
        <h1 className="text-xl font-bold text-grey-800 mb-3">Actions</h1>
        <button
          onClick={onExtendClick}
          className="w-full px-4 py-2.5 bg-info-50 text-info-700 text-sm font-bold rounded-lg hover:bg-info-100 transition-colors cursor-pointer inline-flex items-center justify-center gap-2"
        >
          <InfoIcon size={16} />
          Extend Suspension
        </button>
      </div>
    </div>
  );
};

export default SuspensionInfo;
