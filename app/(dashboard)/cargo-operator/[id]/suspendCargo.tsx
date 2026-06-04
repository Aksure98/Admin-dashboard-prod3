"use client";
import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/modal";
import { Select } from "@/components/inputs";
import { WarningIcon } from "@phosphor-icons/react";

const SuspendCargoSchema = z.object({
  reason: z
    .string({ message: "A reason must be selected" })
    .refine((val) => val !== "" && val !== "Select a reason", {
      message: "A reason must be selected",
    }),
  duration_days: z
    .string({ message: "A suspension duration must be selected" })
    .refine((val) => val !== "" && val !== "Select a duration", {
      message: "A suspension duration must be selected",
    }),
  message: z.string().optional(),
});

type SuspendCargoProps = z.infer<typeof SuspendCargoSchema>;

export type SuspendAccountPayload = {
  reason: string;
  duration_days: number;
  message: string;
};

const reasonOptions: { value: string; label: string }[] = [
  { value: "", label: "Select a reason" },
  { value: "violation_of_terms", label: "Violation of terms of service" },
  { value: "document_verification", label: "Document verification issues" },
  { value: "fraudulent_activity", label: "Fraudulent activity" },
  { value: "payment_issues", label: "Payment issues" },
  { value: "safety_concerns", label: "Safety Concerns" },
  { value: "other", label: "Other" },
];

const durationOptions: { value: string; label: string }[] = [
  { value: "", label: "Select a duration" },
  { value: "7", label: "7 days" },
  { value: "30", label: "30 days" },
  { value: "90", label: "90 days" },
];

interface SuspendCargoFormProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: SuspendAccountPayload) => Promise<void> | void;
  isLoading?: boolean;
}

const SuspendCargo = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}: SuspendCargoFormProps) => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SuspendCargoProps>({
    resolver: zodResolver(SuspendCargoSchema),
  });

  const handleSuspendAccount = async (data: SuspendCargoProps) => {
    const payload: SuspendAccountPayload = {
      reason: data.reason,
      duration_days: Number(data.duration_days),
      message: data.message ?? "",
    };

    if (onConfirm) {
      await onConfirm(payload);
    }

    reset();
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Suspend Account"
      saveButtonText="Confirm Suspension"
      cancelButtonText="Cancel"
      onCancel={() => {
        reset();
        onClose();
      }}
      onSave={handleSubmit(handleSuspendAccount)}
      isLoading={isLoading}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Reason for Suspension"
          name="reason"
          icon={<WarningIcon size={20} color="#667085" />}
          options={reasonOptions}
          register={formRegister}
          placeholder="Select a reason"
          hintText={errors.reason?.message}
          destructive={!!errors.reason}
        />

        <Select
          label="Suspension Duration"
          name="duration_days"
          icon={<WarningIcon size={20} color="#667085" />}
          options={durationOptions}
          register={formRegister}
          placeholder="Select a duration"
          hintText={errors.duration_days?.message}
          destructive={!!errors.duration_days}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">
            Additional Details
          </label>
          <textarea
            {...formRegister("message")}
            placeholder="Enter Message"
            rows={4}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>
      </div>
    </FormModal>
  );
};

export default SuspendCargo;
