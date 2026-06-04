"use client";
import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import {
  NIGERIAN_STATES,
  formatCompactNumber,
  formatDate,
} from "@/utils/utils";
import {
  BicycleIcon,
  CalendarIcon,
  CarSimpleIcon,
  PlusIcon,
  TractorIcon,
  TruckIcon,
} from "@phosphor-icons/react";
import { useState } from "react";
import BarChart from "./chart";
import Link from "next/link";
import TabNavigation from "@/components/tabNavigation";
import Rating from "./rating";
import Earning from "./earning";
import Trip from "./trip";
import { useDashboardStat } from "@/hooks/dashboard/dashboardStat";
import { useGetLiveOperations } from "@/hooks/dashboard/liveOperation";
import { useRecentActivities } from "@/hooks/dashboard/recentActivities";
import { useTopPerformer } from "@/hooks/dashboard/topPerformer";
import { DashboardNotificationItem } from "@/@types";

const OperationOptions = [
  { label: "All Operation", value: "all" },
  { label: "Ride Operation", value: "ride" },
  { label: "Delivery Operation", value: "delivery" },
  { label: "Tow Operation", value: "tow" },
  { label: "Cargo Operation", value: "cargo" },
];

const Tabs = [
  { id: "rating", label: "Rating" },
  { id: "earnings", label: "Earnings" },
  { id: "trips_booked", label: "Trips booked" },
];

type Period = "THIS_MONTH" | "LAST_MONTH" | "LAST_7_DAYS" | "LAST_30_DAYS";

const SkeletonBlock = ({ className }: { className?: string }) => (
  <div className={`animate-pulse bg-grey-100 rounded-lg ${className}`} />
);

const StatsSkeleton = () => (
  <div className="grid grid-cols-5 gap-5">
    {Array.from({ length: 9 }).map((_, i) => (
      <div
        key={i}
        className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-3"
      >
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-10 w-16" />
      </div>
    ))}
  </div>
);

const LiveOperationsSkeleton = () => (
  <div className="col-span-1 border border-grey-200 rounded-3xl p-6 flex flex-col gap-5">
    <SkeletonBlock className="h-6 w-36" />
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex justify-between items-center pb-3">
        <div className="flex gap-4 items-center">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="h-3 w-12" />
          </div>
        </div>
        <SkeletonBlock className="h-8 w-14 rounded-lg" />
      </div>
    ))}
  </div>
);

const RecentActivitiesSkeleton = () => (
  <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-3">
    <SkeletonBlock className="h-6 w-40" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex justify-between items-center pb-3">
        <div className="flex gap-4 items-center">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-3 w-24" />
          </div>
        </div>
        <SkeletonBlock className="h-8 w-24 rounded-xl" />
      </div>
    ))}
  </div>
);

const TopPerformerSkeleton = () => (
  <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-3">
    <SkeletonBlock className="h-6 w-36" />
    <SkeletonBlock className="h-10 w-full rounded-xl" />
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex justify-between items-center pb-3">
        <div className="flex gap-4 items-center">
          <SkeletonBlock className="h-10 w-10 rounded-full" />
          <div className="flex flex-col gap-2">
            <SkeletonBlock className="h-4 w-32" />
            <SkeletonBlock className="h-3 w-20" />
          </div>
        </div>
        <SkeletonBlock className="h-4 w-16" />
      </div>
    ))}
  </div>
);

