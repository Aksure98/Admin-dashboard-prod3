/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/inputs";
import { CaretDown, FloppyDiskIcon, PlusIcon } from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import { useGetNotificationTemplates } from "@/hooks/notification-templates/getNotificationTemplates";
import { useAddNotificationTemplate } from "@/hooks/notification-templates/addNotificationTemplate";
import { EventNotification, NotificationTemplate } from "@/@types";
import { useEffect, useState } from "react";
import { useSendEventNotification } from "@/hooks/event-notifications/sendEventNotification";
import { useUpdateEventNotification } from "@/hooks/event-notifications/updateEventNotification";

const SendNotificationSchema = z
  .object({
    condition: z.string().min(1, { message: "Please select a condition" }),
    trigger_threshold: z.coerce
      .number()
      .min(0, { message: "Please enter a valid threshold" }),
    threshold_unit: z.string().min(1, { message: "Please specify a unit" }),
    recipient_group: z.string().min(1, { message: "Please select recipients" }),
    custom_user_ids: z.string().optional(),
    template_id: z.string().min(1, { message: "Please select a template" }),
    title: z.string().optional(),
    message: z.string().optional(),
    channels: z
      .array(z.string())
      .min(1, { message: "Please select at least one channel" }),
    is_active: z.boolean(),
  })
  .superRefine((data, ctx) => {
    if (
      data.recipient_group === "CUSTOM" &&
      (!data.custom_user_ids || data.custom_user_ids.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter custom user IDs",
        path: ["custom_user_ids"],
      });
    }

    if (
      data.template_id === "custom_notification" &&
      (!data.title || data.title.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a title for custom notification",
        path: ["title"],
      });
    }

    if (
      data.template_id === "custom_notification" &&
      (!data.message || data.message.trim() === "")
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Please enter a message for custom notification",
        path: ["message"],
      });
    }
  });

type SendNotificationFormInput = z.input<typeof SendNotificationSchema>;
type SendNotificationPayload = z.output<typeof SendNotificationSchema>;

interface SendNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  notification?: EventNotification | null;
}

const UI_CONDITIONS = [
  { label: "When ride is completed", value: "booking.completed" },
  { label: "When payment fails", value: "payment.failed" },
  { label: "When user registers", value: "user.registered" },
  { label: "When operator registers", value: "operator.registered" },
  { label: "When booking is cancelled", value: "booking.cancelled" },
  { label: "When payment is successful", value: "payment.successful" },
  { label: "When SOS is triggered", value: "sos.triggered" },
  { label: "When lost item is reported", value: "lost_item.reported" },
];

const UI_RECIPIENTS = [
  { label: "All Users", value: "ALL_USERS" },
  { label: "All Operators", value: "ALL_OPERATORS" },
  { label: "All Ride Operators", value: "ALL_RIDE_OPERATORS" },
  { label: "All Delivery Operators", value: "ALL_DELIVERY_OPERATORS" },
  { label: "All Towing Operators", value: "ALL_TOWING_OPERATORS" },
  { label: "All Cargo Operators", value: "ALL_CARGO_OPERATORS" },
  { label: "Custom Selection", value: "CUSTOM" },
];

const UI_CHANNELS = [
  { label: "Email", value: "EMAIL" },
  { label: "Push", value: "PUSH" },
  { label: "SMS", value: "SMS" },
  { label: "In App", value: "IN_APP" },
];

