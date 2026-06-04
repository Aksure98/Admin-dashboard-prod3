"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Logo from "@/public/images/point2-white.png";
import {
  CaretDownIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
  TextOutdentIcon,
} from "@phosphor-icons/react";
import { Input } from "./inputs";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAppSelector } from "@/store/hooks";
import { useLogout } from "@/hooks/logout";
import { sidebarConfig, SidebarItem, SidebarSection } from "./sidebarConfig";

const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const userDetail = useAppSelector((state) => state.user);
  const { logout } = useLogout();

  // Track which expandable items are open by their id
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});

  // Auto-open parent if current path matches a child
  useEffect(() => {
    const newOpenItems: Record<string, boolean> = {};
    sidebarConfig.forEach((section) => {
      section.items.forEach((item) => {
        if (item.children) {
          const isChildActive = item.children.some((child) =>
            pathname.startsWith(child.path),
          );
          if (isChildActive) newOpenItems[item.id] = true;
        }
      });
    });
    setOpenItems((prev) => ({ ...prev, ...newOpenItems }));
  }, [pathname]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderItem = (item: SidebarItem) => {
    const Icon = item.icon;
    const isOpen = openItems[item.id] ?? false;

    // Leaf item with a direct path
    if (!item.children && item.path) {
      return (
        <Link
          key={item.id}
          href={item.path}
          className={`w-full flex items-center gap-3 px-3 py-2.5 text-left font-figtree text-grey-0 font-normal rounded-xl cursor-pointer transition-colors ${
            pathname === item.path ? "bg-brand-600" : ""
          }`}
        >
          <Icon size={20} />
          <span className="text-sm">{item.label}</span>
        </Link>
      );
    }

    // Expandable item with children
    return (
      <div key={item.id}>
        <div
          onClick={() => toggleItem(item.id)}
          className={`w-full flex items-center justify-between px-3 py-2.5  rounded transition-colors cursor-pointer ${
            isOpen ? "font-bold" : ""
          }`}
        >
          <div className="flex items-center gap-3">
            <Icon size={20} />
            <p className="text-sm text-grey-0 font-normal">{item.label}</p>
          </div>
          {isOpen ? <CaretUpIcon size={20} /> : <CaretDownIcon size={20} />}
        </div>

        {isOpen && (
          <div>
            {item.children!.map((child) => (
              <div
                key={child.id}
                onClick={() => router.push(child.path)}
                className={`w-full px-3 py-2.5  text-left text-sm transition-colors text-grey-0 cursor-pointer ${
                  pathname.startsWith(child.path) ? "bg-brand-600" : ""
                }`}
              >
                {child.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const renderSection = (section: SidebarSection, index: number) => (
    <div
      key={index}
      className="flex flex-col gap-5 pb-5 border-b-2 border-secondary-200"
    >
      {section.title && (
        <div className="px-6 mt-3">
          <p className="text-sm font-semibold text-grey-0">{section.title}</p>
        </div>
      )}
      {section.items.map(renderItem)}
    </div>
  );

  return (
    <div className="w-72 h-screen bg-brand-800 rounded-r-2xl text-white flex flex-col gap-6 py-6">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-2">
        <Image src={Logo} alt="Point 2 Logo" width={100} height={100} />
        <div className="cursor-pointer">
          <TextOutdentIcon size={20} />
        </div>
      </div>

      {/* Search */}
      <div className="px-2">
        <Input
          inputType="iconLeading"
          icon={<MagnifyingGlassIcon size={16} color="#667085" />}
          type="text"
          label=""
          name="search"
          placeholder="Search Menu"
          className="w-full bg-brand-700 border-brand-700"
        />
      </div>

      {/* Nav sections */}
      <div className="overflow-y-auto scrollbar-hide flex flex-col">
        {sidebarConfig.map(renderSection)}
      </div>

      {/* User footer */}
      <div className="border-t border-secondary-200 p-3">
        <div className="flex items-center gap-3 p-2 rounded transition-colors">
          <div className="relative">
            <Avatar>
              <AvatarImage src={userDetail?.logo || undefined} alt="name" />
              <AvatarFallback>
                {userDetail?.full_name ? userDetail.full_name.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div
              className={`absolute h-3 w-3 rounded-2xl left-6 top-5 ${
                userDetail?.status === "ACTIVE"
                  ? "bg-success-700"
                  : "bg-grey-700"
              }`}
            />
          </div>
          <div className="flex-1">
            <h4 className="text-sm text-grey-0 font-semibold">
              {userDetail?.full_name}
            </h4>
            <p className="text-secondary-50 text-sm font-normal">
              {userDetail?.role}
            </p>
          </div>
          <button className="p-4 rounded cursor-pointer" onClick={logout}>
            <SignOutIcon size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
