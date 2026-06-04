"use client";
import z from "zod";
import { NIGERIAN_STATES } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/modal";
import { useAddCargo } from "@/hooks/cargo/addCargo";
import { Input, Select } from "@/components/inputs";
import {
  EnvelopeSimpleIcon,
  MapPinAreaIcon,
  PhoneCallIcon,
  UserIcon,
  FloppyDiskIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useEditCargo } from "@/hooks/cargo/editCargo";
import { useEffect } from "react";
import { notify } from "@/utils/toastStore";

const AddCargoSchema = z.object({
  fullName: z
    .string({ message: "Please enter user full name" })
    .min(1, { message: "Please enter full name" }),

  email: z.string().email({ message: "Please enter a valid email" }),

  phoneNumber: z
    .string({ message: "Phone number is required" })
    .min(10, { message: "Phone number should be a minimum of 10 digits" })
    .max(11, { message: "Phone number should be maximum of 11 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),

  streetAddress: z
    .string({ message: "An address must be filled in" })
    .min(7, { message: "Please enter full address" }),

  state: z
    .string({ message: "A state must be selected" })
    .refine((val) => val !== "" && val !== "Select state", {
      message: "A state must be selected",
    }),

  city: z
    .string({ message: "Please enter your city" })
    .min(1, { message: "Please enter your city" }),
});

type AddCargoProps = z.infer<typeof AddCargoSchema>;

interface CargoData {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  streetAddress: string;
  state: string;
  city: string;
}

interface AddCargoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: CargoData | null;
  mode?: "create" | "edit";
}

const AddCargoForm = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddCargoFormProps) => {
  const addCargoMutation = useAddCargo();
  const editCargoMutation = useEditCargo();

  const isLoading = addCargoMutation.isPending || editCargoMutation.isPending;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddCargoProps>({
    resolver: zodResolver(AddCargoSchema),
    defaultValues: {
      fullName: editData?.fullName || "",
      phoneNumber: editData?.phoneNumber || "",
      email: editData?.email || "",
      streetAddress: editData?.streetAddress || "",
      state: editData?.state || "",
      city: editData?.city || "",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("fullName", editData.fullName);
      setValue("email", editData.email);
      setValue("phoneNumber", editData.phoneNumber);
      setValue("streetAddress", editData.streetAddress);
      setValue("state", editData.state);
      setValue("city", editData.city);
    } else {
      reset({
        fullName: "",
        email: "",
        phoneNumber: "",
        state: "",
        city: "",
        streetAddress: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSaveAddCargo = async (data: AddCargoProps) => {
    if (mode === "edit") {
      if (!editData?.id) {
        notify({
          type: "danger",
          title: "Error",
          message: "Customer ID is missing",
          autoClose: true,
          autoCloseDelay: 3000,
        });
        return;
      }

      const payload = {
        id: editData.id,
        values: {
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          city: data.city,
          state: data.state,
          streetAddress: data.streetAddress,
        },
      };

      await editCargoMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      await addCargoMutation.mutateAsync(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  const stateOptions = [
    { value: "", label: "Select a state" },
    ...NIGERIAN_STATES.map((state) => ({
      value: state.toLowerCase().replace(/\s+/g, "-"),
      label: state,
    })),
  ];

  if (!isOpen) return null;

  return (
    <FormModal
      title={mode === "edit" ? "Edit Cargo Driver" : "Add Cargo Driver"}
      saveButtonText={mode === "edit" ? "Save" : "Add Cargo Driver"}
      cancelButtonText="Cancel"
      onCancel={onClose}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onSave={handleSubmit(handleSaveAddCargo)}
      isLoading={isLoading}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Full Name"
          name="fullName"
          placeholder="Enter Full Name"
          register={formRegister}
          destructive={!!errors.fullName}
          hintText={errors.fullName?.message}
        />

        <Input
          inputType="iconLeading"
          icon={<EnvelopeSimpleIcon size={16} />}
          label="Email Address"
          name="email"
          placeholder="Enter a valid email address"
          register={formRegister}
          destructive={!!errors.email}
          hintText={errors.email?.message}
        />

        <Input
          inputType="iconLeading"
          icon={<PhoneCallIcon size={16} />}
          label="Phone Number"
          name="phoneNumber"
          placeholder="Enter phone number"
          register={formRegister}
          destructive={!!errors.phoneNumber}
          hintText={errors.phoneNumber?.message}
        />

        <Input
          inputType="iconLeading"
          icon={<MapPinAreaIcon size={16} />}
          label="Street Address"
          name="streetAddress"
          placeholder="Enter Street Address"
          register={formRegister}
          destructive={!!errors.streetAddress}
          hintText={errors.streetAddress?.message}
        />
        <Select
          label="State"
          name="state"
          icon={<MapPinAreaIcon size={20} color="#667085" />}
          options={stateOptions}
          register={formRegister}
          placeholder="Select State"
          hintText={errors.state?.message}
          destructive={!!errors.state}
        />

        <Input
          inputType="iconLeading"
          icon={<MapPinAreaIcon size={16} />}
          label="City"
          name="city"
          placeholder="Enter City"
          register={formRegister}
          destructive={!!errors.city}
          hintText={errors.city?.message}
        />
      </div>
    </FormModal>
  );
};

export default AddCargoForm;
