export type DocumentStatus = "Verified" | "Unverified" | "In Progress" | "Expired";

export interface OperatorDocument {
  id: string;
  name: string;
  operatorName: string;
  operatorEmail: string;
  imageUrl?: string;
  expiresAt: string;
  status: DocumentStatus;
}

export const operatorDocuments: OperatorDocument[] = [
  {
    id: "001",
    name: "Vehicle License",
    operatorName: "Courtney Henry",
    operatorEmail: "jessica.hanson@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=8",
    expiresAt: "15 May 2020 8:30 am",
    status: "Verified",
  },
  {
    id: "002",
    name: "Vehicle Insurance",
    operatorName: "Damson Idris",
    operatorEmail: "damson.idris@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=9",
    expiresAt: "15 May 2020 8:00 am",
    status: "Verified",
  },
  {
    id: "003",
    name: "Operators License",
    operatorName: "Theresa Webb",
    operatorEmail: "michael.mitc@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=10",
    expiresAt: "15 May 2020 9:30 am",
    status: "Unverified",
  },
  {
    id: "004",
    name: "Vehicle License",
    operatorName: "Floyd Miles",
    operatorEmail: "debra.holt@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=11",
    expiresAt: "15 May 2020 8:00 am",
    status: "In Progress",
  },
  {
    id: "005",
    name: "Vehicle Insurance",
    operatorName: "Courtney Henry",
    operatorEmail: "jessica.hanson@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=12",
    expiresAt: "10 Jan 2019 8:00 am",
    status: "Expired",
  },
  {
    id: "006",
    name: "Operators License",
    operatorName: "Damson Idris",
    operatorEmail: "damson.idris@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=13",
    expiresAt: "5 Mar 2019 9:00 am",
    status: "Expired",
  },
  {
    id: "007",
    name: "Vehicle License",
    operatorName: "Theresa Webb",
    operatorEmail: "michael.mitc@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=14",
    expiresAt: "20 Dec 2018 10:00 am",
    status: "Expired",
  },
  {
    id: "008",
    name: "Vehicle Insurance",
    operatorName: "Floyd Miles",
    operatorEmail: "debra.holt@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=15",
    expiresAt: "1 Nov 2019 11:00 am",
    status: "Expired",
  },
  {
    id: "009",
    name: "Operators License",
    operatorName: "Courtney Henry",
    operatorEmail: "jessica.hanson@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=16",
    expiresAt: "15 Sep 2019 2:00 pm",
    status: "Expired",
  },
  {
    id: "010",
    name: "Vehicle License",
    operatorName: "Damson Idris",
    operatorEmail: "damson.idris@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=17",
    expiresAt: "8 Aug 2019 3:00 pm",
    status: "Expired",
  },
  {
    id: "011",
    name: "Vehicle Insurance",
    operatorName: "Theresa Webb",
    operatorEmail: "michael.mitc@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=18",
    expiresAt: "22 Jul 2019 4:00 pm",
    status: "Expired",
  },
  {
    id: "012",
    name: "Operators License",
    operatorName: "Floyd Miles",
    operatorEmail: "debra.holt@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=19",
    expiresAt: "30 Jun 2019 5:00 pm",
    status: "Expired",
  },
  {
    id: "013",
    name: "Vehicle License",
    operatorName: "Courtney Henry",
    operatorEmail: "jessica.hanson@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=20",
    expiresAt: "12 May 2019 6:00 pm",
    status: "Expired",
  },
  {
    id: "014",
    name: "Vehicle Insurance",
    operatorName: "Damson Idris",
    operatorEmail: "damson.idris@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=21",
    expiresAt: "25 Apr 2019 7:00 pm",
    status: "Expired",
  },
  {
    id: "015",
    name: "Operators License",
    operatorName: "Theresa Webb",
    operatorEmail: "michael.mitc@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=22",
    expiresAt: "3 Mar 2019 8:00 pm",
    status: "Expired",
  },
  {
    id: "016",
    name: "Vehicle License",
    operatorName: "Floyd Miles",
    operatorEmail: "debra.holt@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=23",
    expiresAt: "14 Feb 2019 9:00 pm",
    status: "Expired",
  },
  {
    id: "017",
    name: "Vehicle Insurance",
    operatorName: "Courtney Henry",
    operatorEmail: "jessica.hanson@example.com",
    imageUrl: "https://i.pravatar.cc/150?img=24",
    expiresAt: "28 Jan 2019 10:00 pm",
    status: "Expired",
  },
  ...Array.from({ length: 14 }, (_, index) => {
    const baseIndex = index + 18;
    const statuses: DocumentStatus[] = ["Verified", "Unverified", "In Progress"];
    const status = statuses[baseIndex % statuses.length];

    return {
      id: String(baseIndex).padStart(3, "0"),
      name: "Vehicle License",
      operatorName: `Operator ${baseIndex}`,
      operatorEmail: `operator${baseIndex}@example.com`,
      imageUrl: `https://i.pravatar.cc/150?img=${(baseIndex % 70) + 1}`,
      expiresAt: "15 May 2020 8:00 am",
      status,
    } as OperatorDocument;
  }),
];

