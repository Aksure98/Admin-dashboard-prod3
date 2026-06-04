"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BellIcon, GearIcon, UserIcon } from "@phosphor-icons/react";

import Breadcrumb from "./breadCrumb";
import Notification from "./notification";
import {SignOutIcon } from "@phosphor-icons/react";
// import SettingsModal from "./settings-modal";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "./avatar";

import { useAppSelector } from "@/store/hooks";
import { store } from "@/store";
import { notify } from "@/utils/toastStore";
import { clearUser } from "@/store/slices/userSlice";
import SettingsModal from "./settings";

interface BreadcrumbItem {
  label: string;
  href: string;
  active: boolean;
}

const DashboardNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const userDetail = useAppSelector((state) => state.user);

  const [openNotification, setOpenNotification] = useState(false);
  const [openSettings, setOpenSettings] = useState(false);
  const [openSOS, setOpenSOS] = useState(false);

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const segments = pathname.split("/").filter(Boolean);

    return segments.map((segment, index) => {
      const href = "/" + segments.slice(0, index + 1).join("/");

      const label = segment
        .split("-")
        .map(
          (word) =>
            word.charAt(0).toUpperCase() + word.slice(1)
        )
        .join(" ");

      return {
        label,
        href,
        active: index === segments.length - 1,
      };
    });
  };

  const items = generateBreadcrumbs();

  return (
    <>
      {/* Navbar */}
      <div className="fixed top-0 right-0 z-10 flex h-[70px] w-[calc(100%_-_280px)] items-center justify-between border-b-2 border-gray-200 bg-gray-50 px-5">

        <Breadcrumb
          items={items}
          onNavigate={(href: string) => router.push(href)}
        />

        <div className="flex items-center gap-5">

          {/* SOS */}
          <button
            onClick={() => setOpenSOS(true)}
            className="rounded-2xl bg-gray-200 px-3 py-3 font-extrabold"
          >
            SOS
          </button>

          {/* Settings */}
          <button
            onClick={() => setOpenSettings(true)}
            className="rounded-2xl bg-gray-200 px-3 py-3"
          >
            <GearIcon size={20} />
          </button>

          {/* Notifications */}
          <button
            onClick={() =>
              setOpenNotification((prev) => !prev)
            }
            className="rounded-2xl bg-gray-200 px-3 py-3"
          >
            <BellIcon size={20} />
          </button>

          {/* User */}
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src={userDetail?.logo || undefined} />
              <AvatarFallback>
                {userDetail?.full_name?.charAt(0) || "?"}
              </AvatarFallback>
            </Avatar>

            <div>
              <h4 className="text-sm font-semibold">
                {userDetail?.full_name}
              </h4>
              <p className="text-sm text-gray-600">
                {userDetail?.role}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Notification */}
      <Notification
        isOpen={openNotification}
        onClose={() => setOpenNotification(false)}
      />

      {/* Settings */}
      {openSettings && (
        <SettingsModal
          isOpen={openSettings}
          onClose={() => setOpenSettings(false)}
        />
      )}

      {/* SOS Overlay */}
      {openSOS && (
        <div
          className="fixed inset-0 z-40 bg-black/30"
          onClick={() => setOpenSOS(false)}
        />
      )}

      {/* SOS Drawer */}
      <div
        className={`rounded-lg fixed right-0 top-0 z-50 h-80 w-80 bg-white shadow-2xl transition-transform duration-200 ${
          openSOS ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between  p-5">
          <h2 className="text-lg font-semibold">Profile</h2>

          <button
            onClick={() => setOpenSOS(false)}
            className="text-bold hover:text-red-600"
          >
            ✕
          </button>
        </div>

        <div className="space-y-0 p-2">

          <button
            onClick={() => {
              setOpenSettings(true);
              setOpenSOS(false);
            }}
            className="w-full rounded-lg border border-gray-300 font-sans flex items-center gap-2 bg-white p-3  text-left cursor-pointer display hover:bg-brand-500"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-300 text-white">
              <UserIcon size={20} color="#0077b6" />
            </span>
            Edit Profile
          </button>

          <button
            onClick={() => {
              store.dispatch(clearUser());
              localStorage.removeItem("token");
              localStorage.removeItem("refreshToken");
              notify({
                type: "success",
                title: "Logged Out",
                message: "You have been logged out successfully",
                autoClose: true,
                autoCloseDelay: 3000,
              });
              router.push("/");
            }}
            className="w-full rounded-lg border border-gray-100 flex items-center gap-2 bg-white p-3  font-sans cursor-pointer display hover:bg-brand-500"
          >
            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-brand-300 text-white">
              <SignOutIcon size={20} color="#0077b6" />
            </span>
            log Out
          </button>
        </div>
      </div>
    </>
  );
};

export default DashboardNavbar;