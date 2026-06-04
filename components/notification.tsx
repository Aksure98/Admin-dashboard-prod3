"use client";

import { ShieldIcon } from "@phosphor-icons/react";
import FormModal from "./modal";
import { UserNotification } from "@/@types";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

const SampleNotifications: UserNotification[] = [
  {
    id: "string",
    title: "Document Verification",
    message: "Your document has been verified successfully.",
    createdAt: "2023-10-01T00:00:00Z",
  },
];

const Notification = ({ isOpen, onClose }: NotificationProps) => {
  function timeAgo(date: string | Date): string {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    const diffHrs = Math.floor(diffMins / 60);
    if (diffHrs < 24) return `${diffHrs} hr ago`;
    return `${Math.floor(diffHrs / 24)} days ago`;
  }

  if (!isOpen) return null;
  return (
    <FormModal
      title="Notifications"
      saveButtonText="Clear Notifications"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={() => console.log("hello")}
      saveIcon={null}
      // isLoading={addTeamMutation.isPending}
      className="max-w-lg"
    >
      {SampleNotifications.map((notification) => (
        <div
          key={notification.id}
          className="flex items-start gap-4 bg-grey-100  rounded-lg px-5 py-4 shadow-sm border border-grey-100"
        >
          <div className="bg-grey-200 rounded-lg px-3 py-2">
            <ShieldIcon color="#667085" size={36} />
          </div>

          <div className="flex flex-col gap-0.5">
            <p className="text-grey-800 text-sm font-bold  ">
              {notification.title}
            </p>
            <p className="text-grey-600 text-sm">{notification.message}</p>
            <p className="text-grey-400 text-xs">
              {timeAgo(notification.createdAt)}
            </p>
          </div>
        </div>
      ))}
    </FormModal>
  );
};

export default Notification;
