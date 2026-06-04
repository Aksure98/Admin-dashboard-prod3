import React, { useState } from "react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T extends { id: string | number }> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  selectable?: boolean;
  selectedRows?: Array<string | number>;
  onSelectRow?: (id: string | number, checked: boolean) => void;
  onSelectAll?: (checked: boolean) => void;
  isLoading?: boolean; // ✅ added
}

type SortDirection = "asc" | "desc" | null;

const Table = <T extends { id: string | number }>({
  columns,
  data,
  onRowClick,
  selectable = false,
  selectedRows = [],
  onSelectRow,
  onSelectAll,
  isLoading = false, // ✅ added
}: TableProps<T>) => {
  const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const allSelected =
    selectable && data.length > 0 && selectedRows.length === data.length;
  const someSelected =
    selectable && selectedRows.length > 0 && selectedRows.length < data.length;

  const handleSort = (accessor: keyof T, sortable?: boolean) => {
    if (sortable === false) return;
    if (sortColumn === accessor) {
      if (sortDirection === "asc") {
        setSortDirection("desc");
      } else if (sortDirection === "desc") {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection("asc");
      }
    } else {
      setSortColumn(accessor);
      setSortDirection("asc");
    }
  };

  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) return data;
    return [...data].sort((a, b) => {
      const aValue = a[sortColumn];
      const bValue = b[sortColumn];
      if (aValue === bValue) return 0;
      let comparison = 0;
      if (typeof aValue === "string" && typeof bValue === "string") {
        comparison = aValue.localeCompare(bValue);
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        comparison = aValue - bValue;
      } else {
        comparison = String(aValue).localeCompare(String(bValue));
      }
      return sortDirection === "asc" ? comparison : -comparison;
    });
  }, [data, sortColumn, sortDirection]);

  const getSortIcon = (accessor: keyof T) => {
    if (sortColumn !== accessor) {
      return (
        <div className="flex flex-col">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="9"
            height="17"
            viewBox="0 0 9 17"
            fill="none"
          >
            <path
              d="M8.56754 11.4333C8.62565 11.4913 8.67175 11.5603 8.7032 11.6362C8.73465 11.712 8.75084 11.7934 8.75084 11.8755C8.75084 11.9576 8.73465 12.039 8.7032 12.1148C8.67175 12.1907 8.62565 12.2596 8.56754 12.3177L4.81754 16.0677C4.75949 16.1258 4.69056 16.1719 4.61469 16.2033C4.53881 16.2348 4.45748 16.251 4.37535 16.251C4.29321 16.251 4.21188 16.2348 4.13601 16.2033C4.06014 16.1719 3.99121 16.1258 3.93316 16.0677L0.18316 12.3177C0.0658843 12.2004 -1.2357e-09 12.0413 0 11.8755C1.2357e-09 11.7096 0.0658843 11.5506 0.18316 11.4333C0.300435 11.316 0.459495 11.2501 0.625347 11.2501C0.7912 11.2501 0.95026 11.316 1.06754 11.4333L4.37535 14.7419L7.68316 11.4333C7.74121 11.3752 7.81014 11.3291 7.88601 11.2976C7.96188 11.2662 8.04321 11.25 8.12535 11.25C8.20748 11.25 8.28881 11.2662 8.36469 11.2976C8.44056 11.3291 8.50949 11.3752 8.56754 11.4333ZM1.06754 4.81768L4.37535 1.50909L7.68316 4.81768C7.80044 4.93496 7.9595 5.00084 8.12535 5.00084C8.2912 5.00084 8.45026 4.93496 8.56754 4.81768C8.68481 4.7004 8.7507 4.54134 8.7507 4.37549C8.7507 4.20964 8.68481 4.05058 8.56754 3.9333L4.81754 0.183304C4.75949 0.125194 4.69056 0.0790944 4.61469 0.0476417C4.53881 0.016189 4.45748 0 4.37535 0C4.29321 0 4.21188 0.016189 4.13601 0.0476417C4.06014 0.0790944 3.99121 0.125194 3.93316 0.183304L0.18316 3.9333C0.0658843 4.05058 -3.26935e-09 4.20964 0 4.37549C3.26935e-09 4.54134 0.0658849 4.7004 0.18316 4.81768C0.300436 4.93495 0.459495 5.00084 0.625347 5.00084C0.7912 5.00084 0.95026 4.93496 1.06754 4.81768Z"
              fill="#475467"
            />
          </svg>
        </div>
      );
    }
    if (sortDirection === "asc") {
      return (
        <svg
          className="w-3 h-3 ml-1 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 15l7-7 7 7"
          />
        </svg>
      );
    }
    return (
      <svg
        className="w-3 h-3 ml-1 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 9l-7 7-7-7"
        />
      </svg>
    );
  };

  // ✅ Skeleton rows
  const renderSkeletonRows = () =>
    Array.from({ length: 8 }).map((_, i) => (
      <tr key={i} className="animate-pulse">
        {selectable && (
          <td className="px-6 py-4">
            <div className="h-4 w-4 bg-grey-200 rounded" />
          </td>
        )}
        {columns.map((_, colIdx) => (
          <td key={colIdx} className="px-6 py-4">
            {colIdx === 0 ? (
              // ✅ First column mimics avatar + text (User Details style)
              <div className="flex gap-2 items-center">
                <div className="h-9 w-9 bg-grey-200 rounded-full" />
                <div className="flex flex-col gap-1">
                  <div className="h-3 bg-grey-200 rounded w-24" />
                  <div className="h-3 bg-grey-200 rounded w-32" />
                </div>
              </div>
            ) : (
              <div className="h-3 bg-grey-200 rounded w-20" />
            )}
          </td>
        ))}
      </tr>
    ));

  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg">
      <table className="min-w-full divide-y divide-grey-300">
        <thead className="bg-grey-50">
          <tr>
            {selectable && (
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={(input) => {
                    if (input) input.indeterminate = someSelected;
                  }}
                  onChange={(e) => onSelectAll?.(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                />
              </th>
            )}
            {columns.map((column, idx) => (
              <th
                key={idx}
                onClick={() => handleSort(column.accessor, column.sortable)}
                className={`whitespace-nowrap px-6 py-4 text-left text-sm font-bold text-grey-600 capitalize tracking-wider ${
                  column.sortable !== false
                    ? "cursor-pointer hover:bg-gray-100 select-none"
                    : ""
                }`}
              >
                <div className="flex gap-2 items-center">
                  {column.header}
                  {column.sortable !== false && getSortIcon(column.accessor)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-grey-300">
          {/* ✅ Show skeletons while loading, otherwise render data */}
          {isLoading ? (
            renderSkeletonRows()
          ) : sortedData.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length + (selectable ? 1 : 0)}
                className="px-6 py-16 text-center"
              >
                <div className="flex flex-col items-center gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-12 w-12 text-grey-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 17v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v8m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  <p className="text-grey-500 text-sm font-semibold">
                    No data yet
                  </p>
                  <p className="text-grey-400 text-xs">
                    There are no records to display at this time.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            sortedData.map((row, rowIdx) => {
              const isSelected = selectable && selectedRows.includes(row.id);
              return (
                <tr
                  key={rowIdx}
                  onClick={() => onRowClick?.(row)}
                  className={`${onRowClick ? "cursor-pointer" : ""} ${
                    isSelected ? "bg-blue-50" : "hover:bg-gray-50"
                  }`}
                >
                  {selectable && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          e.stopPropagation();
                          onSelectRow?.(row.id, e.target.checked);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="h-4 w-4 rounded border-gray-300 text-brand-600 focus:ring-brand-500"
                      />
                    </td>
                  )}
                  {columns.map((column, colIdx) => (
                    <td
                      key={colIdx}
                      className="px-6 py-4 whitespace-nowrap text-sm text-grey-600 font-bold"
                    >
                      {column.render
                        ? column.render(row)
                        : String(row[column.accessor])}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
