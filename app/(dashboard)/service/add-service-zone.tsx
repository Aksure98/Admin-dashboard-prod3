"use client";
import { Input, Select } from "@/components/inputs";
import FormModal from "@/components/modal";
import z from "zod";
import { FloppyDiskIcon, PlusIcon } from "@phosphor-icons/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { CreateServiceZoneProps, ServiceZoneList } from "@/@types";
import { useCreateServiceZone } from "@/hooks/service-zone/createServiceZone";
import { useUpdateServiceZone } from "@/hooks/service-zone/updateServiceZone";

const AddServiceZoneSchema = z.object({
  zone_name: z.string().min(1, { message: "Please enter your zone name" }),
  region: z.string().min(1, { message: "Please select a region" }),
  city: z.string().min(1, { message: "Please select a city" }),
  service_type: z.string().min(1, { message: "Please select a service" }),
});

type AddServiceZoneProps = z.infer<typeof AddServiceZoneSchema>;

interface AddServiceZoneFormProps {
  isOpen: boolean;
  onClose: () => void;
  editData?: ServiceZoneList | null;
  mode?: "create" | "edit";
}

const zoneOptions = [
  { value: "zone A", label: "Zone A" },
  { value: "zone B", label: "Zone B" },
  { value: "zone C", label: "Zone C" },
];

const regionOptions = [
  { value: "all-cities", label: "All Cities" },
  { value: "lagos", label: "Lagos" },
  { value: "abuja", label: "Abuja" },
  { value: "rivers", label: "Rivers" },
];

const serviceOptions = [
  { value: "all services", label: "All Services" },
  { value: "delivery", label: "Delivery" },
  { value: "cargo", label: "Cargo" },
  { value: "towing", label: "Towing" },
  { value: "ride", label: "Ride" },
];

const EditServiceZone = ({
  isOpen,
  onClose,
  editData = null,
  mode = "create",
}: AddServiceZoneFormProps) => {
  const { mutateAsync: createServiceZone, isPending: isCreating } =
    useCreateServiceZone();
  const { mutateAsync: updateServiceZone, isPending: isUpdating } =
    useUpdateServiceZone(String(editData?.id));

  const isPending = isCreating || isUpdating;
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<AddServiceZoneProps>({
    resolver: zodResolver(AddServiceZoneSchema),
    defaultValues: {
      zone_name: editData?.zone_name || "",
      region: editData?.region || "",
      city: editData?.city || "",
      service_type: editData?.service_type || "",
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("zone_name", editData.zone_name);
      setValue("region", editData.region);
      setValue("city", editData.city);
      setValue("service_type", editData.service_type);
    } else {
      reset({
        zone_name: "",
        region: "",
        city: "",
        service_type: "",
      });
    }
  }, [editData, setValue, reset]);

  const handleSave = async (data: CreateServiceZoneProps) => {
    const payload: CreateServiceZoneProps = {
      zone_name: data.zone_name,
      region: data.region,
      city: data.city,
      service_type: data.service_type,
    };

    if (mode === "edit") {
      await updateServiceZone(payload, {
        onSuccess: () => {
          reset();
          onClose();
        },
      });
    } else {
      await createServiceZone(payload, {
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
      title={mode === "edit" ? "Edit Service Zone" : "Add Service Zone"}
      saveButtonText={
        isPending
          ? mode === "edit"
            ? "Saving..."
            : "Adding..."
          : mode === "edit"
            ? "Save"
            : "Add Service Zone"
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
        <Select
          label="Zone Name"
          name="zone_name"
          options={zoneOptions}
          register={formRegister}
          placeholder="Select a zone"
          destructive={!!errors.zone_name}
          hintText={errors.zone_name?.message}
        />

        <Input
          label="City/Area"
          name="city"
          placeholder="Enter city or area"
          register={formRegister}
          destructive={!!errors.city}
          hintText={errors.city?.message}
        />

        <Select
          label="Region"
          name="region"
          options={regionOptions}
          register={formRegister}
          placeholder="Select a region"
          destructive={!!errors.region}
          hintText={errors.region?.message}
        />

        <Select
          label="Service Type"
          name="service_type"
          options={serviceOptions}
          register={formRegister}
          placeholder="Select a service type"
          destructive={!!errors.service_type}
          hintText={errors.service_type?.message}
        />

        {/* <div>
          <h6>Zone Status</h6>
          {errors.status && (
            <p className="text-red-500 text-xs mt-1">{errors.status.message}</p>
          )}


          <input type="hidden" {...formRegister("status")} />

          <div className="flex gap-5 mt-2">
            <div
              className="flex items-center h-5 gap-2 cursor-pointer"
              onClick={() => handleStatusChange("active")}
            >
              <Checkbox
                id="active"
                checked={currentStatus === "active"}
                onChange={() => handleStatusChange("active")}
              />
              <p className="text-grey-800 text-sm font-semibold">Active</p>
            </div>

            <div
              className="flex items-center h-5 gap-2 cursor-pointer"
              onClick={() => handleStatusChange("inactive")}
            >
              <Checkbox
                id="inactive"
                checked={currentStatus === "inactive"}
                onChange={() => handleStatusChange("inactive")}
              />
              <p className="text-grey-800 text-sm font-semibold">Inactive</p>
            </div>
          </div>
        </div> */}
      </div>
    </FormModal>
  );
};

export default EditServiceZone;
