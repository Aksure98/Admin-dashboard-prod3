"use client";

import { TripsDetailsResponse } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { formatDate, formatPrice } from "@/utils/utils";
import Link from "next/link";

interface AllTripsProps {
  allTrips: TripsDetailsResponse[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading: boolean;
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED: "bg-success-100 text-success-600",
  ONGOING: "bg-brand-50 text-brand-600",
  SCHEDULED: "bg-warning-50 text-warning-600",
  CANCELLED: "bg-error-100 text-error-600",
};

const AllTripsDetails: React.FC<AllTripsProps> = ({
  allTrips,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  console.log(allTrips);

  const columns = [
    {
      header: "Trip Id",
      accessor: "id" as keyof TripsDetailsResponse,
    },
    {
      header: "Service Type",
      accessor: "service_type" as keyof TripsDetailsResponse,
    },

    {
      header: "Fare",
      accessor: "estimated_fare" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <p>{formatPrice(row.estimated_fare)}</p>
      ),
    },
    {
      header: "Payment Method",
      accessor: "payment_method" as keyof TripsDetailsResponse,
    },
    {
      header: "Payment Status",
      accessor: "payment_status" as keyof TripsDetailsResponse,
      render: (row: TripsDetailsResponse) => (
        <p>{row?.payment_status?.status}</p>
      ),
    },
    {
      header: "Operator Details",
      accessor: "assigned_operator" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={row?.assigned_operator?.avatar_url}
              alt={row.assigned_operator?.name ?? ""}
            />
            <AvatarFallback>
              {row.assigned_operator?.name
                ? row.assigned_operator.name.charAt(0).toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row.assigned_operator?.name}
            </div>
            <div className="text-grey-600 text-sm">
              {row.assigned_operator?.vehicle_make}
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Customer Details",
      accessor: "customer" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage
              src={row?.customer?.avatar}
              alt={row.customer?.full_name ?? ""}
            />
            <AvatarFallback>
              {row?.customer?.full_name
                ? row?.customer?.full_name.charAt(0).toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row.customer?.full_name}
            </div>
            <div className="text-grey-600 text-sm">{row.customer?.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Pickup",
      accessor: "pickup" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <p className="text-sm text-grey-600 max-w-[200px] truncate">
          {row.pickup?.address ?? "-"}
        </p>
      ),
    },
    {
      header: "Destination",
      accessor: "destination" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <p className="text-sm text-grey-600 max-w-[200px] truncate">
          {row.destination?.address ?? "-"}
        </p>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof TripsDetailsResponse,

      render: (row: TripsDetailsResponse) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
            STATUS_STYLES[row.status] ?? "bg-indigo-50 text-indigo-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "created_at" as keyof TripsDetailsResponse,
      render: (row: TripsDetailsResponse) => (
        <span>{formatDate(Number(row.created_at?.seconds) * 1000)}</span>
      ),
    },

    {
      header: "Actions",
      accessor: "id",
      sortable: false,

      render: (row: TripsDetailsResponse) => (
        <Link
          href={`/trip-management/${row.id}`}
          className="text-brand-600 text-sm font-bold"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <Table
        //@ts-expect-error will work on it
        columns={columns}
        data={allTrips}
        isLoading={isLoading}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default AllTripsDetails;
