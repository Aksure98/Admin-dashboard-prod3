"use client";

import { Input, TextArea } from "@/components/inputs";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useEditNotificationTemplate } from "@/hooks/notification-templates/editNotificationTemplate";
import FormModal from "@/components/modal";
import { NotificationTemplate } from "@/@types";

const NotificationTemplateSchema = z.object({
  title: z.string().min(1, { message: "Please enter a template title" }),
  message: z.string().min(1, { message: "Please enter a template message" }),
});

type NotificationTemplatePayload = z.infer<typeof NotificationTemplateSchema>;

interface EditNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  notification: NotificationTemplate;
}

const EditNotificationForm = ({
  isOpen,
  onClose,
  notification,
}: EditNotificationFormProps) => {
  const editNotificationMutation = useEditNotificationTemplate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<NotificationTemplatePayload>({
    resolver: zodResolver(NotificationTemplateSchema),
  });

  useEffect(() => {
    if (!notification) return;
    setValue("title", notification.title);
    setValue("message", notification.message);
  }, [notification, setValue]);

  const handleSave = async (data: NotificationTemplatePayload) => {
    await editNotificationMutation.mutateAsync(
      { id: notification.id, values: data },
      {
        onSuccess: () => {
          reset();
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Edit Template"
      saveButtonText="Edit Template"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={editNotificationMutation.isPending}
      saveIcon={<FloppyDiskIcon size={20} />}
      className="max-w-md"
    >
      <div className="flex flex-col gap-4">
        <Input
          label="Title"
          name="title"
          placeholder="Enter notification name"
          register={formRegister}
          destructive={!!errors.title}
          hintText={errors.title?.message}
        />

        <TextArea
          label="Message"
          name="message"
          placeholder="Enter your message here"
          register={formRegister}
          destructive={!!errors.message}
          hintText={errors.message?.message}
          size="md"
        />
      </div>
    </FormModal>
  );
};

export default EditNotificationForm;