const DashboardPage = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedOperation, setSelectedOperation] = useState<string>("all");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("THIS_MONTH");
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("rating");

  const { data: dashboardStat, isLoading: isDashboardLoading } =
    useDashboardStat({
      period: selectedPeriod,
      state: selectedState !== "All States" ? selectedState : undefined,
    });
  const { data: liveOperation, isLoading: isLiveOperationLoading } =
    useGetLiveOperations();
  const { data: notification, isLoading: isNotificationLoading } =
    useRecentActivities();
  const { data: topPerformer, isLoading: isTopPerformerLoading } =
    useTopPerformer({
      sort_by: selectedTab,
    });

  const dashboardStatDetails = dashboardStat?.data;
  const liveOperationDetails = liveOperation?.data;
  const notificationDetails = notification;

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);
  const handleExport = async (_format: string) => {
    // await exportMutation.mutateAsync(_format);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Dashboard
          </h1>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="flex min-h-10 max-h-10 px-4 py-2.5 justify-center items-center gap-2 rounded-lg border border-[#98A2B3] bg-white text-grey-800 text-sm font-medium cursor-pointer"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative flex h-10 min-h-8 px-3 items-center gap-3 rounded-lg border border-[#E4E7EC] bg-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M16.25 2.5H14.375V1.875C14.375 1.70924 14.3092 1.55027 14.1919 1.43306C14.0747 1.31585 13.9158 1.25 13.75 1.25C13.5842 1.25 13.4253 1.31585 13.3081 1.43306C13.1908 1.55027 13.125 1.70924 13.125 1.875V2.5H6.875V1.875C6.875 1.70924 6.80915 1.55027 6.69194 1.43306C6.57473 1.31585 6.41576 1.25 6.25 1.25C6.08424 1.25 5.92527 1.31585 5.80806 1.43306C5.69085 1.55027 5.625 1.70924 5.625 1.875V2.5H3.75C3.41848 2.5 3.10054 2.6317 2.86612 2.86612C2.6317 3.10054 2.5 3.41848 2.5 3.75V16.25C2.5 16.5815 2.6317 16.8995 2.86612 17.1339C3.10054 17.3683 3.41848 17.5 3.75 17.5H16.25C16.5815 17.5 16.8995 17.3683 17.1339 17.1339C17.3683 16.8995 17.5 16.5815 17.5 16.25V3.75C17.5 3.41848 17.3683 3.10054 17.1339 2.86612C16.8995 2.6317 16.5815 2.5 16.25 2.5ZM5.625 3.75V4.375C5.625 4.54076 5.69085 4.69973 5.80806 4.81694C5.92527 4.93415 6.08424 5 6.25 5C6.41576 5 6.57473 4.93415 6.69194 4.81694C6.80915 4.69973 6.875 4.54076 6.875 4.375V3.75H13.125V4.375C13.125 4.54076 13.1908 4.69973 13.3081 4.81694C13.4253 4.93415 13.5842 5 13.75 5C13.9158 5 14.0747 4.93415 14.1919 4.81694C14.3092 4.69973 14.375 4.54076 14.375 4.375V3.75H16.25V6.25H3.75V3.75H5.625ZM16.25 16.25H3.75V7.5H16.25V16.25Z"
                fill="#475467"
              />
            </svg>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="border-none bg-transparent text-grey-800 focus:outline-none cursor-pointer"
            >
              <option value="THIS_MONTH">This month</option>
              <option value="LAST_MONTH">Last month</option>
              <option value="LAST_7_DAYS">Last 7 Days</option>
              <option value="LAST_30_DAYS">Last 30 Days</option>
            </select>
          </div>
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Stats */}
      {isDashboardLoading ? (
        <StatsSkeleton />
      ) : (
        <div className="grid grid-cols-5 gap-5">
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Total trips
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.total_trips ?? 0)}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active Trips
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.active_trips ?? 0)}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Total Revenue
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {dashboardStatDetails?.total_revenue ?? "₦0.00"}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Total Users
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.total_users ?? 0)}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active SOS Alerts
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(
                dashboardStatDetails?.active_sos_alerts ?? 0,
              )}
            </p>
          </div>
          {/* <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active Cargo
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.active_cargo ?? 0)}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active Delivery
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(
                dashboardStatDetails?.active_deliveries ?? 0,
              )}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active Rides
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.active_rides ?? 0)}
            </p>
          </div>
          <div className="border border-grey-200 rounded-3xl p-6">
            <h3 className="text-grey-600 text-sm font-bold font-figtree">
              Active Towing
            </h3>
            <p className="text-grey-800 text-4xl font-bold">
              {formatCompactNumber(dashboardStatDetails?.active_towing ?? 0)}
            </p>
          </div> */}
        </div>
      )}

      {/* Chart + Live Operations */}
      <div className="grid grid-cols-4 gap-4">
        <div className="col-span-3 border border-grey-200 rounded-3xl p-6 flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <h3 className="text-grey-800 text-xl font-bold">
              Revenue Overview
            </h3>
            <select
              value={selectedOperation}
              onChange={(e) => setSelectedOperation(e.target.value)}
              className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
            >
              {OperationOptions.map((option) => (
                <option key={option.label} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-5 items-center">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-brand-600 h-2 w-2" />
              <p className="text-grey-500 text-sm">Ride</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-brand-400 h-2 w-2" />
              <p className="text-grey-500 text-sm">Cargo</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-brand-200 h-2 w-2" />
              <p className="text-grey-500 text-sm">Delivery</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-brand-50 h-2 w-2" />
              <p className="text-grey-500 text-sm">Tow</p>
            </div>
          </div>
          <BarChart selectedOperation={selectedOperation} />
        </div>

        {/* Live Operations */}
        {isLiveOperationLoading ? (
          <LiveOperationsSkeleton />
        ) : (
          <div className="col-span-1 border border-grey-200 rounded-3xl p-6 flex flex-col gap-5 h-fit">
            <h2 className="text-grey-800 text-xl font-bold">Live Operations</h2>
            <div className="divide-y divide-grey-100 grid gap-10">
              <div className="flex justify-between pb-3">
                <div className="flex gap-5">
                  <div className="bg-brand-50 rounded-full w-10 h-10 text-brand-600 flex justify-center items-center">
                    <CarSimpleIcon size={20} />
                  </div>
                  <div className="text-grey-600 text-sm">
                    <h3 className="font-bold">Active Rides</h3>
                    <h6 className="font-normal">
                      {liveOperationDetails?.active_rides}
                    </h6>
                  </div>
                </div>
                {/* <Link
                  href="/rides"
                  className="bg-brand-600 px-5 py-1 text-center text-grey-0 rounded-lg flex justify-center items-center hover:bg-brand-400 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  View
                </Link> */}
              </div>
              <div className="flex justify-between pb-3">
                <div className="flex gap-5">
                  <div className="bg-brand-50 rounded-full w-10 h-10 text-brand-600 flex justify-center items-center">
                    <BicycleIcon size={20} />
                  </div>
                  <div className="text-grey-600 text-sm">
                    <h3 className="font-bold">Active Deliveries</h3>
                    <h6 className="font-normal">
                      {liveOperationDetails?.active_deliveries}
                    </h6>
                  </div>
                </div>
                {/* <Link
                  href="/delivery"
                  className="bg-brand-600 px-5 py-1 text-center text-grey-0 rounded-lg flex justify-center items-center hover:bg-brand-400 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  View
                </Link> */}
              </div>
              <div className="flex justify-between pb-3">
                <div className="flex gap-5">
                  <div className="bg-brand-50 rounded-full w-10 h-10 text-brand-600 flex justify-center items-center">
                    <TruckIcon size={20} />
                  </div>
                  <div className="text-grey-600 text-sm">
                    <h3 className="font-bold">Active Cargo</h3>
                    <h6 className="font-normal">
                      {liveOperationDetails?.active_cargo}
                    </h6>
                  </div>
                </div>
                {/* <Link
                  href="/cargo"
                  className="bg-brand-600 px-5 py-1 text-center text-grey-0 rounded-lg flex justify-center items-center hover:bg-brand-400 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  View
                </Link> */}
              </div>
              <div className="flex justify-between pb-3">
                <div className="flex gap-5">
                  <div className="bg-brand-50 rounded-full w-10 h-10 text-brand-600 flex justify-center items-center">
                    <TractorIcon size={20} />
                  </div>
                  <div className="text-grey-600 text-sm">
                    <h3 className="font-bold">Active Towing</h3>
                    <h6 className="font-normal">
                      {liveOperationDetails?.active_towing}
                    </h6>
                  </div>
                </div>
                {/* <Link
                  href="/tow"
                  className="bg-brand-600 px-5 py-1 text-center text-grey-0 rounded-lg flex justify-center items-center hover:bg-brand-400 transition-all duration-300 hover:scale-110 active:scale-95"
                >
                  View
                </Link> */}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Recent Activities + Top Performance */}
      <div className="grid grid-cols-2 gap-5">
        {isNotificationLoading ? (
          <RecentActivitiesSkeleton />
        ) : (
          <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-3">
            <h2 className="text-grey-800 text-xl font-bold">
              Recent Activities
            </h2>
            <div className="divide-y divide-grey-100 grid gap-10">
              {notificationDetails?.data?.length === 0 ? (
                <p className="text-grey-400 text-sm text-center py-6">
                  No activities yet
                </p>
              ) : (
                notificationDetails?.data
                  ?.slice(0, 5)
                  .map(
                    (
                      notification: DashboardNotificationItem,
                      index: number,
                    ) => (
                      <div key={index} className="flex justify-between pb-3">
                        <div className="flex gap-5">
                          <div className="bg-brand-50 rounded-full w-10 h-10 text-brand-600 flex justify-center items-center">
                            <CarSimpleIcon size={20} />
                          </div>
                          <div className="text-grey-600 text-sm">
                            <h3 className="font-bold">
                              {notification.event_type
                                .replace(/_/g, " ")
                                .toLowerCase()
                                .replace(/\b\w/g, (c) => c.toUpperCase())}
                            </h3>
                            <h6 className="font-normal">
                              {notification.service_type}
                            </h6>
                            <h6 className="font-normal">
                              {notification.description}
                            </h6>
                          </div>
                        </div>
                        <div className="bg-brand-25 rounded-xl flex justify-center items-center px-3 py-1 text-grey-600 text-sm">
                          {formatDate(notification?.timestamp)}
                        </div>
                      </div>
                    ),
                  )
              )}
            </div>
          </div>
        )}

        {/* Top Performance */}
        {isTopPerformerLoading ? (
          <TopPerformerSkeleton />
        ) : (
          <div className="border border-grey-200 rounded-3xl p-6 flex flex-col gap-3">
            <h2 className="text-grey-800 text-xl font-bold">Top Performance</h2>
            <TabNavigation
              tabs={Tabs}
              onTabChange={(tabId) => setSelectedTab(tabId)}
            />
            <div>
              {selectedTab === "rating" && <Rating data={topPerformer?.data} />}
              {selectedTab === "earnings" && (
                <Earning data={topPerformer?.data} />
              )}
              {selectedTab === "trips_booked" && (
                <Trip data={topPerformer?.data} />
              )}
            </div>
          </div>
        )}
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default DashboardPage;
