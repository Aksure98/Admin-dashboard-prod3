"use client";

import FormModal from "@/components/modal";
import { Select } from "@/components/inputs";
import { CopyIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Image from "next/image";
import { useGetTowVehicle } from "@/hooks/tow/getVehicle";
import { useEditTowVehicle } from "@/hooks/tow/editVehicle";

interface ManageVehicleModalProps {
  isOpen: boolean;
  onClose: () => void;
  id: string;
}

const serviceCategoryOptions = [
  { value: "premium", label: "Premium" },
  { value: "standard", label: "Standard" },
  { value: "luxury", label: "Luxury" },
];

const ManageVehicleModal: React.FC<ManageVehicleModalProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  const [serviceCategory, setServiceCategory] = useState("premium");
  const { data: vehicleData } = useGetTowVehicle(id);
  const editVehicleMutation = useEditTowVehicle(id);

  const handleDone = async () => {
    await editVehicleMutation.mutateAsync(
      { category: serviceCategory },
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
      title="Vehicle Information"
      saveButtonText={editVehicleMutation.isPending ? "Saving..." : "Done"}
      isLoading={editVehicleMutation.isPending}
      onSave={handleDone}
      onCancel={onClose}
      className="max-w-2xl"
    >
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="text-lg font-bold text-grey-900 mb-4">
            Vehicle Details
          </h3>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Vehicle Model
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.model}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Plate Number
              </span>
              <div className="flex items-center gap-2">
                <span className="text-grey-900 text-sm font-semibold">
                  {vehicleData?.data?.plate_number}
                </span>
                <button
                  type="button"
                  className="text-grey-500 hover:text-grey-700 cursor-pointer"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      vehicleData?.data?.plate_number ?? "",
                    );
                  }}
                >
                  <CopyIcon size={16} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Vehicle Manufacturer
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.manufacturer}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Year Produced
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.production_year}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                License Expiration Date
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.vehicle_license_exp_date}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                License Number
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.vehicle_license_number}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Air Condition
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.has_ac}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">
                Number of Seats
              </span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.load_capacity}
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-grey-600 text-sm font-medium">Color</span>
              <span className="text-grey-900 text-sm font-semibold">
                {vehicleData?.data?.color}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey-900 mb-4">
            Vehicle Images
          </h3>
          <div className="grid grid-cols-3 gap-4">
            {vehicleData?.data?.photo_urls.map((url, index) => (
              <div
                key={index}
                className="w-full aspect-square rounded-lg overflow-hidden bg-grey-100 border border-grey-200 relative"
              >
                <Image
                  src={url}
                  alt={`Vehicle photo ${index + 1}`}
                  className="object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
            ))}
            <div className="w-full aspect-square rounded-lg border-2 border-dashed border-grey-300 bg-grey-50 flex items-center justify-center">
              <span className="text-grey-400 text-xs">Empty</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-grey-900 mb-4">
            Select Service Category
          </h3>
          <Select
            name="serviceCategory"
            options={serviceCategoryOptions}
            value={serviceCategory}
            onChange={(e) => setServiceCategory(e.target.value)}
            placeholder="Select Service Category"
          />
        </div>
      </div>
    </FormModal>
  );
};

export default ManageVehicleModal;
