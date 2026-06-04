"use client";

import Button from "@/components/button";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

import SendNotificationForm from "./send-notification";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import { useGetEventNotifications } from "@/hooks/event-notifications/getEventNotifications";
import { useBulkDeleteEventNotifications } from "@/hooks/event-notifications/bulkDeleteEventNotifications";
import { EventNotification, NotificationTemplate } from "@/@types";
import ExportModal from "@/components/exportModal";
import { useExportEventNotifications } from "@/hooks/event-notifications/exportEventNotifications";
import { useToggleEventNotificationStatus } from "@/hooks/event-notifications/toggleEventNotificationStatus";
import { useGetNotificationTemplates } from "@/hooks/notification-templates/getNotificationTemplates";

const EventNotificationPage = () => {
  const [openSendNotification, setOpenSendNotification] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<EventNotification | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [openExportModal, setOpenExportModal] = useState(false);

  const { data: notificationData, isLoading } = useGetEventNotifications({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const { data: templatesData } = useGetNotificationTemplates({ limit: 100 });
  const bulkDeleteEventNotificationsMutation = useBulkDeleteEventNotifications();
  const exportEventNotificationsMutation = useExportEventNotifications();
  const toggleEventNotificationStatusMutation =
    useToggleEventNotificationStatus();

  const templates = templatesData?.data ?? [];

  const formatEnumLabel = (value?: string) => {
    if (!value) return "N/A";
    return value
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (character) => character.toUpperCase());
  };

  const getNotificationTitle = (row: EventNotification) => {
    if (row.title) return row.title;

    const matchingTemplate = templates.find(
      (template: NotificationTemplate) => template.id === row.template_id,
    );

    return matchingTemplate?.title ?? "Custom Notification";
  };

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };

  const handleExport = async (format: string) => {
    await exportEventNotificationsMutation.mutateAsync(format);
  };

  const handleOpenSendNotification = (notification?: EventNotification) => {
    setSelectedNotification(notification ?? null);
    setOpenSendNotification(true);
  };

  const handleCloseSendNotification = () => {
    setOpenSendNotification(false);
    setSelectedNotification(null);
  };

  const getNotificationRuleId = (row: EventNotification) => {
    const notificationWithAliases = row as EventNotification & {
      automated_notification_id?: string;
      notification_id?: string;
    };

    return String(
      notificationWithAliases.rule_id ??
        notificationWithAliases.automated_notification_id ??
        notificationWithAliases.notification_id ??
        row.id,
    );
  };

  const handleEdit = (e: React.MouseEvent, row: EventNotification) => {
    e.stopPropagation();
    handleOpenSendNotification(row);
  };

  const handleToggleStatus = async (
    e: React.MouseEvent,
    row: EventNotification,
  ) => {
    e.stopPropagation();

    await toggleEventNotificationStatusMutation.mutateAsync({
      id: getNotificationRuleId(row),
      values: { is_active: !row.is_active },
    });
  };

  const handleDelete = async (
    e: React.MouseEvent,
    row: EventNotification,
  ) => {
    e.stopPropagation();

    await bulkDeleteEventNotificationsMutation.mutateAsync(
      [getNotificationRuleId(row)],
      {
      onSuccess: () => {
        setSelectedRows((currentRows) =>
          currentRows.filter((rowId) => rowId !== row.id),
        );
      },
      },
    );
  };

  const columns = [
    {
      header: "Condition",
      accessor: "condition" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <p className="text-sm font-medium text-gray-900">{row.condition || "N/A"}</p>
      ),
    },
    {
      header: "Trigger Threshold",
      accessor: "trigger_threshold" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <p className="text-sm text-gray-600">
          {row.trigger_threshold} {row.threshold_unit?.toLowerCase()}
        </p>
      ),
    },
    {
      header: "Title",
      accessor: "template_id" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <p className="text-sm font-medium text-gray-900">
          {getNotificationTitle(row)}
        </p>
      ),
    },
    {
      header: "Recipients",
      accessor: "recipient_group" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <p className="text-sm text-gray-600">{formatEnumLabel(row.recipient_group)}</p>
      ),
    },
    {
      header: "Channel",
      accessor: "channels" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <p className="text-sm text-gray-600">
          {(row.channels || []).map((channel) => formatEnumLabel(channel)).join(", ")}
        </p>
      ),
    },
    {
      header: "Status",
      accessor: "is_active" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
            row.is_active
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "id" as keyof EventNotification,
      sortable: false,
      render: (row: EventNotification) => (
        <div className="flex items-center gap-4">
          <label
            className="relative inline-flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              checked={row.is_active ?? true}
              readOnly
              onClick={(e) => handleToggleStatus(e, row)}
            />
            <div className="w-11 h-[24px] bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[3px] after:left-[3px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-[18px] after:w-[18px] after:transition-all peer-checked:bg-[#0073b6]"></div>
          </label>
          <button
            onClick={(e) => handleEdit(e, row)}
            className="text-[#0073b6] font-semibold text-sm hover:underline"
          >
            Edit
          </button>
          <button
            onClick={(e) => handleDelete(e, row)}
            className="text-red-600 font-semibold text-sm hover:underline"
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (notificationData?.meta?.total ?? 0) /
      (notificationData?.meta?.limit ?? 15),
  );
  const paginatedData = (notificationData?.data || []) as EventNotification[];

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedRows((currentRows) =>
        currentRows.includes(id) ? currentRows : [...currentRows, id],
      );
    } else {
      setSelectedRows((currentRows) =>
        currentRows.filter((rowId) => rowId !== id),
      );
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedRows((paginatedData as EventNotification[]).map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleApplyBulkAction = async () => {
    if (bulkAction !== "delete" || selectedRows.length === 0) return;
    const ruleIds = paginatedData
      .filter((row) => selectedRows.includes(row.id))
      .map(getNotificationRuleId);

    await bulkDeleteEventNotificationsMutation.mutateAsync(ruleIds, {
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
          Automated Notifications
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
            Create New Event
          </Button>
        </div>
      </div>

      <div className="">
        <div className="border border-grey-200 rounded-lg shadow bg-white">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
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

                <div className="relative">
                  <select
                    value={bulkAction}
                    onChange={(e) => setBulkAction(e.target.value)}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm cursor-pointer"
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
          notification={selectedNotification}
        />
      )}
    </div>
  );
};

export default EventNotificationPage;
