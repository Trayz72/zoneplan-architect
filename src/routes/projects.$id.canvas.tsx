import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  AlertTriangle,
  Armchair,
  Check,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Download,
  DoorOpen,
  Droplets,
  Film,
  RefreshCw,
  ShieldCheck,
  Ticket,
  Wrench,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { AppTopBar } from "@/components/AppTopBar";
import { COLUMNS, areaFor, defaultZones, seatsFor, useStore, type Zone } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/canvas")({
  head: () => ({
    meta: [
      { title: "Zoning canvas — Connplex Zoning Studio" },
      { name: "description", content: "Drag, resize and validate cinema zones on the floor plan with live seat and area counts." },
      { property: "og:title", content: "Zoning canvas — Connplex Zoning Studio" },
      { property: "og:description", content: "Drag, resize and validate cinema zones on the floor plan with live seat and area counts." },
    ],
  }),
  component: CanvasPage,
});

const CANVAS_W = 760;
const CANVAS_H = 530;

const zoneFill: Record<Zone["kind"], string> = {
  auditorium: "bg-zone-auditorium",
  foyer: "bg-zone-foyer",
  washroom: "bg-zone-washroom",
  generic: "bg-zone-generic",
};

const zoneItems = [
  { label: "Auditorium", Icon: Film },
  { label: "Foyer", Icon: DoorOpen },
  { label: "F&B", Icon: Coffee },
  { label: "Washroom", Icon: Droplets },
  { label: "Box office", Icon: Ticket },
  { label: "Back-of-house", Icon: Wrench },
];

const seatItems = [
  "Slider sofa",
  "Front lounger",
  "Duo lounger",
  "Recliner",
  "Premium recliner",
  "Duo recliner",
];

const rules = [
  { name: "Minimum clear height", measured: `10'-6" measured`, required: `10'-0" minimum`, pass: true },
  { name: "Column grid width", measured: "21' measured", required: "20' minimum", pass: true },
  { name: "Column grid length", measured: "28' measured", required: "30' minimum", pass: false },
  { name: "Seats per screen", measured: "77 measured", required: "55 minimum", pass: true },
  { name: "Minimum carpet area", measured: "15,893 sqft measured", required: "6,000 sqft minimum", pass: true },
];

function overlapsColumn(z: Zone) {
  return COLUMNS.some((c) => c.x >= z.x && c.x <= z.x + z.w && c.y >= z.y && c.y <= z.y + z.h);
}

