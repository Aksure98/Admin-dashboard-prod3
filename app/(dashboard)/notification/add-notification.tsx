"use client";

import { Input, TextArea } from "@/components/inputs";
import { PlusIcon } from "@phosphor-icons/react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useAddNotificationTemplate } from "@/hooks/notification-templates/addNotificationTemplate";
import FormModal from "@/components/modal";

const NotificationTemplateSchema = z.object({
  title: z.string().min(1, { message: "Please enter a template title" }),
  message: z.string().min(1, { message: "Please enter a template message" }),
});

type NotificationTemplatePayload = z.infer<typeof NotificationTemplateSchema>;

interface AddNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddNotificationForm = ({ isOpen, onClose }: AddNotificationFormProps) => {
  const addNotificationMutation = useAddNotificationTemplate();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<NotificationTemplatePayload>({
    resolver: zodResolver(NotificationTemplateSchema),
  });

  const handleSave = async (data: NotificationTemplatePayload) => {
    await addNotificationMutation.mutateAsync(data, {
      onSuccess: () => {
        reset();
        onClose();
      },
    });
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Create New Template"
      saveButtonText="Create New Template"
      cancelButtonText="Cancel"
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={addNotificationMutation.isPending}
      saveIcon={<PlusIcon size={20} />}

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

export default AddNotificationForm;
