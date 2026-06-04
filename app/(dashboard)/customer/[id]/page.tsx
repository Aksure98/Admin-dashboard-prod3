"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";
import TabNavigation from "@/components/tabNavigation";
import {
  CalendarDotsIcon,
  CalendarIcon,
  CarIcon,
  EnvelopeSimpleIcon,
  LockIcon,
  MoneyIcon,
  PauseIcon,
  PencilSimpleIcon,
  PhoneCallIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import KYC from "./kyc";
import TripDetails from "./trips";
import PaymentDetails from "./payment";
import RatingDetails from "./rating";
import { formatDate } from "@/utils/utils";
import { useParams } from "next/navigation";
import { useGetSingleCustomer } from "@/hooks/customer/useGetSingleCustomer";
import { useResetPasswordCustomer } from "@/hooks/customer/resetPasswordCustomer";
import { useSuspendCustomer } from "@/hooks/customer/suspendCustomer";
import AddCustomer from "../add-customer";
import SuspendAccountModal, {
  SuspendAccountPayload,
} from "../suspend-customer";
import { useActivateCustomer } from "@/hooks/customer/activateCustomer";
import { CustomerPaymentMethod, PaymentStat } from "@/@types";

//   {
//     id: "001",
//     type: "ride",
//     amount: 50000,
//     payment: "cash",
//     status: "success",
//     date: "15 may 2025",
//   },
//   {
//     id: "002",
//     type: "pay later",
//     amount: 50000,
//     payment: "cash",
//     status: "failed",
//     date: "15 may 2025",
//   },
//   {
//     id: "003",
//     type: "cargo",
//     amount: 50000,
//     payment: "cash",
//     status: "pending",
//     date: "15 may 2025",
//   },
//   {
//     id: "004",
//     type: "refund",
//     amount: 50000,
//     payment: "cash",
//     status: "pending",
//     date: "15 may 2025",
//   },
// ];

const allCard: CustomerPaymentMethod[] = [
  { id: "1", method: "Mastercard", details: "***4231" },
  { id: "2", method: "Pay later", details: "Limit ₦15,000" },
];

//   { id: "1", label: "Average Rating Received", value: "⭐4.9", allRating: [] },
//   { id: "2", label: "Total Ratings Received", value: "4", allRating: [] },
//   { id: "3", label: "Total Ratings Given", value: "8", allRating: [] },
// ];

// const allRating: CustomerRating[] = [
//   {
//     id: "001",
//     type: "Ride",
//     driver: "Tunde O. (⭐ 4.9)",
//     rating: "4.5",
//     description: "Polite and on time",
//   },
//   {
//     id: "002",
//     type: "Ride",
//     driver: "Tunde O. (⭐ 2.5)",
//     rating: "2.5",
//     description: "Polite and on time",
//   },
//   {
//     id: "002",
//     type: "Ride",
//     driver: "Tunde O. (⭐ 1)",
//     rating: "1",
//     description: "Rude",
//   },
// ];

const CustomerDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleCustomer(id);
  const customerDetails = data?.data;

  const [selectedTab, setSelectedTab] = useState("kyc");
  const [openEditCustomer, setOpenEditCustomer] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);

  const resetPasswordMutation = useResetPasswordCustomer();
  const suspendMutation = useSuspendCustomer();
  const activateMutation = useActivateCustomer();

  const handleResetPasswordCustomer = async () => {
    if (!customerDetails?.user_id) return;
    await resetPasswordMutation.mutateAsync(customerDetails.user_id);
  };

  const handleOpenEdit = () => setOpenEditCustomer(true);
  const handleCloseEdit = () => setOpenEditCustomer(false);

  const handleOpenSuspend = () => setIsSuspendOpen(true);
  const handleCloseSuspend = () => setIsSuspendOpen(false);

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (!customerDetails?.user_id) return;
    await suspendMutation.mutateAsync({
      id: customerDetails.user_id,
      payload: data,
    });
    handleCloseSuspend();
  };

  const handleActivateCustomer = async () => {
    if (!customerDetails?.user_id) return;
    await activateMutation.mutateAsync(customerDetails.user_id);
  };

  const customerTabs = [
    { id: "kyc", label: "KYC" },
    { id: "trips", label: "Trips" },
    { id: "payments", label: "Payments" },
    { id: "ratings", label: "Ratings" },
  ];

  return (
    <div className="grid grid-cols-4 gap-5 mt-24">
      <div className="col-span-3 border-r border-grey-200 pr-5 flex flex-col gap-5">
        <TabNavigation
          tabs={customerTabs}
          onTabChange={(tabId) => setSelectedTab(tabId)}
        />
        <div>
          {selectedTab === "kyc" && <KYC id={id} />}
          {selectedTab === "trips" && <TripDetails id={id} />}
          {selectedTab === "payments" && (
            <PaymentDetails allCard={allCard} id={id} />
          )}
          {selectedTab === "ratings" && <RatingDetails id={id} />}
        </div>
      </div>

      <div className="col-span-1">
        <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
          <div className="flex gap-5 items-center pb-3">
            <Avatar>
              <AvatarImage
                src={customerDetails?.avatar}
                alt={customerDetails?.first_name || ""}
              />
              <AvatarFallback>
                {customerDetails?.first_name
                  ? customerDetails.first_name.charAt(0)
                  : "?"}
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col gap-2 mt-2">
              <h1 className="text-grey-800 text-xl font-bold">
                {customerDetails?.first_name} {customerDetails?.last_name}
              </h1>
              <div>
                <p className="text-grey-800 text-sm">
                  {customerDetails?.email}
                </p>
                <div className="flex items-center gap-4">
                  <p
                    className={`px-5 py-1 rounded-full w-fit text-center ${
                      customerDetails?.status === "ACTIVE"
                        ? "bg-success-500 text-grey-25"
                        : customerDetails?.status === "INACTIVE"
                          ? "bg-error-500 text-grey-25"
                          : "bg-warning-500 text-grey-25"
                    }`}
                  >
                    {customerDetails?.status}
                  </p>
                  <p className="bg-brand-500 px-5 py-1 rounded-full text-brand-25 w-fit text-center">
                    {customerDetails?.kyc_level}
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
              <p className="text-grey-600 text-sm">{customerDetails?.email}</p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <PhoneCallIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Phone Number</h1>
              <p className="text-grey-600 text-sm">
                {customerDetails?.phone_number ?? "Not provided"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <MoneyIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Total Spend</h1>
              <p className="text-grey-600 text-sm">
                {customerDetails?.total_spend ?? "0"}
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
                {customerDetails?.total_trips ?? "0"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <UserIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">
                Pay Later Limit
              </h1>
              <p className="text-grey-600 text-sm">
                {customerDetails?.pay_later_limit ?? "0"}
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
                {customerDetails?.created_at
                  ? formatDate(customerDetails.created_at)
                  : "—"}
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-center pb-3">
            <div className="bg-brand-50 rounded-full p-3">
              <CalendarDotsIcon size={24} color="#0077b6" />
            </div>
            <div>
              <h1 className="text-grey-600 text-sm font-bold">Last Login</h1>
              <p className="text-grey-600 text-sm">
                {customerDetails?.last_active_at
                  ? formatDate(customerDetails.last_active_at)
                  : "Yet to login"}
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-grey-100 p-6 flex flex-col gap-5">
          <h1 className="text-xl font-bold text-grey-800">Action</h1>

          <Button
            hierarchy="secondary"
            leftIcon={<PencilSimpleIcon size={24} />}
            onClick={handleOpenEdit}
            size="lg"
            className="cursor-pointer w-full"
          >
            Edit
          </Button>

          {customerDetails?.status === "ACTIVE" ||
          customerDetails?.status === "SUSPENDED" ? (
            <Button
              hierarchy="secondary"
              leftIcon={<PauseIcon size={24} />}
              onClick={
                customerDetails?.status === "ACTIVE"
                  ? handleOpenSuspend
                  : handleActivateCustomer
              }
              isLoading={
                suspendMutation.isPending || activateMutation.isPending
              }
              size="lg"
              className="cursor-pointer w-full"
            >
              {customerDetails?.status === "ACTIVE" ? "Suspend" : "Activate"}
            </Button>
          ) : null}

          <Button
            hierarchy="primary"
            leftIcon={<LockIcon size={24} />}
            size="lg"
            className="cursor-pointer w-full"
            onClick={handleResetPasswordCustomer}
            isLoading={resetPasswordMutation.isPending}
          >
            Reset Password
          </Button>
        </div>
      </div>

      {openEditCustomer && customerDetails && (
        <AddCustomer
          isOpen={openEditCustomer}
          onClose={handleCloseEdit}
          mode="edit"
          editData={{
            id: customerDetails.user_id,
            first_name: customerDetails.first_name,
            last_name: customerDetails.last_name,
            email: customerDetails.email,
            //@ts-expect-error will work on it
            phone_number: customerDetails.phone_number,
          }}
        />
      )}

      <SuspendAccountModal
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />
    </div>
  );
};

export default CustomerDetails;
