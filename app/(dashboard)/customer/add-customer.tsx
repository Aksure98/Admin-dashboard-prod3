"use client";
import { Input } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import {
  EnvelopeSimpleIcon,
  FloppyDiskIcon,
  PhoneCallIcon,
  PlusIcon,
  UserIcon,
} from "@phosphor-icons/react";
import { useEffect } from "react";
import { useAddCustomer } from "@/hooks/customer/addCustomer";
import { useEditCustomer } from "@/hooks/customer/editCustomer";
import { notify } from "@/utils/toastStore";

const AddCustomerSchema = z.object({
  first_name: z.string().min(1, { message: "Please enter your full name" }),
  last_name: z.string().min(1, { message: "Please enter your full name" }),
  email: z.string().email({ message: "Enter a valid email" }),
  phone_number: z
    .string({ message: "Phone number is required" })
    .min(10, { message: "Phone number should be a minimum of 10 digits" })
    .max(11, { message: "Phone number should be maximum of 11 digits" })
    .regex(/^\d+$/, { message: "Phone number must contain only digits" }),
});

type AddCustomerProps = z.infer<typeof AddCustomerSchema>;

interface CustomerData {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
}

interface AddCustomerFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: CustomerData | null;
  mode?: "create" | "edit";
}

const AddCustomer = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddCustomerFormProps) => {
  const addCustomerMutation = useAddCustomer();
  const editCustomerMutation = useEditCustomer();
  const isLoading =
    addCustomerMutation.isPending || editCustomerMutation.isPending;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddCustomerProps>({
    resolver: zodResolver(AddCustomerSchema),
    defaultValues: {
      first_name: editData?.first_name || "",
      last_name: editData?.last_name || "",
      email: editData?.email || "",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("first_name", editData.first_name);
      setValue("last_name", editData.last_name);
      setValue("email", editData.email);
      setValue("phone_number", editData.phone_number);
    } else {
      reset({
        first_name: "",
        last_name: "",
        email: "",
        phone_number: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSaveAddCustomer = async (data: AddCustomerProps) => {
    console.log("Form Data:", data);
    console.log("Mode:", mode);
    console.log("Edit ID:", editData?.id);

    if (mode === "edit") {
      if (!editData?.id) {
        notify({
          type: "danger",
          title: "Error",
          message: "Customer ID is missing", // Changed from "Role ID"
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
        },
      };
      //@ts-expect-error will work on it later
      await editCustomerMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      //@ts-expect-error hhh
      await addCustomerMutation.mutateAsync(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;
  return (
    <FormModal
      title={mode === "edit" ? "Edit Customer" : "Create Customer"}
      saveButtonText={mode === "edit" ? "Save" : "Create Customer"}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onCancel={onClose}
      onSave={handleSubmit(handleSaveAddCustomer)}
      className="max-w-md"
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-6">
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
          label="Email"
          name="email"
          placeholder="Enter a valid email"
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
      </div>
    </FormModal>
  );
};

export default AddCustomer;
