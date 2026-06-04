"use client";

import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { formatCompactNumber, NIGERIAN_STATES } from "@/utils/utils";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AddServiceZone from "./add-service-zone";
import type { ServiceZone, ServiceZoneList } from "@/@types";
import { useGetZoneStat } from "@/hooks/service-zone/service-zoneStats";
import { useGetServiceZoneList } from "@/hooks/service-zone/getServiceZoneList";
import { useDeleteServiceZone } from "@/hooks/service-zone/deleteServiceZone";
import { useUpdateServiceZoneStatus } from "@/hooks/service-zone/updateServiceZoneStatus";
import { notify } from "@/utils/toastStore";

const allZone: ServiceZone[] = [
  {
    id: "1",
    region: "lagos",
    city: "Ikeja",
    zone: "zone A",
    service: "ride",
    operators: 20,
    status: "active",
  },
  {
    id: "2",
    region: "abuja",
    city: "Victoria Island",
    zone: "zone B",
    service: "all services",
    operators: 20,
    status: "inactive",
  },
];

const ServiceZone = () => {
  const [openAddCategory, setOpenAddCategory] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState<number>(1);
  // const [openAddZone, setOpenAddZone] = useState(false);
  const [openEditZone, setOpenEditZone] = useState(false);
  const [selectedZone, setSelectedZone] = useState<ServiceZoneList | null>(
    null,
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { data: serviceZone, isLoading } = useGetZoneStat();
  const { data: serviceZoneList, isLoading: serviceListLoading } =
    useGetServiceZoneList({
      page: currentPage,
      limit: itemsPerPage,
      state: selectedState !== "All States" ? selectedState : undefined,
    });

  const deleteMutation = useDeleteServiceZone();
  const statusMutation = useUpdateServiceZoneStatus();

  const totalPages = Math.ceil(
    (serviceZoneList?.data?.total ?? 0) / (serviceZoneList?.data?.limit ?? 20),
  );
  const paginatedData = serviceZoneList?.data?.zones || [];
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleOpenAddCategory = () => {
    setOpenAddCategory(true);
  };
  const handleCloseAddCategory = () => {
    setOpenAddCategory(false);
  };

  const handleOpenEditZone = (zone: ServiceZoneList) => {
    setOpenEditZone(true);
    setSelectedZone(zone);
  };

  const handleCloseEditZone = () => {
    setOpenEditZone(false);
    setSelectedZone(null);
  };

  const columns = [
    {
      header: "Region",
      accessor: "region" as keyof ServiceZoneList,
    },

    {
      header: "City/Area",
      accessor: "city" as keyof ServiceZoneList,
    },

    {
      header: "Zone Name",
      accessor: "zone_name" as keyof ServiceZoneList,
    },

    {
      header: "Service",
      accessor: "service_type" as keyof ServiceZoneList,
    },

    {
      header: "Operators",
      accessor: "operator_count" as keyof ServiceZoneList,
    },

    {
      header: "Status",
      accessor: "status" as keyof ServiceZoneList,
      render: (row: ServiceZoneList) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
            row.status === "active"
              ? "bg-success-100 text-success-600"
              : "bg-warning-100 text-warning-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },

    {
      header: "Actions",
      accessor: "id" as keyof ServiceZoneList,
      sortable: false,
      render: (row: ServiceZoneList) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row.status === "active"}
              onChange={() => statusMutation.mutate(String(row.id))}
              disabled={statusMutation.isPending}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>

          <div
            className="text-brand-600 text-sm font-bold cursor-pointer"
            onClick={() => handleOpenEditZone(row)}
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

  const handleDeleteConfirm = (zone: ServiceZoneList) => {
    notify({
      type: "danger",
      title: "Delete Vehicle Category",
      message:
        "Are you sure you want to delete this vehicle category. Please note that this action is non-reversible.",
      onConfirm: () => deleteMutation.mutate(String(zone.id)),
      confirmText: "Yes, Delete",
      cancelText: "No, Cancel",
    });
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Service Zones and Areas
          </h1>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        {/* <div className="flex items-center gap-3">
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddCategory}
            className="cursor-pointer"
          >
            Add Service Zone
          </Button>
        </div> */}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Service Zones
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(serviceZone?.data?.total_zones ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Active Zones
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(serviceZone?.data?.active_zones ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Inactive Zones
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(serviceZone?.data?.inactive_zones ?? 0)}
          </p>
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
              isLoading={serviceListLoading}
            />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={serviceZoneList?.data?.total || 0}
              itemsPerPage={serviceZoneList?.data?.limit || 20}
              onPageChange={serviceListLoading ? () => {} : handlePageChange}
            />
          </div>
        </div>
      </div>

      {/* {openAddCategory && (
        <AddServiceZone
          isOpen={openAddCategory}
          onClose={handleCloseAddCategory}
          mode="create"
        />
      )} */}

      {openEditZone && selectedZone && (
        <AddServiceZone
          isOpen={openEditZone}
          onClose={handleCloseEditZone}
          mode="edit"
          //@ts-expect-error will work on it later
          editData={{
            id: selectedZone.id,
            zone_name: selectedZone.zone_name,
            city: selectedZone.city,
            region: selectedZone.region,
            service_type: selectedZone.service_type,
          }}
        />
      )}
    </div>
  );
};

export default ServiceZone;
