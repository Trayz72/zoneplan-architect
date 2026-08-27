import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Download, FileText } from "lucide-react";
import { useState } from "react";
import { AppTopBar } from "@/components/AppTopBar";
import { areaFor, COLUMNS, seatsFor, useStore, type Zone } from "@/lib/store";
import { toast } from "sonner";

export const Route = createFileRoute("/projects/$id/export")({
  head: () => ({
    meta: [
      { title: "Export / review — Connplex Zoning Studio" },
      { name: "description", content: "Review the generated cinema zoning drawing sheet and export to PDF or DWG." },
      { property: "og:title", content: "Export / review — Connplex Zoning Studio" },
      { property: "og:description", content: "Review the generated cinema zoning drawing sheet and export to PDF or DWG." },
    ],
  }),
  component: ExportPage,
});

const SHEET_W = 640;
const SHEET_H = 420;
const SCALE = 0.6;

const zoneFill: Record<Zone["kind"], string> = {
  auditorium: "bg-zone-auditorium",
  foyer: "bg-zone-foyer",
  washroom: "bg-zone-washroom",
  generic: "bg-zone-generic",
};

function formatDate() {
  const d = new Date();
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function ExportPage() {
  const { id } = Route.useParams();
  const { getProject, updateProject } = useStore();
  const project = getProject(id);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!project) return <div className="p-6 text-[13px]">Project not found.</div>;

  const zones = project.zones;
  const totalSeats = zones.filter((z) => z.kind === "auditorium").reduce((s, z) => s + seatsFor(z), 0);

  const onExport = (type: "PDF" | "DWG") => {
    toast(`${type} export simulated — this is a prototype`);
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <AppTopBar title={`Export / review — ${project.name}`} subtitle={`${project.code} · ${project.revision}`} />

      <main className="min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-4xl space-y-4">
          {/* Drawing sheet preview */}
          <div className="rounded-sm border border-border bg-card p-4">
            <div
              className="relative mx-auto border-2 border-foreground bg-white"
              style={{ width: SHEET_W, height: SHEET_H }}
            >
              {/* Floor plan */}
              <div
                className="absolute left-4 top-4 border border-foreground/40 bg-canvas"
                style={{ width: SHEET_W - 180, height: SHEET_H - 60 }}
              >
                {zones.map((z) => (
                  <div
                    key={z.id}
                    className={`absolute border border-foreground/30 ${zoneFill[z.kind]}`}
                    style={{ left: z.x * SCALE, top: z.y * SCALE, width: z.w * SCALE, height: z.h * SCALE }}
                  >
                    <span className="absolute inset-0 flex items-center justify-center text-[9px] font-medium text-foreground">
                      {z.label}
                    </span>
                  </div>
                ))}
                {COLUMNS.map((c) => (
                  <span
                    key={c.id}
                    className="absolute h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted-foreground"
                    style={{ left: c.x * SCALE, top: c.y * SCALE }}
                  />
                ))}
              </div>

              {/* Title block */}
              <div className="absolute bottom-4 right-4 w-[160px] border border-foreground bg-card text-[10px]">
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Project code</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.code}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Property</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.name}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">City / state</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.city}, {project.state}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Client</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.intake.clientName || "—"}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Net usage area</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.netArea.toLocaleString()} sq ft</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Scale</div>
                  <div className="p-1 text-right font-medium text-foreground">1:100</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Drawn by</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.drawnBy || "—"}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto] border-b border-foreground/30">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Checked by</div>
                  <div className="p-1 text-right font-medium text-foreground">{project.checkedBy || "—"}</div>
                </div>
                <div className="grid grid-cols-[1fr_auto]">
                  <div className="border-r border-foreground/30 p-1 text-muted-foreground">Date</div>
                  <div className="p-1 text-right font-medium text-foreground">{formatDate()}</div>
                </div>
              </div>

              {/* Footer */}
              <div className="absolute bottom-1 left-4 text-[9px] text-muted-foreground">Connplex Cinemas Limited</div>
            </div>
          </div>

          {/* Inputs */}
          <div className="grid grid-cols-1 gap-3 rounded-sm border border-border bg-card p-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-[12px] text-muted-foreground">Drawn by</label>
              <input
                type="text"
                value={project.drawnBy}
                onChange={(e) => updateProject(id, { drawnBy: e.target.value })}
                className="w-full rounded-sm border border-input bg-background px-2 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1 block text-[12px] text-muted-foreground">Checked by</label>
              <input
                type="text"
                value={project.checkedBy}
                onChange={(e) => updateProject(id, { checkedBy: e.target.value })}
                className="w-full rounded-sm border border-input bg-background px-2 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-1 block text-[12px] text-muted-foreground">Remarks</label>
              <textarea
                rows={3}
                value={project.remarks}
                onChange={(e) => updateProject(id, { remarks: e.target.value })}
                className="w-full resize-none rounded-sm border border-input bg-background px-2 py-1.5 text-[13px] outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onExport("PDF")}
              className="inline-flex h-9 items-center gap-1.5 rounded-sm bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              <FileText className="h-4 w-4" />
              Download PDF
            </button>
            <button
              onClick={() => onExport("DWG")}
              className="inline-flex h-9 items-center gap-1.5 rounded-sm border border-border bg-card px-3 text-[13px] font-medium text-foreground transition-colors hover:bg-accent"
            >
              <Download className="h-4 w-4" />
              Download DWG
            </button>
          </div>

          {/* Revision history */}
          <div className="rounded-sm border border-border bg-card">
            <button
              onClick={() => setHistoryOpen((v) => !v)}
              className="flex w-full items-center justify-between px-3 py-2 text-[13px] font-medium text-foreground hover:bg-accent"
            >
              <span>Revision history</span>
              {historyOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
            {historyOpen ? (
              <div className="border-t border-border px-3 py-2">
                <div className="flex items-center justify-between text-[13px]">
                  <span className="font-medium text-foreground">R0</span>
                  <span className="text-muted-foreground">{formatDate()}</span>
                </div>
                <p className="text-[12px] text-muted-foreground">Initial draft</p>
              </div>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
