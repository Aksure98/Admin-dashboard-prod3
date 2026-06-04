"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import TabNavigation from "@/components/tabNavigation";
import { useGetTowLocationList } from "@/hooks/tow/getTowLocation";
import Busy from "./busy";

const Tabs = [
  { id: "BUSY", label: "On ride" },
  { id: "ONLINE", label: "Online" },
  { id: "OFFLINE", label: "Offline" },
];

interface SelectedLocation {
  lat: number;
  lng: number;
}

const TowLocation = () => {
  const [selectedStatus, setSelectedStatus] = useState("BUSY");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] =
    useState<SelectedLocation | null>(null);

  const { data: towLocation, isLoading } = useGetTowLocationList(selectedStatus);
  const towList = towLocation?.data?.operators ?? [];

  const filteredDrivers = towList.filter((driver) => {
    const fullName = `${driver.first_name} ${driver.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  const mapSrc = selectedLocation
    ? `https://www.google.com/maps?q=${selectedLocation.lat},${selectedLocation.lng}&z=15&output=embed`
    : null;

  return (
    <div className="grid grid-cols-12 gap-5 mt-24 h-[calc(100vh-120px)]">
      <div className="col-span-5 border-r border-grey-200 pr-5 flex flex-col gap-5 min-w-0">
        <div className="flex flex-col gap-4">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Tow Operators Location
          </h1>

          <div className="flex items-center gap-2">
            <Input
              inputType="iconLeading"
              icon={<MagnifyingGlassIcon size={20} color="#667085" />}
              name="search"
              placeholder="Search"
              size="md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button hierarchy="secondary" size="xl" className="cursor-default">
              Search
            </Button>
          </div>

          <TabNavigation
            tabs={Tabs}
            onTabChange={(tabId) => {
              setSelectedStatus(tabId);
              setSelectedLocation(null);
            }}
          />
        </div>

        <div className="flex-1 overflow-y-auto scrollbar-hide">
          <Busy
            drivers={filteredDrivers}
            isLoading={isLoading}
            onViewLocation={(lat, lng) => setSelectedLocation({ lat, lng })}
          />
        </div>
      </div>

      <div className="col-span-7 min-w-0">
        <div className="w-full h-full rounded-lg overflow-hidden border border-grey-200 bg-grey-0 flex items-center justify-center">
          {mapSrc ? (
            <iframe
              title="Tow Operators Map"
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={mapSrc}
            />
          ) : (
            <p className="text-grey-400 text-sm">
              Click &quot;View Location&quot; to see a tow operator on the map
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TowLocation;
