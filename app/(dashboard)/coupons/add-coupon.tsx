"use client";
import { Input, Select, TextArea } from "@/components/inputs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import FormModal from "@/components/modal";
import z from "zod";
import { useEffect, useState } from "react";
import { notify } from "@/utils/toastStore";
import { Coupon } from "@/@types";
import { FloppyDiskIcon, PlusIcon } from "@phosphor-icons/react";
import { NIGERIAN_STATES } from "@/utils/utils";
import { useAddCoupon } from "@/hooks/coupons/addCoupon";
import { useEditCoupon } from "@/hooks/coupons/editCoupon";

const CouponSchema = z.object({
  name: z.string().min(1, { message: "Please enter a coupon name" }),
  code: z.string().min(1, { message: "Please enter a coupon code" }),
  description: z.string().min(1, { message: "Please enter a description" }),
  city: z.string().min(1, { message: "Please enter a city" }),
  discount_type: z.enum(["PERCENTAGE", "FIXED_AMOUNT"], {
    message: "Please select a discount type",
  }),
  max_discount_amount: z
    .number()
    .min(0, { message: "Please enter a max discount amount" }),
  applicable_services: z
    .array(z.string())
    .min(1, { message: "Please select at least one service" }),
  applicable_tiers: z.array(z.string()).optional(),
  max_usage_total: z
    .number()
    .min(1, { message: "Please enter max total usage" }),
  max_usage_per_user: z
    .number()
    .min(1, { message: "Please enter max usage per user" }),
  starts_at: z.string().min(1, { message: "Please select a start date" }),
  expires_at: z.string().min(1, { message: "Please select an expiry date" }),
  user_type: z.enum(["ALL", "FIRST_TIME", "RETURNING"], {
    message: "Please select a user type",
  }),
  discount_value: z
    .number()
    .min(0, { message: "Please enter a discount value" }),
});

export type CouponFormProps = z.infer<typeof CouponSchema>;

interface AddCouponsFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: Coupon | null;
  mode?: "create" | "edit";
}

const serviceOptions = [
  { value: "RIDES", label: "Ride" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "TRUCK", label: "Truck" },
  { value: "TOWING", label: "Towing" },
];

