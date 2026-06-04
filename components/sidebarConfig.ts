import {
  BellIcon,
  BellSimpleZIcon,
  BookIcon,
  CarIcon,
  EnvelopeIcon,
  FileIcon,
  GearIcon,
  HouseIcon,
  KeyIcon,
  MapPinAreaIcon,
  MapPinIcon,
  MoneyIcon,
  PackageIcon,
  PercentIcon,
  TruckIcon,
  TruckTrailerIcon,
  UsersFourIcon,
  UsersThreeIcon,
  WarningCircleIcon,
} from "@phosphor-icons/react";
import { ElementType } from "react";

export interface SidebarSubItem {
  id: string;
  label: string;
  path: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  path?: string;
  icon: ElementType;
  children?: SidebarSubItem[];
}

export interface SidebarSection {
  title: string;
  items: SidebarItem[];
}

export const sidebarConfig: SidebarSection[] = [
  {
    title: "",
    items: [
      {
        id: "dashboard",
        label: "Dashboard",
        path: "/dashboard",
        icon: HouseIcon,
      },
    ],
  },
  {
    title: "Operator",
    items: [
      {
        id: "live-tracking",
        label: "Live Tracking",
        path: "/live-tracking",
        icon: MapPinAreaIcon,
      },
      // { id: "rides", label: "Trip Management", path: "/rides", icon: CarIcon },
      {
        id: "trip-management",
        label: "Trip Management",
        path: "/trip-management",
        icon: CarIcon,
      },
      // {
      //   id: "delivery",
      //   label: "Deliveries",
      //   path: "/delivery",
      //   icon: PackageIcon,
      // },
      // {
      //   id: "cargo",
      //   label: "Freight / Cargo",
      //   path: "/cargo",
      //   icon: TruckIcon,
      // },
      // { id: "tow", label: "Towing", path: "/tow", icon: TruckTrailerIcon },
      { id: "lost", label: "Lost and Found", path: "/lost", icon: KeyIcon },
    ],
  },
  {
    title: "User Management",
    items: [
      {
        id: "team-members",
        label: "Team Members",
        icon: UsersThreeIcon,
        children: [
          { id: "all-team", label: "All Team Members", path: "/team-members" },
          {
            id: "roles",
            label: "Roles and Permissions",
            path: "/team-members/roles",
          },
        ],
      },
      {
        id: "customer",
        label: "Customers",
        path: "/customer",
        icon: UsersFourIcon,
      },
      {
        id: "operators",
        label: "Operators",
        icon: UsersFourIcon,
        children: [
          { id: "all-operators", label: "All Operators", path: "/operators" },
          {
            id: "operator-docs",
            label: "Operator Documents",
            path: "/operators/documents",
          },
          {
            id: "operator-location",
            label: "Operator Location",
            path: "/operators/location",
          },
          {
            id: "operator-notif",
            label: "Operator Notification",
            path: "/operators/notifications",
          },
          {
            id: "operator-wallet",
            label: "Operator Wallet",
            path: "/operators/wallet",
          },
        ],
      },
      // {
      //   id: "riders",
      //   label: "Riders",
      //   icon: UsersFourIcon,
      //   children: [
      //     { id: "all-riders", label: "All Riders", path: "/riders" },
      //     {
      //       id: "rider-docs",
      //       label: "Rider Documents",
      //       path: "/riders/documents",
      //     },
      //     {
      //       id: "rider-location",
      //       label: "Rider Location",
      //       path: "/riders/location",
      //     },
      //     {
      //       id: "rider-notif",
      //       label: "Rider Notifications",
      //       path: "/riders/notifications",
      //     },
      //     {
      //       id: "rider-wallet",
      //       label: "Riders Wallet",
      //       path: "/riders/wallet",
      //     },
      //   ],
      // },
      // {
      //   id: "tow-operators",
      //   label: "Tow Operator",
      //   icon: UsersFourIcon,
      //   children: [
      //     { id: "all-operators", label: "All Operators", path: "/operators" },
      //     {
      //       id: "operator-docs",
      //       label: "Operator Documents",
      //       path: "/operators/documents",
      //     },
      //     {
      //       id: "operator-location",
      //       label: "Operator Location",
      //       path: "/operators/location",
      //     },
      //     {
      //       id: "operator-notif",
      //       label: "Operator Notification",
      //       path: "/operators/notifications",
      //     },
      //     {
      //       id: "operator-wallet",
      //       label: "Operator Wallet",
      //       path: "/operators/wallet",
      //     },
      //   ],
      // },
      // {
      //   id: "cargo-operators",
      //   label: "Cargo Operator",
      //   icon: UsersFourIcon,
      //   children: [
      //     {
      //       id: "all-cargo-operators",
      //       label: "All Cargo Operators",
      //       path: "/cargo-operator",
      //     },
      //     {
      //       id: "cargo-operator-docs",
      //       label: "Cargo Operator Documents",
      //       path: "/cargo-operator/documents",
      //     },
      //     {
      //       id: "cargo-operator-location",
      //       label: "Cargo Operator Location",
      //       path: "/cargo-operator/location",
      //     },
      //     {
      //       id: "cargo-operator-notif",
      //       label: "Cargo Operator Notification",
      //       path: "/cargo-operator/notifications",
      //     },
      //     {
      //       id: "cargo-operator-wallet",
      //       label: "Cargo Operator Wallet",
      //       path: "/cargo-operator/wallet",
      //     },
      //   ],
      // },
    ],
  },
  {
    title: "Fleet & Service Management",
    items: [
      {
        id: "vehicle",
        label: "Vehicle Management",
        path: "/vehicle",
        icon: CarIcon,
      },
      {
        id: "service",
        label: "Service Zones and Areas",
        path: "/service",
        icon: MapPinIcon,
      },
      {
        id: "heat-map",
        label: "Heat map & Areas",
        path: "/heat-map",
        icon: MapPinAreaIcon,
      },
      {
        id: "sos",
        label: "SOS Reports",
        path: "/sos",
        icon: WarningCircleIcon,
      },
    ],
  },
  {
    title: "Price & Payments",
    items: [
      { id: "pricing", label: "Pricing", path: "/pricing", icon: MoneyIcon },
      {
        id: "promotions",
        label: "Promotions",
        icon: PercentIcon,
        children: [
          { id: "coupons", label: "Coupons", path: "/coupons" },
          { id: "incentive", label: "Incentive", path: "/incentive" },
        ],
      },
      {
        id: "financial",
        label: "Financial",
        icon: MoneyIcon,
        children: [
          { id: "transactions", label: "Transactions", path: "/transactions" },
          {
            id: "pay-later",
            label: "Pay Later Management",
            path: "/pay-later",
          },
        ],
      },
    ],
  },
  {
    title: "Notifications",
    items: [
      {
        id: "notification",
        label: "Notification Templates",
        path: "/notification",
        icon: EnvelopeIcon,
      },
      {
        id: "push-notification",
        label: "Push Notification",
        path: "/push-notification",
        icon: BellIcon,
      },
      {
        id: "event-notification",
        label: "Event Notifications",
        path: "/event-notification",
        icon: BellSimpleZIcon,
      },
    ],
  },
  {
    title: "Content Management",
    items: [
      {
        id: "customer-landing",
        label: "Customers Landing Page",
        path: "/customer-landing",
        icon: BookIcon,
      },
      {
        id: "operator-landing",
        label: "Operators Landing Page",
        path: "/operator-landing",
        icon: BookIcon,
      },
    ],
  },
  {
    title: "Platform Settings",
    items: [
      {
        id: "settings",
        label: "General Settings",
        path: "/settings",
        icon: GearIcon,
      },
      {
        id: "toggles",
        label: "Feature Toggles",
        path: "/toggles",
        icon: GearIcon,
      },
      {
        id: "integration",
        label: "Integrations",
        path: "/integration",
        icon: GearIcon,
      },
      { id: "logs", label: "Activity Logs", path: "/logs", icon: FileIcon },
    ],
  },
];
