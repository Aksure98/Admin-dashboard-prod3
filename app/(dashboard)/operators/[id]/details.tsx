"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Table from "@/components/table";
import Link from "next/link";

import { useState } from "react";
import {
  InfoIcon,
  // PencilSimpleIcon,
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  CarIcon,
  PhoneIcon,
} from "@phosphor-icons/react";
import { Driver, DriverDetail } from "@/@types";

interface DriverDetailsProps {
  completedCount: number;
  totalCount: number;
  progressPercentage: number;
  verifications: {
    email: boolean;
    phone: boolean;
    id: boolean;
    bvn: boolean;
  };
  allDocuments: DriverDetail[];
  driver: Driver;
}

const PersonalInfoItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
}> = ({ icon, label, value }) => (
  <div className="flex gap-3 items-start">
    <div className="flex-shrink-0 mt-1">
      <div className="w-10 h-10 flex items-center justify-center bg-[#D9F2FF] rounded-full p-2">
        {icon}
      </div>
    </div>
    <div className="flex-1">
      <p className="text-grey-600 font-bold text-sm">{label}</p>
      <p className="text-grey-900 text-sm font-normal">{value}</p>
    </div>
  </div>
);

const Details: React.FC<DriverDetailsProps> = ({ allDocuments, driver }) => {
  const [isManageVehicleModalOpen, setIsManageVehicleModalOpen] =
    useState(false);

  const handleOpenManageVehicleModal = () => {
    setIsManageVehicleModalOpen(true);
  };

  const handleCloseManageVehicleModal = () => {
    setIsManageVehicleModalOpen(false);
  };
  const columns = [
    {
      header: "Name",
      sortable: false,
      accessor: "name" as keyof DriverDetail,
    },
    {
      header: "Image",
      sortable: false,
      accessor: "document" as keyof DriverDetail,
      render: (row: DriverDetail) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={row?.document?.[0]?.url} alt={row.name || ""} />
            <AvatarFallback>
              {row.name ? row.name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      header: "Document Number",
      sortable: false,
      accessor: "documentNumber" as keyof DriverDetail,
    },
    {
      header: "Expires At",
      sortable: false,
      accessor: "expiresAt" as keyof DriverDetail,
      render: () => <span>15 May 2026</span>,
    },
    {
      header: "Verification",
      sortable: false,
      accessor: "verification" as keyof DriverDetail,
      render: () => (
        <span className="text-success-600 font-bold text-sm">Verified</span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof DriverDetail,
      sortable: false,
      render: () => (
        <div className="flex gap-2">
          <Link href={`/drivers/documents`}>
            <span className="text-brand-400 text-sm font-bold cursor-pointer hover:underline">
              View
            </span>
          </Link>
          <Link href={`/drivers/documents`}>
            <span className="text-success-400 text-sm font-bold cursor-pointer hover:underline">
              Approve
            </span>
          </Link>
          <Link href={`/drivers/documents`}>
            <span className="text-error-400 text-sm font-bold cursor-pointer hover:underline">
              Reject
            </span>
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex gap-6">
        {/* Personal Information Section */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-grey-200">
          <h2 className="text-xl font-bold text-grey-900 mb-4">
            Personal Information
          </h2>
          <div className="flex flex-col gap-4">
            <PersonalInfoItem
              icon={<UserIcon size={20} color="#0077B6" />}
              label="Full Name"
              value={driver?.first_name}
            />
            <PersonalInfoItem
              icon={<UserIcon size={20} color="#0077B6" />}
              label="Gender"
              value="Male"
            />
            <PersonalInfoItem
              icon={<CalendarIcon size={20} color="#0077B6" />}
              label="Date of Birth"
              value="Feb 21, 1990"
            />
            <PersonalInfoItem
              icon={<MapPinIcon size={20} color="#0077B6" />}
              label="Address"
              value="12B Adeola Rd, Ikoyi, Lagos"
            />
            <PersonalInfoItem
              icon={<PhoneIcon size={20} color="#0077B6" />}
              label="Emergency Contact Person"
              value="+234801234567"
            />

            <PersonalInfoItem
              icon={<PhoneIcon size={20} color="#0077B6" />}
              label="Emergency Contact Person"
              value="Jason Smith"
            />
          </div>
        </div>
        {/* Vehicle Information Section */}
        <div className="flex-1 bg-white rounded-xl p-6 border border-grey-200">
          <h2 className="text-xl font-bold text-grey-900 mb-4">
            Vehicle Information
          </h2>
          <div className="flex flex-col gap-6">
            <PersonalInfoItem
              icon={<CarIcon size={20} color="#0077B6" />}
              label="Vehicle Type"
              value="SUV"
            />
            <PersonalInfoItem
              icon={<CarIcon size={20} color="#0077B6" />}
              label="Brand / Model"
              value="Toyota Corrolla"
            />
            <PersonalInfoItem
              icon={<CarIcon size={20} color="#0077B6" />}
              label="Year"
              value="2020"
            />
            <PersonalInfoItem
              icon={<CarIcon size={20} color="#0077B6" />}
              label="Registered Service"
              value="Driver"
            />

            <PersonalInfoItem
              icon={<CarIcon size={20} color="#0077B6" />}
              label="Vehicle Category"
              value="Premium"
            />
          </div>
          <button
            onClick={handleOpenManageVehicleModal}
            className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-brand-50 text-brand-600 text-sm font-bold rounded-lg hover:bg-brand-100 transition-colors cursor-pointer"
          >
            <InfoIcon size={16} />
            Manage Vehicle Information
          </button>
        </div>
      </div>

      {/* Verification Documents Table */}
      <div className="border border-grey-200 rounded-lg shadow bg-white">
        <div className="p-6 flex items-center justify-between border-b border-grey-200">
          <h1 className="text-grey-900 text-xl font-bold">
            Verification Documents
          </h1>
        </div>
        <div className="overflow-x-auto">
          <Table columns={columns} data={allDocuments || []} />
        </div>
      </div>
    </div>
  );
};

export default Details;
