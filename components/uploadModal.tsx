"use client";

import { FileArrowUpIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import Button from "./button";

interface UploadModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UploadModal = ({ setShowModal }: UploadModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      validateFile(event.target.files[0]);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files.length) {
      validateFile(event.dataTransfer.files[0]);
    }
  };

  const validateFile = (selectedFile: File) => {
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Invalid file type. Please upload a CSV or Excel file.");
      setFile(null);
      return;
    }

    if (selectedFile.size > maxSize) {
      setError("File size exceeds 2MB limit.");
      setFile(null);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  return (
    <div className="fixed inset-0 bg-grey-900/70 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-10 w-[36.5rem] flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-grey-900 text-3xl font-bold">Import File</h1>
          </div>
          <div
            className="text-grey-800 rounded-lg cursor-pointer"
            onClick={() => setShowModal(false)}
          >
            <XIcon size={20} />
          </div>
        </div>

        <div
          className="bg-grey-0 p-6 flex justify-center items-center border-dashed border-2 border-grey-300 rounded-4xl cursor-pointer"
          onDragOver={(event) => event.preventDefault()}
          onDrop={handleDrop}
        >
          <div
            className="flex justify-center items-center flex-col gap-5"
            onChange={handleFileUpload}
          >
            <input
              type="file"
              accept=".csv,.xls,.xlsx"
              className="hidden"
              id="fileInput"
              onChange={handleFileUpload}
            />
            <label
              htmlFor="fileInput"
              className="cursor-pointer bg-brand-50 p-5 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M20.2959 7.455L15.0459 2.205C14.9415 2.10039 14.8174 2.0174 14.6808 1.96078C14.5442 1.90416 14.3978 1.87501 14.25 1.875H5.25C4.75272 1.875 4.27581 2.07254 3.92417 2.42417C3.57254 2.77581 3.375 3.25272 3.375 3.75V20.25C3.375 20.7473 3.57254 21.2242 3.92417 21.5758C4.27581 21.9275 4.75272 22.125 5.25 22.125H18.75C19.2473 22.125 19.7242 21.9275 20.0758 21.5758C20.4275 21.2242 20.625 20.7473 20.625 20.25V8.25C20.625 7.95187 20.5066 7.66593 20.2959 7.455ZM17.1562 7.5H15V5.34375L17.1562 7.5ZM5.625 19.875V4.125H12.75V8.625C12.75 8.92337 12.8685 9.20952 13.0795 9.4205C13.2905 9.63147 13.5766 9.75 13.875 9.75H18.375V19.875H5.625ZM15.0459 13.0791C15.2573 13.2904 15.376 13.5771 15.376 13.8759C15.376 14.1748 15.2573 14.4615 15.0459 14.6728C14.8346 14.8842 14.5479 15.0029 14.2491 15.0029C13.9502 15.0029 13.6635 14.8842 13.4522 14.6728L13.125 14.3438V17.25C13.125 17.5484 13.0065 17.8345 12.7955 18.0455C12.5845 18.2565 12.2984 18.375 12 18.375C11.7016 18.375 11.4155 18.2565 11.2045 18.0455C10.9935 17.8345 10.875 17.5484 10.875 17.25V14.3438L10.5459 14.6737C10.3346 14.8851 10.0479 15.0038 9.74906 15.0038C9.45018 15.0038 9.16353 14.8851 8.95219 14.6737C8.74084 14.4624 8.62211 14.1758 8.62211 13.8769C8.62211 13.578 8.74084 13.2913 8.95219 13.08L11.2022 10.83C11.3067 10.7251 11.4309 10.6419 11.5676 10.5851C11.7044 10.5283 11.851 10.4991 11.9991 10.4991C12.1471 10.4991 12.2937 10.5283 12.4305 10.5851C12.5672 10.6419 12.6914 10.7251 12.7959 10.83L15.0459 13.0791Z"
                  fill="#0077B6"
                />
              </svg>
            </label>
            <div>
              <p className="text-grey-600 text-center font-normal">
                <span
                  className="font-bold text-brand-600 "
                  onClick={() => document.getElementById("fileInput")?.click()}
                >
                  Click here
                </span>{" "}
                to upload your file or drag.
              </p>
              <p className="text-grey-400 text-sm">
                Supported Format: CSV, XLSX (10mb each)
              </p>
            </div>

            {file && (
              <p className="text-green-600 text-sm">
                {file.name} uploaded successfully!
              </p>
            )}
            {error && <p className="text-red-600 text-sm">{error}</p>}
          </div>
        </div>

        <p className="text-grey-800 text-base font-normal">
          Please download the example CSV file from{" "}
          <span className="underline text-brand-600 cursor-pointer">here</span>{" "}
          and please make sure you{" "}
          <span className="underline text-brand-600 cursor-pointer">
            read the instructions{" "}
          </span>
           carefully before starting the import.
        </p>

        <Button
          leftIcon={<FileArrowUpIcon size={20} />}
          className="cursor-pointer"
        >
          Import Data
        </Button>
      </div>
    </div>
  );
};

export default UploadModal;
