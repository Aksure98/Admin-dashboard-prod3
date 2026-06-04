"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Input } from "./inputs";
import z from "zod";
import { useChangePassword } from "@/hooks/changePassword";

const ChangePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    new_password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
      }),
    confirm_password: z
      .string()
      .min(1, { message: "Please confirm your password" }),
  })
  .refine((data) => data.new_password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"], // error shows on confirm_password field
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: "New password must be different from your current password",
    path: ["new_password"], // error shows on new_password field
  });

type ChangePasswordFormProps = z.infer<typeof ChangePasswordSchema>;

interface ChangePasswordProps {
  submitRef: React.MutableRefObject<(() => void) | null>;
}

const ChangePassword = ({ submitRef }: ChangePasswordProps) => {
  const changePasswordMutation = useChangePassword();
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormProps>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormProps) => {
    const { confirm_password, ...payload } = data;

    //@ts-expect-error will work on it later
    changePasswordMutation.mutateAsync(payload, {
      onSuccess: () => reset(),
    });
  };

  // Register this tab's submit with the parent modal
  useEffect(() => {
    submitRef.current = handleSubmit(onSubmit);
  }, [handleSubmit]);

  return (
    <div className="mt-5 flex flex-col items-start gap-6">
      <Input
        destructive={!!errors.current_password}
        inputType="iconLeading"
        type="password"
        label="Current Password"
        name="current_password"
        placeholder="********"
        register={formRegister}
        className="w-full"
        hintText={errors.current_password?.message}
      />
      <Input
        destructive={!!errors.new_password}
        inputType="iconLeading"
        type="password"
        label="New Password"
        name="new_password"
        placeholder="********"
        register={formRegister}
        className="w-full"
        hintText={errors.new_password?.message}
      />
      <Input
        destructive={!!errors.confirm_password}
        inputType="iconLeading"
        type="password"
        label="Confirm Password"
        name="confirm_password"
        placeholder="********"
        register={formRegister}
        className="w-full"
        hintText={errors.confirm_password?.message}
      />
    </div>
  );
};

export default ChangePassword;
