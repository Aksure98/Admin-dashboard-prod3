"use client";

import { FileArrowDownIcon, FileIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Button from "./button";
import { Select } from "./inputs";

interface ExportModalProps {
  setShowModal:
    | React.Dispatch<React.SetStateAction<boolean>>
    | ((value: boolean) => void);
  onExport: (format: string) => Promise<void>;
  options?: { label: string; value: string }[];
}

const FileOptions = [
  { label: "CSV", value: "csv" },
  { label: "XLSX", value: "xlsx" },
  { label: "PDF", value: "pdf" }, // ✅ added
];

const ExportModal = ({
  setShowModal,
  onExport,
  options = FileOptions,
}: ExportModalProps) => {
  const [format, setFormat] = useState("csv");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setLoading(true);
    setError(null);
    try {
      await onExport(format);
      setShowModal(false);
    } catch {
      setError("Export failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-grey-900/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-[36.5rem] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-grey-900 text-3xl font-bold">Export Data</h1>
          </div>
          <div
            className="text-grey-800 rounded-lg cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <XIcon size={20} />
          </div>
        </div>

        <div className="flex justify-center items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="120"
            height="120"
            viewBox="0 0 120 120"
            fill="none"
          >
            <path
              d="M100.153 38.5969L73.9031 12.3469C73.5546 11.9987 73.1409 11.7227 72.6857 11.5345C72.2305 11.3463 71.7426 11.2496 71.25 11.25H26.25C24.2609 11.25 22.3532 12.0402 20.9467 13.4467C19.5402 14.8532 18.75 16.7609 18.75 18.75V101.25C18.75 103.239 19.5402 105.147 20.9467 106.553C22.3532 107.96 24.2609 108.75 26.25 108.75H93.75C95.7391 108.75 97.6468 107.96 99.0533 106.553C100.46 105.147 101.25 103.239 101.25 101.25V41.25C101.25 40.7574 101.154 40.2695 100.966 39.8143C100.777 39.3591 100.501 38.9454 100.153 38.5969ZM75 24.0516L88.4484 37.5H75V24.0516ZM93.75 101.25H26.25V18.75H67.5V41.25C67.5 42.2446 67.8951 43.1984 68.5983 43.9016C69.3016 44.6049 70.2554 45 71.25 45H93.75V101.25Z"
              fill="#1D2939"
            />
          </svg>
        </div>

        <Select
          label="Export Format"
          name="file"
          icon={<FileIcon size={20} color="#667085" />}
          placeholder="File Format"
          options={options}
          size="sm"
          value={format}
          onChange={(e) => setFormat(e.target.value)}
          className="placeholder:text-black"
        />

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <Button
          leftIcon={<FileArrowDownIcon size={20} />}
          className="cursor-pointer"
          onClick={handleExport}
          disabled={loading}
          isLoading={loading}
        >
          Export Data
        </Button>
      </div>
    </div>
  );
};

export default ExportModal;
