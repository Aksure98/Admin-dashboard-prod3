"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";
import TabNavigation from "@/components/tabNavigation";
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
import AddCargoForm from "../add-operator";
import { useParams } from "next/navigation";
import CargoTripDetails from "./pickups";
import CargoEarnings from "./earnings";
import CargoRatingDetails from "./ratings";
import { formatDate } from "@/utils/utils";
import { useGetSingleCargo } from "@/hooks/cargo/getSingleCargo";
import SuspendCargo, { SuspendAccountPayload } from "./suspendCargo";
import { useSuspendCargo } from "@/hooks/cargo/suspendCargo";
import { useActivateCargo } from "@/hooks/cargo/activateCargo";
import { useResetPasswordCargo } from "@/hooks/cargo/resetPasswordCargo";
import ManageVehicleModal from "./manage-vehicle-info";

const CargoDetails = () => {
  const [selectedTab, setSelectedTab] = useState("details");
  const [openEditCargo, setOpenEditCargo] = useState(false);
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [cargoToSuspend, setCargoToSuspend] = useState<string | null>(null);
  const [isManageVehicleModalOpen, setIsManageVehicleModalOpen] =
    useState(false);

  const { id } = useParams<{ id: string }>();
  const { data } = useGetSingleCargo(id);
  const cargoDetails = data?.data;

  const suspendMutation = useSuspendCargo();
  const activateMutation = useActivateCargo();
  const resetPasswordMutation = useResetPasswordCargo();

  const customerTabs = [
    { id: "details", label: "Cargo Driver Details" },
    { id: "trips", label: "Trips" },
    { id: "earnings", label: "Earnings" },
    { id: "ratings", label: "Performance & Ratings" },
  ];

  const handleOpenSuspend = (userId: string) => {
    setCargoToSuspend(userId);
    setIsSuspendOpen(true);
  };

  const handleCloseSuspend = () => {
    setIsSuspendOpen(false);
    setCargoToSuspend(null);
  };

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (cargoToSuspend) {
      await suspendMutation.mutateAsync({
        id: cargoToSuspend,
        payload: data,
      });
      handleCloseSuspend();
    }
  };

  const handleActivateCargo = async () => {
    if (!cargoDetails?.user_id) return;
    await activateMutation.mutateAsync(cargoDetails.user_id);
  };

  const handleResetPasswordCargo = async () => {
    if (!cargoDetails?.user_id) return;
    await resetPasswordMutation.mutateAsync(cargoDetails.user_id);
  };

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
              <div className="flex flex-col gap-6">
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
                            {cargoDetails?.first_name} {cargoDetails?.last_name}
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
                            Male
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
                            Feb 21,1990
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
                            12B Adeola Rd, Ikeja, Lagos
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
                            SUV
                          </p>
                        </div>
                      </div>
                      <Button
                        hierarchy="secondary"
                        leftIcon={<InfoIcon size={16} />}
                        onClick={() => setIsManageVehicleModalOpen(true)}
                      >
                        Manage Vehicle Information
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {selectedTab === "trips" && <CargoTripDetails id={id} />}
            {selectedTab === "earnings" && <CargoEarnings id={id} />}
            {selectedTab === "ratings" && <CargoRatingDetails id={id} />}
          </div>
        </div>

        <div className="col-span-1 ">
          <div className=" flex flex-col gap-5 divide-y-2 divide-grey-100">
            <div className="flex gap-5 items-center pb-3">
              <Avatar>
                <AvatarImage
                  src={cargoDetails?.avatar ?? ""}
                  alt={cargoDetails?.first_name || ""}
                />
                <AvatarFallback>
                  {cargoDetails?.first_name
                    ? cargoDetails?.first_name.charAt(0)
                    : "?"}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col gap-2 mt-2">
                <h1 className="text-grey-800 text-xl font-bold">
                  {cargoDetails?.first_name} {cargoDetails?.last_name}
                </h1>
                <div>
                  <p className="text-grey-600 font-normal text-sm">
                    ID : {cargoDetails?.user_id}
                  </p>

                  <div className="flex items-center gap-4 mt-2">
                    <p
                      className={`px-5 py-1 rounded-full w-fit text-center text-xs font-bold ${
                        cargoDetails?.status === "ACTIVE"
                          ? "bg-success-100 text-success-600"
                          : cargoDetails?.status === "SUSPENDED"
                            ? "bg-error-100 text-error-600"
                            : "bg-brand-100 text-brand-600"
                      }`}
                    >
                      {cargoDetails?.status}
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
                <p className="text-grey-600 text-sm">{cargoDetails?.email}</p>
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
                  {cargoDetails?.phone_number}
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
                <p className="text-grey-600 text-sm">- </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CarIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Total Trips</h1>
                <p className="text-grey-600 text-sm">
                  {cargoDetails?.total_jobs}
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
                  * {cargoDetails?.rating}
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
                  {formatDate(cargoDetails?.created_at ?? "")}
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
                onClick={() => setOpenEditCargo(true)}
                size="lg"
                className="cursor-pointer w-full"
              >
                Edit
              </Button>
              {cargoDetails?.status === "ACTIVE" ||
              cargoDetails?.status === "SUSPENDED" ? (
                <Button
                  hierarchy="secondary"
                  leftIcon={<PauseIcon size={24} />}
                  onClick={
                    cargoDetails?.status === "ACTIVE"
                      ? () => handleOpenSuspend(cargoDetails?.user_id)
                      : () => handleActivateCargo()
                  }
                  isLoading={
                    suspendMutation.isPending || activateMutation.isPending
                  }
                  size="lg"
                  className="cursor-pointer w-full"
                >
                  {cargoDetails?.status === "ACTIVE" ? "Suspend" : "Activate"}
                </Button>
              ) : null}
              <Button
                hierarchy="primary"
                leftIcon={<LockIcon size={24} />}
                size="lg"
                className="cursor-pointer w-full"
                onClick={handleResetPasswordCargo}
                isLoading={resetPasswordMutation.isPending}
              >
                Reset Password
              </Button>
            </div>
          </div>
        </div>
      </div>
      {openEditCargo && (
        <AddCargoForm
          isOpen={openEditCargo}
          onClose={() => setOpenEditCargo(false)}
          mode="edit"
          editData={{
            id: cargoDetails?.user_id,
            fullName: `${cargoDetails?.first_name} ${cargoDetails?.last_name}`,
            email: cargoDetails?.email ?? "",
            phoneNumber: cargoDetails?.phone_number ?? "",
            state: cargoDetails?.state || "",
            city: cargoDetails?.city || "",
            streetAddress: cargoDetails?.streetAddress || "",
          }}
        />
      )}
      <SuspendCargo
        isOpen={isSuspendOpen}
        onClose={handleCloseSuspend}
        onConfirm={handleConfirmSuspend}
        isLoading={suspendMutation.isPending}
      />

      <ManageVehicleModal
        isOpen={isManageVehicleModalOpen}
        onClose={() => setIsManageVehicleModalOpen(false)}
        id={id}
      />
    </>
  );
};

export default CargoDetails;
