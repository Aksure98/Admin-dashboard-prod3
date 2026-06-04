"use client";

import Button from "@/components/button";
import ExportModal from "@/components/exportModal";
import TabNavigation from "@/components/tabNavigation";
import { allLost, allReported, allClaimed } from "@/utils/utils";
import { CalendarIcon, PlusIcon } from "@phosphor-icons/react";
import { useState } from "react";
import AllLostDetails from "./all-lost";
import ReportDetails from "./report";
import ClaimedDetails from "./claimed";
import {
  NIGERIAN_STATES,
  formatCompactNumber,
  formatDate,
} from "@/utils/utils";
import { useLostAndFoundStat } from "@/hooks/lostandfound/lostAndFoundStat";
import { useExportLostAndFoundList } from "@/hooks/lostandfound/exportLostAndFound";
import { useGetLostAndFoundList } from "@/hooks/lostandfound/getLostAndFoundList";

type Period = "today" | "this_week" | "this_month" | "all_time";

const Tabs = [
  { id: "all", label: "All" },
  { id: "REPORTED", label: "Reported" },
  { id: "CLAIMED", label: "Claimed" },
];

const LostAndFound = () => {
  const [openExportModal, setOpenExportModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState("all");
  const [selectedPeriod, setSelectedPeriod] = useState<Period>("all_time");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const exportMutation = useExportLostAndFoundList();
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const { data: lostStat, isLoading } = useLostAndFoundStat({
    period: selectedPeriod,
    state: selectedState !== "All States" ? selectedState : undefined,
  });

  const { data: lostList, isLoading: lostListLoading } = useGetLostAndFoundList(
    {
      status: selectedTab,
      state: selectedState === "All States" ? undefined : selectedState,
      page: currentPage,
      limit: ITEMS_PER_PAGE,
    },
  );

  const lostItems = lostList?.data?.items ?? [];

  console.log(lostList, "HELLO");

  const handleExportOpen = () => {
    setOpenExportModal(true);
  };
  const handleExportClose = () => {
    setOpenExportModal(false);
  };

  const handleExport = async (format: string) => {
    await exportMutation.mutateAsync({ format, state: selectedState });
  };

  return (
    <div className="flex flex-col gap-6 mt-24">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-5">
          <h1 className="text-grey-800 text-2xl font-bold font-figtree">
            Lost and Found
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 border border-grey-400 bg-grey-0 rounded-xl px-3 py-2 text-sm">
            <CalendarIcon size={20} className="text-grey-600" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as Period)}
              className="border-none bg-transparent text-grey-800 focus:outline-none cursor-pointer"
            >
              <option value="all_time">All time</option>
              <option value="THIS_MONTH">This month</option>
              <option value="THIS_WEEK">This week</option>
              <option value="TODAY">Today</option>
            </select>
          </div>

          <Button
            hierarchy="primary"
            leftIcon={<PlusIcon size={16} />}
            onClick={handleExportOpen}
            className="cursor-pointer"
          >
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Total
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {lostList?.data?.total}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Claimed
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {lostList?.data?.claimed}
          </p>
        </div>
        <div className="border border-grey-200 rounded-3xl p-6">
          <h3 className="text-grey-600 text-sm font-bold font-figtree">
            Reported
          </h3>

          <p className="text-grey-800 text-4xl font-bold ">
            {lostList?.data?.reported}
          </p>
        </div>
      </div>

      <TabNavigation
        tabs={Tabs}
        onTabChange={(tabId) => {
          setSelectedTab(tabId);
        }}
      />

      <div>
        {selectedTab === "all" && (
          <AllLostDetails
            allLost={lostItems}
            currentPage={currentPage}
            totalItems={lostList?.data?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={lostListLoading}
          />
        )}
        {selectedTab === "REPORTED" && (
          <ReportDetails
            allLost={lostItems}
            currentPage={currentPage}
            totalItems={lostList?.data?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={lostListLoading}
          />
        )}
        {selectedTab === "CLAIMED" && (
          <ClaimedDetails
            allLost={lostItems}
            currentPage={currentPage}
            totalItems={lostList?.data?.total ?? 0}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
            isLoading={lostListLoading}
          />
        )}
      </div>

      {openExportModal && (
        <ExportModal setShowModal={handleExportClose} onExport={handleExport} />
      )}
    </div>
  );
};

export default LostAndFound;
