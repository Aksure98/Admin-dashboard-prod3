"use client";

import { RevenueMonthData } from "@/@types";
import { useRevenueOverview } from "@/hooks/dashboard/revenueOverview";
import { useState } from "react";

interface BarChartProps {
  selectedOperation: string;
}

const currentYear = new Date().getFullYear();
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2];

const formatYAxisLabel = (value: number): string => {
  if (value >= 1_000_000_000) return `${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return Math.round(value).toString();
};

const BarChart = ({ selectedOperation }: BarChartProps) => {
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const SERVICE_TYPE_MAP: Record<string, string | undefined> = {
    all: undefined,
    ride: "RIDES",
    delivery: "DELIVERY",
    tow: "TOWING",
    cargo: "TRUCK",
  };

  const { data: revenueOverview, isLoading } = useRevenueOverview({
    year: selectedYear,
    service_type: SERVICE_TYPE_MAP[selectedOperation],
  });

  const apiData: RevenueMonthData[] = revenueOverview?.data ?? [];

  const data = apiData.map((item) => ({
    month: item.month_name,
    values: [item.rides, item.cargo, item.delivery, item.towing],
  }));

  const operationIndexMap: Record<string, number> = {
    ride: 0,
    cargo: 1,
    delivery: 2,
    tow: 3,
  };

  const filteredData = data.map((item: { month: string; values: number[] }) => {
    if (selectedOperation === "all") return item;
    const index = operationIndexMap[selectedOperation];
    return { month: item.month, values: [item.values[index]] };
  });

  const allValues = filteredData.flatMap((item) => item.values);
  const maxValue = allValues.length > 0 ? Math.max(...allValues, 1) : 1000;

  const chartHeight = 400;
  const colors = ["#0077B6", "#55A4CE", "#AAD2E7", "#D9F2FF"];
  const barWidth = selectedOperation === "all" ? "12px" : "32px";

  const yTicks = [
    maxValue,
    maxValue * 0.8,
    maxValue * 0.6,
    maxValue * 0.4,
    maxValue * 0.2,
    0,
  ];

  // Auto-calculate Y-axis width based on longest label
  const longestLabel = yTicks
    .map((v) => formatYAxisLabel(v))
    .reduce((a, b) => (a.length > b.length ? a : b), "");
  const yAxisWidth = Math.max(40, longestLabel.length * 8);

  return (
    <div className="w-full flex flex-col gap-3">
      <div className="flex justify-end">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
        >
          {YEAR_OPTIONS.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <div
          className="flex items-center justify-center text-grey-400 text-sm"
          style={{ height: `${chartHeight}px` }}
        >
          Loading...
        </div>
      ) : (
        <div className="flex gap-2" style={{ height: `${chartHeight + 60}px` }}>
          {/* Y-axis labels — auto width */}
          <div
            className="flex-shrink-0 flex flex-col justify-between text-xs text-grey-600 text-right pb-12"
            style={{ width: `${yAxisWidth}px` }}
          >
            {yTicks.map((val, i) => (
              <span key={i}>{formatYAxisLabel(val)}</span>
            ))}
          </div>

          {/* Chart area */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="relative flex-1">
              {/* Grid lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                {yTicks.map((_, i) => (
                  <div key={i} className="border-t border-gray-200 w-full" />
                ))}
              </div>

              {/* Bars */}
              <div className="absolute inset-0 flex items-end justify-around">
                {filteredData.map((item) => (
                  <div
                    key={item.month}
                    className="flex-1 flex items-end justify-center gap-0.5"
                  >
                    {item.values.map((value, barIndex) => {
                      const height = (value / maxValue) * chartHeight;
                      const colorIndex =
                        selectedOperation === "all"
                          ? barIndex
                          : operationIndexMap[selectedOperation];

                      return (
                        <div
                          key={barIndex}
                          className="rounded-t transition-all duration-300 hover:opacity-80"
                          style={{
                            height: `${height}px`,
                            width: barWidth,
                            minWidth: "8px",
                            backgroundColor: colors[colorIndex],
                          }}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>

            {/* X-axis labels */}
            <div className="flex justify-around mt-2 text-xs text-gray-600 h-8">
              {filteredData.map((item) => (
                <span key={item.month} className="flex-1 text-center">
                  {item.month}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BarChart;
