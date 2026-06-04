"use client";

import Image from "next/image";
import Auth from "../layout/authLayout";
import Point2Logo from "@/public/images/point2-dark.png";
import { NextPage } from "next";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Input } from "../inputs";
import {
  EnvelopeSimpleIcon,
  LockIcon,
  SignInIcon,
} from "@phosphor-icons/react";
import Button from "../button";
import Link from "next/link";
import { Checkbox } from "../checkbox";
import { useEffect, useState } from "react";
import { useSignIn } from "@/hooks/signin";
import { signInProps } from "@/@types";

const REMEMBER_EMAIL_KEY = "remembered_email";
const REMEMBER_EXPIRY_KEY = "remembered_email_expiry";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

const LoginSchema = z.object({
  email: z.email({
    message: "Please enter a valid email",
  }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 character" })
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/, {
      message:
        "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character",
    }),
});

const Login: NextPage = () => {
  const signInMutation = useSignIn();
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<signInProps>({
    resolver: zodResolver(LoginSchema),
  });

  // Load remembered email on mount, clear if expired
  useEffect(() => {
    try {
      const expiry = localStorage.getItem(REMEMBER_EXPIRY_KEY);
      const email = localStorage.getItem(REMEMBER_EMAIL_KEY);

      if (expiry && Date.now() > Number(expiry)) {
        // Expired — clear everything
        localStorage.removeItem(REMEMBER_EMAIL_KEY);
        localStorage.removeItem(REMEMBER_EXPIRY_KEY);
        return;
      }

      if (email) {
        setValue("email", email);
        setRememberMe(true);
      }
    } catch {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_EXPIRY_KEY);
    }
  }, [setValue]);

  const onSubmit = async (data: signInProps) => {
    if (rememberMe) {
      localStorage.setItem(REMEMBER_EMAIL_KEY, data.email);
      localStorage.setItem(
        REMEMBER_EXPIRY_KEY,
        String(Date.now() + THIRTY_DAYS_MS),
      );
    } else {
      localStorage.removeItem(REMEMBER_EMAIL_KEY);
      localStorage.removeItem(REMEMBER_EXPIRY_KEY);
    }

    await signInMutation.mutateAsync(data, {
      onSuccess: () => {
        reset();
        router.push("/dashboard");
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
            Welcome Back
          </h1>
          <p className="text-grey-600 text-center text-xl font-normal">
            Sign in with your admin credentials. Unauthorized access will be
            logged and reported.
          </p>
        </div>

        <form
          className="flex w-full flex-col items-start gap-8"
          onSubmit={handleSubmit(onSubmit)}
          // Let the browser handle password autofill securely
          autoComplete="on"
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
                disabled={signInMutation.isPending}
                hintText={errors.email?.message}
                autoComplete="email"
              />
              <Input
                destructive={!!errors.password?.message}
                inputType="iconLeading"
                icon={<LockIcon size={16} color="#667085" />}
                type="password"
                label="Password"
                name="password"
                placeholder="********"
                register={formRegister}
                className="w-full"
                disabled={signInMutation.isPending}
                hintText={errors.password?.message}
                autoComplete="current-password"
              />
            </div>
            <div className="flex justify-between items-center w-full">
              <div className="flex gap-1 items-center">
                <div className="flex items-center h-5">
                  <Checkbox
                    id="rememberMe"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked === true)
                    }
                    data-testid="remember-me-checkbox"
                  />
                </div>
                <p className="text-grey-800 text-sm font-semibold">
                  Remember For 30 Days
                </p>
              </div>

              <Link
                href="/forgot-password"
                className="text-brand-600 text-sm font-bold"
              >
                Forgot Password
              </Link>
            </div>
            <Button
              rightIcon={<SignInIcon size={16} />}
              hierarchy="primary"
              size="xl"
              className="w-full cursor-pointer"
              isLoading={signInMutation.isPending}
              disabled={signInMutation.isPending}
            >
              Login
            </Button>
          </div>
        </form>
      </div>
    </Auth>
  );
};

export default Login;