const SendNotificationForm = ({
  isOpen,
  onClose,
  notification,
}: SendNotificationFormProps) => {
  const sendNotificationMutation = useSendEventNotification();
  const updateEventNotificationMutation = useUpdateEventNotification();
  const addNotificationMutation = useAddNotificationTemplate();

  const { data: templatesData } = useGetNotificationTemplates({ limit: 100 });
  const templates =
    (templatesData?.data ?? []).map((template: NotificationTemplate) => ({
      label: template.title,
      value: template.id,
      message: template.message,
    })) || [];

  const templateOptions = [
    ...templates.map((template: any) => ({
      label: template.label,
      value: template.value,
    })),
    { label: "Custom Notification", value: "custom_notification" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const isEditing = Boolean(notification);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<SendNotificationFormInput, unknown, SendNotificationPayload>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      condition: "booking.completed",
      trigger_threshold: 7,
      threshold_unit: "Minutes",
      recipient_group: "ALL_USERS",
      custom_user_ids: "",
      template_id: "custom_notification",
      title: "",
      message: "",
      channels: ["PUSH", "EMAIL"],
      is_active: true,
    },
  });

  useEffect(() => {
    if (!isOpen) return;

    const matchingCondition = UI_CONDITIONS.find(
      (condition) =>
        condition.value === notification?.condition_event ||
        condition.label === notification?.condition,
    );

    reset({
      condition: matchingCondition?.value ?? "booking.completed",
      trigger_threshold: notification?.trigger_threshold ?? 7,
      threshold_unit: notification?.threshold_unit ?? "Minutes",
      recipient_group: notification?.recipient_group ?? "ALL_USERS",
      custom_user_ids: notification?.custom_user_ids?.join(", ") ?? "",
      template_id: notification?.template_id ?? "custom_notification",
      title: notification?.title ?? "",
      message: notification?.message ?? "",
      channels: notification?.channels?.length
        ? notification.channels
        : ["PUSH", "EMAIL"],
      is_active: notification?.is_active ?? true,
    });
  }, [isOpen, notification, reset]);

  const selectedRecipientGroup = watch("recipient_group");
  const selectedTemplateId = watch("template_id");
  const selectedTemplate = templates.find(
    (template: any) => template.value === selectedTemplateId,
  );
  const notificationRuleId =
    notification?.rule_id ?? notification?.id;

  const handleSave: SubmitHandler<SendNotificationPayload> = async (data) => {
    let finalTemplateId = data.template_id;

    if (data.template_id === "custom_notification") {
      try {
        const newTemplate = await addNotificationMutation.mutateAsync({
          title: data.title || "",
          message: data.message || "",
        });
        finalTemplateId =
          (newTemplate as any)?.data?.id || "custom_notification";
      } catch (error) {
        console.error("Failed to create template:", error);
        return;
      }
    }

    const selectedConditionObj = UI_CONDITIONS.find(
      (condition) => condition.value === data.condition,
    );

    const payload = {
      condition: selectedConditionObj?.label || data.condition,
      condition_event: data.condition,
      trigger_threshold: data.trigger_threshold,
      threshold_unit: data.threshold_unit,
      template_id: finalTemplateId,
      recipient_group: data.recipient_group,
      channels: data.channels,
      ...(data.recipient_group === "CUSTOM" && data.custom_user_ids
        ? {
            custom_user_ids: data.custom_user_ids
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean),
          }
        : {}),
    };

    if (isEditing && notificationRuleId) {
      await updateEventNotificationMutation.mutateAsync(
        { id: notificationRuleId, values: payload },
        {
          onSuccess: () => {
            reset();
            onClose();
          },
        },
      );
      return;
    }

    await sendNotificationMutation.mutateAsync(payload, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  const CustomDropdown = ({
    name,
    label,
    options,
    isMulti = false,
  }: {
    name: "condition" | "recipient_group" | "template_id" | "channels";
    label: string;
    options: { label: string; value: string }[];
    isMulti?: boolean;
  }) => (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const isDropdownOpen = openDropdown === name;

        let displayValue = "";
        if (isMulti) {
          const valArray = (value || []) as string[];
          displayValue =
            valArray.length > 0
              ? options
                  .filter((o) => valArray.includes(o.value))
                  .map((o) => o.label)
                  .join(", ")
              : "Select channel(s)";
        } else {
          displayValue =
            options.find((o) => o.value === value)?.label ||
            `Select ${label.toLowerCase()}`;
        }

        return (
          <div className="flex flex-col gap-2 relative w-full">
            <label className="text-[13px] font-bold text-[#1f2937]">
              {label}
            </label>
            <div
              onClick={() => setOpenDropdown(isDropdownOpen ? null : name)}
              className="h-10 px-3 border border-[#e5e7eb] rounded-md flex justify-between items-center bg-[#f9fafb]/50 text-sm cursor-pointer text-[#4b5563] hover:border-[#d1d5db] transition-colors"
            >
              <span className="truncate">{displayValue}</span>
              <CaretDown
                size={16}
                weight="bold"
                className="text-[#9ca3af] flex-shrink-0 ml-2"
              />
            </div>

            {isDropdownOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenDropdown(null)}
                ></div>
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-[#f3f4f6] rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-20 p-[6px] flex flex-col gap-[2px] max-h-48 overflow-y-auto">
                  {options.map((opt) => {
                    const isSelected = isMulti
                      ? (value as string[]).includes(opt.value)
                      : value === opt.value;

                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          if (isMulti) {
                            const valArray = (value || []) as string[];
                            onChange(
                              isSelected
                                ? valArray.filter((v) => v !== opt.value)
                                : [...valArray, opt.value],
                            );
                          } else {
                            onChange(opt.value);
                            setOpenDropdown(null);
                          }
                        }}
                        className={`p-[10px] rounded-md cursor-pointer flex items-center gap-3 text-sm text-[#4b5563] transition-colors ${
                          isSelected ? "bg-[#f3f4f6]" : "hover:bg-[#f9fafb]"
                        }`}
                      >
                        <div className="w-[14px] h-[14px] rounded-full border border-[#d1d5db] bg-white flex items-center justify-center flex-shrink-0">
                          {isSelected && (
                            <div className="w-[8px] h-[8px] rounded-full bg-[#0073b6]" />
                          )}
                        </div>
                        <span className="truncate">{opt.label}</span>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
            {errors[name] && (
              <p className="text-xs text-red-500 mt-1">
                {errors[name]?.message}
              </p>
            )}
          </div>
        );
      }}
    />
  );

  return (
    <FormModal
      title={isEditing ? "Edit Automated Notification" : "Create Automated Notification"}
      saveButtonText={isEditing ? "Save Changes" : "Create Notification"}
      cancelButtonText=""
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={
        sendNotificationMutation.isPending ||
        updateEventNotificationMutation.isPending
      }
      saveIcon={
        isEditing ? (
          <FloppyDiskIcon size={16} weight="bold" />
        ) : (
          <PlusIcon size={16} weight="bold" />
        )
      }
      className="max-w-[400px]"
    >
      <div className="flex flex-col gap-6 py-2">
        <CustomDropdown
          name="condition"
          label="Condition"
          options={UI_CONDITIONS}
        />

        <div className="flex flex-col gap-2 -mt-1">
          <label className="text-[13px] font-bold text-[#1f2937]">
            Trigger Threshold
          </label>
          <Input
            label=""
            name="trigger_threshold"
            type="number"
            placeholder="5"
            register={formRegister}
            destructive={!!errors.trigger_threshold}
            hintText={errors.trigger_threshold?.message?.toString()}
            className="bg-[#f9fafb]/50 text-sm"
          />
        </div>

        <div className="flex flex-col gap-2 -mt-1">
          <label className="text-[13px] font-bold text-[#1f2937]">
            Threshold Unit
          </label>
          <Input
            label=""
            name="threshold_unit"
            type="text"
            placeholder="Minutes"
            register={formRegister}
            destructive={!!errors.threshold_unit}
            hintText={errors.threshold_unit?.message}
            className="bg-[#f9fafb]/50 text-sm"
          />
        </div>

        <CustomDropdown
          name="template_id"
          label="Select Template"
          options={templateOptions}
        />

        {selectedTemplateId === "custom_notification" ? (
          <div className="flex flex-col gap-4 bg-[#f9fafb]/50 p-3 rounded-md border border-[#e5e7eb]">
            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#1f2937]">
                Title
              </label>
              <Input
                label=""
                name="title"
                type="text"
                placeholder="Notification Title"
                register={formRegister}
                destructive={!!errors.title}
                hintText={errors.title?.message}
                className="bg-white text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[13px] font-bold text-[#1f2937]">
                Message
              </label>
              <textarea
                {...formRegister("message")}
                placeholder="Notification Message"
                rows={3}
                className={`w-full px-3 py-2 border rounded-md bg-white text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#d1d5db] transition-colors resize-y ${
                  errors.message ? "border-red-500" : "border-[#e5e7eb]"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3 bg-[#f9fafb]/50 p-4 rounded-md border border-[#e5e7eb]">
            <div>
              <p className="text-[13px] font-bold text-[#1f2937]">Title</p>
              <p className="text-sm text-[#374151]">
                {selectedTemplate?.label || "Select a notification template"}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1f2937]">Message</p>
              <p className="text-sm text-[#4b5563] whitespace-pre-wrap">
                {selectedTemplate?.message || "Select a notification template"}
              </p>
            </div>
          </div>
        )}

        <CustomDropdown
          name="recipient_group"
          label="Select Recipients"
          options={UI_RECIPIENTS}
        />

        {selectedRecipientGroup === "CUSTOM" && (
          <div className="flex flex-col gap-2 -mt-1">
            <Input
              label=""
              name="custom_user_ids"
              type="text"
              placeholder="Enter user IDs (comma separated)..."
              register={formRegister}
              destructive={!!errors.custom_user_ids}
              hintText={errors.custom_user_ids?.message}
              className="bg-white text-sm"
            />
          </div>
        )}

        <CustomDropdown
          name="channels"
          label="Select Channel"
          options={UI_CHANNELS}
          isMulti
        />

        {!isEditing && (
          <div className="flex items-center justify-between mt-1 pt-1 pb-2">
            <label className="text-[13px] font-bold text-[#1f2937]">
              Status
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                {...formRegister("is_active")}
                className="sr-only peer"
              />
              <div className="w-11 h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#0073b6]"></div>
            </label>
          </div>
        )}
      </div>
    </FormModal>
  );
};

export default SendNotificationForm;
