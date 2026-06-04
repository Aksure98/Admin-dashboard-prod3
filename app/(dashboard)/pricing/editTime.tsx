"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { useUpdateTime } from "@/hooks/pricing/updateTime";

const EditBaseFareSchema = z.object({
  per_km: z.number({ message: "Per km amount is required" }).min(0, {
    message: "Base fare amount must be a positive number",
  }),
});

type EditBaseFareProps = z.infer<typeof EditBaseFareSchema>;

interface EditBaseFareFormProps {
  isOpen: boolean;
  onClose: () => void;
  distanceId: string;
  currentAmount: number;
}

const EditTime = ({
  isOpen,
  onClose,
  distanceId,
  currentAmount,
}: EditBaseFareFormProps) => {
  const editBaseFareMutation = useUpdateTime();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<EditBaseFareProps>({
    resolver: zodResolver(EditBaseFareSchema),
    defaultValues: {
      per_km: currentAmount,
    },
  });

  const handleSave = async (data: EditBaseFareProps) => {
    await editBaseFareMutation.mutateAsync(
      { id: distanceId, per_min: data.per_km },
      {
        onSuccess: () => {
          onClose();
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title="Edit Amount"
      saveButtonText="Update Amount"
      saveIcon={<FloppyDiskIcon size={20} />}
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={editBaseFareMutation.isPending}
      className="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-grey-800 text-sm font-medium">
            Amount (₦)
          </label>
          <div className="flex items-center border border-grey-300 rounded-lg overflow-hidden ">
            <div className="flex items-center justify-center px-3 border-r border-grey-300 bg-grey-50 h-full">
              <span className="text-grey-600 text-sm font-medium">₦</span>
            </div>
            <input
              type="number"
              {...formRegister("per_km", { valueAsNumber: true })}
              className="flex-1 px-3 py-2.5 text-sm text-grey-800 bg-grey-0 focus:outline-none"
              placeholder="Enter amount"
            />
            <div className="flex items-center justify-center px-3 border-l border-grey-300 bg-grey-50">
              <span className="text-grey-600 text-sm font-medium">NGN</span>
            </div>
          </div>
          {errors.per_km && (
            <p className="text-error-500 text-xs">{errors.per_km.message}</p>
          )}
        </div>
      </div>
    </FormModal>
  );
};

export default EditTime;
