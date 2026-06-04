"use client";
import { NextPage } from "next";
import Sidebar from "@/components/sidebar";
import DashboardNavbar from "@/components/navbar";

const DashboardLayout: NextPage<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="flex w-full bg-grey-0 h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex flex-col flex-1 min-w-0 bg-grey-0">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto overflow-x-auto px-5 scrollbar-hide">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
