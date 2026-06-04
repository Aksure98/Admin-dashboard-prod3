"use client";

import { CustomerTripBooking, CustomerTrips } from "@/@types";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetCustomerTrip } from "@/hooks/customer/customerTrips";
import { useGetCustomerTripStat } from "@/hooks/customer/customerTripStats";
import { formatDate, formatPrice } from "@/utils/utils";
import { useState } from "react";

interface TripProps {
  id: string;
}

const TripDetails: React.FC<TripProps> = ({ id }) => {
  const { data: customerTrip, isLoading } = useGetCustomerTrip(id);
  const { data: customerTripStat } = useGetCustomerTripStat(id);

  const customerTripDetails = customerTrip?.data;

  const customerTripStatDetails = customerTripStat?.data;

  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(
    (customerTripDetails?.total ?? 0) / (customerTripDetails?.limit ?? 20),
  );

  const paginatedData = customerTripDetails?.bookings || [];
  console.log(paginatedData);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const columns = [
    {
      header: "Id",
      accessor: "id" as keyof CustomerTripBooking,
    },
    {
      header: "Type",
      accessor: "service_type" as keyof CustomerTripBooking,
    },
    {
      header: "Operator",
      accessor: "assigned_operator" as keyof CustomerTripBooking,
      render: (row: CustomerTripBooking) => (
        <p>{row?.assigned_operator?.name ?? "N/A"}</p>
      ),
    },
    {
      header: "Amount",
      accessor: "estimated_fare" as keyof CustomerTripBooking,
      render: (row: CustomerTripBooking) => (
        <p>{formatPrice(row?.estimated_fare || 0)}</p>
      ),
    },
    {
      header: "Date",
      accessor: "created_at" as keyof CustomerTripBooking,
      render: (row: CustomerTripBooking) => (
        <p suppressHydrationWarning>
          {formatDate(Number(row?.created_at?.seconds ?? 0) * 1000)}
        </p>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof CustomerTripBooking,
      render: (row: CustomerTripBooking) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row?.status === "COMPLETED"
              ? "bg-success-100 text-success-600"
              : row?.status === "ONGOING"
                ? "bg-brand-50 text-brand-600"
                : row?.status === "SCHEDULED"
                  ? "bg-warning-50 text-warning-600"
                  : "bg-error-100 text-error-600"
          }`}
        >
          {row?.status}
        </p>
      ),
    },
    // {
    //   header: "Actions",
    //   accessor: "id" as keyof CustomerTrips,
    //   sortable: false,
    //   render: (row: CustomerTrips) => (
    //     <div
    //       className="text-brand-600 text-sm font-bold cursor-pointer"
    //       onClick={() => console.log(row)}
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
            {customerTripStatDetails?.total}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Completed Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.completed}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Cancelled Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.cancelled}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Scheduled Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.scheduled}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Rides
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.rides}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Delivery
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.delivery}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Towing
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.towing}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Truck
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {customerTripStatDetails?.truck}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Trips</h1>
        </div>

        <Table
          columns={columns}
          //@ts-expect-error will work on it later
          data={paginatedData}
        />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={customerTripDetails?.total || 0}
          itemsPerPage={customerTripDetails?.limit || 20}
          onPageChange={isLoading ? () => {} : handlePageChange}
        />
      </div>
    </div>
  );
};

export default TripDetails;
