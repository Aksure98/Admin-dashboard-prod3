"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/modal";
import { Input, Select } from "@/components/inputs";
import {
  CalendarBlankIcon,
  FileArrowUpIcon,
  IdentificationCardIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useRef, useState } from "react";

const AddDriverDocumentSchema = z.object({
  driver: z.string().min(1, { message: "Please select a driver" }),
  documentType: z.string().min(1, { message: "Please select a document type" }),
  documentNumber: z
    .string({ message: "Please enter a document number" })
    .min(3, { message: "Document number must be at least 3 characters" }),
  expiresAt: z.string({ message: "Please select an expiry date" }),
  status: z.string().min(1, { message: "Please select a status" }),
});

type AddDriverDocumentFormValues = z.infer<typeof AddDriverDocumentSchema>;

interface AddDriverDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  driverOptions: Array<{ value: string; label: string }>;
}

const documentTypeOptions = [
  { value: "vehicle-license", label: "Vehicle License" },
  { value: "vehicle-insurance", label: "Vehicle Insurance" },
  { value: "drivers-license", label: "Drivers License" },
];

const statusOptions = [
  { value: "verified", label: "Verified" },
  { value: "unverified", label: "Unverified" },
  { value: "in-progress", label: "In Progress" },
];

const AddDriverDocument: React.FC<AddDriverDocumentProps> = ({
  isOpen,
  onClose,
  driverOptions,
}) => {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddDriverDocumentFormValues>({
    resolver: zodResolver(AddDriverDocumentSchema),
    defaultValues: {
      driver: "",
      documentType: "",
      documentNumber: "",
      expiresAt: "",
      status: "",
    },
  });

  const onSubmit = async (values: AddDriverDocumentFormValues) => {
    // Placeholder for future API integration
    console.log("Add driver document", values);
    onClose();
    reset();
    setSelectedFileName(null);
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Add Drivers Document"
      saveButtonText="Add Drivers Document"
      onCancel={onClose}
      onSave={handleSubmit(onSubmit)}
      isLoading={isSubmitting}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Select
          label="Driver"
          name="driver"
          icon={<UserIcon size={20} color="#667085" />}
          options={driverOptions}
          register={register}
          placeholder="Select Driver"
          destructive={!!errors.driver}
          hintText={errors.driver?.message}
        />

        <Select
          label="Document Type"
          name="documentType"
          icon={<IdentificationCardIcon size={20} color="#667085" />}
          options={documentTypeOptions}
          register={register}
          placeholder="Select Document Type"
          destructive={!!errors.documentType}
          hintText={errors.documentType?.message}
        />

        <Input
          inputType="iconLeading"
          icon={<IdentificationCardIcon size={16} />}
          label="Document Number"
          name="documentNumber"
          placeholder="Enter Document Number"
          register={register}
          destructive={!!errors.documentNumber}
          hintText={errors.documentNumber?.message}
        />

        <Input
          inputType="iconLeading"
          icon={<CalendarBlankIcon size={16} />}
          label="Expires At"
          name="expiresAt"
          type="date"
          register={register}
          destructive={!!errors.expiresAt}
          hintText={errors.expiresAt?.message}
        />

        <Select
          label="Status"
          name="status"
          icon={<IdentificationCardIcon size={20} color="#667085" />}
          options={statusOptions}
          register={register}
          placeholder="Select Status"
          destructive={!!errors.status}
          hintText={errors.status?.message}
        />

        <button
          type="button"
          className="mt-2 border border-dashed border-grey-300 rounded-2xl bg-grey-50 px-4 py-8 flex flex-col items-center justify-center text-center gap-2 cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-2">
            <FileArrowUpIcon size={24} className="text-brand-600" />
          </div>
          <p className="text-sm text-grey-600">
            <span className="text-brand-600 font-semibold cursor-pointer">
              Click here
            </span>{" "}
            to upload your file or drag.
          </p>
          <p className="text-xs text-grey-500">
            Supported Format: SVG, JPG, PNG (10mb each)
          </p>
          {selectedFileName && (
            <p className="mt-2 text-xs text-grey-700">
              Selected file:{" "}
              <span className="font-semibold">{selectedFileName}</span>
            </p>
          )}
          <input
            type="file"
            className="hidden"
            id="driver-document-file"
            accept=".svg,.jpg,.jpeg,.png"
            ref={fileInputRef}
            onChange={(event) => {
              const file = event.target.files?.[0];
              setSelectedFileName(file ? file.name : null);
            }}
          />
        </button>
      </div>
    </FormModal>
  );
};

export default AddDriverDocument;
