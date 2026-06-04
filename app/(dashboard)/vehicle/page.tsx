"use client";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddVehicleCategory from "./add-vehicle-category";
import { Vehicle, VehicleCategory } from "@/@types";

import { useGetVehicleCategory } from "@/hooks/vehicle/getVehicle";
import { useDeleteVehicleCategory } from "@/hooks/vehicle/deleteVechicle";
import { notify } from "@/utils/toastStore";
import { useUpdateVehicleCategoryStatus } from "@/hooks/vehicle/updateVehicleStatus";

const VehicleManagement = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [openEditCategory, setOpenEditCategory] = useState(false);
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedVehicle, setSelectedVehicle] =
    useState<VehicleCategory | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: vehicleCategories, isLoading } = useGetVehicleCategory({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const deleteMutation = useDeleteVehicleCategory();
  const statusMutation = useUpdateVehicleCategoryStatus();
  console.log(vehicleCategories);

  const handleOpenAddCategory = () => {
    setOpenAddCategory(true);
  };
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  const handleOpenEditCategory = (vehicle: VehicleCategory) => {
    setSelectedVehicle(vehicle);
    setOpenEditCategory(true);
  };

  const handleCloseEditCustomer = () => {
    setOpenEditCategory(false);
    setSelectedVehicle(null);
  };

  const handleDeleteConfirm = (vehicle: VehicleCategory) => {
    notify({
      type: "danger",
      title: "Delete Vehicle Category",
      message:
        "Are you sure you want to delete this vehicle category. Please note that this action is non-reversible.",
      onConfirm: () => deleteMutation.mutate(String(vehicle.id)),
      confirmText: "Yes, Delete",
      cancelText: "No, Cancel",
    });
  };

  const columns = [
    {
      header: "Id",
      accessor: "id" as keyof VehicleCategory,
    },
    {
      header: "Category Name",
      accessor: "name" as keyof VehicleCategory,
    },
    {
      header: "Service Type",
      accessor: "service_type" as keyof VehicleCategory,
    },
    {
      header: "Description",
      accessor: "description" as keyof VehicleCategory,
    },
    {
      header: "Vehicle Type",
      accessor: "vehicle_type" as keyof VehicleCategory,
    },
    {
      header: "Vehicle Count",
      accessor: "vehicle_count" as keyof VehicleCategory,
    },
    {
      header: "Status",
      accessor: "status" as keyof VehicleCategory,
      render: (row: VehicleCategory) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
            row.is_active === true
              ? "bg-success-100 text-success-600"
              : "bg-error-100 text-error-600"
          }`}
        >
          {row.is_active === true ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof VehicleCategory,
      sortable: false,
      render: (row: VehicleCategory) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active === true}
              onChange={() => statusMutation.mutate(String(row.id))}
              disabled={statusMutation.isPending}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>

          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditCategory(row)}
          >
            Edit
          </div>
          <div
            className="text-error-600 text-sm font-bold cursor-pointer"
            onClick={() => handleDeleteConfirm(row)}
          >
            Delete
          </div>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (vehicleCategories?.data?.total ?? 0) /
      (vehicleCategories?.data?.limit ?? 20),
  );
  const paginatedData = vehicleCategories?.data?.categories || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Vehicle Categories
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddCategory}
            className="cursor-pointer"
          >
            Add Category
          </Button>
        </div>
      </div>

      <div>
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={() => {
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm"
                >
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                {/* Bulk Actions dropdown */}
                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={() => {
                      setCurrentPage(1);
                    }}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="delete">Bulk Delete</option>
                    <option value="suspend">Bulk Suspend</option>
                  </select>
                </div>

                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  // onClick={() => setIsModalOpen(true)}
                >
                  Apply
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={20} color="#667085" />}
                  name="search"
                  placeholder="search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
            <Table
              columns={columns}
              data={paginatedData}
              isLoading={isLoading}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={vehicleCategories?.data?.total || 0}
              itemsPerPage={vehicleCategories?.data?.limit || 20}
              onPageChange={isLoading ? () => {} : handlePageChange}
            />
          </div>
        </div>
      </div>

      {openAddCategory && (
        <AddVehicleCategory
          isOpen={openAddCategory}
          onClose={handleCloseAddCategory}
          mode="create"
        />
      )}

      {openEditCategory && selectedVehicle && (
        <AddVehicleCategory
          isOpen={openEditCategory}
          onClose={handleCloseEditCustomer}
          mode="edit"
          //@ts-expect-error will work on it later
          editData={{
            id: selectedVehicle.id,
            name: selectedVehicle?.name,
            service_type: selectedVehicle?.service_type,
            description: selectedVehicle?.description,
            min_year_required: selectedVehicle?.min_year_required,
            max_year_required: selectedVehicle?.max_year_required,
            vehicle_count: selectedVehicle?.vehicle_count,
            vehicle_type: selectedVehicle?.vehicle_type,
            is_active: selectedVehicle?.is_active,
          }}
        />
      )}
    </div>
  );
};

export default VehicleManagement;
