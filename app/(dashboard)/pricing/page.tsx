"use client";

// import Button from "@/components/button";
// import ExportModal from "@/components/exportModal";
import { useState } from "react";
import {
  CaretDownIcon,
  CaretRightIcon,
  PencilIcon,
} from "@phosphor-icons/react";

import { formatDate, formatPrice } from "@/utils/utils";
import {
  BaseFareItem,
  BookingFeeItem,
  CommissionItem,
  DistancePricingItem,
  ExtraChargeItem,
  MinimumFareItem,
  PricingTierItems,
  SurgePricingItem,
  SurgePricingItems,
  TimePricingItem,
  TimePricingZone,
  TrafficMultiplierItem,
} from "@/@types";
import Table from "@/components/table";

import { useGetPricingSummary } from "@/hooks/pricing/getPricingSummary";
import { useGetPricingTiers } from "@/hooks/pricing/getPricingTiers";
import EditBaseFare from "./editBaseFare";
import EditDistance from "./editDistance";
import EditTime from "./editTime";
import EditTraffic from "./updateTraffic";
import { useToggleTrafficLevel } from "@/hooks/pricing/toggleTrafficLevel";
import { useToggleSurge } from "@/hooks/pricing/toggleSurge";
import EditSurge from "./updateSurge";
import EditExtraCharge from "./updateExtraCharge";
import EditBookingFees from "./updateBookingfees";
import EditMiniFare from "./updateMiniFare";
import EditDriverCommission from "./updateDriverCommission";

const SERVICE_OPTIONS = ["AllServices", "RIDES", "DELIVERY", "TRUCK", "TOWING"];

