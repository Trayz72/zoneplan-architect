import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Status = "Intake incomplete" | "Ready to zone" | "Layout drafted" | "Exported";

export type Intake = {
  propertyName: string;
  googleLocation: string;
  city: string;
  state: string;
  floorShopNo: string;
  propertyStatus: string;
  propertyType: string;
  beamHeight: string;
  clientName: string;
  clientMobile: string;
  clientEmail: string;
  propertySource: string;
};

export const INTAKE_FIELDS: (keyof Intake)[] = [
  "propertyName",
  "googleLocation",
  "city",
  "state",
  "floorShopNo",
  "propertyStatus",
  "propertyType",
  "beamHeight",
  "clientName",
  "clientMobile",
  "clientEmail",
  "propertySource",
];

export type Zone = {
  id: string;
  label: string;
  kind: "auditorium" | "foyer" | "washroom" | "generic";
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Project = {
  id: string;
  code: string;
  name: string;
  city: string;
  state: string;
  tier: string;
  status: Status;
  updated: string;
  revision: string;
  netArea: number;
  intake: Intake;
  zones: Zone[];
  drawnBy: string;
  checkedBy: string;
  remarks: string;
};

const emptyIntake = (): Intake => ({
  propertyName: "",
  googleLocation: "",
  city: "",
  state: "",
  floorShopNo: "",
  propertyStatus: "",
  propertyType: "",
  beamHeight: "",
  clientName: "",
  clientMobile: "",
  clientEmail: "",
  propertySource: "",
});

export const defaultZones = (): Zone[] => [
  { id: "z1", label: "Screen 1", kind: "auditorium", x: 60, y: 50, w: 300, h: 220 },
  { id: "z2", label: "Screen 2", kind: "auditorium", x: 400, y: 50, w: 300, h: 220 },
  { id: "z3", label: "Foyer / F&B", kind: "foyer", x: 60, y: 310, w: 430, h: 170 },
  { id: "z4", label: "Washroom", kind: "washroom", x: 530, y: 310, w: 170, h: 170 },
];

export const COLUMNS = [
  { id: "c1", x: 60, y: 50 },
  { id: "c2", x: 700, y: 50 },
  { id: "c3", x: 380, y: 290 },
  { id: "c4", x: 60, y: 480 },
  { id: "c5", x: 700, y: 480 },
];

const seed = (
  id: string,
  code: string,
  name: string,
  city: string,
  state: string,
  tier: string,
  status: Status,
  updated: string,
  intake: Partial<Intake>,
): Project => ({
  id,
  code,
  name,
  city,
  state,
  tier,
  status,
  updated,
  revision: "R0",
  netArea: 15893,
  intake: { ...emptyIntake(), propertyName: name, city, state, ...intake },
  zones: defaultZones(),
  drawnBy: "",
  checkedBy: "",
  remarks: "",
});

const initialProjects: Project[] = [
  seed("1022", "#1022", "Maruti Nandan Business Hub", "Dhule", "Maharashtra", "Signature", "Layout drafted", "12 Aug 2026", {
    googleLocation: "Station Rd, Dhule",
    floorShopNo: "2nd floor, Unit 204",
    propertyStatus: "Ready",
    propertyType: "Existing Building",
    beamHeight: "10'-6\"",
    clientName: "Rakesh Patil",
    clientMobile: "+91 98220 41123",
    clientEmail: "rakesh@nandanhub.in",
    propertySource: "Broker",
  }),
  seed("1045", "#1045", "Keshav Landmark", "Vadodara", "Gujarat", "Luxuriance", "Exported", "05 Aug 2026", {
    googleLocation: "Alkapuri, Vadodara",
    floorShopNo: "3rd floor",
    propertyStatus: "Ready",
    propertyType: "Existing Building",
    beamHeight: "11'-0\"",
    clientName: "Nikhil Shah",
    clientMobile: "+91 99789 22014",
    clientEmail: "nikhil@keshavgroup.com",
    propertySource: "Developer",
  }),
  seed("1067", "#1067", "Silver Arc Mall", "Indore", "Madhya Pradesh", "Express", "Ready to zone", "28 Jul 2026", {
    googleLocation: "AB Road, Indore",
    floorShopNo: "4th floor",
    propertyStatus: "Under Construction",
    propertyType: "Bare Shell",
    beamHeight: "10'-3\"",
    clientName: "Anita Verma",
    clientMobile: "+91 90090 77120",
    clientEmail: "anita@silverarc.in",
    propertySource: "Direct",
  }),
  seed("1078", "#1078", "Horizon Point", "Surat", "Gujarat", "Signature", "Intake incomplete", "22 Jul 2026", {
    googleLocation: "",
    floorShopNo: "",
    propertyStatus: "",
    propertyType: "",
    beamHeight: "",
    clientName: "",
    clientMobile: "",
    clientEmail: "",
    propertySource: "",
  }),
];

type Store = {
  projects: Project[];
  getProject: (id: string) => Project | undefined;
  updateProject: (id: string, patch: Partial<Project>) => void;
  createProject: () => Project;
};

const StoreContext = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);

  const value = useMemo<Store>(
    () => ({
      projects,
      getProject: (id) => projects.find((p) => p.id === id),
      updateProject: (id, patch) =>
        setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...patch } : p))),
      createProject: () => {
        const nextId = String(1080 + projects.length);
        const p = seed(nextId, `#${nextId}`, "Untitled property", "", "", "Express", "Intake incomplete", "Today", {});
        p.intake.propertyName = "";
        setProjects((prev) => [...prev, p]);
        return p;
      },
    }),
    [projects],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}

export function intakeRemaining(intake: Intake) {
  return INTAKE_FIELDS.filter((f) => !intake[f].trim()).length;
}

export function seatsFor(zone: Zone) {
  return Math.max(0, Math.round((zone.w * zone.h) / 860));
}

export function areaFor(zone: Zone) {
  return Math.round((zone.w * zone.h) / 4.4);
}
