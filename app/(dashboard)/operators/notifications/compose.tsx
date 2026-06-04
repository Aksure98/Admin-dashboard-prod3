"use client";

import { useEffect, useMemo, useState } from "react";
import { PlusIcon } from "@phosphor-icons/react";
import { Select, TextArea } from "@/components/inputs";
import FormModal from "@/components/modal";
import { NIGERIAN_STATES } from "@/utils/utils";

type SendType = "send_now" | "schedule" | "draft";

export interface NotificationPayload {
  title: string; // was templateId
  body: string; // was message
  recipients: string;
  state?: string;
  driverId?: string;
  sendType: SendType;
}

interface ComposeNotificationsComponentProps {
  isOpen: boolean;
  onClose: () => void;
  onSend?: (payload: NotificationPayload) => void;
  isSending?: boolean;
}

const ComposeNotifications = ({
  isOpen,
  onClose,
  onSend,
  isSending,
}: ComposeNotificationsComponentProps) => {
  const templateOptions = useMemo(
    () => [
      { value: "announcement", label: "Announcement" },
      { value: "reminder", label: "Reminder" },
      { value: "alert", label: "Alert" },
      { value: "promotion", label: "Promotion" },
      { value: "customize", label: "Customize" },
    ],
    [],
  );

  const recipientsOptions = useMemo(
    () => [
      { value: "all", label: "All Drivers" },
      { value: "active", label: "Active Drivers" },
      { value: "verified", label: "Verified Drivers" },
      { value: "unverified", label: "Unverified Drivers" },
      { value: "suspended", label: "Suspended Drivers" },
      { value: "by_state", label: "By State" },
      { value: "individual", label: "Individual Driver" },
    ],
    [],
  );

  const templates = useMemo(
    () =>
      new Map<string, string>([
        [
          "announcement",
          "Hello Driver,\n\nPlease note that we have an announcement for you. This announcement is very important.\n\nThank you.",
        ],
        [
          "reminder",
          "Hello Driver,\n\nThis is a reminder that one or more of your documents will expire soon. Please update your documents to avoid service interruptions.",
        ],
        [
          "alert",
          "Hello Driver,\n\nThere's an important alert you need to be aware of. Stay active to find out.",
        ],
        [
          "promotion",
          "Hello Driver,\n\nWe're excited to announce a new promotion. Stay active to qualify and enjoy more earnings.",
        ],
        ["customize", "Hello User,\n\nYou can customize your message here"],
      ]),
    [],
  );

  const [templateId, setTemplateId] = useState<string>("");
  const [recipients, setRecipients] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedDriverId, setSelectedDriverId] = useState<string>("");
  const [sendType, setSendType] = useState<SendType>("send_now");
  const [message, setMessage] = useState<string>("");

  const stateOptions = useMemo(
    () =>
      NIGERIAN_STATES.filter((s) => s !== "All States").map((s) => ({
        value: s,
        label: s,
      })),
    [],
  );

  useEffect(() => {
    if (!templateId) return;
    const templateMessage = templates.get(templateId);
    if (templateMessage) setMessage(templateMessage);
  }, [templateId, templates]);

  useEffect(() => {
    if (!isOpen) {
      setTemplateId("");
      setRecipients("all");
      setSelectedState("");
      setSelectedDriverId("");
      setSendType("send_now");
      setMessage("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (recipients !== "by_state") setSelectedState("");
    if (recipients !== "individual") setSelectedDriverId("");
  }, [recipients]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!message.trim()) return;
    if (recipients === "by_state" && !selectedState) return;
    if (recipients === "individual" && !selectedDriverId) return;

    const payload: NotificationPayload = {
      title: templateId,
      body: message,
      recipients,
      state: recipients === "by_state" ? selectedState : undefined,
      driverId: recipients === "individual" ? selectedDriverId : undefined,
      sendType,
    };

    onSend?.(payload);
  };

  return (
    <FormModal
      title="Compose Notification"
      onCancel={onClose}
      onSave={handleSend}
      saveButtonText={isSending ? "Sending..." : "Send Notification"}
      saveIcon={<PlusIcon size={18} />}
      isLoading={isSending}
      className="max-w-xl h-screen rounded-l-3xl"
    >
      <div className="flex flex-col gap-6">
        <Select
          label="Select Notification Templates"
          name="template"
          placeholder="Select notification templates"
          options={templateOptions}
          value={templateId}
          onChange={(e) => setTemplateId(e.target.value)}
        />

        <Select
          label="Recipients"
          name="recipients"
          options={recipientsOptions}
          value={recipients}
          onChange={(e) => setRecipients(e.target.value)}
        />

        {recipients === "by_state" && (
          <Select
            label="State"
            name="state"
            placeholder="Select state"
            options={stateOptions}
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
          />
        )}

        <div className="flex flex-col gap-2">
          <p className="text-grey-800 text-sm font-bold">Send Type</p>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendType"
                value="send_now"
                checked={sendType === "send_now"}
                onChange={() => setSendType("send_now")}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-grey-600 text-sm font-normal">
                Send Now
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendType"
                value="schedule"
                checked={sendType === "schedule"}
                onChange={() => setSendType("schedule")}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-grey-600 text-sm font-normal">
                Schedule
              </span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="sendType"
                value="draft"
                checked={sendType === "draft"}
                onChange={() => setSendType("draft")}
                className="h-4 w-4 accent-brand-600"
              />
              <span className="text-grey-600 text-sm font-normal">
                Save as Draft
              </span>
            </label>
          </div>
        </div>

        <TextArea
          label="Message"
          name="message"
          placeholder={
            templateId
              ? "Edit message"
              : "Choose a template to load a message, or type your message"
          }
          size="md"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>
    </FormModal>
  );
};

export default ComposeNotifications;
