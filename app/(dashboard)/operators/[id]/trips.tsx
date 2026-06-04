"use client";

import { DriverTrips, DriverTripStat, SingleTripDetails } from "@/@types";

import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetTripList } from "@/hooks/drivers/getTripsList";
import { useGetTripStats } from "@/hooks/drivers/getTripsStats";
import { formatDate, formatPrice } from "@/utils/utils";
import { useState } from "react";

interface TripProps {
  id: string;
  service_type: string;
}

const DriverTripDetails: React.FC<TripProps> = ({ id, service_type }) => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: tripStatData, isLoading } = useGetTripStats(id);
  const { data: tripList, isLoading: tripLoading } = useGetTripList(id, {
    page: currentPage,
    limit: itemsPerPage,
  });

  console.log(tripList);

  const totalPages = Math.ceil(
    (tripList?.data?.total ?? 0) / (tripList?.data?.limit ?? 20),
  );
  const paginatedData = (tripList?.data?.bookings ?? []).map((item) => ({
    ...item,
    id: item.id,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Trip Id",
      accessor: "id" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => <p>{row?.id}</p>,
    },
    {
      header: "Operator",
      accessor: "assigned_operator" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => <p>{row?.assigned_operator?.name}</p>,
    },
    {
      header: "Customer",
      accessor: "customer" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => <p>{row?.customer?.name}</p>,
    },
    {
      header: "Status",
      accessor: "status" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "COMPLETED"
              ? "bg-success-100 text-success-600"
              : row.status === "ONGOING"
                ? "bg-brand-50 text-brand-600"
                : row.status === "SCHEDULED"
                  ? "bg-warning-50 text-warning-600"
                  : "bg-error-100 text-error-600"
          }`}
        >
          {row.status}
        </p>
      ),
    },
    {
      header: "Pick up",
      accessor: "pickup" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p>
          {row?.pickup?.address}, {row?.pickup?.state}
        </p>
      ),
    },
    {
      header: "destination",
      accessor: "destination" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p>
          {row?.destination?.address}, {row?.destination?.state}
        </p>
      ),
    },
    {
      header: "Amount",
      accessor: "estimated_fare" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p>{formatPrice(row?.estimated_fare)}</p>
      ),
    },
    {
      header: "Payment Method",
      accessor: "payment_method" as keyof SingleTripDetails,
    },
    {
      header: "Payment Status",
      accessor: "payment_status" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.payment_status?.status === "PAID"
              ? "bg-success-100 text-success-600"
              : row.payment_status?.status === "PENDING"
                ? "bg-warning-50 text-warning-600"
                : "bg-error-100 text-error-600"
          }`}
        >
          {row?.payment_status?.status}
        </p>
      ),
    },
    {
      header: "Date",
      accessor: "created_at" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p suppressHydrationWarning>
          {new Date(Number(row?.created_at?.seconds) * 1000).toLocaleString(
            "en-US",
            {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hour12: true,
            },
          )}
        </p>
      ),
    },

    // {
    //   header: "Actions",
    //   accessor: "id" as keyof SingleTripDetails,
    //   sortable: false,
    //   render: (row: SingleTripDetails) => (
    //     <div
    //       className="text-brand-600 text-sm font-bold cursor-pointer"
    //       onClick={() => row}
    //     >
    //       View
    //     </div>
    //   ),
    // },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            All Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {tripStatData?.data?.rides}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Completed Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {tripStatData?.data?.completed}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Cancelled Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {tripStatData?.data?.cancelled}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Ongoing Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {tripStatData?.data?.in_progress}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Trips</h1>
        </div>

        <Table
          columns={columns}
          data={paginatedData ?? []}
          isLoading={tripLoading}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={tripList?.data?.total ?? 0}
          itemsPerPage={itemsPerPage}
          onPageChange={tripLoading ? () => {} : handlePageChange}
        />
      </div>
    </div>
  );
};

export default DriverTripDetails;
