"use client";

import React from "react";
import { CircleNotchIcon, PlusIcon, XIcon } from "@phosphor-icons/react";
import Button from "./button";

interface FormModalProps {
  title?: string;
  subtitle?: string;
  saveButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
  saveIcon?: React.ReactNode;
  cancelIcon?: React.ReactNode;
  className?: string;
  showSaveButton?: boolean;
}

const FormModal: React.FC<FormModalProps> = ({
  title = "Form",
  saveButtonText = "Save",
  cancelButtonText = "Cancel",
  showCancelButton = false,
  onSave,
  onCancel,
  children,
  isLoading = false,
  saveIcon = <PlusIcon size={20} />,
  cancelIcon,
  className = "",
  subtitle,
  showSaveButton = true,
}) => {
  return (
    <div className="fixed inset-0 bg-grey-950/70  flex items-start justify-end z-50 h-screen overflow-x-hidden overflow-y-scroll scrollbar-hide">
      <div
        className={`bg-grey-0 w-full px-6 py-6 shadow-2xl animate-slide-in flex flex-col gap-6 rounded-lg max-h-[95vh] ${className}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between flex-shrink-0">
          <h2 className="text-3xl font-bold text-grey-900">{title}</h2>
          <div
            onClick={onCancel}
            className="text-grey-800 hover:text-gray-600 transition-colors cursor-pointer"
          >
            <XIcon size={20} />
          </div>
        </div>
        <p className="flex-shrink-0">{subtitle}</p>

        {/* Form Content - scrollable area */}
        <div className="flex-1 overflow-y-auto">{children}</div>

        {/* Action Buttons */}
        <div className="flex-shrink-0">
          <div
            className={`flex gap-3 ${showCancelButton ? "" : "justify-center"}`}
          >
            {showCancelButton && (
              <Button
                hierarchy="secondary"
                className="w-full cursor-pointer"
                size="lg"
                onClick={onCancel}
                leftIcon={cancelIcon}
              >
                {cancelButtonText}
              </Button>
            )}

            {showSaveButton && (
              <Button
                className="cursor-pointer w-full"
                size="lg"
                leftIcon={
                  isLoading ? (
                    <CircleNotchIcon size={20} className="animate-spin" />
                  ) : (
                    saveIcon
                  )
                }
                onClick={onSave}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : saveButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default FormModal;
