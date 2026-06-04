"use client";

import { Integration } from "@/@types";
import Button from "@/components/button";
import { Input } from "@/components/inputs";
import Pagination from "@/components/pagination";
import Table from "@/components/table";
import { useGetIntegrations } from "@/hooks/integrations/getIntegrations";
import { useToggleIntegrationStatus } from "@/hooks/integrations/toggleStatusIntegration";
import { formatDate } from "@/utils/utils";
import { MagnifyingGlassIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";

const IntegrationPage = () => {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { data: integrations, isLoading } = useGetIntegrations({
    page: currentPage,
    limit: itemsPerPage,
    search: searchQuery,
  });

  const integrationList = (integrations?.data ?? []).map((item) => ({
    ...item,
    id: item.integration_id,
  }));

  const toggleStatusMutation = useToggleIntegrationStatus();

  const totalPages = Math.ceil(
    (integrations?.total ?? 0) / (integrationList?.length ?? 20),
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setCurrentPage(1);
  };

  const handleToggleStatus = (row: Integration) => {
    setTogglingId(row.integration_id);
    toggleStatusMutation.mutate(
      { id: row.integration_id, value: { is_active: !row.is_active } },
      { onSettled: () => setTogglingId(null) },
    );
  };

  const columns = [
    {
      header: "Id",
      accessor: "integration_id" as keyof Integration,
    },
    {
      header: "Name",
      accessor: "name" as keyof Integration,
    },
    {
      header: "Category",
      accessor: "category" as keyof Integration,
    },
    {
      header: "Last Updated",
      accessor: "updated_at" as keyof Integration,
      render: (row: Integration) => <p>{formatDate(row.updated_at)}</p>,
    },
    {
      header: "Status",
      accessor: "is_active" as keyof Integration,
      render: (row: Integration) => (
        <p
          className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
            row.is_active
              ? "bg-success-100 text-success-600"
              : "bg-error-100 text-error-600"
          }`}
        >
          {row.is_active ? "Active" : "Inactive"}
        </p>
      ),
    },

    {
      header: "Actions",
      accessor: "id" as keyof Integration,
      sortable: false,
      render: (row: Integration) => (
        <div className="flex items-center space-x-2">
          <label
            className={`relative inline-flex items-center ${
              togglingId === row.integration_id
                ? "opacity-50 cursor-not-allowed"
                : "cursor-pointer"
            }`}
          >
            <input
              type="checkbox"
              className="sr-only peer"
              defaultChecked={row?.is_active === true}
              disabled={togglingId === row.integration_id}
              onChange={() => handleToggleStatus(row)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-800"></div>
          </label>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Integrations
          </h1>
        </div>

        <Button
          hierarchy="primary"
          leftIcon={<PlusIcon size={16} />}
          // onClick={handleExportOpen}
          className="cursor-pointer"
        >
          Export
        </Button>
      </div>

      <div>
        <div className="border border-grey-200 rounded-lg shadow">
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
                  <option value="10">10</option>
                  <option value="20">20</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                  <option value="100">100</option>
                </select>

                <div className="relative">
                  <select
                    value={itemsPerPage}
                    onChange={() => setCurrentPage(1)}
                    className="border border-grey-400 bg-grey-0 rounded-xl text-grey-800 px-3 py-4 text-sm cursor-pointer"
                  >
                    <option value="">Bulk Action</option>
                    <option value="delete">Bulk Delete</option>
                    <option value="suspend">Bulk Suspend</option>
                  </select>
                </div>

                <Button
                  hierarchy="secondary"
                  size="xl"
                  className="cursor-pointer"
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
            data={integrationList}
            isLoading={isLoading}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={integrations?.total || 0}
            itemsPerPage={integrationList?.length || 20}
            onPageChange={isLoading ? () => {} : handlePageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default IntegrationPage;
