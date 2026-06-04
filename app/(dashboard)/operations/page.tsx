"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/avatar";
import Link from "next/link";
import Table from "@/components/table";
import Pagination from "@/components/pagination";
import { Input } from "@/components/inputs";
import {
  formatCompactNumber,
  formatDate,
  NIGERIAN_STATES,
} from "@/utils/utils";
import AddTowForm from "./add-operator";
import { useGetTowOperatorStat } from "@/hooks/tow/getTowStats";
import { useGetTowList } from "@/hooks/tow/getTowList";
import { Driver } from "@/@types";
import { useExportTow } from "@/hooks/tow/exportTow";
import { useActivateTow } from "@/hooks/tow/activateTow";
import SuspendTow, { SuspendAccountPayload } from "./[id]/suspendTow";
import { useSuspendTow } from "@/hooks/tow/suspendTow";

export default function AllTowOperators() {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [openAddTow, setOpenAddTow] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [selectedTow, setSelectedTow] = useState<Driver | null>(null);
  const [openEditTow, setOpenEditTow] = useState(false);
  const [searchInput, setSearchInput] = useState<string>("");
  const [isSuspendOpen, setIsSuspendOpen] = useState(false);
  const [towToSuspend, setTowToSuspend] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const exportMutation = useExportTow();
  const itemsPerPage = 10;

  const { data: towStat, isLoading } = useGetTowOperatorStat();
  const { data: towList } = useGetTowList({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });
  const towStatDetails = towStat?.data;
  const towListData = towList?.data;

  const suspendMutation = useSuspendTow();
  const activateMutation = useActivateTow();

  const columns = [
    { header: "ID", accessor: "user_id" as keyof Driver },
    {
      header: "User Details",
      accessor: "name" as keyof Driver,
      render: (row: Driver) => (
        <div className="flex gap-2 items-center">
          <Avatar>
            <AvatarImage src={row?.avatar || ""} alt={row.first_name || ""} />
            <AvatarFallback>
              {row.first_name ? row.first_name.charAt(0) : "?"}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="font-bold text-sm text-grey-600">
              {row?.first_name} {row?.last_name}
            </div>
            <div className="text-grey-600 text-sm">{row.email}</div>
          </div>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: "status" as keyof Driver,
      render: (row: Driver) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.status === "ACTIVE" ? "bg-success-100 text-success-600" : "bg-error-100 text-error-600"}`}>
          {row.status}
        </span>
      ),
    },
    {
      header: "Verification",
      accessor: "verification" as keyof Driver,
      render: (row: Driver) => (
        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${row.verification_status === "VERIFIED" ? "bg-success-100 text-success-600" : row.verification_status === "UNVERIFIED" ? "bg-error-100 text-error-600" : "bg-warning-50 text-warning-600"}`}>
          {row.verification_status}
        </span>
      ),
    },
    {
      header: "Created At",
      accessor: "created" as keyof Driver,
      render: (row: Driver) => <span>{formatDate(row.created_at)}</span>,
    },
    {
      header: "Actions",
      accessor: "id" as keyof Driver,
      sortable: false,
      render: (row: Driver) => (
        <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row.status === "ACTIVE"}
              onChange={async () => {
                if (row.status === "ACTIVE") {
                  setTowToSuspend(row.user_id);
                  setIsSuspendOpen(true);
                } else {
                  await activateMutation.mutateAsync(row.user_id);
                }
              }}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
          <div className="text-brand-600 text-sm font-bold cursor-pointer" onClick={() => { setSelectedTow(row); setOpenEditTow(true); }}>
            Edit
          </div>
          <Link href={`/operators/${row.user_id}`} className="text-brand-600 text-sm font-bold">
            View
          </Link>
        </div>
      ),
    },
  ];

  const totalPages = Math.ceil(
    (towList?.data?.total ?? 0) / (towList?.data?.limit ?? 20),
  );

  const paginatedData = towListData?.operators || [];

  const handleConfirmSuspend = async (data: SuspendAccountPayload) => {
    if (towToSuspend) {
      await suspendMutation.mutateAsync({
        id: towToSuspend,
        payload: data,
      });
      setIsSuspendOpen(false);
      setTowToSuspend(null);
    }
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Tow Operators
          </h1>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
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
          <Button hierarchy="secondary" leftIcon={<PlusIcon size={16} />} onClick={() => setOpenExportModal(true)} className="cursor-pointer">
            Export
          </Button>
          <Button hierarchy="primary" leftIcon={<PlusIcon size={16} />} onClick={() => setOpenAddTow(true)} className="cursor-pointer">
            Add Operator
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">All Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.total ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Active Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.active ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Inactive Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.inactive ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Verified Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.verified ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Unverified Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.unverified ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Pending Verification</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.pending_verification ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Banned Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.banned ?? 0)}</p></div>
        <div className="border border-grey-200 rounded-3xl p-6"><h3 className="text-grey-600 text-sm font-bold font-figtree">Suspended Operators</h3><p className="text-grey-800 text-4xl font-bold">{formatCompactNumber(towStatDetails?.suspended ?? 0)}</p></div>
      </div>

      <div className="border border-grey-200 rounded-lg shadow">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <select value={itemsPerPage} onChange={() => setCurrentPage(1)} className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm">
                <option value="15">15</option><option value="25">25</option><option value="50">50</option><option value="100">100</option>
              </select>
              <div className="relative">
                <select value="" onChange={() => setCurrentPage(1)} className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800  px-3 py-4 text-sm cursor-pointer">
                  <option value="">Bulk Action</option><option value="suspend">Suspend Operators</option><option value="verify">Verify Operators</option><option value="delete">Delete Operators</option>
                </select>
              </div>
              <Button hierarchy="secondary" size="xl" className="cursor-pointer">Apply</Button>
            </div>
            <div className="flex items-center space-x-2">
              <Input inputType="iconLeading" icon={<MagnifyingGlassIcon size={20} color="#667085" />} name="search" placeholder="search" size="md" value={searchInput} onChange={(e) => setSearchInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (() => { setSearchQuery(searchInput); setCurrentPage(1); })()} />
              <Button hierarchy="secondary" size="xl" className="cursor-pointer" onClick={() => { setSearchQuery(searchInput); setCurrentPage(1); }}>Search</Button>
            </div>
          </div>
        </div>
        <Table columns={columns} data={paginatedData} onRowClick={(row: Driver) => console.log("Row clicked:", row)} selectable={true} selectedRows={selectedRows} onSelectAll={(checked) => console.log(checked)} isLoading={isLoading} />
        <Pagination currentPage={currentPage} totalPages={totalPages} totalItems={towList?.data?.total || 0} itemsPerPage={towList?.data?.limit || 20} onPageChange={isLoading ? () => {} : setCurrentPage} />
      </div>

      {openExportModal && (
        <ExportModal
          setShowModal={() => setOpenExportModal(false)}
          onExport={async (format) => {
            await exportMutation.mutateAsync(format);
          }}
        />
      )}
      {openAddTow && <AddTowForm isOpen={openAddTow} onClose={() => setOpenAddTow(false)} />}
      {openEditTow && selectedTow && (
        <AddTowForm
          isOpen={openEditTow}
          onClose={() => { setOpenEditTow(false); setSelectedTow(null); }}
          mode="edit"
          editData={{
            id: selectedTow.user_id,
            fullName: `${selectedTow.first_name} ${selectedTow.last_name}`,
            email: selectedTow.email,
            phoneNumber: selectedTow.phone_number ?? "",
            state: selectedTow.state ?? "",
            city: selectedTow.city ?? "",
            streetAddress: selectedTow.streetAddress ?? "",
          }}
        />
      )}
      <SuspendTow isOpen={isSuspendOpen} onClose={() => { setIsSuspendOpen(false); setTowToSuspend(null); }} onConfirm={handleConfirmSuspend} isLoading={suspendMutation.isPending} />
    </div>
  );
}
