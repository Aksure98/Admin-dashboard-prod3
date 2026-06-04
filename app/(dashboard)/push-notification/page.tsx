"use client";

import Button from "@/components/button";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import SendNotificationForm from "./send-notification";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import { useGetPushNotifications } from "@/hooks/push-notifications/getPushNotifications";
import { useBulkDeletePushNotifications } from "@/hooks/push-notifications/bulkDeletePushNotifications";
import { PushNotification } from "@/@types";
import { formatDate } from "@/utils/utils";
import ExportModal from "@/components/exportModal";
import { useExportPushNotifications } from "@/hooks/push-notifications/exportPushNotifications";

const PushNotificationPage = () => {
  const [openSendNotification, setOpenSendNotification] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
 const [openExportModal, setOpenExportModal] = useState(false);
  const { data: notificationData, isLoading } = useGetPushNotifications({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const bulkDeletePushNotificationsMutation = useBulkDeletePushNotifications();
    const exportPushNotificationsMutation = useExportPushNotifications();

    const handleExportOpen = () => {
    setOpenExportModal(true);
    };
  const handleExport = async (format: string) => {
    await exportPushNotificationsMutation.mutateAsync(format);
  };
  const handleOpenSendNotification = () => {
    setOpenSendNotification(true);
  };

  const handleCloseSendNotification = () => {
    setOpenSendNotification(false);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "sent":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    {
      header: "Notification ID",
      accessor: "notification_id" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm font-medium text-gray-900">{row.broadcast_id}</p>
      ),
    },
    {
      header: "Title",
      accessor: "title" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm font-medium text-gray-900">{row.title}</p>
      ),
    },
    {
      header: "Recipients",
      accessor: "recipients" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm text-gray-600">{row.recipient_group}</p>
      ),
    },
    {
      header: "Channel",
      accessor: "channel" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm text-gray-600">{row.channels.join(", ")}</p>
      ),
    },
    {
      header: "Date",
      accessor: "date" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm text-gray-600">{formatDate(row.created_at)}</p>
      ),
    },
    {
      header: "Read Count",
      accessor: "read_count" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <p className="text-sm text-gray-600">{row.read_count}</p>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof PushNotification,
      sortable: false,
      render: (row: PushNotification) => (
        <span
          className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(row.status)}`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (notificationData?.meta?.total ?? 0) /
      (notificationData?.meta?.limit ?? 15),
  );
  const paginatedData = (notificationData?.data || []) as PushNotification[];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRowClick = (row: PushNotification) => {
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
      setSelectedRows((paginatedData as PushNotification[]).map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleApplyBulkAction = async () => {
    if (bulkAction !== "delete" || selectedRows.length === 0) return;
    await bulkDeletePushNotificationsMutation.mutateAsync(selectedRows.map(String), {
      onSuccess: () => {
        setSelectedRows([]);
        setBulkAction("");
      },
    });
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <h1 className="text-grey-800 text-2xl font-bold font-figtree">
          Push Notifications
        </h1>

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
            onClick={handleOpenSendNotification}
          >
            Send Push Notifications
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
            itemsPerPage={notificationData?.meta?.limit || 15}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>
        {openExportModal && (
        <ExportModal
            setShowModal={setOpenExportModal}
            onExport={handleExport}
        />
        )}
      {openSendNotification && (
        <SendNotificationForm
          isOpen={openSendNotification}
          onClose={handleCloseSendNotification}
        />
      )}
    </div>
  );
};

export default PushNotificationPage;
