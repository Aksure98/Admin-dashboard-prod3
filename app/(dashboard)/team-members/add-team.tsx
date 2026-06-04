"use client";
import { Input, Select } from "@/components/inputs";
import {
  EnvelopeSimpleIcon,
  MapPinAreaIcon,
  PhoneCallIcon,
  UserIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddTeam } from "@/hooks/team-members/addTeam";
import FormModal from "@/components/modal";
import { useGetRoles } from "@/hooks/roles/getRole";

const AddUserSchema = z.object({
  full_name: z
    .string({ message: "Please enter user full name" })
    .min(1, { message: "Please enter user full name" }),

  email: z.string().email({ message: "Please enter a valid email" }),

  phone_number: z
    .string({ message: "Phone number is required" })
    .regex(/^(0\d{10}|9\d{9})$/, {
      message: "Enter a valid Nigerian phone number (e.g. 09139022719)",
    }),

  role_id: z
    .string({ message: "A role must be selected" })
    .refine((val) => val !== "" && val !== "Select a role", {
      message: "A role must be selected",
    }),

  region: z
    .string({ message: "A region must be selected" })
    .refine((val) => val !== "" && val !== "Select a region", {
      message: "A region must be selected",
    }),
});

type AddUserProps = z.infer<typeof AddUserSchema>;

// ✅ Explicitly typed
const regionsOption: { value: string; label: string }[] = [
  { value: "", label: "Select a region" },
  { value: "lagos", label: "Lagos" },
];

interface AddTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddTeamForm = ({ isOpen, onClose }: AddTeamFormProps) => {
  const addTeamMutation = useAddTeam();
  const { data: roleData } = useGetRoles();

  // ✅ Added default "Select a role" option + coerce value to string
  const roles: { value: string; label: string }[] = [
    { value: "", label: "Select a role" },
    ...(roleData?.data ?? []).map((role) => ({
      value: String(role.role_id),
      label: role.name,
    })),
  ];

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AddUserProps>({
    resolver: zodResolver(AddUserSchema),
  });

  const normalizeNGPhone = (phone: string) => {
    const trimmed = phone.replace(/\s+/g, "");

    if (trimmed.startsWith("+234")) return trimmed;
    if (trimmed.startsWith("0")) return `+234${trimmed.slice(1)}`;
    return `+234${trimmed}`;
  };

  // ✅ Removed explicit AddUserProps type on payload (avoids re-typing transformed data)
  const handleSaveAddTeam = async (data: AddUserProps) => {
    const payload = {
      ...data,
      phone_number: normalizeNGPhone(data.phone_number),
    };
    //@ts-expect-error will work on it later
    await addTeamMutation.mutateAsync(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Add Team Member"
      saveButtonText="Add Team Member"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={handleSubmit(handleSaveAddTeam)}
      isLoading={addTeamMutation.isPending}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Full Name"
          name="full_name"
          placeholder="Enter Full Name"
          register={formRegister}
          destructive={!!errors.full_name}
          hintText={errors.full_name?.message}
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

        <Select
          label="Role"
          name="role_id"
          icon={<UsersIcon size={20} color="#667085" />}
          options={roles}
          register={formRegister}
          placeholder="Select a role"
          hintText={errors.role_id?.message}
          destructive={!!errors.role_id}
        />
        <Select
          label="Region"
          name="region"
          icon={<MapPinAreaIcon size={20} color="#667085" />}
          options={regionsOption}
          register={formRegister}
          placeholder="Select a region"
          hintText={errors.region?.message}
          destructive={!!errors.region}
        />
      </div>
    </FormModal>
  );
};

export default AddTeamForm;
