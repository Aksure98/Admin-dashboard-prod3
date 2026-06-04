"use client";

import { useEffect, useRef, useState } from "react";
import { XIcon } from "@phosphor-icons/react";
import Image from "next/image";
import Button from "@/components/button";
import { Input, Select } from "@/components/inputs";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useGetSettings } from "@/hooks/settings/getSettings";
import { useUpdateSettings } from "@/hooks/settings/updateSetting";
import { useUpdateFavicon, useUpdateLogo } from "@/hooks/settings/updateLogo";
import { useGetNotificationSettings } from "@/hooks/settings/getNotificationSettings";
import { NotificationSetting } from "@/@types";
import { useUpdateNotificationSetting } from "@/hooks/settings/updateNotification";

const SettingsSchema = z.object({
  company_name: z.string().min(1, { message: "Please enter a company name" }),
  date_format: z.string().min(1, { message: "Please select a date format" }),
  time_format: z.string().min(1, { message: "Please select a time format" }),
  currency: z.string().min(1, { message: "Please select a currency" }),
  timezone: z.string().min(1, { message: "Please enter a timezone" }),
  operator_search_radius_km: z
    .number()
    .min(1, { message: "Please enter a search radius" }),
});

type SettingsFormProps = z.infer<typeof SettingsSchema>;

const dateFormatOptions = [
  { value: "DD/MM/YY", label: "DD/MM/YY" },
  { value: "DD/MM/YYYY", label: "DD/MM/YYYY" },
  { value: "MM/DD/YY", label: "MM/DD/YY" },
  { value: "MM/DD/YYYY", label: "MM/DD/YYYY" },
  { value: "YYYY-MM-DD", label: "YYYY-MM-DD" },
];

const timeFormatOptions = [
  { value: "24", label: "24 hour" },
  { value: "12", label: "12 hour" },
];

const currencyOptions = [
  { value: "NGN", label: "Naira (#)" },
  { value: "USD", label: "Dollar ($)" },
  { value: "GBP", label: "Pound (£)" },
  { value: "EUR", label: "Euro (€)" },
];

type NotificationChannel = "email_enabled" | "sms_enabled" | "push_enabled";

const channels: { key: NotificationChannel; label: string }[] = [
  { key: "email_enabled", label: "Email" },
  { key: "sms_enabled", label: "SMS" },
  { key: "push_enabled", label: "Push" },
];

