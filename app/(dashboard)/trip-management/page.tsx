"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import TabNavigation from "@/components/tabNavigation";
import {
  formatCompactNumber,
  formatPrice,
  NIGERIAN_STATES,
  Tabs,
} from "@/utils/utils";
import { PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AllTripsDetails from "./all-trips";
import OnGoingTripsDetails from "./ongoing-trips";
import ScheduledTripsDetails from "./scheduled-trips";
import CompletedTripsDetails from "./completed-trips";
import CancelledTripsDetails from "./cancelled-trips";
import { useGetTrips } from "@/hooks/rides/getRides";
import { useGetTripsStat } from "@/hooks/rides/tripsStats";
import { TripsDetailsResponse } from "@/@types";

const TAB_STATUS_MAP: Record<string, string | undefined> = {
  all: undefined,
  ongoing: "IN_PROGRESS",
  scheduled: "SCHEDULED",
  completed: "COMPLETED",
  cancelled: "CANCELLED",
};

const ITEMS_PER_PAGE = 10;
const SERVICE_OPTIONS = [
  "All Services",
  "RIDES",
  "DELIVERY",
  "TOWING",
  "TRUCK",
];

const Riders = () => {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedService, setSelectedService] =
    useState<string>("All Services");
  const [selectedTab, setSelectedTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const { data: tripsData, isLoading } = useGetTrips({
    status: TAB_STATUS_MAP[selectedTab],
    state: selectedState === "All States" ? undefined : selectedState,
    service_type:
      selectedService === "All Services" ? undefined : selectedService, // updated key
    page: currentPage,
    limit: ITEMS_PER_PAGE,
  });

  const { data: tripsStatsData } = useGetTripsStat({
    service_type:
      selectedService === "All Services" ? undefined : selectedService,
    state: selectedState === "All States" ? undefined : selectedState,
  });

  const tripsDetails: TripsDetailsResponse[] = tripsData?.data ?? [];
  const tripsStat = tripsStatsData?.data;

  const handleTabChange = (tabId: string) => {
    setSelectedTab(tabId);
    setCurrentPage(1);
  };

  const handleStateChange = (state: string) => {
    setSelectedState(state);
    setCurrentPage(1);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setCurrentPage(1);
  };

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);
  const handleExport = async (_format: string) => {
    // await exportMutation.mutateAsync(_format);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Trips Management
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
          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="flex min-h-10 max-h-10 px-4 py-2.5 justify-center items-center gap-2 rounded-lg border border-[#98A2B3] bg-white text-grey-800 text-sm font-medium cursor-pointer"
          >
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
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
        <p className="text-grey-800 text-4xl font-bold">
          {tripsStat?.total_revenue ?? 0}
        </p>
      </div>

      <div className="grid grid-cols-4 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Ongoing Trips
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(tripsStat?.ongoing_trips ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Scheduled
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(tripsStat?.scheduled_trips ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Completed Today
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(tripsStat?.completed_today ?? 0)}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Cancelled Trip
          </h3>
          <p className="text-grey-800 text-4xl font-bold">
            {formatCompactNumber(tripsStat?.cancelled_trips ?? 0)}
          </p>
        </div>
      </div>

      <TabNavigation tabs={Tabs} onTabChange={handleTabChange} />

      <div>
        {selectedTab === "all" && (
          <AllTripsDetails
            allTrips={tripsDetails}
            currentPage={currentPage}
            totalItems={tripsData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "ongoing" && (
          <OnGoingTripsDetails
            allTrips={tripsDetails}
            currentPage={currentPage}
            totalItems={tripsData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "scheduled" && (
          <ScheduledTripsDetails
            allTrips={tripsDetails}
            currentPage={currentPage}
            totalItems={tripsData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "completed" && (
          <CompletedTripsDetails
            allTrips={tripsDetails}
            currentPage={currentPage}
            totalItems={tripsData?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={isLoading}
          />
        )}
        {selectedTab === "cancelled" && (
          <CancelledTripsDetails
            allTrips={tripsDetails}
            currentPage={currentPage}
            totalItems={tripsData?.total ?? 0}
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

export default Riders;
