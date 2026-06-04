"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { FloppyDiskIcon } from "@phosphor-icons/react";
import { useUpdateExtraCharge } from "@/hooks/pricing/updateExtraCharge";

const EditBaseFareSchema = z.object({
  amount: z.number({ message: "amount is required" }).min(0, {
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

const EditExtraCharge = ({
  isOpen,
  onClose,
  distanceId,
  currentAmount,
}: EditBaseFareFormProps) => {
  const editBaseFareMutation = useUpdateExtraCharge();

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
  } = useForm<EditBaseFareProps>({
    resolver: zodResolver(EditBaseFareSchema),
    defaultValues: {
      amount: currentAmount,
    },
  });

  const handleSave = async (data: EditBaseFareProps) => {
    await editBaseFareMutation.mutateAsync(
      { id: distanceId, amount: data.amount },
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
      title="Edit Extra Charge"
      saveButtonText="Update Amount"
      saveIcon={<FloppyDiskIcon size={20} />}
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      isLoading={editBaseFareMutation.isPending}
      className="max-w-md"
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label className="text-grey-800 text-sm font-medium">Amount</label>
          <div className="flex items-center border border-grey-300 rounded-lg overflow-hidden ">
            <div className="flex items-center justify-center px-3 border-r border-grey-300 bg-grey-50 h-full">
              <span className="text-grey-600 text-sm font-medium">₦</span>
            </div>
            <input
              type="number"
              {...formRegister("amount", { valueAsNumber: true })}
              className="flex-1 px-3 py-2.5 text-sm text-grey-800 bg-grey-0 focus:outline-none"
              placeholder="Enter amount"
            />
            <div className="flex items-center justify-center px-3 border-l border-grey-300 bg-grey-50">
              <span className="text-grey-600 text-sm font-medium">NGN</span>
            </div>
          </div>
          {errors.amount && (
            <p className="text-error-500 text-xs">{errors.amount.message}</p>
          )}
        </div>
      </div>
    </FormModal>
  );
};

export default EditExtraCharge;
