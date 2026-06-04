import { OperatorPaymentMethod } from "@/@types";

export interface Operator {
  id: string;
  name: string;
  email: string;
  status: "Active" | "Inactive" | "Suspended";
  verification: "Verified" | "Unverified" | "In Progress";
  created: string;
  logo?: Array<{ url: string }>;
  phoneNumber?: string;
  ratings?: number;
  totalTrips?: number;
  totalEarnings?: number;
  state?: string;
  city?: string;
  streetAddress?: string;
}

export const defaultOperatorBankAccounts: OperatorPaymentMethod[] = [
  {
    id: "1",
    bankName: "GT Bank",
    accountNumber: "7248658463",
  },
  {
    id: "2",
    bankName: "Stanbic Bank",
    accountNumber: "4732340352",
  },
];

export const allOperators: Operator[] = [
  {
    id: "001",
    name: "Nguyen Savannah",
    email: "jessica.hanson@example.com",
    status: "Active",
    verification: "Verified",
    created: "15 May 2020 8:30 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=1" }],
    phoneNumber: "+2348012345678",
    ratings: 4.5,
    totalTrips: 30,
    totalEarnings: 5400,
  },
  {
    id: "002",
    name: "Idris Damson",
    email: "damson.idris@example.com",
    status: "Active",
    verification: "Verified",
    created: "15 May 2020 8:00 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=2" }],
    phoneNumber: "+2348098765432",
    ratings: 4.9,
    totalTrips: 20,
    totalEarnings: 6200,
  },
  {
    id: "003",
    name: "Webb Theresa",
    email: "michael.mitc@example.com",
    status: "Active",
    verification: "Verified",
    created: "15 May 2020 9:30 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=3" }],
  },
  {
    id: "004",
    name: "Miles Floyd ",
    email: "debra.holt@example.com",
    status: "Inactive",
    verification: "Unverified",
    created: "15 May 2020 8:00 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=4" }],
  },
  {
    id: "005",
    name: "Henry Courtney",
    email: "jackson.graham@example.com",
    status: "Inactive",
    verification: "In Progress",
    created: "15 May 2020 9:30 am",
    logo: [],
  },
  {
    id: "006",
    name: "Fisher Cody",
    email: "tim.jennings@example.com",
    status: "Inactive",
    verification: "Unverified",
    created: "15 May 2020 9:30 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=6" }],
  },
  {
    id: "007",
    name: "Flores Albert",
    email: "deanna.curtis@example.com",
    status: "Active",
    verification: "Verified",
    created: "15 May 2020 9:00 am",
    logo: [{ url: "https://i.pravatar.cc/150?img=7" }],
  },
  {
    id: "008",
    name: "Morgan Freeman",
    email: "morgan.freeman@example.com",
    status: "Suspended",
    verification: "Verified",
    created: "20 February 2020 2:15 pm",
    logo: [{ url: "https://i.pravatar.cc/150?img=9" }],
    phoneNumber: "+2349012345678",
    ratings: 3.8,
    totalTrips: 52,
    totalEarnings: 12500,
  },
  ...Array.from(
    { length: 141 },
    (_, i) =>
      ({
        id: String(i + 9).padStart(3, "0"),
        name: `Operator ${i + 4}`,
        email: `operator${i + 4}@example.com`,
        status: (i % 2 === 0 ? "Active" : "Inactive") as "Active" | "Inactive",
        verification: (["Verified", "Unverified", "In Progress"][i % 3] ||
          "Verified") as "Verified" | "Unverified" | "In Progress",
        created: "15 June 2025 8:00 am",
        logo: [{ url: `https://i.pravatar.cc/150?img=${(i % 70) + 1}` }],
      }) as Operator,
  ),
];