const AddCoupons = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddCouponsFormProps) => {
  const addCouponMutation = useAddCoupon();
  const editCouponMutation = useEditCoupon();
  const isLoading = addCouponMutation.isPending || editCouponMutation.isPending;

  const [selectedServices, setSelectedServices] = useState<string[]>(
    editData?.applicable_services || [],
  );

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<CouponFormProps>({
    resolver: zodResolver(CouponSchema),
    defaultValues: {
      name: editData?.name || "",
      code: editData?.code || "",
      city: editData?.city || "",
      description: editData?.description || "",
      applicable_services: editData?.applicable_services || [],
      applicable_tiers: editData?.applicable_tiers || [],
      discount_type: editData?.discount_type || "PERCENTAGE",
      max_discount_amount: editData?.max_discount_amount || 0,
      max_usage_total: editData?.max_usage_total || 1,
      max_usage_per_user: editData?.max_usage_per_user || 1,
      starts_at: editData?.starts_at || "",
      expires_at: editData?.expires_at || "",
      user_type: editData?.user_type || "ALL",
      discount_value: editData?.discount_value || 0,
    },
  });

  const numberRegister = (name: keyof CouponFormProps) =>
    formRegister(name, { valueAsNumber: true });

  useEffect(() => {
    setValue("applicable_services", selectedServices, { shouldValidate: true });
  }, [selectedServices, setValue]);

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("code", editData.code);
      setValue("city", editData.city);
      setValue("description", editData.description);
      setValue("applicable_tiers", editData.applicable_tiers || []);
      setValue("discount_type", editData.discount_type);
      setValue("max_discount_amount", editData.max_discount_amount);
      setValue("max_usage_total", editData.max_usage_total);
      setValue("max_usage_per_user", editData.max_usage_per_user);
      setValue("starts_at", editData.starts_at);
      setValue("expires_at", editData.expires_at);
      setValue("user_type", editData.user_type);
      setValue("discount_value", editData.discount_value);
      setSelectedServices(editData.applicable_services || []);
    } else {
      reset({
        name: "",
        code: "",
        city: "",
        description: "",
        applicable_services: [],
        applicable_tiers: [],
        discount_type: "PERCENTAGE",
        max_discount_amount: 0,
        max_usage_total: 1,
        max_usage_per_user: 1,
        starts_at: "",
        expires_at: "",
        user_type: "ALL",
        discount_value: 0,
      });
      setSelectedServices([]);
    }
  }, [editData, setValue, reset]);

  const toggleService = (value: string) => {
    setSelectedServices((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  const handleSaveCoupon = async (data: CouponFormProps) => {
    console.log("Form submitted:", data);

    if (mode === "edit") {
      if (!editData?.id) {
        notify({
          type: "danger",
          title: "Error",
          message: "Coupon ID is missing",
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
      await editCouponMutation.mutateAsync(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      //@ts-expect-error will work on it later
      await addCouponMutation.mutateAsync(data, {
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
      title={mode === "create" ? "Add Coupon" : "Edit Coupon"}
      saveButtonText={mode === "create" ? "Add Coupon" : "Update Coupon"}
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onCancel={onClose}
      onSave={handleSubmit(handleSaveCoupon, (errors) =>
        console.log("Validation errors:", errors),
      )}
      className="max-w-md"
      isLoading={isLoading}
    >
      <div className="flex flex-col gap-6">
        <Input
          inputType="iconLeading"
          label="Promotion Name"
          name="name"
          placeholder="Enter promotion name"
          register={formRegister}
          destructive={!!errors.name}
          hintText={errors.name?.message}
        />

        <Input
          inputType="iconLeading"
          name="code"
          label="Coupon Code"
          placeholder="Enter Coupon Code"
          register={formRegister}
          destructive={!!errors.code}
          hintText={errors.code?.message}
        />

        <Select
          label="City"
          name="city"
          options={NIGERIAN_STATES.map((state) => ({
            label: state,
            value: state,
          }))}
          register={formRegister}
          placeholder="Select City"
          destructive={!!errors.city}
          hintText={errors.city?.message}
        />

        {/* Multi-select pill toggle for Service Type */}
        <div className="flex flex-col gap-1">
          <label className="text-grey-800 text-sm font-medium">
            Service Type
          </label>
          <div className="flex flex-wrap gap-2">
            {serviceOptions.map((service) => (
              <button
                key={service.value}
                type="button"
                onClick={() => toggleService(service.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all ${
                  selectedServices.includes(service.value)
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white text-grey-700 border-grey-300 hover:border-brand-400"
                }`}
              >
                {service.label}
              </button>
            ))}
          </div>
          {errors.applicable_services && (
            <p className="text-error-500 text-xs">
              {errors.applicable_services.message as string}
            </p>
          )}
        </div>

        <div className="flex gap-5">
          <Select
            label="Coupon Type"
            name="discount_type"
            options={[
              { value: "PERCENTAGE", label: "Percentage" },
              { value: "FIXED_AMOUNT", label: "Fixed Amount" },
            ]}
            register={formRegister}
            placeholder="Select Coupon Type"
            destructive={!!errors.discount_type}
            hintText={errors.discount_type?.message}
          />

          <Input
            inputType="iconLeading"
            name="max_discount_amount"
            label="Amount"
            placeholder="Enter Amount"
            type="number"
            register={numberRegister}
            destructive={!!errors.max_discount_amount}
            hintText={errors.max_discount_amount?.message}
          />
        </div>

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

        <Input
          inputType="iconLeading"
          name="max_usage_total"
          label="Usage Per Coupon"
          placeholder="Maximum usage per coupon"
          type="number"
          register={numberRegister}
          destructive={!!errors.max_usage_total}
          hintText={errors.max_usage_total?.message}
        />

        <Input
          inputType="iconLeading"
          name="max_usage_per_user"
          label="Usage Per User"
          placeholder="Maximum usage per user"
          type="number"
          register={numberRegister}
          destructive={!!errors.max_usage_per_user}
          hintText={errors.max_usage_per_user?.message}
        />
        <Input
          inputType="iconLeading"
          name="discount_value"
          label="Discount Value"
          placeholder="Enter Discount Value"
          type="number"
          register={numberRegister}
          destructive={!!errors.discount_value}
          hintText={errors.discount_value?.message}
        />

        <Select
          label="User Type"
          name="user_type"
          options={[
            { value: "ALL", label: "All" },
            { value: "FIRST_TIME", label: "First Time User" },
            { value: "RETURNING", label: "Existing User" },
          ]}
          register={formRegister}
          placeholder="Select User Type"
          destructive={!!errors.user_type}
          hintText={errors.user_type?.message}
        />

        <TextArea
          label="Condition"
          name="description"
          placeholder="Enter Promo condition"
          size="sm"
          hintText={errors.description?.message}
          register={formRegister}
          destructive={!!errors.description}
        />
      </div>
    </FormModal>
  );
};

export default AddCoupons;
