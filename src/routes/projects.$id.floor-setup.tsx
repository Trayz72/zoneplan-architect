import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Loader2, UploadCloud } from "lucide-react";
import { useRef, useState } from "react";
import { AppTopBar } from "@/components/AppTopBar";
import { useStore } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/floor-setup")({
  head: () => ({
    meta: [
      { title: "Floor setup — Connplex Zoning Studio" },
      { name: "description", content: "Upload a DWG floor plan and set franchise tier before generating a zoning layout." },
      { property: "og:title", content: "Floor setup — Connplex Zoning Studio" },
      { property: "og:description", content: "Upload a DWG floor plan and set franchise tier before generating a zoning layout." },
    ],
  }),
  component: FloorSetupPage,
});

const inputCls =
  "h-8 w-full rounded-sm border border-input bg-background px-2 text-[13px] outline-none focus:border-ring";

function FloorSetupPage() {
  const { id } = Route.useParams();
  const { getProject, updateProject } = useStore();
  const navigate = useNavigate();
  const project = getProject(id);
  const fileRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  if (!project) return <div className="p-6 text-[13px]">Project not found.</div>;

  const simulateUpload = () => {
    if (loading) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setUploaded(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppTopBar title={`${project.name} · ${project.code}`} subtitle="Floor setup" />

      <main className="mx-auto max-w-[720px] p-4">
        <input ref={fileRef} type="file" className="hidden" onChange={simulateUpload} />
        <div
          onClick={() => (uploaded ? undefined : fileRef.current?.click())}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            simulateUpload();
          }}
          className="flex h-40 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed border-border bg-card text-[13px] text-muted-foreground transition-colors hover:border-ring"
        >
          {loading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin text-primary" />
              Reading DWG geometry…
            </>
          ) : uploaded ? (
            <>
              <UploadCloud className="h-5 w-5 text-success-foreground" />
              ground-floor-plan.dwg uploaded
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              Drop your DWG file here or click to browse
            </>
          )}
        </div>

        {uploaded ? (
          <div className="mt-4 rounded-md border border-border bg-card p-4">
            <svg viewBox="0 0 640 320" className="h-56 w-full bg-canvas">
              <rect x="20" y="20" width="600" height="280" fill="none" stroke="currentColor" strokeWidth="2" className="text-foreground" />
              <rect x="40" y="40" width="560" height="240" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="6 4" className="text-muted-foreground" />
            </svg>
            <p className="mt-2 text-center text-[12px] text-muted-foreground">
              Net usage area: {project.netArea.toLocaleString()} sq ft
            </p>
          </div>
        ) : null}

        <div className="mt-4 grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-[12px] text-muted-foreground">Franchise tier</span>
            <select className={inputCls} value={project.tier} onChange={(e) => updateProject(id, { tier: e.target.value })}>
              {["Express", "Signature", "Luxuriance"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[12px] text-muted-foreground">Property type</span>
            <select
              className={inputCls}
              value={project.intake.propertyType || "Existing Building"}
              onChange={(e) => updateProject(id, { intake: { ...project.intake, propertyType: e.target.value } })}
            >
              {["Existing Building", "Bare Shell", "Open Land"].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              updateProject(id, { status: "Layout drafted" });
              navigate({ to: "/projects/$id/canvas", params: { id } });
            }}
            className="h-8 rounded-sm bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Generate zoning layout
          </button>
        </div>
      </main>
    </div>
  );
}
