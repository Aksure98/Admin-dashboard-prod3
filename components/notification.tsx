"use client";

import { CheckCircleIcon, ShieldIcon } from "@phosphor-icons/react";
import { NotificationInbox } from "@/@types";
import FormModal from "./modal";
import Button from "./button";
import { useGetNotificationInbox } from "@/hooks/notification/getNotificationInbox";
import { useDeleteNotificationInbox } from "@/hooks/notification/deleteNotificationInbox";
import { useMarkNotificationInboxAsRead } from "@/hooks/notification/editNotificationIbox";
import { useMarkAllNotificationInboxAsRead } from "@/hooks/notification/addNotificationInbox";

interface NotificationProps {
  isOpen: boolean;
  onClose: () => void;
}

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

  const { data: notificationInboxResponse, isLoading } = useGetNotificationInbox({
    page: 1,
    pageSize: 10,
  });
  const deleteNotificationMutation = useDeleteNotificationInbox();
  const markNotificationAsReadMutation = useMarkNotificationInboxAsRead();
  const markAllAsReadMutation = useMarkAllNotificationInboxAsRead();

  const notifications = notificationInboxResponse?.data ?? [];
  const hasNotifications = notifications.length > 0;
  const hasUnreadNotifications = notifications.some(
    (notification) => !notification.is_read,
  );

  const handleNotificationClick = (notification: NotificationInbox) => {
    if (notification.is_read || markNotificationAsReadMutation.isPending) {
      return;
    }

    markNotificationAsReadMutation.mutate(notification.id);
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Notifications"
      saveButtonText="Clear Notifications"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={() => deleteNotificationMutation.mutate()}
      saveIcon={null}
      isLoading={deleteNotificationMutation.isPending}
      className="max-w-lg"
      showSaveButton={hasNotifications}
    >
      <div className="flex flex-col gap-4">
        {hasNotifications && (
          <div className="flex justify-end">
            <Button
              hierarchy="tertiary"
              size="sm"
              leftIcon={<CheckCircleIcon size={18} />}
              onClick={() => markAllAsReadMutation.mutate()}
              isLoading={markAllAsReadMutation.isPending}
              disabled={!hasUnreadNotifications}
              className="w-fit"
            >
              Mark all read
            </Button>
          </div>
        )}

        {isLoading && (
          <p className="text-grey-500 text-sm text-center py-8">
            Loading notifications...
          </p>
        )}

        {!isLoading && !hasNotifications && (
          <p className="text-grey-500 text-sm text-center py-8">
            No notifications yet.
          </p>
        )}

        {!isLoading &&
          notifications.map((notification: NotificationInbox) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => handleNotificationClick(notification)}
              className={`flex w-full items-start gap-4 rounded-lg px-5 py-4 text-left shadow-sm border transition-colors ${
                notification.is_read
                  ? "bg-grey-0 border-grey-100"
                  : "bg-grey-100 border-brand-100"
              }`}
            >
              <div className="bg-grey-200 rounded-lg px-3 py-2">
                <ShieldIcon color="#667085" size={36} />
              </div>

              <div className="flex flex-1 flex-col gap-0.5">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-grey-800 text-sm font-bold">
                    {notification.title}
                  </p>
                  {!notification.is_read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-brand-600" />
                  )}
                </div>
                <p className="text-grey-600 text-sm">{notification.message}</p>
                <p className="text-grey-400 text-xs">
                  {timeAgo(notification.created_at)}
                </p>
              </div>
            </button>
          ))}
      </div>
    </FormModal>
  );
};

export default Notification;
