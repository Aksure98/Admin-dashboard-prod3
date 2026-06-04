"use client";
import { DriverRating, PerformanceRating } from "@/@types";
import Table from "@/components/table";
import TabNavigation from "@/components/tabNavigation";
import { useGetPerformance } from "@/hooks/drivers/getPerformance";
import { useState } from "react";

interface DriverRatingProps {
  id: string;
}
const DriverRatingDetails: React.FC<DriverRatingProps> = ({ id }) => {
  const [selectedTab, setSelectedTab] = useState("received");
  const { data: performanceData, isLoading } = useGetPerformance(id);

  const ratingTabs = [
    { id: "received", label: "Received" },
    { id: "given", label: "Given" },
  ];

  const columns = [
    {
      header: "Trip ID",
      accessor: "trip_id" as keyof PerformanceRating,
    },

    {
      header: "Driver",
      accessor: "driver" as keyof PerformanceRating,
    },
    {
      header: "Rating",
      accessor: "rating" as keyof PerformanceRating,
      render: (row: PerformanceRating) => (
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              className={`w-4 h-4 ${
                star <= Number(row.rating)
                  ? "text-warning-500"
                  : "text-grey-300"
              }`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="ml-1 text-sm text-grey-600">{row.rating}</span>
        </div>
      ),
    },
    {
      header: "Description",
      accessor: "description" as keyof PerformanceRating,
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
            {performanceData?.data?.average_rating_received}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Ratings Received
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.total_ratings_received}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total Ratings Given
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.total_ratings_given}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Completed Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.completed_trips}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Cancellation Rate
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.cancellation_rate}%
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Acceptance Rate
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.acceptance_rate}%
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Trips per hour
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.trips_per_hour}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Earnings per hour
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.earnings_per_hour}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Disputes Filled Against
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {performanceData?.data?.disputes_filed_against}
          </p>
        </div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 flex items-center justify-between">
          <h1 className="text-grey-800 text-2xl font-bold">Trips</h1>
          <TabNavigation
            tabs={ratingTabs}
            onTabChange={(tabId) => {
              setSelectedTab(tabId);
            }}
          />
        </div>

        <div className="">
          {selectedTab === "received" && (
            <>
              <Table
                columns={columns}
                data={performanceData?.data?.performanceRating ?? []}
              />
            </>
          )}

          {selectedTab === "given" && (
            <>
              <Table
                columns={columns}
                data={performanceData?.data?.performanceRating ?? []}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRatingDetails;
