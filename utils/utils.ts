import { AllLost, AllTrips } from "@/@types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Number(price));
}

export function formatPriceWithDecimals(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

export function formatDate(date: string | number | Date): string {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) return "—";

  const datePart = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(dateObj);

  const timePart = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  }).format(dateObj);

  return `${datePart}, ${timePart}`;
}

export function formatCompactNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return num.toString();
}

export const Tabs = [
  { id: "all", label: "All Trips" },
  { id: "ongoing", label: "Ongoing Trips" },
  { id: "scheduled", label: "Scheduled Trips" },
  { id: "completed", label: "Completed Trips" },
  { id: "cancelled", label: "Cancelled Trips" },
];

export const allRides: AllTrips[] = [
  {
    id: "TRIP001",
    type: "premium",
    image: [{ url: "https://example.com/image1.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP002",
    type: "basic",
    image: [{ url: "https://example.com/image2.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "force ended",
  },
  {
    id: "TRIP003",
    type: "free",
    image: [{ url: "https://example.com/image3.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "driver reassigned",
  },
  {
    id: "TRIP004",
    type: "premium",
    image: [{ url: "https://example.com/image4.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP005",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP006",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP007",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
];
export const onGoingRides: AllTrips[] = [
  {
    id: "TRIP001",
    type: "premium",
    image: [{ url: "https://example.com/image1.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP002",
    type: "basic",
    image: [{ url: "https://example.com/image2.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP003",
    type: "free",
    image: [{ url: "https://example.com/image3.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP004",
    type: "premium",
    image: [{ url: "https://example.com/image4.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP005",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP006",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
  {
    id: "TRIP007",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "ongoing",
  },
];
export const scheduledRides: AllTrips[] = [
  {
    id: "TRIP001",
    type: "premium",
    image: [{ url: "https://example.com/image1.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP002",
    type: "basic",
    image: [{ url: "https://example.com/image2.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP003",
    type: "free",
    image: [{ url: "https://example.com/image3.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP004",
    type: "premium",
    image: [{ url: "https://example.com/image4.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP005",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP006",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
  {
    id: "TRIP007",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "scheduled",
  },
];
export const completedRides: AllTrips[] = [
  {
    id: "TRIP001",
    type: "premium",
    image: [{ url: "https://example.com/image1.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP002",
    type: "basic",
    image: [{ url: "https://example.com/image2.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP003",
    type: "free",
    image: [{ url: "https://example.com/image3.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP004",
    type: "premium",
    image: [{ url: "https://example.com/image4.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP005",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP006",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
  {
    id: "TRIP007",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "completed",
  },
];
export const cancelledRides: AllTrips[] = [
  {
    id: "TRIP001",
    type: "premium",
    image: [{ url: "https://example.com/image1.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP002",
    type: "basic",
    image: [{ url: "https://example.com/image2.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP003",
    type: "free",
    image: [{ url: "https://example.com/image3.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP004",
    type: "premium",
    image: [{ url: "https://example.com/image4.jpg" }],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP005",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP006",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
  {
    id: "TRIP007",
    type: "premium",
    image: [],
    user: {
      name: "John Doe",
      email: "john@example.com",
    },
    operator: {
      name: "Savannah Nguyen",
      email: "savannahnguyen@example.com",
      image: [],
    },
    amount: 5000,
    status: "cancelled",
  },
];

export const allLost: AllLost[] = [
  {
    id: "LOST001",
    user: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      image: [{ url: "https://example.com/userimage1.jpg" }],
    },
    item: "Wallet",
    type: "Rider",
    location: "Lekki Phase 1",
    image: [{ url: "https://example.com/lostitem1.jpg" }],
    status: "reported",
    date: "2026-01-15T10:30:00.000Z",
  },
  {
    id: "LOST001",
    user: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      image: [{ url: "https://example.com/userimage1.jpg" }],
    },
    item: "Wallet",
    type: "Rider",
    location: "Lekki Phase 1",
    image: [{ url: "https://example.com/lostitem1.jpg" }],
    status: "claimed",
    date: "2026-01-15T10:30:00.000Z",
  },
];
export const allReported: AllLost[] = [
  {
    id: "LOST001",
    user: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      image: [{ url: "https://example.com/userimage1.jpg" }],
    },
    item: "Wallet",
    type: "Rider",
    location: "Lekki Phase 1",
    image: [{ url: "https://example.com/lostitem1.jpg" }],
    status: "reported",
    date: "2026-01-15T10:30:00.000Z",
  },
];
export const allClaimed: AllLost[] = [
  {
    id: "LOST001",
    user: {
      name: "Jane Smith",
      email: "janesmith@example.com",
      image: [{ url: "https://example.com/userimage1.jpg" }],
    },
    item: "Wallet",
    type: "Rider",
    location: "Lekki Phase 1",
    image: [{ url: "https://example.com/lostitem1.jpg" }],
    status: "claimed",
    date: "2026-01-15T10:30:00.000Z",
  },
];

// Nigerian States
export const NIGERIAN_STATES = [
  "All States",
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Federal Capital Territory",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export const permissionOptions = [
  "All",
  "Index",
  "Create",
  "Read",
  "Update",
  "Delete",
] as const;
