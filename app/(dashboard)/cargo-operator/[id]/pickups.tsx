"use client";

import { SingleTripDetails } from "@/@types";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetCargoTripList } from "@/hooks/cargo/getTripsList";
import { useGetCargoTripStats } from "@/hooks/cargo/getTripsStats";
import { formatPrice } from "@/utils/utils";
import { useState } from "react";

interface TripProps {
  id: string;
}

const CargoTripDetails: React.FC<TripProps> = ({ id }) => {
  const itemsPerPage = 20;
  const [currentPage, setCurrentPage] = useState<number>(1);
  const { data: tripStatData } = useGetCargoTripStats(id);
  const { data: tripList, isLoading: tripLoading } = useGetCargoTripList(id, {
    page: currentPage,
    limit: itemsPerPage,
  });

  const totalPages = Math.ceil(
    (tripList?.data?.total ?? 0) / (tripList?.data?.limit ?? 20),
  );
  const paginatedData = (tripList?.data?.bookings ?? []).map((item) => ({
    ...item,
    id: item.trip_id,
  }));

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Trip Id",
      accessor: "trip_id" as keyof SingleTripDetails,
    },
    {
      header: "Customer",
      accessor: "customer" as keyof SingleTripDetails,
    },
    {
      header: "Amount",
      accessor: "estimated_fare" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p>{formatPrice(row?.estimated_fare)}</p>
      ),
    },
    {
      header: "Date",
      accessor: "date" as keyof SingleTripDetails,
    },
    {
      header: "Status",
      accessor: "status" as keyof SingleTripDetails,
      render: (row: SingleTripDetails) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.status === "completed"
              ? "bg-success-100 text-success-600"
              : row.status === "ongoing"
                ? "bg-brand-50 text-brand-600"
                : row.status === "scheduled"
                  ? "bg-warning-50 text-warning-600"
                  : "bg-error-100 text-error-600"
          }`}
        >
          {row.status}
        </p>
      ),
    },
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

        <Table columns={columns} data={paginatedData ?? []} />
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

export default CargoTripDetails;
