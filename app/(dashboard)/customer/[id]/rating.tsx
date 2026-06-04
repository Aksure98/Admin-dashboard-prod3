"use client";
import { CustomerRating } from "@/@types";
import Table from "@/components/table";
import TabNavigation from "@/components/tabNavigation";
import { useGetCustomerRating } from "@/hooks/customer/customerRating";
import { useState } from "react";

interface RatingProps {
  id: string;
}

const RatingDetails: React.FC<RatingProps> = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState<"GIVEN" | "RECEIVED">(
    "RECEIVED",
  );

  const { data: reviewData, isLoading } = useGetCustomerRating(id, selectedTab);

  const reviewDetailsData = reviewData?.data;

  const ratingTabs = [
    { id: "RECEIVED", label: "Received" },
    { id: "GIVEN", label: "Given" },
  ];

  const columns = [
    {
      header: "Trip ID",
      accessor: "id" as keyof CustomerRating,
      render: (row: CustomerRating) => (
        <span>{row?.data?.rating?.id ?? "-"}</span>
      ),
    },
    {
      header: "Type",
      accessor: "type" as keyof CustomerRating,
      render: (row: CustomerRating) => (
        <span>{row?.data?.rating?.type ?? "-"}</span>
      ),
    },
    {
      header: "Driver",
      accessor: "driver" as keyof CustomerRating,
      render: (row: CustomerRating) => (
        <span>{row?.data?.rating?.driver ?? "-"}</span>
      ),
    },
    {
      header: "Rating",
      accessor: "rating" as keyof CustomerRating,
      render: (row: CustomerRating) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Number(row?.data?.rating?.rating)
                  ? "text-warning-500"
                  : "text-grey-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-grey-600">
            {row?.data?.rating?.rating}
          </span>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description" as keyof CustomerRating,
      render: (row: CustomerRating) => (
        <span>{row?.data?.rating?.description ?? "-"}</span>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Average Rating Received
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {reviewDetailsData?.average_rating ?? 0}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {reviewDetailsData?.total ?? 0}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Ratings</h1>
          <TabNavigation
            tabs={ratingTabs}
            onTabChange={(tabId) =>
              setSelectedTab(tabId as "GIVEN" | "RECEIVED")
            }
          />
        </div>

        <Table
          //@ts-expect-error will work on it
          columns={columns}
          //@ts-expect-error will work on it
          data={reviewDetailsData?.rating ?? ([] as CustomerRating[])}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default RatingDetails;
