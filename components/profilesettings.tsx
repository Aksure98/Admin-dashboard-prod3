import { useAppSelector } from "@/store/hooks";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Input, Select } from "./inputs";
import { useGetRoles } from "@/hooks/roles/getRole";
import { useEffect } from "react";

const ProfileSettingsSchema = z.object({
  full_name: z
    .string({ message: "Please enter user full name" })
    .min(1, { message: "Please enter user full name" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone_number: z
    .string({ message: "Phone number is required" })
    .regex(/^(0\d{10}|9\d{9})$/, {
      message: "Enter a valid Nigerian phone number (e.g. 09139022719)",
    }),
  role: z
    .string({ message: "A role must be selected" })
    .refine((val) => val !== "" && val !== "Select a role", {
      message: "A role must be selected",
    }),
});

type ProfileSettingsFormProps = z.infer<typeof ProfileSettingsSchema>;

interface ProfileSettingsProps {
  submitRef: React.MutableRefObject<(() => void) | null>;
}

const ProfileSettings = ({ submitRef }: ProfileSettingsProps) => {
  const userDetail = useAppSelector((state) => state.user);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ProfileSettingsFormProps>({
    resolver: zodResolver(ProfileSettingsSchema),
  });

  const onSubmit = (data: ProfileSettingsFormProps) => {
    console.log("Save profile:", data);
    // call your update profile mutation here e.g:
    // updateProfileMutation.mutateAsync(data)
  };

  // Register this tab's submit with the parent modal
  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit);
  }, [handleSubmit]);

  useEffect(() => {
    if (userDetail) {
      setValue("full_name", userDetail.full_name);
      setValue("email", userDetail.email);

      //@ts-expect-error will work on it later
      const rawPhone = userDetail?.phone_number?.toString() ?? "";
      const localPhone = rawPhone.startsWith("+234")
        ? "0" + rawPhone.slice(4)
        : rawPhone;
      setValue("phone_number", localPhone);

      setValue("role", userDetail?.role ?? "");
    }
  }, [userDetail, setValue]);

  return (
    <div className="mt-5">
      {/* Avatar */}
      <Avatar className="w-[50px] h-[50px]">
        <AvatarImage
          src={userDetail?.logo || undefined}
          alt={userDetail?.full_name || "User"}
        />
        <AvatarFallback>
          {userDetail?.full_name ? userDetail.full_name.charAt(0) : "?"}
        </AvatarFallback>
      </Avatar>

      {/* User info header */}
      <div className="flex gap-5 items-center mt-3">
        <h1 className="text-grey-800 text-2xl font-bold">
          {userDetail?.full_name || "User Name"}
        </h1>
        <p className="text-sm bg-brand-50 px-5 py-2 rounded-full text-brand-600 font-semibold">
          {userDetail?.role}
        </p>
      </div>
      <p className="text-grey-400">{userDetail?.email || "User Email"}</p>

      {/* Form fields */}
      <div className="mt-5 flex flex-col gap-4">
        <Input
          inputType="iconLeading"
          label="Full Name"
          name="full_name"
          placeholder="Enter Full Name"
          register={formRegister}
          destructive={!!errors.full_name}
          hintText={errors.full_name?.message}
        />

        <Input
          inputType="iconLeading"
          label="Role"
          name="role"
          placeholder="Role"
          register={formRegister}
          destructive={!!errors.role}
          hintText={errors.role?.message}
          disabled
        />

        <Input
          inputType="iconLeading"
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
          label="Phone Number"
          name="phone_number"
          placeholder="Enter phone number"
          register={formRegister}
          destructive={!!errors.phone_number}
          hintText={errors.phone_number?.message}
        />
      </div>
    </div>
  );
};

export default ProfileSettings;
