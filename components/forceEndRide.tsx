"use client";

import { Select, TextArea } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { PlusIcon, WarningCircleIcon } from "@phosphor-icons/react";
import { formatPrice } from "@/utils/utils";
import { useForceEndRides } from "@/hooks/rides/forceEndTrips";

interface ForceEndRideData {
  id?: string;
  tripSummary: {
    driver: string;
    customer: string;
    route: string;
    fare: number;
  };
}

interface ForceEndProps {
  isOpen: boolean;
  onClose: () => void;
  rideData?: ForceEndRideData;
}

const reasonOptions = [
  { value: "", label: "Select a reason" },
  { value: "DRIVER_EMERGENCY", label: "Driver Emergency" },
  { value: "DRIVER_REQUEST", label: "Driver Request" },
  { value: "SAFETY_CONCERNS", label: "Safety Concerns" },
  { value: "SYSTEM_ERROR", label: "System Error" },
  { value: "OTHER", label: "Other" },
];

const ForceEndRidesSchema = z.object({
  reason: z.string().min(1, { message: "Please select a reason" }),
  details: z
    .string()
    .min(10, { message: "Please enter a reason for reassignment" }),
});

type ForceEndFormProps = z.infer<typeof ForceEndRidesSchema>;

const ForceEndRide = ({ isOpen, onClose, rideData }: ForceEndProps) => {
  const { mutate: forceEndRide, isPending } = useForceEndRides(
    rideData?.id ?? "",
  );

  const {
    register: registerForceEndRide,
    handleSubmit,
    formState: { errors: errorsForceEndRide },
    reset,
  } = useForm<ForceEndFormProps>({
    resolver: zodResolver(ForceEndRidesSchema),
  });

  const handleConfirmForceEnd = (values: ForceEndFormProps) => {
    forceEndRide(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Force End Trip"
      onSave={handleSubmit(handleConfirmForceEnd)}
      onCancel={onClose}
      saveButtonText={isPending ? "Ending Trip..." : "Force End Trip"}
      saveIcon={<PlusIcon size={20} />}
      className="max-w-xl"
      isLoading={isPending}
    >
      <div className="flex flex-col gap-7">
        <h2 className="text-neutral-900 text-sm font-normal">
          Trip Id: {rideData?.id}
        </h2>

        <div className="border border-grey-200 rounded-xl bg-error-50 px-6 py-4">
          <div className="flex gap-5 items-start ">
            <div>
              <WarningCircleIcon color="#912018" size={24} />
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="font-semibold text-xl text-error-800">Warning</h3>
              <p className="font-normal text-sm text-error-800">
                Editing this trip will mark it as force ended. Both driver and
                customer will be notified. This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <Select
          label="Reason for Ending Trip"
          name="reason"
          options={reasonOptions}
          placeholder="select a reason"
          register={registerForceEndRide}
          destructive={!!errorsForceEndRide.reason}
          hintText={errorsForceEndRide.reason?.message}
        />

        <TextArea
          label="Additional Details"
          name="details"
          placeholder="Enter Message"
          size="sm"
          hintText={
            errorsForceEndRide.details?.message ?? "Minimum 20 characters"
          }
          register={registerForceEndRide}
          destructive={!!errorsForceEndRide.details}
        />

        <div>
          <h3 className="text-grey-800 font-semibold text-sm ">Trip Summary</h3>

          <div className="grid grid-cols-2 bg-grey-50 rounded-xl px-4 py-2 gap-5">
            <div>
              <h6 className="text-grey-800 font-normal text-sm ">Driver</h6>
              <h1 className="text-grey-800 font-semibold text-sm ">
                {rideData?.tripSummary?.driver}
              </h1>
            </div>
            <div>
              <h6 className="text-grey-800 font-normal text-sm ">Customer</h6>
              <h1 className="text-grey-800 font-semibold text-sm ">
                {rideData?.tripSummary?.customer}
              </h1>
            </div>
            <div>
              <h6 className="text-grey-800 font-normal text-sm ">Route</h6>
              <h1 className="text-grey-800 font-semibold text-sm ">
                {rideData?.tripSummary?.route}
              </h1>
            </div>
            <div>
              <h6 className="text-grey-800 font-normal text-sm ">
                Current Fare
              </h6>
              <h1 className="text-grey-800 font-semibold text-sm ">
                {formatPrice(rideData?.tripSummary?.fare || 0)}
              </h1>
            </div>
          </div>
        </div>
      </div>
    </FormModal>
  );
};

export default ForceEndRide;
