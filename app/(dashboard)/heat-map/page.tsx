"use client";

import { useMemo, useState } from "react";
import { CalendarIcon, PlusIcon } from "@phosphor-icons/react";
import { GoogleMap, useLoadScript, MarkerF } from "@react-google-maps/api";
import { HeatMapPoint } from "@/@types";
import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import TabNavigation from "@/components/tabNavigation";
import { useExportHeatMap } from "@/hooks/heat-map/exportHeatMap";
import { useGetHeatMap } from "@/hooks/heat-map/getHeatMap";
import { NIGERIAN_STATES } from "@/utils/utils";
import LowDemandAreas from "./low";
import TopDemandAreas from "./top";

const Tabs = [
  { id: "top", label: "Top Demand Areas" },
  { id: "low", label: "Low Demand Areas" },
];

const PERIOD_OPTIONS = [
  { label: "This month", value: "THIS_MONTH" },
  { label: "Last month", value: "LAST_MONTH" },
  { label: "Last 7 days", value: "LAST_7_DAYS" },
  { label: "Last 30 days", value: "LAST_30_DAYS" },
  { label: "This year", value: "YEAR" },
];

const SERVICE_OPTIONS = [
  { label: "All service", value: "" },
  { label: "Rides", value: "RIDES" },
  { label: "Delivery", value: "DELIVERY" },
  { label: "Cargo", value: "TRUCK" },
  { label: "Towing", value: "TOWING" },
];

// Default center to Nigeria if no points exist
const DEFAULT_CENTER = { lat: 9.082, lng: 8.6753 }; 

const HeatMap = () => {
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("top");
  const exportMutation = useExportHeatMap();

  // Load Google Maps Script (Requires API Key in your .env file)
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "", 
  });

  const handleExportOpen = () => setOpenExportModal(true);
  const handleExportClose = () => setOpenExportModal(false);

  const filters = {
    period: selectedPeriod || undefined,
    state: selectedState === "All States" ? undefined : selectedState,
    service_type: selectedService || undefined,
  };
  
  const { data: heatMapData } = useGetHeatMap(filters);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const points = heatMapData?.data?.points || [];
  
// Calculate the center of the map based on available data
  const mapCenter = useMemo(() => {
    if (points.length > 0) {
      const firstPoint = points[0];
      const lat = Number(firstPoint.latitude);
      const lng = Number(firstPoint.longitude);

      if (!isNaN(lat) && !isNaN(lng)) {
        return { lat, lng };
      }
    }
    return DEFAULT_CENTER;
  }, [points]);

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync({
      format,
      params: filters,
    });
  };

  return (
    <div className="mt-24 mb-15 flex flex-col gap-6">
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-5">
          <h1 className="font-figtree text-2xl font-bold text-grey-800">
            Heat Map & Areas
          </h1>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="rounded-lg border border-grey-400 bg-grey-0 px-4 py-2 text-sm font-medium text-grey-800"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-grey-400 bg-grey-0 px-3 py-2 text-sm">
            <CalendarIcon size={20} className="text-grey-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="cursor-pointer border-none bg-transparent text-grey-800 focus:outline-none"
            >
              <option value="">All time</option>
              {PERIOD_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
        </div>
      </div>

      {/* Map Section */}
      <div className="flex h-fit flex-col gap-5 rounded-3xl border border-grey-200 p-6">
        <div className="flex justify-between">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-grey-800">Heat Map</h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl border border-grey-400 bg-grey-0 px-3 py-2 text-sm">
            <CalendarIcon size={20} className="text-grey-600" />
            <select
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="cursor-pointer border-none bg-transparent text-grey-800 focus:outline-none"
            >
              {SERVICE_OPTIONS.map((option) => (
                <option key={option.value || "all"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Interactive Google Map rendering markers */}
        <div className="h-[30rem] w-full rounded-lg overflow-hidden border-0 bg-grey-100">
          {!isLoaded ? (
            <div className="flex h-full items-center justify-center text-grey-500">
              Loading map...
            </div>
          ) : (
            <GoogleMap
              mapContainerStyle={{ width: "100%", height: "100%" }}
              center={mapCenter}
              zoom={points.length > 0 ? 11 : 6}
              options={{ disableDefaultUI: true, zoomControl: true }}
            >
              {points.map((point: HeatMapPoint) => {
                const lat = Number(point.latitude);
                const lng = Number(point.longitude);

                if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) {
                  return null;
                }

                return (
                  <MarkerF
                    key={point.id}
                    position={{ lat, lng }}
                    label={{
                      text: String(point.count || ""),
                      color: "white",
                      fontWeight: "bold",
                    }}
                  />
                );
              })}
            </GoogleMap>
          )}
        </div>
      </div>

      {/* Tabs & Lists */}
      <TabNavigation
        tabs={Tabs}
        onTabChange={(tabId) => {
          setSelectedTab(tabId);
        }}
      />

      <div>
        {selectedTab === "top" && <TopDemandAreas filters={filters} />}
        {selectedTab === "low" && <LowDemandAreas filters={filters} />}
      </div>

      {openExportModal && (
        <ExportModal
          setShowModal={handleExportClose}
          onExport={handleExport}
          options={[
            { label: "CSV", value: "csv" },
            { label: "XLSX", value: "xlsx" },
          ]}
        />
      )}
    </div>
  );
};

export default HeatMap;
