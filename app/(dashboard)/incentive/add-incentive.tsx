"use client";
import { Input, Select, TextArea } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { useEffect, useState } from "react";
import { notify } from "@/utils/toastStore";
import { FloppyDiskIcon, PlusIcon } from "@phosphor-icons/react";
import { Incentive } from "@/@types";
import { useAddIncentive } from "@/hooks/incentive/addIncentive";
import { useEditIncentive } from "@/hooks/incentive/editIncentive";

const IncentiveSchema = z.object({
  name: z.string().min(1, { message: "Please enter a coupon name" }),
  discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
    message: "Please select a discount type",
  }),
  discount_value: z
    .number()
    .min(0, { message: "Please enter a discount value" }),
  starts_at: z.string().min(1, { message: "Please select a start date" }),
  expires_at: z.string().min(1, { message: "Please select an expiry date" }),
  user_type: z.string().min(1, { message: "Please select a type" }),
  condition: z.string().min(1, { message: "Please enter a coupon name" }),
});

export type IncentiveFormProps = z.infer<typeof IncentiveSchema>;

interface AddIncentiveFormsProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Incentive | null;
  mode?: "create" | "edit";
}

const serviceOptions = [
  { value: "ALL", label: "All" },
  { value: "OPERATOR", label: "Operator" },
  { value: "CUSTOMER", label: "Customer" },
];

const AddIncentive = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddIncentiveFormsProps) => {
  const addIncentiveMutation = useAddIncentive();
  const editIncentiveMutation = useEditIncentive();

  const isLoading =
    addIncentiveMutation.isPending || editIncentiveMutation.isPending;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<IncentiveFormProps>({
    resolver: zodResolver(IncentiveSchema),
    defaultValues: {
      name: editData?.name || "",
      discount_type: editData?.discount_type || "PERCENTAGE",
      discount_value: editData?.discount_value || 0,
      starts_at: editData?.starts_at || "",
      expires_at: editData?.expires_at || "",
      user_type: editData?.user_type || "",
      condition: editData?.condition || "",
    },
  });

  const numberRegister = (name: keyof IncentiveFormProps) =>
    formRegister(name, { valueAsNumber: true });

  useEffect(() => {
    if (editData) {
      setValue("name", editData?.name);
      setValue("discount_type", editData.discount_type);
      setValue("discount_value", editData.discount_value);
      setValue("starts_at", editData.starts_at);
      setValue("expires_at", editData.expires_at);
      setValue("user_type", editData.user_type);
      setValue("condition", editData?.condition);
    } else {
      reset({
        name: "",
        discount_type: "PERCENTAGE",
        discount_value: 0,
        starts_at: "",
        expires_at: "",
        user_type: "",
        condition: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSaveIncentive = async (data: IncentiveFormProps) => {
    console.log("data", data);

    if (mode === "edit") {
      if (!editData?.id) {
        notify({
          type: "danger",
          title: "Error",
          message: "Incentive ID is missing",
          autoClose: true,
          autoCloseDelay: 3000,
        });
        return;
      }

      const payload = {
        id: editData.id,
        values: data,
      };
      //@ts-expect-error will work on it later
      await editIncentiveMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      //@ts-expect-error will work on it later
      await addIncentiveMutation.mutateAsync(data, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    }
  };

  if (!isOpen) return null;

  return (
    <FormModal
      title={mode === "create" ? "Add Incentive" : "Edit Incentive"}
      saveButtonText={mode === "create" ? "Add Incentive" : "Update Incentive"}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onCancel={onClose}
      onSave={handleSubmit(handleSaveIncentive, (errors) =>
        console.log("Validation errors:", errors),
      )}
      className="max-w-md"
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-6">
        <Input
          inputType="iconLeading"
          label=" Name"
          name="name"
          placeholder="Enter name"
          register={formRegister}
          destructive={!!errors.name}
          hintText={errors.name?.message}
        />

        <Select
          label=" Type"
          name="discount_type"
          options={[
            { value: "PERCENTAGE", label: "Percentage" },
            { value: "FIXED_AMOUNT", label: "Fixed Amount" },
          ]}
          register={formRegister}
          placeholder="Select Type"
          destructive={!!errors.discount_type}
          hintText={errors.discount_type?.message}
        />

        <Input
          inputType="iconLeading"
          name="discount_value"
          label="Amount"
          placeholder="Enter Amount"
          type="number"
          register={numberRegister}
          destructive={!!errors.discount_value}
          hintText={errors.discount_value?.message}
        />

        <div className="flex gap-5">
          <div className="flex flex-col gap-1 flex-1">
            <label className="text-grey-800 text-sm font-medium">
              Start Date
            </label>
            <input
              type="date"
              {...formRegister("starts_at")}
              className={`border rounded-lg px-4 py-2 text-sm text-grey-800 bg-grey-0 focus:outline-none focus:ring-2 focus:ring-brand-600 w-full ${
                errors.starts_at ? "border-error-500" : "border-grey-400"
              }`}
            />
            {errors.starts_at && (
              <p className="text-error-500 text-xs">
                {errors.starts_at.message}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1 flex-1">
            <label className="text-grey-800 text-sm font-medium">
              End Date
            </label>
            <input
              type="date"
              {...formRegister("expires_at")}
              className={`border rounded-lg px-4 py-2 text-sm text-grey-800 bg-grey-0 focus:outline-none focus:ring-2 focus:ring-brand-600 w-full ${
                errors.expires_at ? "border-error-500" : "border-grey-400"
              }`}
            />
            {errors.expires_at && (
              <p className="text-error-500 text-xs">
                {errors.expires_at.message}
              </p>
            )}
          </div>
        </div>

        <Select
          label=" Type"
          name="user_type"
          options={serviceOptions}
          register={formRegister}
          placeholder="Select Type"
          destructive={!!errors.user_type}
          hintText={errors.user_type?.message}
        />

        <TextArea
          label="Condition"
          name="condition"
          placeholder="Enter Promo condition"
          size="sm"
          hintText={errors.condition?.message}
          register={formRegister}
          destructive={!!errors.condition}
        />
      </div>
    </FormModal>
  );
};

export default AddIncentive;
