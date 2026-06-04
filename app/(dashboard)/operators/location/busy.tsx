import { useState } from "react";
import { CaretDownIcon, CaretUpIcon } from "@phosphor-icons/react";
import { OperatorsDetails } from "@/@types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Button from "@/components/button";

interface BusyProps {
  drivers: OperatorsDetails[];
  isLoading?: boolean;
  onViewLocation: (lat: number, lng: number) => void;
}

const SkeletonRow = () => (
  <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-grey-100">
    <div className="flex items-center gap-3">
      <div className="animate-pulse bg-grey-100 rounded-full size-10" />
      <div className="flex flex-col gap-2">
        <div className="animate-pulse bg-grey-100 rounded h-4 w-32" />
        <div className="animate-pulse bg-grey-100 rounded h-3 w-16" />
      </div>
    </div>
    <div className="animate-pulse bg-grey-100 rounded-lg h-8 w-24" />
  </div>
);

const Busy = ({ drivers, isLoading, onViewLocation }: BusyProps) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const toggleExpand = (userId: string) => {
    setExpandedId((prev) => (prev === userId ? null : userId));
  };

  if (isLoading) {
    return (
      <div>
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonRow key={i} />
        ))}
      </div>
    );
  }

  if (drivers.length === 0) {
    return (
      <p className="text-grey-400 text-sm text-center py-10">
        No drivers found
      </p>
    );
  }

  return (
    <div>
      {drivers.map((driver) => {
        const isExpanded = expandedId === driver?.user_id;

        return (
          <div key={driver?.user_id}>
            <div className="flex items-center justify-between gap-3 px-4 py-4 border-b border-grey-100">
              <div className="flex items-center gap-3 min-w-0">
                <Avatar className="size-10">
                  <AvatarImage src={""} alt={driver?.first_name || ""} />
                  <AvatarFallback>
                    {driver?.first_name ? driver?.first_name.charAt(0) : "?"}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="text-grey-700 text-sm font-bold truncate">
                    {driver?.first_name} {driver?.last_name}
                  </p>
                  <div className="flex items-center gap-1">
                    <svg
                      className="w-4 h-4 text-warning-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span className="text-grey-600 text-sm font-normal">
                      {driver?.ratings ?? 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  hierarchy="secondary"
                  size="sm"
                  className="cursor-pointer"
                  onClick={() => {
                    const lat = driver?.lat;
                    const lng = driver?.lng;
                    if (lat != null && lng != null && lat !== 0 && lng !== 0) {
                      onViewLocation(lat, lng);
                    }
                  }}
                >
                  View Location
                </Button>

                {/* <button
                  type="button"
                  className="p-1 rounded-md hover:bg-grey-50 transition-colors"
                  aria-expanded={isExpanded}
                  onClick={() => toggleExpand(driver?.user_id)}
                >
                  {isExpanded ? (
                    <CaretUpIcon size={18} color="#98A2B3" />
                  ) : (
                    <CaretDownIcon size={18} color="#98A2B3" />
                  )}
                </button> */}
              </div>
            </div>

            {/* Expanded content */}
            {isExpanded && (
              <div
                id={`operator-location-details-${driver?.user_id}`}
                className="px-4 py-3 bg-grey-50 border-b border-grey-100"
              >
                <div className="flex items-center justify-between">
                  <p className="text-grey-600 text-xs font-bold">
                    Riders Details
                  </p>
                  <p className="text-grey-600 text-xs font-normal">
                    Courtney Henry
                  </p>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">Service</p>
                    <p className="text-grey-600 text-xs font-normal">Ride</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">
                      Service Category
                    </p>
                    <p className="text-grey-600 text-xs font-normal">Premium</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">
                      Payment Status
                    </p>
                    <span className="px-3 py-1 rounded-full bg-warning-500 text-white text-[11px] font-bold">
                      Pending
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">
                      Payment Method
                    </p>
                    <p className="text-grey-600 text-xs font-normal">Cash</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">Distance</p>
                    <p className="text-grey-600 text-xs font-normal">7.2 km</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-grey-600 text-xs font-bold">
                      Date / Time
                    </p>
                    <p className="text-grey-600 text-xs font-normal">
                      15 May 2020 8:30 am
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <Button
                    hierarchy="secondary"
                    size="xl"
                    href={`/driver/${driver.user_id}`}
                  >
                    View More
                  </Button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Busy;
