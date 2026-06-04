"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import { Select, TextArea } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { PlusIcon } from "@phosphor-icons/react";
import { useReassignRide } from "@/hooks/rides/assignRides";
import { useGetAvailableDeliveryOperator } from "@/hooks/delivery/getAvailableDeliveryOperators";

interface RideData {
  id?: string;
  driverDetails: {
    name: string;
    email: string;
    rating: number;
    image: string;
  };
}

interface ReassignDriverProps {
  isOpen: boolean;
  onClose: () => void;
  rideData?: RideData;
}

const ReassignDriverSchema = z.object({
  operator_id: z.string().min(1, { message: "Please select a driver" }),
  reason: z
    .string()
    .min(10, { message: "Please enter a reason for reassignment" }),
});

type ReassignDriverFormProps = z.infer<typeof ReassignDriverSchema>;

const ReassignCargoOperator = ({
  isOpen,
  onClose,
  rideData,
}: ReassignDriverProps) => {
  const { mutate: reassignRides, isPending } = useReassignRide(
    rideData?.id ?? "",
  );

  const { data: availableDriver } = useGetAvailableDeliveryOperator(
    rideData?.id ?? "",
  );

  const {
    register: registerReassignDriver,
    handleSubmit,
    formState: { errors: errorsReassignDriver },
    reset,
  } = useForm<ReassignDriverFormProps>({
    resolver: zodResolver(ReassignDriverSchema),
  });

  const handleConfirmReassignment = (values: ReassignDriverFormProps) => {
    reassignRides(values, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Reassign Driver"
      saveButtonText={
        isPending ? "Reassigning Driver ...." : "Confirm Reassignment"
      }
      saveIcon={<PlusIcon size={20} />}
      onCancel={onClose}
      onSave={handleSubmit(handleConfirmReassignment)}
      className="max-w-md"
      isLoading={isPending}
    >
      <div className="flex flex-col gap-7">
        <h2 className="text-neutral-900 text-sm font-normal">
          Trip Id: {rideData?.id}
        </h2>
        <div className="border border-grey-400 rounded-lg p-4 flex flex-col gap-2 bg-grey-50">
          <h3 className="text-grey-800 text-sm font-semibold">
            Current Driver
          </h3>
          <div className="flex justify-between items-start">
            <Avatar>
              <AvatarImage
                src={rideData?.driverDetails?.image}
                alt={rideData?.driverDetails?.name || ""}
              />
              <AvatarFallback>
                {rideData?.driverDetails?.name?.charAt(0).toUpperCase() || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h1 className="text-sm text-gray-600 font-semibold">
                {rideData?.driverDetails?.name}
              </h1>
              <p className="text-sm text-grey-600 font-normal">
                {rideData?.driverDetails?.email}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${
                    star <= Number(rideData?.driverDetails.rating)
                      ? "text-warning-500"
                      : "text-grey-300"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        <Select
          label="Select New Driver"
          name="operator_id"
          options={availableDriver?.data}
          placeholder="select a driver"
          register={registerReassignDriver}
          destructive={!!errorsReassignDriver.operator_id}
        />

        <TextArea
          label="Reason for Reassignment"
          name="reason"
          placeholder="Enter Message"
          size="sm"
          hintText="Maximum 20 character"
          register={registerReassignDriver}
          destructive={!!errorsReassignDriver.reason}
        />
      </div>
    </FormModal>
  );
};

export default ReassignCargoOperator;
