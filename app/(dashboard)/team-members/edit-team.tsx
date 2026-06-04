"use client";
import { Input, Select } from "@/components/inputs";
import {
  EnvelopeSimpleIcon,
  FloppyDiskIcon,
  MapPinAreaIcon,
  PhoneCallIcon,
  UserIcon,
  UsersIcon,
} from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import { useEditTeam } from "@/hooks/team-members/editTeam";
import { useEffect } from "react";
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

interface EditTeamFormProps {
  isOpen: boolean;
  onClose: () => void;
  // @ts-expect-error i will work on this later
  user: TeamDetails; // Change this to the appropriate type for the user/team member details
}

const EditTeamForm = ({ isOpen, onClose, user }: EditTeamFormProps) => {
  const editTeamMutation = useEditTeam();
  const { data: roleData } = useGetRoles();
  const roles = (roleData?.data ?? []).map((role) => ({
    value: role.role_id,
    label: role.name,
  }));

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddUserProps>({
    resolver: zodResolver(AddUserSchema),
  });

  const normalizeNGPhone = (phone: string) => {
    const trimmed = phone.replace(/\s+/g, "");

    if (trimmed.startsWith("+234")) return trimmed;
    if (trimmed.startsWith("0")) return `+234${trimmed.slice(1)}`;
    return `+234${trimmed}`;
  };

  useEffect(() => {
    if (user) {
      setValue("full_name", user.full_name);
      setValue("email", user.email);

      // ✅ Convert +234XXXXXXXXX back to 0XXXXXXXXX for the input field
      const rawPhone = user?.phone_number?.toString() ?? "";
      const localPhone = rawPhone.startsWith("+234")
        ? "0" + rawPhone.slice(4)
        : rawPhone;
      setValue("phone_number", localPhone);

      setValue("role_id", user?.role?.role_id?.toLowerCase() ?? "");
      setValue("region", user.region);
    }
  }, [user, setValue]);

  // const handleSaveAddTeam = async (data: AddUserProps) => {
  //   await editTeamMutation.mutateAsync(
  //     {
  //       id: user.id,
  //       values: {
  //         ...data,
  //         phone_number: normalizeNGPhone(data.phone_number),
  //       },
  //     },
  //     {
  //       onSuccess: () => {
  //         reset();
  //         onClose();
  //       },
  //     },
  //   );
  // };

  const handleSaveAddTeam = async (data: AddUserProps) => {
    const { email, region, ...rest } = data; // ✅ destructure out email and region

    await editTeamMutation.mutateAsync(
      {
        id: user.id,
        values: {
          ...rest,
          //@ts-expect-error will work on it later
          phone_number: normalizeNGPhone(data.phone_number),
        },
      },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Edit Team Member"
      saveButtonText="Save"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={handleSubmit(handleSaveAddTeam)}
      isLoading={editTeamMutation.isPending}
      saveIcon={<FloppyDiskIcon size={20} />}
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
          disabled
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
        {/* <Select
          label="Region"
          name="region"
          icon={<MapPinAreaIcon size={20} color="#667085" />}
          options={regionsOption}
          register={formRegister}
          placeholder="Select a region"
          hintText={errors.region?.message}
          destructive={!!errors.region}
        /> */}
        <Input
          label="Region"
          name="region"
          icon={<MapPinAreaIcon size={20} color="#667085" />}
          register={formRegister}
          placeholder="Select a region"
          hintText={errors.region?.message}
          destructive={!!errors.region}
          disabled
        />
      </div>
    </FormModal>
  );
};

export default EditTeamForm;
