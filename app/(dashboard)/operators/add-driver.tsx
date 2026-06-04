"use client";
import z from "zod";
import { NIGERIAN_STATES } from "@/utils/utils";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormModal from "@/components/modal";
import { useAddDriver } from "@/hooks/drivers/addDriver";
import { Input, Select } from "@/components/inputs";
import {
  EnvelopeSimpleIcon,
  MapPinAreaIcon,
  PhoneCallIcon,
  UserIcon,
  FloppyDiskIcon,
  PlusIcon,
} from "@phosphor-icons/react";
import { useEditDriver } from "@/hooks/drivers/editDriver";
import { useEffect } from "react";
import { notify } from "@/utils/toastStore";

const AddDriverSchema = z.object({
  first_name: z
    .string({ message: "Please enter user first name" })
    .min(1, { message: "Please enter full name" }),
  last_name: z
    .string({ message: "Please enter user first name" })
    .min(1, { message: "Please enter full name" }),

  email: z.string().email({ message: "Please enter a valid email" }),

  phone_number: z
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

type AddDriverProps = z.infer<typeof AddDriverSchema>;

interface DriverData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string; // Changed from number to string;
  streetAddress: string;
  state: string;
  city: string;
}

interface AddDriverFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: DriverData | null;
  mode?: "create" | "edit";
}

const AddDriverForm = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddDriverFormProps) => {
  const addDriverMutation = useAddDriver();
  const editDriverMutation = useEditDriver();

  const isLoading = addDriverMutation.isPending || editDriverMutation.isPending;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddDriverProps>({
    resolver: zodResolver(AddDriverSchema),
    defaultValues: {
      first_name: editData?.first_name || "",
      last_name: editData?.first_name || "",
      phone_number: editData?.phone_number || "", // changed to string with fallback
      email: editData?.email || "",
      streetAddress: editData?.streetAddress || "",
      state: editData?.state || "",
      city: editData?.city || "",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("first_name", editData.first_name);
      setValue("last_name", editData.last_name);
      setValue("email", editData.email);
      setValue("phone_number", editData.phone_number);
      setValue("streetAddress", editData.streetAddress);
      setValue("state", editData.state);
      setValue("city", editData.city);
    } else {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
        state: "",
        city: "",
        streetAddress: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSaveAddDriver = async (data: AddDriverProps) => {
    console.log("Form Data:", data);
    console.log("Mode:", mode);
    console.log("Edit ID:", editData?.id);
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
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone_number: data.phone_number,
          city: data.city,
          state: data.state,
          streetAddress: data.streetAddress,
        },
      };
      await editDriverMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      await addDriverMutation.mutateAsync(data, {
        ...data,
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  const stateOptions = [
    // { value: "", label: "Select a state" },
    ...NIGERIAN_STATES.map((state) => ({
      value: state.toLowerCase().replace(/\s+/g, "-"),
      label: state,
    })),
  ];

  if (!isOpen) return null;

  return (
    <FormModal
      title={mode === "edit" ? "Edit Driver" : "Add Driver"}
      saveButtonText={mode === "edit" ? "Save" : "Add Driver"}
      cancelButtonText="Cancel"
      onCancel={onClose}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onSave={handleSubmit(handleSaveAddDriver)}
      isLoading={isLoading}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="First Name"
          name="first_name"
          placeholder="Enter First Name"
          register={formRegister}
          destructive={!!errors.first_name}
          hintText={errors.first_name?.message}
        />
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Last Name"
          name="last_name"
          placeholder="Enter Last Name"
          register={formRegister}
          destructive={!!errors.last_name}
          hintText={errors.last_name?.message}
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
          name="phone_number"
          placeholder="Enter phone number"
          register={formRegister}
          destructive={!!errors.phone_number}
          hintText={errors.phone_number?.message}
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

export default AddDriverForm;