function CanvasPage() {
  const { id } = Route.useParams();
  const { getProject, updateProject } = useStore();
  const navigate = useNavigate();
  const project = getProject(id);
  const [leftOpen, setLeftOpen] = useState(true);
  const [rightOpen, setRightOpen] = useState(true);
  const [feasOpen, setFeasOpen] = useState(false);
  const dragRef = useRef<{ id: string; mode: "move" | "resize"; ox: number; oy: number; zone: Zone } | null>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);

  if (!project) return <div className="p-6 text-[13px]">Project not found.</div>;
  const zones = project.zones;

  const onPointerDown = (e: React.PointerEvent, zone: Zone, mode: "move" | "resize") => {
    e.preventDefault();
    e.stopPropagation();
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    dragRef.current = { id: zone.id, mode, ox: e.clientX, oy: e.clientY, zone };
  };

  const onPointerMove = (e: React.PointerEvent) => {
    const d = dragRef.current;
    if (!d) return;
    const dx = e.clientX - d.ox;
    const dy = e.clientY - d.oy;
    const next = zones.map((z) => {
      if (z.id !== d.id) return z;
      if (d.mode === "move") {
        return {
          ...z,
          x: Math.min(Math.max(0, d.zone.x + dx), CANVAS_W - z.w),
          y: Math.min(Math.max(0, d.zone.y + dy), CANVAS_H - z.h),
        };
      }
      return {
        ...z,
        w: Math.min(Math.max(80, d.zone.w + dx), CANVAS_W - z.x),
        h: Math.min(Math.max(60, d.zone.h + dy), CANVAS_H - z.y),
      };
    });
    updateProject(id, { zones: next });
  };

  const endDrag = () => {
    dragRef.current = null;
  };

  const totalSeats = zones.filter((z) => z.kind === "auditorium").reduce((s, z) => s + seatsFor(z), 0);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopBar
        title={`${project.name} · ${project.code} · ${project.revision}`}
        right={
          <>
            <button
              onClick={() => updateProject(id, { zones: defaultZones() })}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border px-2.5 text-[13px] transition-colors hover:bg-accent"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Regenerate
            </button>
            <button
              onClick={() => setFeasOpen(true)}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border px-2.5 text-[13px] transition-colors hover:bg-accent"
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              Feasibility
            </button>
            <button
              onClick={() => navigate({ to: "/projects/$id/export", params: { id } })}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm bg-primary px-2.5 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <Download className="h-3.5 w-3.5" />
              Export
            </button>
          </>
        }
      />

      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside
          className={`flex shrink-0 flex-col border-r border-border bg-sidebar ${leftOpen ? "w-[180px]" : "w-8"}`}
        >
          <button
            onClick={() => setLeftOpen((v) => !v)}
            className="flex h-7 items-center justify-end border-b border-border px-1.5 text-muted-foreground hover:text-foreground"
          >
            {leftOpen ? <ChevronLeft className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </button>
          {leftOpen ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <p className="px-1 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">Zones</p>
              {zoneItems.map(({ label, Icon }) => (
                <div
                  key={label}
                  draggable
                  className="flex cursor-grab items-center gap-2 rounded-sm px-1.5 py-1.5 text-[13px] hover:bg-accent"
                >
                  <Icon className="h-3.5 w-3.5 text-muted-foreground" />
                  {label}
                </div>
              ))}
              <p className="mt-3 px-1 py-1 text-[11px] uppercase tracking-wide text-muted-foreground">Seats</p>
              {seatItems.map((label) => (
                <div
                  key={label}
                  draggable
                  className="flex cursor-grab items-center gap-2 rounded-sm px-1.5 py-1.5 text-[13px] hover:bg-accent"
                >
                  <Armchair className="h-3.5 w-3.5 text-muted-foreground" />
                  {label}
                </div>
              ))}
            </div>
          ) : null}
        </aside>

        {/* Canvas */}
        <main className="min-w-0 flex-1 overflow-auto bg-canvas p-4">
          <div
            ref={surfaceRef}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerLeave={endDrag}
            className="relative border border-foreground/40 bg-card"
            style={{ width: CANVAS_W, height: CANVAS_H }}
          >
            {COLUMNS.map((c) => (
              <span
                key={c.id}
                className="absolute z-10 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground"
                style={{ left: c.x, top: c.y }}
              />
            ))}
            {zones.map((z) => {
              const bad = overlapsColumn(z);
              return (
                <div
                  key={z.id}
                  onPointerDown={(e) => onPointerDown(e, z, "move")}
                  className={`absolute cursor-move border border-foreground/30 ${zoneFill[z.kind]}`}
                  style={{ left: z.x, top: z.y, width: z.w, height: z.h }}
                >
                  <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-[12px] font-medium text-foreground">
                    {z.label}
                  </span>
                  {bad ? (
                    <span className="pointer-events-none absolute -top-5 left-0 inline-flex items-center gap-1 rounded-sm bg-destructive px-1.5 py-0.5 text-[10px] text-destructive-foreground">
                      <AlertTriangle className="h-3 w-3" />
                      overlaps column
                    </span>
                  ) : null}
                  <span
                    onPointerDown={(e) => onPointerDown(e, z, "resize")}
                    className="absolute -bottom-1 -right-1 h-3 w-3 cursor-se-resize border border-foreground/40 bg-card"
                  />
                </div>
              );
            })}
          </div>
        </main>

        {/* Right panel */}
        <aside
          className={`flex shrink-0 flex-col border-l border-border bg-sidebar ${rightOpen ? "w-[220px]" : "w-8"}`}
        >
          <button
            onClick={() => setRightOpen((v) => !v)}
            className="flex h-7 items-center border-b border-border px-1.5 text-muted-foreground hover:text-foreground"
          >
            {rightOpen ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
          </button>
          {rightOpen ? (
            <div className="min-h-0 flex-1 overflow-y-auto p-2">
              <p className="px-1 pb-2 text-[12px] font-medium text-foreground">Area &amp; seat chart</p>
              <div className="space-y-1.5">
                {zones.map((z) => (
                  <div key={z.id} className="rounded-sm border border-border bg-card px-2 py-1.5">
                    <div className="text-[12px] text-muted-foreground">{z.label}</div>
                    <div className="text-[13px] font-medium text-foreground">
                      {z.kind === "auditorium"
                        ? `${seatsFor(z)} seats`
                        : `${areaFor(z).toLocaleString()} sq ft`}
                    </div>
                  </div>
                ))}
              </div>
              <div className="my-3 border-t border-border" />
              <div className="rounded-sm border border-border bg-card px-2 py-2">
                <div className="text-[12px] text-muted-foreground">Total seats</div>
                <div className="text-[22px] font-semibold leading-tight text-foreground">{totalSeats}</div>
              </div>
            </div>
          ) : null}
        </aside>
      </div>

      {/* Feasibility drawer */}
      {feasOpen ? (
        <div className="fixed inset-0 z-50 flex justify-end bg-foreground/20" onClick={() => setFeasOpen(false)}>
          <div
            className="h-full w-[360px] border-l border-border bg-card p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center">
              <h2 className="text-[13px] font-medium text-foreground">Feasibility check</h2>
              <button
                onClick={() => setFeasOpen(false)}
                className="ml-auto rounded-sm p-1 text-muted-foreground hover:bg-accent hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-3 divide-y divide-border border-y border-border">
              {rules.map((r) => (
                <div key={r.name} className="flex items-start gap-2 py-2.5">
                  {r.pass ? (
                    <Check className="mt-0.5 h-4 w-4 text-success-foreground" />
                  ) : (
                    <X className="mt-0.5 h-4 w-4 text-destructive" />
                  )}
                  <div>
                    <div className="text-[13px] text-foreground">{r.name}</div>
                    <div className="text-[12px] text-muted-foreground">
                      {r.measured}, {r.required}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