const Pricing = () => {
  // const [openExportModal, setOpenExportModal] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [distanceOpen, setDistanceOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [zoneOpen, setZoneOpen] = useState(false);
  const [trafficOpen, setTrafficOpen] = useState(false);
  const [surgeOpen, setSurgeOpen] = useState(false);
  const [extraOpen, setExtraOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [baseFareService, setBaseFareService] = useState("");
  const [distanceService, setDistanceService] = useState("");
  const [timeService, setTimeService] = useState("");
  const [zoneService, setZoneService] = useState("");
  const [trafficService, setTrafficService] = useState("");
  const [surgeService, setSurgeService] = useState("");
  const [extraService, setExtraService] = useState("");
  const [bookingService, setBookingService] = useState("");
  const [fareService, setFareService] = useState("");
  const [commissionService, setCommissionService] = useState("");
  const [fareOpen, setFareOpen] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [pricingTiersOpen, setPricingTiersOpen] = useState(false);
  const [editBaseFareOpen, setEditBaseFareOpen] = useState(false);
  const [editDistanceOpen, setEditDistanceOpen] = useState(false);
  const [editTimeOpen, setEditTimeOpen] = useState(false);
  const [editTrafficOpen, setEditTrafficOpen] = useState(false);
  const [editSurgeOpen, setEditSurgeOpen] = useState(false);
  const [editExtraChargeOpen, setEditExtraChargeOpen] = useState(false);
  const [editBookingFeeOpen, setEditBookingFeeOpen] = useState(false);
  const [editMiniFareOpen, setEditMiniFareOpen] = useState(false);
  const [editDriverCommissionOpen, setEditDriverCommissionOpen] =
    useState(false);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingSurgeId, setSurgeTogglingId] = useState<string | null>(null);
  const [selectedBaseFare, setSelectedBaseFare] = useState<BaseFareItem | null>(
    null,
  );
  const [selectedDistance, setSelectedDistance] =
    useState<DistancePricingItem | null>(null);
  const [selectedTime, setSelectedTime] = useState<TimePricingItem | null>(
    null,
  );
  const [selectedTraffic, setSelectedTraffic] =
    useState<TrafficMultiplierItem | null>(null);
  const [selectedSurge, setSelectedSurge] = useState<SurgePricingItem | null>(
    null,
  );
  const [selectedExtraCharge, setSelectedExtraCharge] =
    useState<ExtraChargeItem | null>(null);
  const [selectedBookingFees, setSelectedBookingFees] =
    useState<BookingFeeItem | null>(null);
  const [selectedMiniFare, setSelectedMiniFare] =
    useState<MinimumFareItem | null>(null);
  const [selectedDriverCommission, setSelectedDriverCommission] =
    useState<CommissionItem | null>(null);
  const toggleStatusMutation = useToggleTrafficLevel();
  const toggleSurgeMutation = useToggleSurge();
  // const [selectedService, setSelectedService] = useState("");
  // const [searchInput, setSearchInput] = useState("");
  // const [searchQuery, setSearchQuery] = useState("");

  const { data: pricingSummary, isLoading } = useGetPricingSummary();
  const { data: pricingTiers } = useGetPricingTiers();
  console.log(pricingTiers);

  // const handleExportOpen = () => setOpenExportModal(true);
  // const handleExportClose = () => setOpenExportModal(false);
  // const handleExport = async (_format: string) => {
  //   // await exportMutation.mutateAsync(_format);
  // };

  const handleToggleStatus = (row: TrafficMultiplierItem) => {
    setTogglingId(row?.level);
    toggleStatusMutation.mutate(
      { level: row?.level, value: { is_active: !row.is_active } },
      { onSettled: () => setTogglingId(null) },
    );
  };
  const handleSurgeToggle = (row: SurgePricingItem) => {
    setSurgeTogglingId(row?.id);
    toggleSurgeMutation.mutate(
      { id: row?.id, value: { is_active: !row.is_active } },
      { onSettled: () => setTogglingId(null) },
    );
  };

  const baseFareColumns = [
    { header: "Service Type", accessor: "service" as keyof BaseFareItem },
    {
      header: "Category",
      accessor: "category" as keyof BaseFareItem,
    },
    {
      header: "Amount (#)",
      accessor: "amount" as keyof BaseFareItem,
      render: (row: BaseFareItem) => (
        <div className="flex gap-2 items-center">
          <p>{formatPrice(row?.amount ?? 0)}</p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedBaseFare(row);
              setEditBaseFareOpen(true);
            }}
          >
            <PencilIcon size={16} />
          </div>
        </div>
      ),
    },

    {
      header: "Last updated",
      accessor: "last_updated" as keyof BaseFareItem,
      render: (row: BaseFareItem) => (
        <p>{formatDate(row?.last_updated ?? 0)}</p>
      ),
    },
  ];

  const distanceColumns = [
    {
      header: "Service Type",
      accessor: "service" as keyof DistancePricingItem,
    },
    {
      header: "Category",
      accessor: "category" as keyof DistancePricingItem,
    },
    {
      header: "Amount (#)",
      accessor: "base_fare" as keyof DistancePricingItem,
      render: (row: DistancePricingItem) => (
        <div className="flex gap-2">
          <p>{formatPrice(row?.per_km ?? 0)} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedDistance(row);
              setEditDistanceOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },

    {
      header: "Last updated",
      accessor: "last_updated" as keyof DistancePricingItem,
      render: (row: DistancePricingItem) => (
        <p>{formatDate(row?.last_updated ?? 0)}</p>
      ),
    },
  ];
  const timeColumns = [
    { header: "Service Type", accessor: "service" as keyof TimePricingItem },
    {
      header: "Category",
      accessor: "category" as keyof TimePricingItem,
    },
    {
      header: "Amount (#)",
      accessor: "per_min" as keyof TimePricingItem,
      render: (row: TimePricingItem) => (
        <div className="flex gap-2">
          <p>{formatPrice(row?.per_min ?? 0)} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedTime(row);
              setEditTimeOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },

    {
      header: "Last updated",
      accessor: "last_updated" as keyof TimePricingItem,
      render: (row: TimePricingItem) => <p>{formatDate(row?.per_min ?? 0)}</p>,
    },
  ];

  const zoneMultipleColumn = [
    {
      header: "Region",
      accessor: "region" as keyof TimePricingZone,
    },
    {
      header: "City/Area",
      accessor: "city" as keyof TimePricingZone,
    },
    {
      header: "Zone",
      accessor: "zone" as keyof TimePricingZone,
    },
    {
      header: "Multiplier",
      accessor: "multiplier" as keyof TimePricingZone,
    },
    {
      header: "Last updated",
      accessor: "updated_at" as keyof TimePricingZone,
      render: (row: TimePricingZone) => (
        <p>{formatDate(row?.updated_at ?? 0)}</p>
      ),
    },
  ];

  const trafficColumns = [
    {
      header: "Name",
      accessor: "level" as keyof TrafficMultiplierItem,
    },

    {
      header: "Description",
      accessor: "description" as keyof TrafficMultiplierItem,
    },

    {
      header: "Multiplier",
      accessor: "multiplier" as keyof TrafficMultiplierItem,
      render: (row: TrafficMultiplierItem) => (
        <div className="flex gap-2">
          <p>{row?.multiplier ?? 0} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedTraffic(row);
              setEditTrafficOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },

    // {
    //   header: "Typical Time",
    //   accessor: "typical_time" as keyof TrafficMultiplier,
    // },

    {
      header: "Actions",
      accessor: "id" as keyof TrafficMultiplierItem,
      sortable: false,
      render: (row: TrafficMultiplierItem) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row.is_active === true}
              onChange={() => handleToggleStatus(row)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
        </div>
      ),
    },
    // {
    //   header: "Last Update",
    //   accessor: "updated_at" as keyof TrafficMultiplier,
    // },
  ];

  const surgeColumns = [
    {
      header: "Name",
      accessor: "label" as keyof SurgePricingItem,
    },
    {
      header: "Min Ratio",
      accessor: "min_ratio" as keyof SurgePricingItem,
    },
    {
      header: "Max Ratio",
      accessor: "max_ratio" as keyof SurgePricingItem,
    },
    {
      header: "Region",
      accessor: "region" as keyof SurgePricingItems,
    },
    {
      header: "City/Area",
      accessor: "city_area" as keyof SurgePricingItems,
    },
    {
      header: "Zone",
      accessor: "zone" as keyof SurgePricingItems,
    },

    {
      header: "Service",
      accessor: "service" as keyof SurgePricingItems,
    },
    {
      header: "Multiplier",
      accessor: "multiplier" as keyof SurgePricingItem,
      render: (row: SurgePricingItem) => (
        <div className="flex gap-2">
          <p>{row?.multiplier ?? 0} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedSurge(row);
              setEditSurgeOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof SurgePricingItem,
      sortable: false,
      render: (row: SurgePricingItem) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row.is_active === true}
              onChange={() => handleSurgeToggle(row)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
        </div>
      ),
    },
  ];

  const extraChargeColumns = [
    {
      header: "Charge Name",
      accessor: "name" as keyof ExtraChargeItem,
    },

    {
      header: "Type",
      accessor: "type" as keyof ExtraChargeItem,
    },
    {
      header: "Amount",
      accessor: "unit_price" as keyof ExtraChargeItem,
      render: (row: ExtraChargeItem) => (
        <div className="flex gap-2">
          <p>{formatPrice(row?.unit_price)}</p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedExtraCharge(row);
              setEditExtraChargeOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },
    {
      header: "When Applied",
      accessor: "calculation" as keyof ExtraChargeItem,
    },
    // {
    //   header: "Last Update",
    //   accessor: "updated_at" as keyof ExtraCharge,
    //   render: (row: ExtraCharge) => (
    //     <span>
    //       {row.updated_at ? formatDate(row.updated_at) : "Not updated yet"}
    //     </span>
    //   ),
    // },
  ];

  const bookingColumns = [
    {
      header: "Category",
      accessor: "category" as keyof BookingFeeItem,
    },
    {
      header: "Amount (#)",
      accessor: "amount" as keyof BookingFeeItem,
      render: (row: BookingFeeItem) => (
        <div className="flex gap-2">
          <p>{formatPrice(row?.amount ?? 0)} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedBookingFees(row);
              setEditBookingFeeOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },

    {
      header: "Last updated",
      accessor: "updated_at" as keyof BookingFeeItem,
      render: (row: BookingFeeItem) => (
        <p>{formatDate(row?.last_updated ?? 0)}</p>
      ),
    },
  ];

  const miniFareColumns = [
    { header: "Service Type", accessor: "service" as keyof MinimumFareItem },
    {
      header: "Category",
      accessor: "category" as keyof MinimumFareItem,
    },
    {
      header: "Amount (#)",
      accessor: "amount" as keyof MinimumFareItem,
      render: (row: MinimumFareItem) => (
        <div className="flex gap-2">
          <p>{formatPrice(row?.amount ?? 0)} </p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedMiniFare(row);
              setEditMiniFareOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },

    {
      header: "Last updated",
      accessor: "last_updated" as keyof MinimumFareItem,
      render: (row: MinimumFareItem) => (
        <p>{formatDate(row?.last_updated ?? 0)}</p>
      ),
    },
  ];

  const commissionColumns = [
    {
      header: "Service Type",
      accessor: "service" as keyof CommissionItem,
    },

    {
      header: "Percentage (%)",
      accessor: "percentage" as keyof CommissionItem,
      render: (row: CommissionItem) => (
        <div className="flex gap-2">
          <p>{row?.percentage} %</p>
          <div
            className="cursor-pointer text-brand-600 hover:text-brand-700"
            onClick={() => {
              setSelectedDriverCommission(row);
              setEditDriverCommissionOpen(true);
            }}
          >
            <PencilIcon />
          </div>
        </div>
      ),
    },
    {
      header: "Last updated",
      accessor: "last_updated" as keyof CommissionItem,
      render: (row: CommissionItem) => (
        <p>{formatDate(row?.last_updated ?? 0)}</p>
      ),
    },
  ];

  const fareTierColumns = [
    {
      header: "Name",
      accessor: "name" as keyof PricingTierItems,
    },
    {
      header: "tier_code",
      accessor: "tier_code" as keyof PricingTierItems,
    },
    {
      header: "Base Fare",
      accessor: "base_fare" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{formatPrice(row?.base_fare ?? 0)}</p>
      ),
    },
    {
      header: "Booking Fee",
      accessor: "booking_fare" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{formatPrice(row?.booking_fee ?? 0)}</p>
      ),
    },
    {
      header: "Minimum Fare",
      accessor: "minimum_fare" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{formatPrice(row?.booking_fee ?? 0)}</p>
      ),
    },
    {
      header: "Per km Fare",
      accessor: "per_km_rate" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{formatPrice(row?.per_km_rate ?? 0)}</p>
      ),
    },
    {
      header: "Per minute Fare",
      accessor: "per_minute_rate" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{formatPrice(row?.per_minute_rate ?? 0)}</p>
      ),
    },
    {
      header: "Vehicle Types",
      accessor: "vehicle_types" as keyof PricingTierItems,
      render: (row: PricingTierItems) => (
        <p>{row?.vehicle_types?.join(", ")}</p>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Pricing
          </h1>
        </div>

        {/* <div className="flex gap-3 items-center">
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
        </div> */}
      </div>

      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Base Fare
          </h2>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {isOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {isOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={baseFareService}
                  onChange={(e) => setBaseFareService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={baseFareColumns}
              data={pricingSummary?.data?.base_fare ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Distance Pricing
          </h2>
          <button
            onClick={() => setDistanceOpen(!distanceOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {distanceOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {distanceOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={distanceService}
                  onChange={(e) => setDistanceService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={distanceColumns}
              data={pricingSummary?.data?.distance_pricing ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Time Pricing
          </h2>
          <button
            onClick={() => setTimeOpen(!timeOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {timeOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {timeOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={timeService}
                  onChange={(e) => setTimeService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={timeColumns}
              data={pricingSummary?.data?.time_pricing ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Zone Multiplier
          </h2>
          <button
            onClick={() => setZoneOpen(!zoneOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {zoneOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {zoneOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={zoneService}
                  onChange={(e) => setZoneService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={zoneMultipleColumn}
              //@ts-expect-error will work on it
              data={pricingSummary?.data?.zone_multipliers ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Traffic Multiplier
          </h2>
          <button
            onClick={() => setTrafficOpen(!trafficOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {trafficOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {trafficOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={trafficService}
                  onChange={(e) => setTrafficService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              //@ts-expect-error will work on it
              columns={trafficColumns}
              //@ts-expect-error will work on it
              data={pricingSummary?.data?.traffic_multipliers ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Surge Pricing
          </h2>
          <button
            onClick={() => setSurgeOpen(!surgeOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {surgeOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {surgeOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={surgeService}
                  onChange={(e) => setSurgeService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              //@ts-expect-error will work on it
              columns={surgeColumns}
              data={pricingSummary?.data?.surge_pricing ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Extra charges
          </h2>
          <button
            onClick={() => setExtraOpen(!extraOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {extraOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {extraOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={extraService}
                  onChange={(e) => setExtraService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={extraChargeColumns}
              data={pricingSummary?.data?.extra_charges ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Booking fees
          </h2>
          <button
            onClick={() => setBookingOpen(!bookingOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {bookingOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {bookingOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={bookingService}
                  onChange={(e) => setBookingService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>
            <Table
              columns={bookingColumns}
              data={pricingSummary?.data?.booking_fee ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Minimum Fare
          </h2>
          <button
            onClick={() => setFareOpen(!fareOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {fareOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {fareOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={fareService}
                  onChange={(e) => setFareService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={miniFareColumns}
              data={pricingSummary?.data?.minimum_fare ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Driver&lsquo;s commission
          </h2>
          <button
            onClick={() => setCommissionOpen(!commissionOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {commissionOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {commissionOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              <div className="relative">
                <select
                  value={commissionService}
                  onChange={(e) => setCommissionService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div>

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={commissionColumns}
              data={pricingSummary?.data?.commission ?? []}
              isLoading={isLoading}
            />
          </>
        )}
      </div>
      <div className="border border-grey-200 rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5">
          <h2 className="text-grey-800 text-xl font-bold font-figtree">
            Pricing Tiers
          </h2>
          <button
            onClick={() => setPricingTiersOpen(!pricingTiersOpen)}
            className="bg-brand-600 text-white rounded-xl w-10 h-10 flex items-center justify-center hover:bg-brand-700 transition-colors"
          >
            {pricingTiersOpen ? (
              <CaretDownIcon size={18} />
            ) : (
              <CaretRightIcon size={18} />
            )}
          </button>
        </div>

        {pricingTiersOpen && (
          <>
            {/* Filters */}
            <div className="flex items-center justify-between px-6 pb-4">
              {/* <div className="relative">
                <select
                  value={commissionService}
                  onChange={(e) => setCommissionService(e.target.value)}
                  className="border border-grey-300 bg-grey-0 rounded-lg text-grey-800 pl-3 pr-8 py-2 text-sm font-medium appearance-none cursor-pointer"
                >
                  {SERVICE_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <CaretDownIcon
                  size={14}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-grey-500 pointer-events-none"
                />
              </div> */}

              {/* <div className="flex items-center gap-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={16} color="#667085" />}
                  name="search"
                  placeholder="Search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && setSearchQuery(searchInput)
                  }
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={() => setSearchQuery(searchInput)}
                >
                  Search
                </Button>
              </div> */}
            </div>

            <Table
              columns={fareTierColumns}
              //@ts-expect-error will work on it
              data={pricingTiers?.data ?? []}
            />
          </>
        )}
      </div>

      {/* {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )} */}

      {editBaseFareOpen && selectedBaseFare && (
        <EditBaseFare
          isOpen={editBaseFareOpen}
          onClose={() => {
            setEditBaseFareOpen(false);
            setSelectedBaseFare(null);
          }}
          baseFareId={selectedBaseFare.id}
          currentAmount={selectedBaseFare.amount}
        />
      )}
      {distanceOpen && selectedDistance && (
        <EditDistance
          isOpen={editDistanceOpen}
          onClose={() => {
            setEditDistanceOpen(false);
            setSelectedDistance(null);
          }}
          distanceId={selectedDistance.id}
          currentAmount={selectedDistance?.per_km}
        />
      )}
      {editTimeOpen && selectedTime && (
        <EditTime
          isOpen={editTimeOpen}
          onClose={() => {
            setEditTimeOpen(false);
            setSelectedTime(null);
          }}
          distanceId={selectedTime.id}
          currentAmount={selectedTime?.per_min}
        />
      )}
      {editTrafficOpen && selectedTraffic && (
        <EditTraffic
          isOpen={trafficOpen}
          onClose={() => {
            setEditTrafficOpen(false);
            setSelectedTraffic(null);
          }}
          distanceId={selectedTraffic?.level}
          currentAmount={selectedTraffic?.multiplier}
        />
      )}
      {editSurgeOpen && selectedSurge && (
        <EditSurge
          isOpen={surgeOpen}
          onClose={() => {
            setEditSurgeOpen(false);
            setSelectedSurge(null);
          }}
          distanceId={selectedSurge?.id}
          currentAmount={selectedSurge?.multiplier}
        />
      )}
      {editExtraChargeOpen && selectedExtraCharge && (
        <EditExtraCharge
          isOpen={extraOpen}
          onClose={() => {
            setEditExtraChargeOpen(false);
            setSelectedExtraCharge(null);
          }}
          distanceId={selectedExtraCharge?.id}
          currentAmount={selectedExtraCharge?.unit_price}
        />
      )}
      {editBookingFeeOpen && selectedBookingFees && (
        <EditBookingFees
          isOpen={bookingOpen}
          onClose={() => {
            setEditBookingFeeOpen(false);
            setSelectedBookingFees(null);
          }}
          distanceId={selectedBookingFees?.id}
          currentAmount={selectedBookingFees?.amount}
        />
      )}
      {editMiniFareOpen && selectedMiniFare && (
        <EditMiniFare
          isOpen={fareOpen}
          onClose={() => {
            setEditMiniFareOpen(false);
            setSelectedMiniFare(null);
          }}
          distanceId={selectedMiniFare?.id}
          currentAmount={selectedMiniFare?.amount}
        />
      )}
      {editDriverCommissionOpen && selectedDriverCommission && (
        <EditDriverCommission
          isOpen={commissionOpen}
          onClose={() => {
            setEditDriverCommissionOpen(false);
            setSelectedDriverCommission(null);
          }}
          distanceId={selectedDriverCommission?.id}
          currentAmount={selectedDriverCommission?.percentage}
        />
      )}
    </div>
  );
};

export default Pricing;
