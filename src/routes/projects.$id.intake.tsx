import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { AppTopBar } from "@/components/AppTopBar";
import { intakeRemaining, useStore, type Intake } from "@/lib/store";

export const Route = createFileRoute("/projects/$id/intake")({
  head: () => ({
    meta: [
      { title: "Project intake — Connplex Zoning Studio" },
      { name: "description", content: "Capture property and client details before drafting a cinema zoning layout." },
      { property: "og:title", content: "Project intake — Connplex Zoning Studio" },
      { property: "og:description", content: "Capture property and client details before drafting a cinema zoning layout." },
    ],
  }),
  component: IntakePage,
});

const inputCls =
  "h-8 w-full rounded-sm border border-input bg-background px-2 text-[13px] outline-none focus:border-ring";

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-[12px] text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}

function IntakePage() {
  const { id } = Route.useParams();
  const { getProject, updateProject } = useStore();
  const navigate = useNavigate();
  const project = getProject(id);

  if (!project) return <div className="p-6 text-[13px]">Project not found.</div>;

  const intake = project.intake;
  const set = (key: keyof Intake, value: string) =>
    updateProject(id, {
      intake: { ...intake, [key]: value },
      ...(key === "propertyName" && value ? { name: value } : {}),
      ...(key === "city" ? { city: value } : {}),
      ...(key === "state" ? { state: value } : {}),
    });

  const remaining = intakeRemaining(intake);
  const complete = remaining === 0;

  return (
    <div className="min-h-screen bg-background">
      <AppTopBar title={`${project.name} · ${project.code}`} subtitle="Project intake" />

      <main className="mx-auto max-w-[880px] p-4">
        <section className="rounded-md border border-border bg-card p-4">
          <h2 className="mb-3 text-[13px] font-medium text-foreground">Property details</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <Field label="Property name">
                <input className={inputCls} value={intake.propertyName} onChange={(e) => set("propertyName", e.target.value)} />
              </Field>
            </div>
            <div className="col-span-2">
              <Field label="Google location">
                <input
                  className={inputCls}
                  placeholder="Paste a Google Maps link or address"
                  value={intake.googleLocation}
                  onChange={(e) => set("googleLocation", e.target.value)}
                />
              </Field>
            </div>
            <Field label="City">
              <input className={inputCls} value={intake.city} onChange={(e) => set("city", e.target.value)} />
            </Field>
            <Field label="State">
              <input className={inputCls} value={intake.state} onChange={(e) => set("state", e.target.value)} />
            </Field>
            <Field label="Floor / Shop no.">
              <input className={inputCls} value={intake.floorShopNo} onChange={(e) => set("floorShopNo", e.target.value)} />
            </Field>
            <Field label="Property status">
              <select className={inputCls} value={intake.propertyStatus} onChange={(e) => set("propertyStatus", e.target.value)}>
                <option value="">Select</option>
                {["Under Construction", "Ready", "Shell", "Bare"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Property type">
              <select className={inputCls} value={intake.propertyType} onChange={(e) => set("propertyType", e.target.value)}>
                <option value="">Select</option>
                {["Existing Building", "Bare Shell", "Open Land"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Beam bottom clear height">
              <input
                className={inputCls}
                placeholder={`e.g. 10'-6"`}
                value={intake.beamHeight}
                onChange={(e) => set("beamHeight", e.target.value)}
              />
            </Field>
          </div>
        </section>

        <section className="mt-4 rounded-md border border-border bg-card p-4">
          <h2 className="mb-3 text-[13px] font-medium text-foreground">Client details</h2>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Client name">
              <input className={inputCls} value={intake.clientName} onChange={(e) => set("clientName", e.target.value)} />
            </Field>
            <Field label="Client mobile">
              <input className={inputCls} value={intake.clientMobile} onChange={(e) => set("clientMobile", e.target.value)} />
            </Field>
            <Field label="Client email">
              <input className={inputCls} value={intake.clientEmail} onChange={(e) => set("clientEmail", e.target.value)} />
            </Field>
            <Field label="Property source">
              <select className={inputCls} value={intake.propertySource} onChange={(e) => set("propertySource", e.target.value)}>
                <option value="">Select</option>
                {["Broker", "Direct", "Developer"].map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
          </div>
        </section>

        <div
          className={`mt-4 flex items-center gap-1.5 rounded-sm border border-border px-3 py-2 text-[12px] ${
            complete ? "bg-success text-success-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          {complete ? (
            <>
              <Check className="h-3.5 w-3.5" />
              Intake complete: Yes
            </>
          ) : (
            <>Intake complete: No — {remaining} of 12 fields remaining</>
          )}
        </div>

        <div className="mt-4 flex justify-end">
          <div className="group relative">
            <button
              disabled={!complete}
              onClick={() => {
                updateProject(id, { status: "Ready to zone" });
                navigate({ to: "/projects/$id/floor-setup", params: { id } });
              }}
              className="h-8 rounded-sm bg-primary px-3 text-[13px] font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground"
            >
              Continue to floor setup
            </button>
            {!complete ? (
              <span className="pointer-events-none absolute -top-7 right-0 hidden whitespace-nowrap rounded-sm border border-border bg-popover px-2 py-1 text-[11px] text-popover-foreground group-hover:block">
                Complete all fields first
              </span>
            ) : null}
          </div>
        </div>
      </main>
    </div>
  );
}
