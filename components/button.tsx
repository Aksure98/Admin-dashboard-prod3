import React from "react";
import Link from "next/link";
import { NextPage } from "next";
import { ButtonProps } from "@/@types";

const Button: NextPage<ButtonProps> = ({
  size = "md",
  hierarchy = "primary",
  leftIcon,
  rightIcon,
  destructive = false,
  warning = false,
  isLoading = false,
  disabled = false,
  onClick,
  children,
  href,
  spinnerColor,
  spinnerSize,
  className,
  ...props
}) => {
  const sizeClasses: { [key: string]: string } = {
    sm: "py-2 px-3.5 gap-1 text-xs md:text-sm font-semibold",
    md: "py-2.5 px-4 gap-1 text-xs md:text-sm font-semibold",
    lg: "py-2.5 px-[18px] gap-2 text-sm md:text-base font-semibold",
    xl: "py-3 px-5 gap-2 text-sm md:text-base font-semibold",
    "2xl": "py-4 px-8 gap-2 text-base md:text-lg font-semibold",
  };

  const hierarchyClasses: { [key: string]: string } = {
    primary: warning
      ? "rounded-lg border border-warning-600 bg-warning-600 text-white shadow-xs hover:border-warning-700 hover:bg-warning-700 focus:border-warning-600 focus:bg-warning-600 focus:ring-4 focus:ring-warning-100 disabled:border-warning-200 disabled:bg-warning-200 disabled:cursor-not-allowed"
      : destructive
        ? "rounded-lg border border-error-600 bg-error-600 text-white shadow-xs hover:border-error-700 hover:bg-error-700 focus:border-error-600 focus:bg-error-600 focus:ring-4 focus:ring-error-100 disabled:border-error-200 disabled:bg-error-200 disabled:cursor-not-allowed"
        : "rounded-lg border border-brand-600 bg-brand-600 text-white shadow-xs hover:border-brand-700 hover:bg-brand-700 focus:ring-4 focus:ring-brand-100 disabled:border-brand-200 disabled:bg-brand-200 disabled:text-grey-400 disabled:cursor-not-allowed",
    secondary: warning
      ? "rounded-lg bg-warning-25 text-warning-800 shadow-xs hover:border-warning-400 hover:bg-warning-100 hover:text-warning-800 focus:border-warning-300 focus:bg-warning-50 focus:text-warning-700 focus:ring-4 focus:ring-warning-100 disabled:border-warning-200 disabled:bg-warning-25 disabled:text-warning-300 disabled:cursor-not-allowed"
      : destructive
        ? "rounded-lg border border-error-300 bg-error-50 text-error-700 shadow-xs hover:border-error-400 hover:bg-error-100 hover:text-error-800 focus:border-error-300 focus:bg-error-50 focus:text-error-700 focus:ring-4 focus:ring-error-100 disabled:border-error-200 disabled:bg-error-25 disabled:text-error-300 disabled:cursor-not-allowed"
        : "rounded-lg  bg-brand-50 text-brand-700 shadow-xs hover:border-brand-400 hover:bg-brand-100 hover:text-brand-800 focus:border-brand-300 focus:bg-brand-50 focus:text-brand-700 focus:ring-4 focus:ring-brand-100 disabled:border-brand-200 disabled:bg-brand-700 disabled:text-brand-300 disabled:cursor-not-allowed",
    tertiary: warning
      ? "rounded-lg text-warning-700 hover:text-warning-800 hover:bg-warning-50 focus:text-warning-700 focus:bg-warning-50 disabled:text-warning-300 disabled:cursor-not-allowed"
      : destructive
        ? "rounded-lg text-error-700 hover:text-error-800 hover:bg-error-50 focus:text-error-700 focus:bg-error-50 disabled:text-error-300 disabled:cursor-not-allowed"
        : "rounded-lg text-brand-700 hover:text-brand-800 hover:bg-brand-50 focus:text-brand-700 focus:bg-brand-50 disabled:text-grey-400 disabled:bg-transparent disabled:cursor-not-allowed",
    link: warning
      ? "text-warning-700 hover:text-warning-800 focus:text-warning-700 disabled:text-warning-300 disabled:cursor-not-allowed"
      : destructive
        ? "text-error-700 hover:text-error-800 focus:text-error-700 disabled:text-error-300 disabled:cursor-not-allowed"
        : "text-brand-700 hover:text-brand-800 focus:text-brand-700 disabled:text-grey-400 disabled:cursor-not-allowed",
  };

  const classNames = `outline-none transition-all flex items-center ${
    href ? "justify-center" : "justify-center"
  } ${sizeClasses[size]} ${hierarchyClasses[hierarchy]} ${
    isLoading ? "opacity-50" : ""
  } ${className}`;

  if (href) {
    return (
      <Link
        className={`flex ${classNames}`}
        href={href}
        {...props}
        onClick={onClick}
      >
        <>
          {leftIcon && <span>{leftIcon}</span>}
          {children}
          {rightIcon && <span>{rightIcon}</span>}
        </>
      </Link>
    );
  }

  return (
    <button
      className={classNames}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading ? (
        <svg
          className={`animate-spin -ml-1 mr-3 h-5 w-5 ${
            spinnerColor || "text-white"
          }`}
          fill="none"
          height={spinnerSize || "24"}
          viewBox="0 0 24 24"
          width={spinnerSize || "24"}
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            fill="currentColor"
          ></path>
        </svg>
      ) : (
        <>
          {leftIcon && <span className="">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="">{rightIcon}</span>}
        </>
      )}
    </button>
  );
};

export default Button;