const SettingsPage = () => {
  const [logo, setLogo] = useState<string | null>(null);
  const [favicon, setFavicon] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);
  const faviconRef = useRef<HTMLInputElement>(null);
  const [notifications, setNotifications] = useState<NotificationSetting[]>([]);

  const { data: settingsData, isLoading } = useGetSettings();
  const { data: notificationSettingsData } = useGetNotificationSettings();
  const { mutateAsync: updateSettings, isPending } = useUpdateSettings();
  const {
    mutateAsync: updateNotificationSetting,
    isPending: isNotificationPending,
  } = useUpdateNotificationSetting();

  const { mutateAsync: uploadLogo, isPending: isLogoUploading } =
    useUpdateLogo();
  const { mutateAsync: uploadFavicon, isPending: isFaviconUploading } =
    useUpdateFavicon();

  const settings = settingsData?.data;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SettingsFormProps>({
    resolver: zodResolver(SettingsSchema),
    defaultValues: {
      company_name: "",
      date_format: "",
      time_format: "",
      currency: "",
      timezone: "",
      operator_search_radius_km: 10,
    },
  });

  useEffect(() => {
    if (settings) {
      reset({
        company_name: settings.company_name,
        date_format: settings.date_format,
        time_format: settings.time_format,
        currency: settings.currency,
        timezone: settings.timezone,
        operator_search_radius_km: settings.operator_search_radius_km,
      });
      setLogo(settings.logo_url || null);
      setFavicon(settings.favicon_url || null);
    }
  }, [settings, reset]);

  useEffect(() => {
    if (notificationSettingsData?.data) {
      setNotifications(notificationSettingsData.data);
    }
  }, [notificationSettingsData]);

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogo(URL.createObjectURL(file));
      await uploadLogo(file);
    }
  };

  const handleFaviconUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setFavicon(URL.createObjectURL(file));
      await uploadFavicon(file);
    }
  };

  const toggleNotification = (
    event_type: string,
    channel: NotificationChannel,
  ) => {
    setNotifications((prev) =>
      prev.map((n) =>
        n.event_type === event_type ? { ...n, [channel]: !n[channel] } : n,
      ),
    );
  };

  const saveNotifications = async () => {
    // Only update the notifications that differ from the original API data
    const original = notificationSettingsData?.data ?? [];
    const changed = notifications.filter((n) => {
      const orig = original.find((o) => o.event_type === n.event_type);
      if (!orig) return false;
      return (
        orig.email_enabled !== n.email_enabled ||
        orig.sms_enabled !== n.sms_enabled ||
        orig.push_enabled !== n.push_enabled
      );
    });

    await Promise.all(
      changed.map((n) =>
        updateNotificationSetting({
          event_type: n.event_type,
          data: {
            email_enabled: n.email_enabled,
            sms_enabled: n.sms_enabled,
            push_enabled: n.push_enabled,
          },
        }),
      ),
    );
  };

  const onSubmit = async (data: SettingsFormProps) => {
    await updateSettings(data);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-grey-800 text-2xl font-bold font-figtree">
          General Settings
        </h1>
      </div>

      {/* Company Settings */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-[300px_1fr]">
          <div className="p-6">
            <h2 className="text-grey-800 text-sm font-bold">
              Company Settings
            </h2>
            <p className="text-grey-600 text-sm font-normal mt-1">
              Configure company&apos;s preferences, display formats, and
              branding assets
            </p>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-6 flex flex-col gap-6 border border-grey-200 rounded-2xl"
          >
            <Input
              inputType="default"
              label="Company Name"
              name="company_name"
              placeholder="Enter company name"
              register={formRegister}
              destructive={!!errors.company_name}
              hintText={errors.company_name?.message}
            />

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Date Format"
                name="date_format"
                options={dateFormatOptions}
                register={formRegister}
                placeholder="Select Date Format"
                destructive={!!errors.date_format}
                hintText={errors.date_format?.message}
              />
              <Select
                label="Time Format"
                name="time_format"
                options={timeFormatOptions}
                register={formRegister}
                placeholder="Select Time Format"
                destructive={!!errors.time_format}
                hintText={errors.time_format?.message}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Select
                label="Currency"
                name="currency"
                options={currencyOptions}
                register={formRegister}
                placeholder="Select Currency"
                destructive={!!errors.currency}
                hintText={errors.currency?.message}
              />
              <Input
                inputType="default"
                label="Timezone"
                name="timezone"
                placeholder="e.g. Africa/Lagos"
                register={formRegister}
                destructive={!!errors.timezone}
                hintText={errors.timezone?.message}
              />
            </div>

            {/* Logo + Favicon */}
            <div className="flex gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-grey-800 text-sm font-medium">
                  Logo
                </label>
                <div
                  className="relative w-32 h-24 border border-grey-200 rounded-xl overflow-hidden bg-grey-50 flex items-center justify-center cursor-pointer hover:bg-grey-100 transition-colors"
                  onClick={() => logoRef.current?.click()}
                >
                  {isLogoUploading ? (
                    <p className="text-grey-400 text-xs text-center px-2">
                      Uploading...
                    </p>
                  ) : logo ? (
                    <Image
                      src={logo}
                      alt="Logo"
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <p className="text-grey-400 text-xs text-center px-2">
                      Click to upload
                    </p>
                  )}
                  {logo && !isLogoUploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setLogo(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-error-500 hover:text-error-700"
                    >
                      <XIcon size={14} />
                    </button>
                  )}
                </div>
                <input
                  ref={logoRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-grey-800 text-sm font-medium">
                  Favicon
                </label>
                <div
                  className="relative w-32 h-24 border border-grey-200 rounded-xl overflow-hidden bg-grey-50 flex items-center justify-center cursor-pointer hover:bg-grey-100 transition-colors"
                  onClick={() => faviconRef.current?.click()}
                >
                  {isFaviconUploading ? (
                    <p className="text-grey-400 text-xs text-center px-2">
                      Uploading...
                    </p>
                  ) : favicon ? (
                    <Image
                      src={favicon}
                      alt="Favicon"
                      fill
                      className="object-contain p-2"
                    />
                  ) : (
                    <p className="text-grey-400 text-xs text-center px-2">
                      Click to upload
                    </p>
                  )}
                  {favicon && !isFaviconUploading && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setFavicon(null);
                      }}
                      className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow text-error-500 hover:text-error-700"
                    >
                      <XIcon size={14} />
                    </button>
                  )}
                </div>
                <input
                  ref={faviconRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFaviconUpload}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <Button
                hierarchy="primary"
                className="cursor-pointer"
                isLoading={isPending}
                disabled={
                  isPending ||
                  isLoading ||
                  isLogoUploading ||
                  isFaviconUploading
                }
              >
                {isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="overflow-hidden">
        <div className="grid grid-cols-[300px_1fr]">
          <div className="p-6">
            <h2 className="text-grey-800 text-sm font-bold">
              Notification Settings
            </h2>
            <p className="text-grey-500 text-sm font-normal mt-1">
              Control which system alerts and status notifications are enabled
              for admins
            </p>
          </div>

          <div className="border border-grey-200 rounded-2xl overflow-hidden">
            <div className="divide-y divide-grey-100">
              {notifications.map((notification) => (
                <div
                  key={notification.event_type}
                  className="flex items-center justify-between px-6 py-5"
                >
                  <p className="text-grey-800 text-sm font-semibold">
                    {notification.label}
                  </p>
                  <div className="flex items-center gap-6">
                    {channels.map(({ key, label }) => (
                      <div key={key} className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`${notification.event_type}-${key}`}
                          checked={notification[key]}
                          onChange={() =>
                            toggleNotification(notification.event_type, key)
                          }
                          className="w-[1.25rem] h-[1.25rem] rounded-[20rem] border-grey-300 focus:ring-brand-600 focus:ring-2 cursor-pointer transition-all checked:bg-brand-600 checked:border-brand-600 accent-brand-600"
                        />
                        <label
                          htmlFor={`${notification.event_type}-${key}`}
                          className="text-sm cursor-pointer text-grey-800 font-bold"
                        >
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-4 flex justify-end border-t border-grey-100">
              <Button
                hierarchy="primary"
                className="cursor-pointer"
                onClick={saveNotifications}
                isLoading={isNotificationPending}
                disabled={isNotificationPending}
              >
                {isNotificationPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
