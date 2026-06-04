"use client";

import { Demands, HeatMapAreasParams } from "@/@types";
import Table from "@/components/table";
import { useGetHeatMapAreas } from "@/hooks/heat-map/getHeatMapAreas";

interface TopDemandAreasProps {
  filters: Omit<HeatMapAreasParams, "tab">;
}

const getStatusStyles = (status: string) => {
  switch (status?.toLowerCase()) {
    case "high":
      return "bg-success-100 text-success-600";
    case "medium":
      return "bg-warning-50 text-warning-600";
    case "low":
    default:
      return "bg-error-100 text-error-600";
  }
};

const TopDemandAreas = ({ filters }: TopDemandAreasProps) => {
  const { data, isLoading } = useGetHeatMapAreas({
    ...filters,
    tab: "top",
  });

  const columns = [
    {
      header: "Zone & Area",
      accessor: "zone" as keyof Demands,
    },
    {
      header: "City",
      sortable: false,
      accessor: "city" as keyof Demands,
    },
    {
      header: "Trend",
      accessor: "trend" as keyof Demands,
      sortable: false,
      render: (row: Demands) => <span>{row.trend}%</span>,
    },
    {
      header: "Requests",
      sortable: false,
      accessor: "requests" as keyof Demands,
    },
    {
      header: "Status",
      accessor: "status" as keyof Demands,
      sortable: false,
      render: (row: Demands) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold capitalize leading-5 ${getStatusStyles(
            row.status,
          )}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        data={data?.data || []}
        isLoading={isLoading}
      />
    </div>
  );
};

export default TopDemandAreas;
