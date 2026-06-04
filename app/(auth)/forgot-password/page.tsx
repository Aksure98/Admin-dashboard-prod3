"use client";
import Image from "next/image";

import Point2Logo from "@/public/images/point2-dark.png";
import { NextPage } from "next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForgotPassword } from "@/hooks/forgotPassword";
import Auth from "@/components/layout/authLayout";
import {
  CaretLeftIcon,
  EnvelopeSimpleIcon,
  LockIcon,
} from "@phosphor-icons/react";
import { Input } from "@/components/inputs";
import Button from "@/components/button";
import { forgotPasswordProps } from "@/@types";

const ForgotPasswordSchema = z.object({
  email: z.email({
    message: "Please enter a valid email",
  }),
});

const ForgotPassword: NextPage = () => {
  const forgotPasswordMutation = useForgotPassword();
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<forgotPasswordProps>({
    resolver: zodResolver(ForgotPasswordSchema),
  });

  const onSubmit = async (data: forgotPasswordProps) => {
    await forgotPasswordMutation.mutateAsync(data, {
      onSuccess: () => {
        reset();
        router.push("/");
      },
    });
  };

  return (
    <Auth>
      <div className="bg-grey-0 flex flex-col gap-5 w-[45rem] rounded-2xl px-20 py-14 shadow-2xl">
        <div className="flex justify-center">
          <Image src={Point2Logo} alt="point2 logo" width={200} height={300} />
        </div>

        <div className="flex flex-col gap-3">
          <h1 className="text-grey-800 text-4xl text-center font-extrabold">
            Forgot Password
          </h1>
          <p className="text-grey-600 text-center text-xl font-normal">
            Please enter your registered email address below
          </p>
        </div>

        <form
          className="flex w-full flex-col items-start gap-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-col items-start gap-6 w-full">
            <div className="flex w-full flex-col items-start gap-6">
              <Input
                destructive={!!errors.email?.message}
                inputType="iconLeading"
                icon={<EnvelopeSimpleIcon size={16} color="#667085" />}
                type="email"
                label="Email address"
                name="email"
                placeholder="janedoe@gmail.com"
                register={formRegister}
                className="w-full"
                disabled={forgotPasswordMutation.isPending}
                hintText={errors.email?.message}
              />
            </div>

            <Button
              rightIcon={<LockIcon size={16} />}
              hierarchy="primary"
              size="xl"
              className="w-full cursor-pointer"
              isLoading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
            >
              Reset Password
            </Button>
            <Button
              leftIcon={<CaretLeftIcon size={16} />}
              hierarchy="secondary"
              size="xl"
              className="w-full cursor-pointer"
              isLoading={forgotPasswordMutation.isPending}
              disabled={forgotPasswordMutation.isPending}
            >
              <Link href="/">Back to Login</Link>
            </Button>
          </div>
        </form>
      </div>
    </Auth>
  );
};

export default ForgotPassword;
