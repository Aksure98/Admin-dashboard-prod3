"use client";

import { LostItem } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import ViewLost from "@/components/viewLost";
import { formatDate } from "@/utils/utils";
import { useState } from "react";

interface AllLostProps {
  allLost: LostItem[];
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

const ClaimedDetails: React.FC<AllLostProps> = ({
  allLost,
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  isLoading,
}) => {
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedData = allLost
    .filter((item) => item.status === "CLAIMED")
    .map((item) => ({ ...item, id: item.id }));

  const handleViewDetails = (ticket_id: string) => {
    setSelectedTicketId(ticket_id);
    setViewDetails(true);
  };

  const handleCloseDetails = () => {
    setViewDetails(false);
    setSelectedTicketId(null);
  };

  const columns = [
    {
      header: "Item Id",
      accessor: "ticket_id" as keyof LostItem,
    },
    // {
    //   header: "Reported By",
    //   accessor: "user" as keyof AllLost,
    //   sortable: false,
    //   render: (row: AllLost) => (
    //     <div className="flex gap-2 items-center">
    //       <Avatar>
    //         <AvatarImage src={row.user.image?.[0]?.url} alt={row.user.name} />
    //         <AvatarFallback>{row.user.name.charAt(0)}</AvatarFallback>
    //       </Avatar>
    //       <div>
    //         <div className="font-bold text-sm text-grey-600">
    //           {row?.user?.name}
    //         </div>
    //         <div className="text-grey-600 text-sm">{row?.user?.email}</div>
    //       </div>
    //     </div>
    //   ),
    // },
    {
      header: "Item",
      accessor: "item_title" as keyof LostItem,
      sortable: false,
    },
    {
      header: "Type",
      accessor: "item_category" as keyof LostItem,
      sortable: false,
    },
    {
      header: "Location",
      accessor: "pickup_state" as keyof LostItem,
      sortable: false,
    },
    {
      header: "Image",
      accessor: "image" as keyof LostItem,
      sortable: false,
      render: (row: LostItem) => (
        <Avatar>
          <AvatarImage src={row?.image_urls[0]} alt={row?.item_title || ""} />
          <AvatarFallback>
            {row?.item_title ? row?.item_title.charAt(0).toUpperCase() : "?"}
          </AvatarFallback>
        </Avatar>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof LostItem,
      sortable: false,
      render: (row: LostItem) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
            row.status === "REPORTED"
              ? "bg-warning-100 text-warning-600"
              : row.status === "CLAIMED"
                ? "bg-success-100 text-success-600"
                : "bg-grey-100 text-grey-600"
          }`}
        >
          {row?.status}
        </p>
      ),
    },
    {
      header: "Date",
      accessor: "created_at" as keyof LostItem,
      render: (row: LostItem) => <p>{formatDate(row?.created_at)}</p>,
    },

    {
      header: "Action",
      accessor: "id" as keyof LostItem,
      sortable: false,
      render: (row: LostItem) => (
        <div
          onClick={() => handleViewDetails(row?.ticket_id)}
          className="text-brand-600 text-sm font-bold cursor-pointer "
        >
          View
        </div>
      ),
    },
  ];

  return (
    <div>
      <Table columns={columns} data={paginatedData} isLoading={isLoading} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        onPageChange={isLoading ? () => {} : onPageChange}
      />

      {viewDetails && selectedTicketId && (
        <ViewLost
          isOpen={viewDetails}
          onClose={handleCloseDetails}
          ticket_id={selectedTicketId}
        />
      )}
    </div>
  );
};

export default ClaimedDetails;
