"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";

import UploadModal from "@/components/uploadModal";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import AddNotificationForm from "./add-notification";
import EditNotificationForm from "./edit-notification";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import { NIGERIAN_STATES } from "@/utils/utils";
import { useDeleteNotificationTemplate } from "@/hooks/notification-templates/deleteNotificationTemplate";
import { useBulkDeleteNotificationTemplates } from "@/hooks/notification-templates/bulkDeleteNotificationTemplates";
import { useExportNotificationTemplates } from "@/hooks/notification-templates/exportNotificationTemplates";
import { NotificationTemplate } from "@/@types";
import { useGetNotificationTemplates } from "@/hooks/notification-templates/getNotificationTemplates";

const Notification = () => {
  const [openImportModal, setOpenImportModal] = useState(false);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openAddNotification, setOpenAddNotification] = useState(false);
  const [openEditNotification, setOpenEditNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<NotificationTemplate | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const { data: notificationData, isLoading } = useGetNotificationTemplates({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const deleteNotificationMutation = useDeleteNotificationTemplate();
  const bulkDeleteNotificationMutation = useBulkDeleteNotificationTemplates();
  const exportNotificationMutation = useExportNotificationTemplates();

  console.log(notificationData);


  const handleImportClose = () => {
    setOpenImportModal(false);
  };

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };


  const handleOpenAddNotification = () => {
    setOpenAddNotification(true);
  };

  const handleCloseAddNotification = () => {
    setOpenAddNotification(false);
  };
  const handleOpenEditNotification = (notification: NotificationTemplate) => {
    setSelectedNotification(notification);
    setOpenEditNotification(true);
  };

  const handleCloseEditNotification = () => {
    setOpenEditNotification(false);
    setSelectedNotification(null);
  };

  const handleExport = async (format: string) => {
    await exportNotificationMutation.mutateAsync(format);
  };

  const columns = [
    {
      header: "Title",
      accessor: "title" as keyof NotificationTemplate,
      sortable: false,
      render: (row: NotificationTemplate) => (
        <div className="flex gap-2 items-center">
          <p className="text-sm font-medium text-gray-900">{row.title}</p>
        </div>
      ),
    },
    {
      header: "Message",
      accessor: "message" as keyof NotificationTemplate,
      sortable: false,
      render: (row: NotificationTemplate) => (
        <p className="text-sm text-gray-600 line-clamp-2">{row.message}</p>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof NotificationTemplate,
      sortable: false,
      render: (row: NotificationTemplate) => (
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="text-brand-600 text-sm font-bold"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenEditNotification(row);
            }}
          >
            Edit
          </button>
          <button
            type="button"
            className="text-error-600 text-sm font-bold"
            onClick={(e) => {
              e.stopPropagation();
              deleteNotificationMutation.mutateAsync(String(row.id));
            }}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (notificationData?.meta?.total ?? 0) /
      (notificationData?.meta?.limit ?? 10),
  );
  const paginatedData = notificationData?.data || [];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (row: NotificationTemplate) => {
    console.log("Row clicked:", row);
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedRows([...selectedRows, id]);
    } else {
      setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows(paginatedData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleApplyBulkAction = async () => {
    if (bulkAction !== "delete" || selectedRows.length === 0) return;

    await bulkDeleteNotificationMutation.mutateAsync(
      selectedRows.map(String),
      {
        onSuccess: () => {
          setSelectedRows([]);
          setBulkAction("");
        },
      },
    );
  };

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedState(e.target.value);
    setCurrentPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Notification Templates
          </h1>

          <select
            value={selectedState}
            onChange={handleStateChange}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {NIGERIAN_STATES.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-3 items-center">
          <Button
            hierarchy="secondary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
          >
            Export
          </Button>
          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleOpenAddNotification}
          >
            Create New Template
          </Button>
        </div>
      </div>


      <div className="">
        <div className="border border-grey-200 rounded-lg shadow">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {/* Items per page dropdown */}
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm"
                >
                  <option value="15">15</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                {/* Bulk Actions dropdown */}
                <div className="relative">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="delete">Bulk Delete</option>
                  </select>
                </div>

                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={handleApplyBulkAction}
                  disabled={bulkAction !== "delete" || selectedRows.length === 0}
                >
                  Apply
                </Button>
              </div>

              {/* Search */}
              <div className="flex items-center space-x-2">
                <Input
                  inputType="iconLeading"
                  icon={<MagnifyingGlassIcon size={20} color="#667085" />}
                  name="search"
                  placeholder="search"
                  size="md"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                />
                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
                  onClick={handleSearch}
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
          <Table
            columns={columns}
            data={paginatedData}
            onRowClick={handleRowClick}
            selectable={true}
            selectedRows={selectedRows}
            onSelectRow={handleSelectRow}
            onSelectAll={handleSelectAll}
            isLoading={isLoading}
          />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={notificationData?.meta?.total || 0}
            itemsPerPage={notificationData?.meta?.limit || 10}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>

      {openImportModal && <UploadModal setShowModal={handleImportClose} />}
      {/* {openExportModal && <ExportModal setShowModal={handleExportClose} />} */}
      {openExportModal && (
        <ExportModal
          setShowModal={setOpenExportModal}
          onExport={handleExport}
        />
      )}
      {openAddNotification && (
        <AddNotificationForm
          isOpen={openAddNotification}
          onClose={handleCloseAddNotification}
        />
      )}
      {openEditNotification && selectedNotification && (
        <EditNotificationForm
          isOpen={openEditNotification}
          onClose={handleCloseEditNotification}
          notification={selectedNotification}
        />
      )}
    </div>
  );
};

export default Notification;
