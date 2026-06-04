"use client";
import { useState } from "react";
import Button from "@/components/button";
import {
  CalendarIcon,
  CarIcon,
  ClockIcon,
  CreditCardIcon,
  MapPinIcon,
  MinusIcon,
  PathIcon,
  PlusIcon,
  TaxiIcon,
  UserIcon,
} from "@phosphor-icons/react";
import ForceEndRide from "@/components/forceEndRide";
import ReassignDriver from "./reassignCargo";
import { useParams } from "next/navigation";
import { useGetSingleRides } from "@/hooks/rides/getSingleTrip";
import TripMap from "@/components/map";
import { formatDate } from "@/utils/utils";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-grey-100 rounded-lg ${className}`} />
);

const RidesDetailsSkeleton = () => (
  <div className="flex flex-col gap-6 mt-24">
    <div className="flex justify-between items-center">
      <div className="flex flex-col gap-2">
        <SkeletonBlock className="h-8 w-64" />
        <SkeletonBlock className="h-4 w-40" />
      </div>
      <div className="flex gap-3">
        <SkeletonBlock className="h-10 w-36" />
        <SkeletonBlock className="h-10 w-36" />
      </div>
    </div>

    <div className="grid grid-cols-2 gap-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-5"
        >
          <SkeletonBlock className="h-6 w-48" />
          <div className="flex flex-col gap-5">
            {Array.from({ length: 6 }).map((_, j) => (
              <div key={j} className="flex gap-4 items-center pb-3">
                <SkeletonBlock className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2 flex-1">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>

    <div className="grid grid-cols-2 gap-5">
      {[0, 1].map((i) => (
        <div
          key={i}
          className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-5"
        >
          <SkeletonBlock className="h-6 w-48" />
          <div className="flex flex-col gap-5">
            {Array.from({ length: 3 }).map((_, j) => (
              <div key={j} className="flex gap-4 items-center pb-3">
                <SkeletonBlock className="h-12 w-12 rounded-full" />
                <div className="flex flex-col gap-2 flex-1">
                  <SkeletonBlock className="h-3 w-24" />
                  <SkeletonBlock className="h-4 w-40" />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

const CargoDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetSingleRides(id);
  const [openForceEndModal, setOpenForceEndModal] = useState(false);
  const [openReassignDriverModal, setOpenReassignDriverModal] = useState(false);

  const rideDetails = data?.data;

  const handleOpenForceEndModal = () => {
    setOpenForceEndModal(true);
  };
  const handleOpenReassignDriverModal = () => {
    setOpenReassignDriverModal(true);
  };

  const handleCloseForceEndModal = () => {
    setOpenForceEndModal(false);
  };
  const handleCloseReassignDriverModal = () => {
    setOpenReassignDriverModal(false);
  };

  if (isLoading) return <RidesDetailsSkeleton />;
  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div>
          <div className="flex gap-3">
            <h1 className="text-grey-800 text-2xl font-bold font-figtree">
              Trip Management Details
            </h1>
            {rideDetails?.force_end === true && (
              <p className="text-error-600 text-md font-bold px-5 font-figtree py-1 rounded-full w-fit text-center bg-error-100 capitalize">
                {rideDetails?.status}
              </p>
            )}
          </div>
          <p className="text-grey-800 text-sm">
            Trip Id: {rideDetails?.booking_id}
          </p>
        </div>

        <div className="flex items-center gap-3">
          {rideDetails?.status === "IN_PROGRESS" && (
            <Button
              hierarchy="secondary"
              leftIcon={<MinusIcon size={16} />}
              className="cursor-pointer"
              onClick={handleOpenForceEndModal}
            >
              Force End Trip
            </Button>
          )}
          {rideDetails?.status === "FORCE_ENDED" && (
            <Button
              hierarchy="primary"
              leftIcon={<PlusIcon size={16} />}
              className="cursor-pointer"
              onClick={handleOpenReassignDriverModal}
            >
              Reassign Driver
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-grey-800 text-xl font-bold font-figtree">
            Service Information
          </h3>

          <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Service Category
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.service_type}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CarIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Ride Status</h1>
                <p
                  className={`text-md font-bold px-5 py-1 rounded-full w-fit text-center capitalize ${
                    rideDetails?.status === "COMPLETED"
                      ? "bg-success-200 text-success-600"
                      : rideDetails?.status === "ONGOING"
                        ? "bg-brand-50 text-brand-600"
                        : rideDetails?.status === "FORCE_END"
                          ? "bg-error-100 text-error-600"
                          : rideDetails?.status === "SCHEDULED"
                            ? "bg-warning-50 text-warning-600"
                            : rideDetails?.status === "CANCELLED"
                              ? "bg-error-100 text-error-600"
                              : "bg-indigo-50 text-indigo-600"
                  }`}
                >
                  {rideDetails?.status}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CalendarIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Date</h1>
                <p className="text-grey-600 text-sm">{rideDetails?.date}</p>
              </div>
            </div>
            {rideDetails?.status === "COMPLETED" && (
              <>
                <div className="flex gap-4 items-center pb-3">
                  <div className="bg-brand-50 rounded-full p-3">
                    <ClockIcon size={24} color="#0077b6" />
                  </div>
                  <div>
                    <h1 className="text-grey-600 text-sm font-bold">
                      Start Time
                    </h1>
                    <p className="text-grey-600 text-sm">
                      {formatDate(rideDetails?.start_time ?? "")}
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-center pb-3">
                  <div className="bg-brand-50 rounded-full p-3">
                    <ClockIcon size={24} color="#0077b6" />
                  </div>
                  <div>
                    <h1 className="text-grey-600 text-sm font-bold">
                      End Time
                    </h1>
                    <p className="text-grey-600 text-sm">
                      {formatDate(rideDetails?.end_time ?? "")}
                    </p>
                  </div>
                </div>
              </>
            )}

            {rideDetails?.status === "CANCELLED" && (
              <div className="flex gap-4 items-center pb-3">
                <div className="bg-brand-50 rounded-full p-3">
                  <ClockIcon size={24} color="#0077b6" />
                </div>
                <div>
                  <h1 className="text-grey-600 text-sm font-bold">
                    Reason for cancelling
                  </h1>
                  <p className="text-grey-600 text-sm">
                    {rideDetails?.cancellation_reason ?? ""}
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <PathIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Total Distance
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.distance_km}km
                </p>
              </div>
            </div>

            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <MapPinIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Pick up</h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.pickup_address}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <MapPinIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">Drop off</h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.dropoff_address}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <TaxiIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">ETA</h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.eta_minutes} mins
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <CreditCardIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Payment Method
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.payment_method}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-800 text-xl font-bold font-figtree">
            Current Location
          </h3>

          <TripMap
            pickupLat={rideDetails?.pickup_lat}
            pickupLng={rideDetails?.pickup_lng}
            dropoffLat={rideDetails?.dropoff_lat}
            dropoffLng={rideDetails?.dropoff_lng}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-grey-800 text-xl font-bold font-figtree">
            Driver Information
          </h3>
          <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Driver&apos;s Name
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.driver_name}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Driver&apos;s Number
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.driver_phone}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Driver&apos;s Email
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.driver_email}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Driver&apos;s Rating
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.driver_rating}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-5">
          <h3 className="text-grey-800 text-xl font-bold font-figtree">
            Customer Information
          </h3>
          <div className="flex flex-col gap-5 divide-y-2 divide-grey-100">
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Customer&apos;s Name
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.customer_name}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Customer&apos;s Number
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.customer_phone}
                </p>
              </div>
            </div>
            <div className="flex gap-4 items-center pb-3">
              <div className="bg-brand-50 rounded-full p-3">
                <UserIcon size={24} color="#0077b6" />
              </div>
              <div>
                <h1 className="text-grey-600 text-sm font-bold">
                  Customer&apos;s Email
                </h1>
                <p className="text-grey-600 text-sm">
                  {rideDetails?.customer_email}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {openReassignDriverModal && (
        <ReassignDriver
          isOpen={openReassignDriverModal}
          onClose={handleCloseReassignDriverModal}
          rideData={{
            id: rideDetails?.booking_id,
            driverDetails: {
              name: rideDetails?.driver_name,
              email: rideDetails?.driver_email,
              image: "",
              rating: rideDetails?.driver_rating,
            },
          }}
        />
      )}

      {openForceEndModal && (
        <ForceEndRide
          isOpen={openForceEndModal}
          onClose={handleCloseForceEndModal}
          rideData={{
            id: rideDetails?.booking_id,
            tripSummary: {
              driver: rideDetails?.driver_name || "",
              customer: rideDetails?.customer_name || "",
              route: rideDetails?.dropoff_address || "",
              fare: rideDetails?.estimated_fare || 0,
            },
          }}
        />
      )}
    </div>
  );
};

export default CargoDetails;
