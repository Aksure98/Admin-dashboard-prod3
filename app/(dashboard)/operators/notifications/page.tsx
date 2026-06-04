"use client";

import { useMemo, useState } from "react";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import ComposeNotifications from "./compose";
import FormModal from "@/components/modal";
import { useGetDriverNotification } from "@/hooks/drivers/getDriverNotification";
import { ComposeNotificationsProps, DriverNotificationItem } from "@/@types";
import { useAddNotification } from "@/hooks/drivers/addNotification";

const SERVICE_OPTIONS = [
  "All Services",
  "RIDES",
  "DELIVERY",
  "TOWING",
  "TRUCK",
];

const DriversNotifications = () => {
  const [openCompose, setOpenCompose] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [selectedNotification, setSelectedNotification] =
    useState<DriverNotificationItem | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(15);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [bulkAction, setBulkAction] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedService] =
    useState<string>("All Services");

  const { mutateAsync: sendNotification, isPending: isSending } =
    useAddNotification();

  const { data: notificationData, isLoading } = useGetDriverNotification({
    page: currentPage,
    limit: itemsPerPage,
    service_type:
      selectedService === "All Services" ? undefined : selectedService,
  });

  const notificationList = notificationData?.data?.notifications;

  console.log(notificationList);

  const handleSend = async (payload: ComposeNotificationsProps) => {
    await sendNotification(payload, {
      onSuccess: () => setOpenCompose(false),
    });
  };

  const totalPages = Math.ceil(
    (notificationData?.data?.total ?? 0) /
      (notificationData?.data?.limit ?? 20),
  );

  const handleSelectRow = (id: string | number, checked: boolean) => {
    if (checked) {
      setSelectedRows((prev) => [...prev, id]);
    } else {
      setSelectedRows((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    // if (checked) {
    //   setSelectedRows(paginatedData.map((row) => row.id));
    // } else {
    //   setSelectedRows([]);
    // }
  };

  const handleApplyBulkAction = () => {
    console.log("Apply bulk action", bulkAction, selectedRows);
  };

  const handleServiceChange = (service: string) => {
    setSelectedService(service);
    setCurrentPage(1);
  };

  const columns = [
    {
      header: "Message",
      accessor: "title" as keyof DriverNotificationItem,
      render: (row: DriverNotificationItem) => (
        <div>
          <p className="text-grey-700 text-sm font-bold">{row?.title}</p>
          <p className="text-grey-500 text-sm font-normal truncate max-w-[340px]">
            {row?.body}
          </p>
        </div>
      ),
    },
    {
      header: "Recipients",
      accessor: "recipientsLabel" as keyof DriverNotificationItem,
      render: (row: DriverNotificationItem) => (
        <div>
          <p className="text-grey-700 text-sm font-bold">{row?.recipients}</p>
          <p className="text-grey-500 text-sm font-normal">
            {row.sent_count}{" "}
            {Number(row.sent_count) === 1 ? "Driver" : "Drivers"}
          </p>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof DriverNotificationItem,
      render: (row: DriverNotificationItem) => (
        <span
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full
        ${
          row.status === "SENT"
            ? "bg-success-100 text-success-600"
            : row.status === "PENDING"
              ? "bg-warning-100 text-warning-600"
              : "bg-error-100 text-error-600"
        }
        `}
        >
          {row.status}
        </span>
      ),
    },
    // {
    //   header: "Read Rate",
    //   accessor: "readCount" as keyof DriverNotificationItem,
    //   // render: (row: DriverNotificationItem) => {
    //   //   const recipientCount = Number(row.sent_count);
    //   //   const percent =
    //   //     recipientCount > 0
    //   //       ? Math.round((row.read_count / row.sent_count) * 100)
    //   //       : 0;
    //   //   return (
    //   //     <div>
    //   //       <p className="text-grey-700 text-sm font-bold">
    //   //         {row.read_count}/{row?.sent_count}
    //   //       </p>
    //   //       <p className="text-grey-500 text-sm font-normal">{percent}%</p>
    //   //     </div>
    //   //   );
    //   // },
    // },
    {
      header: "Actions",
      accessor: "notify_id" as keyof DriverNotificationItem,
      sortable: false,
      render: (row: DriverNotificationItem) => (
        <div className="flex items-center gap-4 text-sm font-bold">
          <button
            type="button"
            className="text-brand-600 cursor-pointer"
            onClick={() => {
              setSelectedNotification(row);
              setOpenView(true);
            }}
          >
            View
          </button>
          <button
            type="button"
            className="text-error-600 cursor-pointer"
            onClick={() => console.log("Delete notification", row?.notify_id)}
          >
            Remove
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Driver Notifications
          </h1>

          <select
            value={selectedService}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="border border-grey-400 bg-grey-0 rounded-lg text-grey-800 px-4 py-2 text-sm font-medium"
          >
            {SERVICE_OPTIONS.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <Button
          hierarchy="primary"
          size="lg"
          leftIcon={<PlusIcon size={16} />}
          className="cursor-pointer"
          onClick={() => setOpenCompose(true)}
        >
          Compose Notification
        </Button>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center space-x-3">
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm"
            >
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>

            <select
              value={bulkAction}
              onChange={(e) => setBulkAction(e.target.value)}
              className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-2 text-sm cursor-pointer"
            >
              <option value="">Bulk Actions</option>
              <option value="delete">Delete</option>
              <option value="resend">Resend</option>
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
          data={notificationList ?? []}
          selectable
          selectedRows={selectedRows}
          onSelectRow={handleSelectRow}
          onSelectAll={handleSelectAll}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={notificationData?.data?.total || 0}
          itemsPerPage={itemsPerPage}
          onPageChange={(page) => setCurrentPage(page)}
        />
      </div>

      <ComposeNotifications
        isOpen={openCompose}
        onClose={() => setOpenCompose(false)}
        //@ts-expect-error will work on it later
        onSend={handleSend}
        isSending={isSending}
      />

      {openView && selectedNotification && (
        <FormModal
          title="Notification Details"
          onCancel={() => {
            setOpenView(false);
            setSelectedNotification(null);
          }}
          onSave={() => {
            setOpenView(false);
            setSelectedNotification(null);
          }}
          saveButtonText="Close"
          saveIcon={null}
          className="max-w-xl h-screen rounded-l-3xl"
        >
          <div className="flex flex-col gap-6">
            <div>
              <p className="text-grey-800 text-sm font-bold">Title</p>
              <p className="text-grey-600 text-sm font-normal">
                {selectedNotification.title}
              </p>
            </div>

            <div>
              <p className="text-grey-800 text-sm font-bold">Recipients</p>
              <p className="text-grey-600 text-sm font-normal">
                {selectedNotification?.sent_count} (
                {selectedNotification?.sent_count})
              </p>
            </div>

            <div>
              <p className="text-grey-800 text-sm font-bold">Status</p>
              <span
                className={`mt-2 px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full  w-fit
                ${
                  selectedNotification?.status === "SENT"
                    ? "bg-success-100 text-success-600"
                    : selectedNotification?.status === "PENDING"
                      ? "bg-warning-100 text-warning-600"
                      : "bg-error-100 text-error-600"
                }
                `}
              >
                {selectedNotification.status}
              </span>
            </div>

            <div>
              <p className="text-grey-800 text-sm font-bold">Message</p>
              <div className="mt-2 border border-grey-200 rounded-xl bg-grey-50 p-4">
                <p className="text-grey-700 text-sm font-normal whitespace-pre-line">
                  {selectedNotification.body}
                </p>
              </div>
            </div>
          </div>
        </FormModal>
      )}
    </div>
  );
};

export default DriversNotifications;
