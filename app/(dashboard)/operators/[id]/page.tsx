"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";
import TabNavigation from "@/components/tabNavigation";
import SuspensionInfo from "@/components/suspensionInfo";
import {
  CalendarDotsIcon,
  CalendarIcon,
  CarIcon,
  EnvelopeSimpleIcon,
  InfoIcon,
  LockIcon,
  MapPinIcon,
  MoneyIcon,
  PauseIcon,
  PencilSimpleIcon,
  PhoneCallIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import AddDriverForm from "../add-driver";
import { useParams } from "next/navigation";
import DriverTripDetails from "./trips";
import DriverEarnings from "./earnings";
import DriverRatingDetails from "./ratings";
import { formatDate } from "@/utils/utils";
import { useGetSingleDriver } from "@/hooks/drivers/getSingleDriver";
import SuspendDriver, { SuspendAccountPayload } from "./suspendDriver";
import { useSuspendDriver } from "@/hooks/drivers/suspendDriver";
import { useActivateDriver } from "@/hooks/drivers/activateDriver";
import { useResetPasswordDriver } from "@/hooks/drivers/resetPasswordDriver";
import ManageVehicleModal from "./manage-vehicle-info";
import { DocumentItem, DriverDocument } from "@/@types";
import Image from "next/image";
import Table from "@/components/table";
import ViewDriverDocument from "../documents/view-document";
import { useRejectDocument } from "@/hooks/drivers/rejectDriverDoc";
import { useApproveDocument } from "@/hooks/drivers/approveDriverDoc";

const DriverDetails = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [openEditDriver, setOpenEditDriver] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [driverToSuspend, setDriverToSuspend] = useState<string | null>(null);
  const [isManageVehicleModalOpen, setIsManageVehicleModalOpen] =
    useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null,
  );

  const handleOpenEditDriver = () => setOpenEditDriver(true);
  const handleCloseEditDriver = () => setOpenEditDriver(false);

  const { id } = useParams<{ id: string }>();
  console.log(id);
  const { data, isLoading } = useGetSingleDriver(id);
  const driverDetails = data?.data;
  console.log(driverDetails);

  const suspendMutation = useSuspendDriver();
  const activateMutation = useActivateDriver();
  const resetPasswordMutation = useResetPasswordDriver();
  const { mutate: rejectDoc, isPending: isRejecting } = useRejectDocument(
    selectedDocument?.user_id ?? "",
    selectedDocument?.id ?? "",
  );
  const { mutate: approveDoc, isPending: isApproving } = useApproveDocument(
    selectedDocument?.user_id ?? "",
    selectedDocument?.id ?? "",
  );
  const customerTabs = [
    { id: "details", label: "Driver Details" },
    { id: "trips", label: "Trips" },
    { id: "earnings", label: "Earnings" },
    { id: "ratings", label: "Performance & Ratings" },
  ];

  const handleOpenSuspend = (userId: string) => {
    setDriverToSuspend(userId);
    setIsSuspendOpen(true);
  };

  const handleCloseSuspend = () => {
    setIsSuspendOpen(false);
    setDriverToSuspend(null);
  };

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (driverToSuspend) {
      await suspendMutation.mutateAsync({
        id: driverToSuspend,
        payload: data,
      });
      handleCloseSuspend();
    }
  };

  const handleActivateCustomer = async () => {
    if (!driverDetails?.user_id) return;
    await activateMutation.mutateAsync(driverDetails.user_id);
  };

  const handleResetPasswordDriver = async () => {
    if (!driverDetails?.user_id) return;
    await resetPasswordMutation.mutateAsync(driverDetails.user_id);
  };

  const handleOpenManageVehicleModal = () => {
    setIsManageVehicleModalOpen(true);
  };

  const handleCloseManageVehicleModal = () => {
    setIsManageVehicleModalOpen(false);
  };

  const handleOpenViewModal = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDocument(null);
  };

  const handleApprove = () => {
    approveDoc(undefined, {
      onSuccess: () => {
        handleCloseViewModal();
      },
    });
  };

  const handleReject = () => {
    rejectDoc(undefined, {
      onSuccess: () => {
        handleCloseViewModal();
      },
    });
  };

  const columns = [
    {
      header: "Name",
      accessor: "type" as keyof DriverDocument,
    },
    {
      header: "Image",
      accessor: "url" as keyof DriverDocument,
      render: (row: DriverDocument) => (
        <Image src={row?.url} alt="image" width={50} height={50} />
      ),
    },
    {
      header: "Verification Status",
      accessor: "verification_status" as keyof DriverDocument,
      render: (row: DriverDocument) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.verification_status === "APPROVED"
              ? "bg-success-100 text-success-600"
              : row.verification_status === "ongoing"
                ? "bg-brand-50 text-brand-600"
                : row.verification_status === "scheduled"
                  ? "bg-warning-50 text-warning-600"
                  : "bg-error-100 text-error-600"
          }`}
        >
          {row.verification_status}
        </p>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof DriverDocument,
      sortable: false,
      render: (row: DriverDocument) => (
        <div className="flex gap-3 items-center">
          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            //@ts-expect-error will work on it
            onClick={() => handleOpenViewModal(row)}
          >
            View
          </div>
          {row.verification_status !== "APPROVED" && (
            <>
              <div
                className="text-success-600 text-sm font-bold cursor-pointer"
                onClick={() => row}
              >
                Approve
              </div>
              <div
                className="text-error-600 text-sm font-bold cursor-pointer"
                onClick={() => row}
              >
                Decline
              </div>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <>
      <div className="grid grid-cols-4 gap-5 mt-24 ">
        <div className="col-span-3 border-r border-grey-200 pr-5 flex flex-col gap-5">
          <TabNavigation
            tabs={customerTabs}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
          <div className="">
            {selectedTab === "details" && (
              <div>
                <div className="flex flex-col gap-6 mb-3">
                  <div className="flex gap-6 ">
                    <div className="flex-1 bg-white rounded-xl p-6 border border-grey-200">
                      <h2 className="text-xl font-bold text-grey-900 mb-4">
                        Personal Information
                      </h2>

                      <div className="flex flex-col gap-4 divide-y-2 divide-grey-100">
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <UserIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Full Name
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.first_name}{" "}
                              {driverDetails?.last_name}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <UserIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Gender
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.gender}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <UserIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Date of Birth
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.date_of_birth}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <MapPinIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Address
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.addresses?.[0]?.house_number},
                              {driverDetails?.addresses?.[0]?.street_name},
                              {driverDetails?.addresses?.[0]?.city},
                              {driverDetails?.addresses?.[0]?.area},
                              {driverDetails?.addresses?.[0]?.country},
                            </p>
                          </div>
                        </div>

                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <UserIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Emergency Contact Person
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.emergency_contacts?.name ??
                                "Not yet added"}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <PhoneCallIcon size={24} color="#0077b6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Emergency Contact Person
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.emergency_contacts?.number ??
                                "Not yet added"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 bg-white rounded-xl p-6 border border-grey-200">
                      <h2 className="text-xl font-bold text-grey-900 mb-4">
                        Vehicle Information
                      </h2>

                      <div className="flex flex-col gap-4 divide-y-2 divide-grey-100">
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <CarIcon size={20} color="#0077B6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Vehicle Type
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.vehicle_info?.model}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <CarIcon size={20} color="#0077B6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Brand / Model
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.vehicle_info?.manufacturer}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <CarIcon size={20} color="#0077B6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Year
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.vehicle_info?.production_year}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <CarIcon size={20} color="#0077B6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Plate Number
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {driverDetails?.vehicle_info?.plate_number}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-3 items-start pb-3">
                          <div className="flex-shrink-0 mt-1">
                            <div className="bg-brand-50 rounded-full p-3">
                              <CarIcon size={20} color="#0077B6" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="text-grey-600 font-bold text-sm">
                              Vehicle Category
                            </p>
                            <p className="text-grey-900 text-sm font-normal">
                              {}
                            </p>
                          </div>
                        </div>

                        <Button
                          hierarchy="secondary"
                          leftIcon={<InfoIcon size={16} />}
                          onClick={handleOpenManageVehicleModal}
                        >
                          Manage Vehicle Information
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1 bg-white rounded-xl p-6 border border-grey-200">
                  <h2 className="text-xl font-bold text-grey-900 mb-4">
                    Verification Documents
                  </h2>

                  <Table
                    columns={columns}
                    data={driverDetails?.documents || []}
                  />
                </div>
              </div>
            )}
            {selectedTab === "trips" && (
              <DriverTripDetails id={id} service_type="RIDES" />
            )}
            {selectedTab === "earnings" && <DriverEarnings id={id} />}
            {selectedTab === "ratings" && <DriverRatingDetails id={id} />}
          </div>
        </div>

        <div className="col-span-1 ">
          <div className=" flex flex-col gap-5 divide-y-2 divide-grey-100">
            <div className="flex gap-5 items-center pb-3">
              <Avatar>
                <AvatarImage
                  src={driverDetails?.avatar ?? ""}
                  alt={driverDetails?.first_name || ""}
                />
                <AvatarFallback>
                  {driverDetails?.first_name
                    ? driverDetails?.first_name.charAt(0)
                    : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 mt-2">
                <h1 className="text-grey-800 text-xl font-bold">
                  {driverDetails?.first_name} {driverDetails?.last_name}
                </h1>
                <div>
                  <p className="text-grey-600 font-normal text-sm">
                    ID : {driverDetails?.user_id}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <p
                      className={`px-5 py-1 rounded-full w-fit text-center text-xs font-bold ${
                        driverDetails?.status === "ACTIVE"
                          ? "bg-success-100 text-success-600"
                          : driverDetails?.status === "SUSPENDED"
                            ? "bg-error-100 text-error-600"
                            : "bg-brand-100 text-brand-600"
                      }`}
                    >
                      {driverDetails?.status}
                    </p>
                    <p
                      className={`px-5 py-1 rounded-full w-fit text-center text-xs font-bold ${
                        driverDetails?.availability_status === "ONLINE"
                          ? "bg-success-100 text-success-600"
                          : driverDetails?.status === "BUSY"
                            ? "bg-error-100 text-error-600"
                            : "bg-grey-100 text-grey-600"
                      }`}
                    >
                      {driverDetails?.availability_status}
                    </p>
                    <p className="bg-brand-100 text-brand-600 px-5 py-1 rounded-full w-fit text-center text-xs font-bold">
                      {driverDetails?.service_type ?? ""}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <EnvelopeSimpleIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Email</h1>
                <p className="text-grey-600 text-sm">{driverDetails?.email}</p>
              </div>
            </div>

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <PhoneCallIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Phone Number
                </h1>
                <p className="text-grey-600 text-sm">
                  {driverDetails?.phone_number}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <MoneyIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Total Earnings
                </h1>
                <p className="text-grey-600 text-sm">
                  {driverDetails?.total_earnings}{" "}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CarIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Total Trips</h1>
                <p className="text-grey-600 text-sm">
                  {driverDetails?.total_jobs}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <MoneyIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Average Ratings
                </h1>
                <p className="text-grey-600 text-sm">
                  ⭐ {driverDetails?.rating}
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CalendarIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Created at</h1>
                <p className="text-grey-600 text-sm">
                  {formatDate(driverDetails?.created_at ?? "")}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CalendarDotsIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Last Login</h1>
                <p className="text-grey-600 text-sm">-</p>
              </div>
            </div>
            <div className="border-t border-grey-100 p-6 flex flex-col gap-5 ">
              <h1 className="text-xl font-bold text-grey-800">Action</h1>

              <Button
                hierarchy="secondary"
                leftIcon={<PencilSimpleIcon size={24} />}
                onClick={handleOpenEditDriver}
                size="lg"
                className="cursor-pointer w-full"
              >
                Edit
              </Button>
              {driverDetails?.status === "ACTIVE" ||
              driverDetails?.status === "SUSPENDED" ? (
                <Button
                  hierarchy="secondary"
                  leftIcon={<PauseIcon size={24} />}
                  onClick={
                    driverDetails?.status === "ACTIVE"
                      ? () => handleOpenSuspend(driverDetails?.user_id)
                      : () => handleActivateCustomer()
                  }
                  isLoading={
                    suspendMutation.isPending || activateMutation.isPending
                  }
                  size="lg"
                  className="cursor-pointer w-full"
                >
                  {driverDetails?.status === "ACTIVE" ? "Suspend" : "Activate"}
                </Button>
              ) : null}
              <Button
                hierarchy="primary"
                leftIcon={<LockIcon size={24} />}
                size="lg"
                className="cursor-pointer w-full"
                onClick={handleResetPasswordDriver}
                isLoading={resetPasswordMutation.isPending}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* Edit Driver Modal */}
      {openEditDriver && (
        <AddDriverForm
          isOpen={openEditDriver}
          onClose={handleCloseEditDriver}
          mode="edit"
          editData={{
            id: driverDetails?.user_id,
            first_name: driverDetails?.first_name ?? "",
            last_name: driverDetails?.last_name ?? "",
            email: driverDetails?.email ?? "",

            phone_number: driverDetails?.phone_number ?? "",
            state: driverDetails?.state || "",
            city: driverDetails?.city || "",
            streetAddress: driverDetails?.streetAddress || "",
          }}
        />
      )}
      <SuspendDriver
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />

      <ManageVehicleModal
        isOpen={isManageVehicleModalOpen}
        onClose={handleCloseManageVehicleModal}
        id={id}
      />

      <ViewDriverDocument
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        document={selectedDocument}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
};

export default DriverDetails;
