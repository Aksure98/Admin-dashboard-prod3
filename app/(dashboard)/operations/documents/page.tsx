"use client";

import { useState } from "react";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import ViewOperatorDocument from "./view-document";
import { useTowDocument } from "@/hooks/tow/getTowDocument";
import { DocumentItem } from "@/@types";
import { useRejectTowDocument } from "@/hooks/tow/rejectTowDoc";
import { useApproveTowDocument } from "@/hooks/tow/approveTowDoc";

export default function TowDocumentsPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentItem | null>(
    null,
  );
  const { mutate: rejectDoc } = useRejectTowDocument(
    selectedDocument?.user_id ?? "",
    selectedDocument?.id ?? "",
  );
  const { mutate: approveDoc } = useApproveTowDocument(
    selectedDocument?.user_id ?? "",
    selectedDocument?.id ?? "",
  );

  const { data: documentData, isLoading } = useTowDocument();

  const totalPages = Math.ceil(
    (documentData?.data?.total ?? 0) / (documentData?.data?.limit ?? 20),
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = () => {};

  const handleApplyBulkAction = () => {
    console.log("Apply bulk action", bulkAction, selectedRows);
  };

  const handleOpenViewModal = (document: DocumentItem) => {
    setSelectedDocument(document);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedDocument(null);
  };

  const handleApprove = () => {
    approveDoc(undefined, {
      onSuccess: () => {
        handleCloseViewModal();
      },
    });
  };

  const handleReject = () => {
    rejectDoc(undefined, {
      onSuccess: () => {
        handleCloseViewModal();
      },
    });
  };

  const columns = [
    {
      header: "User Id",
      accessor: "user_id" as keyof DocumentItem,
    },
    {
      header: "Name",
      accessor: "operator_name" as keyof DocumentItem,
    },
    {
      header: "Document",
      accessor: "riderName" as keyof DocumentItem,
      render: (row: DocumentItem) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={row.url} alt={row.operator_name} />
            <AvatarFallback>
              {row.operator_name
                ? row.operator_name.charAt(0).toUpperCase()
                : "?"}
            </AvatarFallback>
          </Avatar>
        </div>
      ),
    },
    {
      header: "Expires At",
      accessor: "expiresAt" as keyof DocumentItem,
    },
    {
      header: "Status",
      accessor: "verification_status" as keyof DocumentItem,
      render: (row: DocumentItem) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.verification_status === "APPROVED"
              ? "bg-success-100 text-success-600"
              : row.verification_status === "UNVERIFIED"
                ? "bg-error-100 text-error-600"
                : row.verification_status === "REJECTED"
                  ? "bg-error-100 text-error-600"
                  : "bg-warning-50 text-warning-600"
          }`}
        >
          {row.verification_status}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof DocumentItem,
      sortable: false,
      render: (row: DocumentItem) => (
        <div className="flex items-center gap-3 text-sm font-bold">
          <button
            className="text-brand-600 cursor-pointer"
            onClick={() => handleOpenViewModal(row)}
          >
            View
          </button>
          {row.verification_status !== "APPROVED" && (
            <>
              <button
                className="text-success-600 cursor-pointer"
                onClick={() => {
                  setSelectedDocument(row);
                  setTimeout(
                    () =>
                      approveDoc(undefined, {
                        onSuccess: () => handleCloseViewModal(),
                      }),
                    0,
                  );
                }}
              >
                Approve
              </button>
              <button
                className="text-error-600 cursor-pointer"
                onClick={() => {
                  setSelectedDocument(row);
                  setTimeout(
                    () =>
                      rejectDoc(undefined, {
                        onSuccess: () => handleCloseViewModal(),
                      }),
                    0,
                  );
                }}
              >
                Reject
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex items-center justify-between">
        <h1 className="text-grey-800 text-2xl font-bold font-figtree">
          Tow Operators Documents
        </h1>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-3">
            <select
              value={itemsPerPage}
              onChange={() => {
                setCurrentPage(1);
              }}
              className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm"
            >
              <option value="15">15</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>

            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm cursor-pointer"
            >
              <option value="">Bulk Actions</option>
              <option value="verify">Verify Documents</option>
              <option value="reject">Reject Documents</option>
            </select>

            <Button
              hierarchy="secondary"
              size="xl"
              className="cursor-pointer"
              onClick={handleApplyBulkAction}
            >
              Apply
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Input
              inputType="iconLeading"
              icon={<MagnifyingGlassIcon size={20} color="#667085" />}
              name="search"
              placeholder="Search"
              size="md"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <Button hierarchy="secondary" size="xl" className="cursor-default">
              Search
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          data={documentData?.data?.documents ?? []}
          selectable
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
          isLoading={isLoading}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={documentData?.data?.total ?? 0}
          itemsPerPage={documentData?.data?.limit ?? 20}
          onPageChange={isLoading ? () => {} : handlePageChange}
        />
      </div>

      <ViewOperatorDocument
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        document={selectedDocument}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}
