import { createFileRoute } from "@tanstack/react-router";
import { ChevronDown, ChevronRight, Download } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AppTopBar } from "@/components/AppTopBar";
import { useStore, type Zone } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/export")({
  head: () => ({
    meta: [
      { title: "Export sheet — Connplex Zoning Studio" },
      { name: "description", content: "Review the zoning drawing sheet, title block and revision history before export." },
      { property: "og:title", content: "Export sheet — Connplex Zoning Studio" },
      { property: "og:description", content: "Review the zoning drawing sheet, title block and revision history before export." },
    ],
  }),
  component: ExportPage,
});

const inputCls =
  "h-8 w-full rounded-sm border border-input bg-background px-2 text-[13px] outline-none focus:border-ring";

const zoneFill: Record<Zone["kind"], string> = {
  auditorium: "var(--zone-auditorium)",
  foyer: "var(--zone-foyer)",
  washroom: "var(--zone-washroom)",
  generic: "var(--zone-generic)",
};

function ExportPage() {
  const { id } = Route.useParams();
  const { getProject, updateProject } = useStore();
  const project = getProject(id);
  const [historyOpen, setHistoryOpen] = useState(false);

  if (!project) return <div className="p-6 text-[13px]">Project not found.</div>;

  const today = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="min-h-screen bg-background">
      <AppTopBar title={`${project.name} · ${project.code} · ${project.revision}`} subtitle="Export / review" />

      <main className="mx-auto max-w-[900px] p-4">
        <div className="rounded-md border border-border bg-card p-4">
          <svg viewBox="0 0 900 620" className="w-full bg-canvas">
            <rect x="8" y="8" width="884" height="604" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
            <g transform="translate(40,30) scale(0.72)">
              <rect x="0" y="0" width="760" height="530" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
              {project.zones.map((z) => (
                <g key={z.id}>
                  <rect x={z.x} y={z.y} width={z.w} height={z.h} fill={zoneFill[z.kind]} stroke="currentColor" strokeWidth="1" className="text-foreground/40" />
                  <text x={z.x + z.w / 2} y={z.y + z.h / 2} textAnchor="middle" fontSize="16" fill="currentColor" className="text-foreground">
                    {z.label}
                  </text>
                </g>
              ))}
            </g>
            <g transform="translate(560,430)">
              <rect x="0" y="0" width="324" height="174" fill="none" stroke="currentColor" strokeWidth="1" className="text-foreground" />
              {[
                ["Project code", project.code],
                ["Property name", project.name],
                ["City/State", project.city ? `${project.city}, ${project.state}` : "—"],
                ["Client name", project.intake.clientName || "—"],
                ["Net usage area", `${project.netArea.toLocaleString()} sq ft`],
                ["Scale", "1:100 @ A1"],
                ["Drawn by", project.drawnBy || "—"],
                ["Checked by", project.checkedBy || "—"],
                ["Date", today],
              ].map(([k, v], i) => (
                <g key={k} transform={`translate(8, ${16 + i * 16})`}>
                  <text fontSize="10" fill="currentColor" className="text-muted-foreground">{k}</text>
                  <text x="316" textAnchor="end" fontSize="10" fill="currentColor" className="text-foreground">{v}</text>
                </g>
              ))}
              <text x="162" y="166" textAnchor="middle" fontSize="10" fill="currentColor" className="text-muted-foreground">
                Connplex Cinemas Limited
              </text>
            </g>
          </svg>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-[12px] text-muted-foreground">Drawn by</span>
            <input className={inputCls} value={project.drawnBy} onChange={(e) => updateProject(id, { drawnBy: e.target.value })} />
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] text-muted-foreground">Checked by</span>
            <input className={inputCls} value={project.checkedBy} onChange={(e) => updateProject(id, { checkedBy: e.target.value })} />
          </label>
        </div>
        <label className="mt-3 block">
          <span className="mb-1 block text-[12px] text-muted-foreground">Remarks</span>
          <textarea
            rows={3}
            className="w-full rounded-sm border border-input bg-background px-2 py-1.5 text-[13px] outline-none focus:border-ring"
            value={project.remarks}
            onChange={(e) => updateProject(id, { remarks: e.target.value })}
          />
        </label>

        <div className="mt-3 flex gap-2">
          {["Download PDF", "Download DWG"].map((label) => (
            <button
              key={label}
              onClick={() => {
                updateProject(id, { status: "Exported" });
                toast("Export simulated — this is a prototype");
              }}
              className="inline-flex h-8 items-center gap-1.5 rounded-sm border border-border px-3 text-[13px] transition-colors hover:bg-accent"
            >
              <Download className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>

        <div className="mt-4 rounded-md border border-border bg-card">
          <button
            onClick={() => setHistoryOpen((v) => !v)}
            className="flex w-full items-center gap-1.5 px-3 py-2 text-left text-[13px] text-foreground"
          >
            {historyOpen ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
            Revision history
          </button>
          {historyOpen ? (
            <div className="border-t border-border px-3 py-2 text-[12px] text-muted-foreground">
              R0 · {today} · Initial draft
            </div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
