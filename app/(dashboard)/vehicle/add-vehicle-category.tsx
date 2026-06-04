"use client";
import { Input, Select, TextArea } from "@/components/inputs";
import FormModal from "@/components/modal";
import z from "zod";
import { FloppyDiskIcon, PlusIcon, UserIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CreateVehicleCategoryProps, VehicleCategory } from "@/@types";
import { useCreateVehicleCategory } from "@/hooks/vehicle/createVehicle";
import { useUpdateVehicleCategory } from "@/hooks/vehicle/updateVehicle";

const AddVehicleCategorySchema = z.object({
  name: z.string().min(1, { message: "Please enter your category name" }),
  service_type: z.string().min(1, { message: "Please select a service type" }),
  vehicle_type: z.string().min(1, { message: "Please select a vehicle type" }),
  min_year_required: z
    .string()
    .min(1, { message: "Please select a minimum year" }),
  max_year_required: z
    .string()
    .min(1, { message: "Please select a maximum year" }),
  description: z.string().min(1, { message: "Please enter a description" }),
});

type AddVehicleCategoryProps = z.infer<typeof AddVehicleCategorySchema>;

interface AddCategoryFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: VehicleCategory | null;
  mode?: "create" | "edit";
}

const serviceOptions = [
  { value: "RIDES", label: "Ride" },
  { value: "DELIVERY", label: "Delivery" },
  { value: "TRUCK", label: "Truck" },
  { value: "TOWING", label: "Towing" },
];

const vehicleOptions = [
  { value: "SUV", label: "SUV" },
  { value: "SEDAN", label: "Sedan" },
  { value: "VAN", label: "Van" },
  { value: "TRUCK", label: "Truck" },
  { value: "MOTORCYCLE", label: "Motorcycle" },
];

const CURRENT_YEAR = 2026;

const minYearOptions = Array.from(
  { length: CURRENT_YEAR - 2005 + 1 },
  (_, i) => {
    const year = String(2005 + i);
    return { value: year, label: year };
  },
);

const maxYearOptions = [
  { value: "0", label: "No Max" },
  ...Array.from({ length: CURRENT_YEAR - 2005 + 1 }, (_, i) => {
    const year = String(2005 + i);
    return { value: year, label: year };
  }),
];

const AddVehicleCategory = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddCategoryFormProps) => {
  const { mutateAsync: createCategory, isPending: isCreating } =
    useCreateVehicleCategory();
  const { mutateAsync: updateCategory, isPending: isUpdating } =
    useUpdateVehicleCategory(String(editData?.id ?? ""));

  const isPending = isCreating || isUpdating;

  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddVehicleCategoryProps>({
    resolver: zodResolver(AddVehicleCategorySchema),
    defaultValues: {
      name: editData?.name || "",
      service_type: editData?.service_type || "",
      vehicle_type: editData?.vehicle_type || "",
      min_year_required: String(editData?.min_year_required || ""),
      max_year_required: String(editData?.max_year_required || ""),
      description: editData?.description || "",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("name", editData.name);
      setValue("service_type", editData.service_type);
      setValue("vehicle_type", editData.vehicle_type);
      setValue("min_year_required", String(editData.min_year_required));
      setValue("max_year_required", String(editData.max_year_required));
      setValue("description", editData.description);
    } else {
      reset({
        name: "",
        service_type: "",
        vehicle_type: "",
        min_year_required: "",
        max_year_required: "",
        description: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSave = async (values: AddVehicleCategoryProps) => {
    const payload: CreateVehicleCategoryProps = {
      name: values.name,
      service_type: values.service_type,
      vehicle_type: values.vehicle_type,
      min_year_required: Number(values.min_year_required),
      max_year_required: Number(values.max_year_required),
      description: values.description,
    };

    if (mode === "edit") {
      await updateCategory(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      await createCategory(payload, {
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
      title={mode === "edit" ? "Edit Vehicle Category" : "Add Vehicle Category"}
      saveButtonText={
        isPending
          ? mode === "edit"
            ? "Saving..."
            : "Adding..."
          : mode === "edit"
            ? "Save"
            : "Add Vehicle Category"
      }
      saveIcon={
        mode === "edit" ? <FloppyDiskIcon size={20} /> : <PlusIcon size={20} />
      }
      onCancel={onClose}
      onSave={handleSubmit(handleSave)}
      className="max-w-md"
      isLoading={isPending}
    >
      <div className="flex flex-col gap-6">
        <Input
          inputType="iconLeading"
          icon={<UserIcon size={16} />}
          label="Category Name"
          name="name"
          placeholder="Enter Category Name"
          register={formRegister}
          destructive={!!errors.name}
          hintText={errors.name?.message}
        />
        <Select
          label="Service Type"
          name="service_type"
          options={serviceOptions}
          register={formRegister}
          placeholder="Select Service Type"
          destructive={!!errors.service_type}
          hintText={errors.service_type?.message}
        />
        <Select
          label="Vehicle Type"
          name="vehicle_type"
          options={vehicleOptions}
          register={formRegister}
          placeholder="Select Vehicle Type"
          destructive={!!errors.vehicle_type}
          hintText={errors.vehicle_type?.message}
        />
        <Select
          label="Minimum Year Requirement"
          name="min_year_required"
          options={minYearOptions}
          register={formRegister}
          placeholder="Select Minimum Year Requirement"
          destructive={!!errors.min_year_required}
          hintText={errors.min_year_required?.message}
        />
        <Select
          label="Maximum Year Requirement"
          name="max_year_required"
          options={maxYearOptions}
          register={formRegister}
          placeholder="Select Maximum Year Requirement"
          destructive={!!errors.max_year_required}
          hintText={errors.max_year_required?.message}
        />
        <TextArea
          label="Description"
          name="description"
          placeholder="Enter Description"
          size="sm"
          hintText={errors.description?.message ?? "Maximum 20 characters"}
          register={formRegister}
          destructive={!!errors.description}
        />
      </div>
    </FormModal>
  );
};

export default AddVehicleCategory;
