import { Metadata } from "next";
import DashboardLayout from "./dashboardLayout";

export const metadata: Metadata = {
  title: {
    default: "Point2 Admin Panel",
    template: "%s | Point2 Dashboard",
  },
  description: "",
};

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
