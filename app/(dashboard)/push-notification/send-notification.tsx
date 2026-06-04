/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Input } from "@/components/inputs";
import { PlusIcon, CaretDown } from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { useSendPushNotification } from "@/hooks/push-notifications/sendPushNotification";
import FormModal from "@/components/modal";
import { useGetNotificationTemplates } from "@/hooks/notification-templates/getNotificationTemplates";
import { useAddNotificationTemplate } from "@/hooks/notification-templates/addNotificationTemplate";
import { NotificationTemplate } from "@/@types";
import { useState } from "react";

const SendNotificationSchema = z
  .object({
    recipient_group: z.string().min(1, { message: "Please select recipients" }),
    custom_user_ids: z.string().optional(),
    template_id: z.string().min(1, { message: "Please select a template" }),
    title: z.string().optional(),
    message: z.string().optional(),
    channels: z
      .array(z.string())
      .min(1, { message: "Please select at least one channel" }),
    scheduled: z.boolean(),
    scheduled_at: z.string().optional(),
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

type SendNotificationPayload = z.infer<typeof SendNotificationSchema>;

interface SendNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

// Updated UI specific options to match the strict backend enum values
const UI_RECIPIENTS = [
  { label: "All Customers", value: "ALL_CUSTOMERS" },
  { label: "All Operators", value: "ALL_OPERATORS" },
  { label: "All Ride Operators", value: "ALL_RIDE_OPERATORS" },
  { label: "All Delivery Operators", value: "ALL_DELIVERY_OPERATORS" },
  { label: "All Towing Operators", value: "ALL_TOWING_OPERATORS" },
  { label: "All Cargo Operators", value: "ALL_CARGO_OPERATORS" },
  { label: "Custom Selection", value: "CUSTOM" },
];

const UI_CHANNELS = [
  { label: "Email", value: "Email" },
  { label: "Push", value: "Push" },
  { label: "SMS", value: "SMS" },
  { label: "In App", value: "In App" },
];

const SendNotificationForm = ({
  isOpen,
  onClose,
}: SendNotificationFormProps) => {
  const sendNotificationMutation = useSendPushNotification();
  const addNotificationMutation = useAddNotificationTemplate();

  const { data: templatesData } = useGetNotificationTemplates({ limit: 100 });
  const templates =
    (templatesData?.data ?? []).map((template: NotificationTemplate) => ({
      label: template.title,
      value: template.id,
      message: template.message,
    })) || [];

  const templateOptions = [
    ...templates.map((template: any) => ({ label: template.label, value: template.value })),
    { label: "Custom Notification", value: "custom_notification" },
  ];

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<SendNotificationPayload>({
    resolver: zodResolver(SendNotificationSchema),
    defaultValues: {
      recipient_group: "ALL_CUSTOMERS",
      custom_user_ids: "",
      template_id: "custom_notification",
      title: "",
      message: "",
      channels: ["Push", "SMS", "Email"],
      scheduled: true,
      scheduled_at: "",
    },
  });

  const isScheduled = watch("scheduled");
  const selectedRecipientGroup = watch("recipient_group");

  const handleSave = async (data: SendNotificationPayload) => {
    const selectedTemplate = templates.find(
      (template: any) => template.value === data.template_id,
    );

    let finalTemplateId = data.template_id;
    const finalTitle = data.title || selectedTemplate?.label || "";
    const finalMessage = data.message || selectedTemplate?.message || "";

    // If custom notification, create the template first
    if (data.template_id === "custom_notification") {
      try {
        const newTemplate = await addNotificationMutation.mutateAsync({
          title: data.title || "",
          message: data.message || "",
        });
        finalTemplateId = (newTemplate as any)?.data?.id || "custom_notification";
      } catch (error) {
        console.error("Failed to create template:", error);
        return;
      }
    }

    const payload = {
      recipient_group: data.recipient_group,
      custom_user_ids:
        data.recipient_group === "CUSTOM" && data.custom_user_ids
          ? data.custom_user_ids
              .split(",")
              .map((id) => id.trim())
              .filter(Boolean)
          : [],
      template_id: finalTemplateId,
      title: finalTitle,
      message: finalMessage,
      channels: data.channels.map((c: string) => c.toUpperCase().replace(" ", "_")),
      ...(data.scheduled && data.scheduled_at
        ? { scheduled_at: new Date(data.scheduled_at).toISOString() }
        : {}),
    };

    await sendNotificationMutation.mutateAsync(payload as any, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  // Custom Dropdown Component
  const CustomDropdown = ({
    name,
    label,
    options,
    isMulti = false,
  }: {
    name: "recipient_group" | "template_id" | "channels";
    label: string;
    options: { label: string; value: string }[];
    isMulti?: boolean;
  }) => (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => {
        const isOpen = openDropdown === name;

        let displayValue = "";
        if (isMulti) {
          const valArray = value as string[];
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
          <div className="flex flex-col gap-2 relative">
            <label className="text-[13px] font-bold text-[#1f2937]">
              {label}
            </label>
            <div
              onClick={() => setOpenDropdown(isOpen ? null : name)}
              className="h-10 px-3 border border-[#e5e7eb] rounded-md flex justify-between items-center bg-[#f9fafb]/50 text-sm cursor-pointer text-[#4b5563] hover:border-[#d1d5db] transition-colors"
            >
              <span className="truncate">{displayValue}</span>
              <CaretDown
                size={16}
                weight="bold"
                className="text-[#9ca3af] flex-shrink-0 ml-2"
              />
            </div>

            {isOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setOpenDropdown(null)}
                ></div>
                <div className="absolute top-[calc(100%+4px)] left-0 w-full bg-white border border-[#f3f4f6] rounded-lg shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] z-20 p-[6px] flex flex-col gap-[2px]">
                  {options.map((opt) => {
                    const isSelected = isMulti
                      ? (value as string[]).includes(opt.value)
                      : value === opt.value;

                    return (
                      <div
                        key={opt.value}
                        onClick={() => {
                          if (isMulti) {
                            const valArray = value as string[];
                            onChange(
                              isSelected
                                ? valArray.filter((v) => v !== opt.value)
                                : [...valArray, opt.value]
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
                        <div className="w-[14px] h-[14px] rounded-full border border-[#d1d5db] bg-white flex items-center justify-center flex-shrink-0"></div>
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
      title="Send Notifications"
      saveButtonText="Send Notification"
      cancelButtonText=""
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={sendNotificationMutation.isPending}
      saveIcon={<PlusIcon size={16} weight="bold" />}
      className="max-w-[400px]"
    >
      <div className="flex flex-col gap-6 py-2">
        <CustomDropdown
          name="recipient_group"
          label="Select Recipients"
          options={UI_RECIPIENTS}
        />

        {selectedRecipientGroup === "CUSTOM" && (
          <div className="flex flex-col gap-2 -mt-2">
            <Input
              label=""
              name="custom_user_ids"
              type="text"
              placeholder="Enter user IDs (comma separated)..."
              register={formRegister}
              destructive={!!errors.custom_user_ids}
              hintText={errors.custom_user_ids?.message}
              className="bg-[#f9fafb]/50 text-sm"
            />
          </div>
        )}

        <CustomDropdown
          name="template_id"
          label="Select Template"
          options={templateOptions}
        />

        {watch("template_id") === "custom_notification" ? (
          <>
            <div className="flex flex-col gap-2 -mt-2">
              <label className="text-[13px] font-bold text-[#1f2937]">Title</label>
              <Input
                label=""
                name="title"
                type="text"
                placeholder="Notification Title"
                register={formRegister}
                destructive={!!errors.title}
                hintText={errors.title?.message}
                className="bg-[#f9fafb]/50 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2 -mt-2">
              <label className="text-[13px] font-bold text-[#1f2937]">Message</label>
              <textarea
                {...formRegister("message")}
                placeholder="Notification Message"
                rows={4}
                className={`w-full px-3 py-2 border rounded-md bg-[#f9fafb]/50 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#d1d5db] transition-colors resize-y ${
                  errors.message ? "border-red-500" : "border-[#e5e7eb]"
                }`}
              />
              {errors.message && (
                <p className="text-xs text-red-500 mt-1">
                  {errors.message.message}
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col gap-3 -mt-2 bg-[#f9fafb]/50 p-4 rounded-md border border-[#e5e7eb]">
            <div>
              <p className="text-[13px] font-bold text-[#1f2937]">Title</p>
              <p className="text-sm text-[#374151]">
                {templates.find((template: any) => template.value === watch("template_id"))?.label || "Select a notification template"}
              </p>
            </div>
            <div>
              <p className="text-[13px] font-bold text-[#1f2937]">Message</p>
              <p className="text-sm text-[#4b5563] whitespace-pre-wrap">
                {templates.find((template: any) => template.value === watch("template_id"))?.message || "Select a notification template"}
              </p>
            </div>
          </div>
        )}

        <CustomDropdown
          name="channels"
          label="Select Channel"
          options={UI_CHANNELS}
          isMulti
        />

        <div className="flex items-center justify-between mt-2">
          <label className="text-[13px] font-bold text-[#1f2937]">
            Scheduled
          </label>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              {...formRegister("scheduled")}
              className="sr-only peer"
            />
            <div className="w-10 h-[22px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0073b6]"></div>
          </label>
        </div>

        <div className="flex flex-col gap-2 -mt-2">
          <label className="text-[13px] font-bold text-[#1f2937]">
            Scheduled At
          </label>
          <Input
            label=""
            name="scheduled_at"
            type="datetime-local"
            placeholder="Select start date and time"
            register={formRegister}
            disabled={!isScheduled}
            destructive={!!errors.scheduled_at}
            hintText={errors.scheduled_at?.message}
            className={`bg-[#f9fafb]/50 text-sm ${
              !isScheduled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          />
        </div>
      </div>
    </FormModal>
  );
};

export default SendNotificationForm;