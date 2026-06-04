"use client";
import Image from "next/image";

import Point2Logo from "@/public/images/point2-dark.png";
import { NextPage } from "next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useParams, useRouter } from "next/navigation";
import { Input } from "@/components/inputs";
import Button from "@/components/button";
import { useResetPassword } from "@/hooks/resetPassword";
import Auth from "@/components/layout/authLayout";
import { LockIcon } from "@phosphor-icons/react";
import { notify } from "@/utils/toastStore";

const changePasswordSchema = z.object({
  new_password: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

type ResetPasswordProps = z.infer<typeof changePasswordSchema>;

const ChangePassword: NextPage = () => {
  const resetPasswordMutation = useResetPassword();
  const router = useRouter();

  const params = useParams();
  const token = params.token as string;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ResetPasswordProps>({
    resolver: zodResolver(changePasswordSchema),
  });

  const password = watch("new_password") || "";

  const onSubmit = async (data: ResetPasswordProps) => {
    if (!token) {
      notify({
        type: "danger",
        title: "Error",
        message: "Invalid or expired reset link. Please request a new one.",
        autoClose: true,
        autoCloseDelay: 3000,
      });
      return;
    }

    await resetPasswordMutation.mutateAsync(
      {
        reset_token: token,
        new_password: data.new_password,
      },
      {
        onSuccess: () => {
          reset();
          router.push("/");
        },
      },
    );
  };

  const getPasswordStrength = (password: string) => {
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    return checks.filter(Boolean).length;
  };

  const passwordStrength = getPasswordStrength(password);

  return (
    <Auth>
      <div className="bg-grey-0 flex flex-col gap-5 w-[45rem] rounded-2xl px-20 py-14 shadow-2xl">
        <div className="flex justify-center">
          <Image src={Point2Logo} alt="point2 logo" width={200} height={300} />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-grey-800 text-4xl text-center font-extrabold">
            Change Password
          </h1>
          <p className="text-grey-600 text-center text-xl font-normal">
            Please enter your new password
          </p>
        </div>

        <form
          className="flex w-full flex-col items-start gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start gap-5 w-full">
            <div className="flex w-full flex-col items-start gap-6">
              <Input
                destructive={!!errors.new_password?.message}
                inputType="iconLeading"
                icon={<LockIcon size={16} color="#667085" />}
                type="password"
                label="Password"
                name="new_password"
                placeholder="********"
                register={formRegister}
                className="w-full"
                disabled={resetPasswordMutation.isPending}
                hintText={errors.new_password?.message}
              />
            </div>

            {password && (
              <div className="space-y-2 w-full">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        passwordStrength <= 2
                          ? "bg-error-600"
                          : passwordStrength <= 4
                            ? "bg-warning-600"
                            : "bg-success-600"
                      }`}
                      style={{ width: `${(passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            )}
            <p className="text-grey-600 text-sm font-medium">
              Your password must contain at least 8 characters, one uppercase
              letter, one special character, and one number
            </p>

            <Button
              rightIcon={<LockIcon size={20} />}
              hierarchy="primary"
              size="xl"
              className="w-full cursor-pointer"
              isLoading={resetPasswordMutation.isPending}
              disabled={resetPasswordMutation.isPending}
            >
              Change Password
            </Button>
          </div>
        </form>
      </div>
    </Auth>
  );
};

export default ChangePassword;
