import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useStore, type Status } from "@/lib/store";

export const Route = createFileRoute("/projects/")({
  head: () => ({
    meta: [
      { title: "Projects — Connplex Zoning Studio" },
      { name: "description", content: "All cinema zoning projects with intake status, franchise tier and revision state." },
      { property: "og:title", content: "Projects — Connplex Zoning Studio" },
      { property: "og:description", content: "All cinema zoning projects with intake status, franchise tier and revision state." },
    ],
  }),
  component: ProjectsPage,
});

const statusClass: Record<Status, string> = {
  "Intake incomplete": "bg-muted text-muted-foreground",
  "Ready to zone": "bg-warning text-warning-foreground",
  "Layout drafted": "bg-info text-info-foreground",
  Exported: "bg-success text-success-foreground",
};

function ProjectsPage() {
  const { projects, createProject } = useStore();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="flex h-12 items-center border-b border-border bg-card px-3">
        <span className="text-[13px] font-semibold text-foreground">Connplex Zoning Studio</span>
        <button
          onClick={() => {
            const p = createProject();
            navigate({ to: "/projects/$id/intake", params: { id: p.id } });
          }}
          className="ml-auto inline-flex h-8 items-center gap-1.5 rounded-sm bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          <Plus className="h-3.5 w-3.5" />
          New project
        </button>
      </header>

      <main className="p-4">
        <h1 className="mb-3 text-[13px] font-medium text-foreground">Projects</h1>
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border bg-muted/60 text-left text-[11px] uppercase tracking-wide text-muted-foreground">
                <th className="px-3 py-2 font-medium">Project code</th>
                <th className="px-3 py-2 font-medium">Property name</th>
                <th className="px-3 py-2 font-medium">City/State</th>
                <th className="px-3 py-2 font-medium">Franchise tier</th>
                <th className="px-3 py-2 font-medium">Status</th>
                <th className="px-3 py-2 font-medium">Last updated</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p.id}
                  onClick={() =>
                    navigate({
                      to: p.status === "Intake incomplete" ? "/projects/$id/intake" : "/projects/$id/canvas",
                      params: { id: p.id },
                    })
                  }
                  className="cursor-pointer border-b border-border last:border-b-0 hover:bg-accent/60"
                >
                  <td className="px-3 py-2 font-mono text-[12px] text-muted-foreground">{p.code}</td>
                  <td className="px-3 py-2 text-foreground">{p.name}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {p.city ? `${p.city}, ${p.state}` : "—"}
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.tier}</td>
                  <td className="px-3 py-2">
                    <span className={`inline-flex rounded-sm px-1.5 py-0.5 text-[11px] ${statusClass[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-muted-foreground">{p.updated}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
