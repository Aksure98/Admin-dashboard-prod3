"use client";
import { useToastStore } from "@/utils/toastStore";
import { CheckCircleIcon, XIcon } from "@phosphor-icons/react";
import { useState, useEffect } from "react";

const Toaster = () => {
  const {
    isOpen,
    type,
    title,
    message,
    autoClose,
    autoCloseDelay,
    onConfirm,
    confirmText,
    cancelText,
    hide,
  } = useToastStore();

  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!isOpen) {
      setProgress(100);
      return;
    }

    if (!autoClose) {
      setProgress(100);
      return;
    }

    setProgress(100);

    const startTimeout = setTimeout(() => {
      const startTime = Date.now();

      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / autoCloseDelay) * 100);
        setProgress(remaining);

        if (remaining === 0) {
          clearInterval(interval);
          hide();
        }
      }, 16);

      return () => clearInterval(interval);
    }, 50);

    return () => clearTimeout(startTimeout);
  }, [isOpen, autoClose, autoCloseDelay, hide]);

  if (!isOpen) return null;

  const config = {
    success: {
      icon: CheckCircleIcon,
      iconBg: "bg-success-50",
      iconColor: "text-success-600",
      accentColor: "bg-success-500",
    },
    warning: {
      icon: CheckCircleIcon,
      iconBg: "bg-warning-50",
      iconColor: "text-warning-600",
      accentColor: "bg-warning-500",
    },
    danger: {
      icon: CheckCircleIcon,
      iconBg: "bg-error-50",
      iconColor: "text-error-600",
      accentColor: "bg-error-500",
    },
    info: {
      icon: CheckCircleIcon,
      iconBg: "bg-brand-50",
      iconColor: "text-brand-600",
      accentColor: "bg-brand-500",
    },
  };

  const currentConfig = config[type] || config.success;
  const Icon = currentConfig.icon;
  const showActions = onConfirm !== null;

  const buttonColorMap = {
    success: "bg-orange-600 hover:bg-orange-700",
    warning: "bg-warning-600 hover:bg-warning-700",
    danger: "bg-error-600 hover:bg-error-700",
    info: "bg-brand-600 hover:bg-brand-700",
  };

  const buttonColor = buttonColorMap[type] || buttonColorMap.success;

  return (
    <div className="fixed inset-0 bg-grey-950/70 flex items-start justify-end p-4 z-50">
      <div className="bg-grey-0 rounded-sm max-w-md w-[35.5rem]">
        <div className="px-5 py-3 flex flex-col gap-2">
          <div className="flex justify-between gap-3 items-center">
            <div className="flex items-center gap-3">
              <div
                className={`flex-shrink-0 w-10 h-10 ${currentConfig.iconBg} rounded-lg flex items-center justify-center`}
              >
                <Icon className={`w-5 h-5 ${currentConfig.iconColor}`} />
              </div>
              <h2 className="text-base font-bold text-grey-900">{title}</h2>
            </div>

            <div
              onClick={hide}
              className="flex-shrink-0 text-grey-800 transition-colors cursor-pointer"
            >
              <XIcon className="w-6 h-6" />
            </div>
          </div>

          <div>
            <p className="text-grey-600 text-sm font-normal">{message}</p>
          </div>

          {showActions && (
            <div className="flex gap-3">
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  hide();
                }}
                className={`px-4 py-2 text-white rounded text-sm font-medium transition-colors ${buttonColor}`}
              >
                {confirmText}
              </button>
              <button
                onClick={hide}
                className="px-4 py-2 text-gray-700 text-sm font-medium hover:text-gray-900 transition-colors"
              >
                {cancelText}
              </button>
            </div>
          )}
        </div>

        <div className="h-1 bg-gray-200 rounded-b-lg overflow-hidden relative">
          <div
            className={`h-full ${currentConfig.accentColor} absolute top-0 left-0`}
            style={{
              width: `${progress}%`,
              transition: autoClose ? "width 0.1s linear" : "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Toaster;
