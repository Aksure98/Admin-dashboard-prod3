"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import TabNavigation from "@/components/tabNavigation";
import {
  allRides,
  cancelledRides,
  completedRides,
  formatCompactNumber,
  formatPrice,
  NIGERIAN_STATES,
  onGoingRides,
  scheduledRides,
  Tabs,
} from "@/utils/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AllCargoDetails from "./all-cargo";
import OngoingCargoDetails from "./ongoing-cargo";
import ScheduledCargoDetails from "./scheduled-cargo";
import CancelledCargoDetails from "./cancelled-cargo";
import CompletedCargoDetails from "./completed-cargo";
import { useGetCargoStat } from "@/hooks/cargo/cargoStat";
import { useGetCargo } from "@/hooks/cargo/getCargo";
import { TripsDetailsResponse } from "@/@types";

const TAB_STATUS_MAP: Record<string, string | undefined> = {
  all: undefined,
  ongoing: "IN_PROGRESS",
  scheduled: "SCHEDULED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const ITEMS_PER_PAGE = 10;

const Cargo = () => {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: cargoData, isLoading } = useGetCargo({
    status: TAB_STATUS_MAP[selectedTab],
    state: selectedState === "All States" ? undefined : selectedState,
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const { data: cargoStatsData } = useGetCargoStat();

  const cargoDetails: TripsDetailsResponse[] = cargoData?.data ?? [];
  const cargoStat = cargoStatsData?.data;

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setCurrentPage(1);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setCurrentPage(1); // reset to first page on state change
  };

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };
  const handleExportClose = () => {
    setOpenExportModal(false);
  };

  const handleExport = async (format: string) => {
    // await exportMutation.mutateAsync(format); // ✅ pass format to mutation
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Cargo Trip Management
          </h1>

          <select
            value={selectedState}
            onChange={(e) => handleStateChange(e.target.value)}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
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

      <div className="border border-grey-200 rounded-3xl p-6">
        <h3 className="text-grey-600 text-sm font-bold font-figtree">
          Total Revenue
        </h3>

        <p className="text-grey-800 text-4xl font-bold ">
          {cargoStat?.total_revenue}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Ongoing Trips
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(cargoStat?.ongoing_trips ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Scheduled
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(cargoStat?.scheduled_trips ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Completed Today
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(cargoStat?.completed_today ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Cancelled Trip
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {formatCompactNumber(cargoStat?.cancelled_trips ?? 0)}
          </p>
        </div>
      </div>

      <TabNavigation tabs={Tabs} onTabChange={handleTabChange} />

      <div>
        {selectedTab === "all" && (
          <AllCargoDetails
            allTrips={cargoDetails}
            currentPage={currentPage}
            totalItems={cargoData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "ongoing" && (
          <OngoingCargoDetails
            allTrips={cargoDetails}
            currentPage={currentPage}
            totalItems={cargoData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "scheduled" && (
          <ScheduledCargoDetails
            allTrips={cargoDetails}
            currentPage={currentPage}
            totalItems={cargoData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "completed" && (
          <CompletedCargoDetails
            allTrips={cargoDetails}
            currentPage={currentPage}
            totalItems={cargoData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "cancelled" && (
          <CancelledCargoDetails
            allTrips={cargoDetails}
            currentPage={currentPage}
            totalItems={cargoData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default Cargo;
