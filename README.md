# Connplex Layout Studio

Build a web app called "Connplex Zoning Studio" — a CAD-like tool for architects

to lay out cinema floor plans. This is a frontend-only prototype: use local

React state (no real backend, no real auth, no real database) to simulate

everything. Use mock data so every screen looks fully populated and real,

not empty placeholders.

OVERALL STYLE:

Clean, professional, CAD/drafting-tool feel — think Figma or AutoCAD's UI,

not a consumer app. Neutral grays and whites, one accent color (blue) used

sparingly for primary actions only. Compact information density, minimal

whitespace waste, small readable fonts (13-14px for UI chrome, not oversized).

Use a sans-serif font throughout. No gradients, no drop shadows except subtle

card borders. Sentence case for all labels and buttons, never Title Case or

ALL CAPS.

======================================================================

SCREEN 1: Login (route: /login)

======================================================================

Simple centered card: email input, password input, "Log in" button. No real

auth — clicking "Log in" with anything in both fields just navigates to

/projects. Nothing fancy here.

======================================================================

SCREEN 2: Project dashboard (route: /projects)

======================================================================

- Top bar: "Connplex Zoning Studio" logo/text on left, "+ New project"

  button on right (primary blue button).

- Main area: a table with columns: Project code, Property name, City/State,

  Franchise tier, Status (badge), Last updated.

- Status badge values and colors: "Intake incomplete" (gray), "Ready to

  zone" (amber), "Layout drafted" (blue), "Exported" (green).

- Populate with 4 mock rows using this realistic data:

  1. #1022 | Maruti Nandan Business Hub | Dhule, Maharashtra | Signature | Layout drafted

  2. #1045 | Keshav Landmark | Vadodara, Gujarat | Luxuriance | Exported

  3. #1067 | Silver Arc Mall | Indore, Madhya Pradesh | Express | Ready to zone

  4. #1078 | Horizon Point | Surat, Gujarat | Signature | Intake incomplete

- Clicking a row with "Intake incomplete" status goes to Screen 3 for that

  project. Clicking any other row goes straight to Screen 5 (the canvas)

  for that project.

- Clicking "+ New project" creates a new mock project and goes to Screen 3.

======================================================================

SCREEN 3: Project intake form (route: /projects/:id/intake)

======================================================================

A form in two visually separated sections on one page:

Section "Property details":

- Property name (text)

- Google location (text, placeholder "Paste a Google Maps link or address")

- City (text), State (text) — side by side

- Floor / Shop no. (text)

- Property status (dropdown: Under Construction, Ready, Shell, Bare)

- Property type (dropdown: Existing Building, Bare Shell, Open Land)

- Beam bottom clear height (text, placeholder "e.g. 10'-6\"")

Section "Client details":

- Client name (text)

- Client mobile (text)

- Client email (text)

- Property source (dropdown: Broker, Direct, Developer)

Below both sections, a status strip that updates live as fields are filled:

"Intake complete: No — 4 of 12 fields remaining" in gray, turning to

"Intake complete: Yes" in green with a checkmark icon when all 12 fields

have values.

A "Continue to floor setup" button at the bottom, disabled (grayed out,

with a tooltip "Complete all fields first" on hover) until intake is

complete. When enabled and clicked, navigate to Screen 4.

======================================================================

SCREEN 4: Floor setup (route: /projects/:id/floor-setup)

======================================================================

- A large dashed-border drag-and-drop upload zone in the center, text

  "Drop your DWG file here or click to browse". Since there's no real

  backend, clicking it or dropping any file should simulate an upload:

  show a brief loading spinner (1-2 seconds), then reveal a simple SVG

  preview below showing a rectangular floor boundary outline with a

  computed area label like "Net usage area: 15,893 sq ft" underneath it.

- Below the preview, two dropdowns side by side:

  - "Franchise tier": Express, Signature, Luxuriance

  - "Property type": Existing Building, Bare Shell, Open Land (pre-filled

    from whatever was chosen in the intake form)

- A button "Generate zoning layout" (primary blue) at the bottom, which

  navigates to Screen 5.

======================================================================

SCREEN 5: Zoning canvas (route: /projects/:id/canvas) — THE MOST IMPORTANT SCREEN

======================================================================

Three-column layout, full height below a top bar:

TOP BAR:

- Left: project name + code + current revision, e.g. "Maruti Nandan

  Business Hub · #1022 · R0"

- Right: three buttons — "Regenerate" (with a refresh icon), "Feasibility"

  (with a shield-check icon), "Export" (with a download icon)

LEFT PANEL (fixed width ~180px, collapsible with a small arrow toggle):

- Section "Zones" — a vertical list of draggable items, each with an icon

  and label: Auditorium, Foyer, F&B, Washroom, Box office, Back-of-house

- Section "Seats" — a vertical list: Slider sofa, Front lounger, Duo

  lounger, Recliner, Premium recliner, Duo recliner

CENTER CANVAS (fills remaining space):

- Render an SVG or HTML canvas showing a floor boundary rectangle, and

  inside it, 4 colored rectangular zones representing: Screen 1, Screen 2,

  Foyer/F&B, Washroom — positioned like a real floor plan (two auditoriums

  side by side on top, foyer and washroom below them). Use distinct pale

  colors per zone type with a small label centered in each.

- Make these zones draggable and resizable within the canvas bounds (basic

  drag-and-drop repositioning is enough — doesn't need to be pixel-perfect

  CAD precision for this prototype).

- Show 4-5 small gray dots at plausible column positions (near corners and

  center) representing structural columns — these are NOT draggable.

- If a zone is dragged to overlap a column dot, show a small red warning

  label near that zone saying "overlaps column" with a warning triangle

  icon, appearing/disappearing live as the user drags.

RIGHT PANEL (fixed width ~220px, collapsible with a small arrow toggle):

- Header: "Area & seat chart"

- A vertical stack of small stat cards, one per zone currently on the

  canvas, each showing the zone name and either its seat count (for

  auditoriums, e.g. "77 seats") or its area (for other zones, e.g.

  "2,145 sq ft"). These numbers should update live as zones are

  resized/moved (approximate calculation based on rectangle size is fine).

- Below the individual cards, a divider, then a "Total seats" stat card

  with a larger bold number summing all auditorium seat counts.

======================================================================

SCREEN 6 (modal/drawer, not a separate page): Feasibility check

======================================================================

Triggered by clicking "Feasibility" in the canvas top bar — slides in from

the right as a drawer/panel (do not navigate away from the canvas).

Contents: a vertical list of rule checks, each row showing:

- Rule name (e.g. "Minimum clear height", "Column grid spacing", "Seats

  per screen", "Minimum carpet area")

- The measured value vs. the required threshold (e.g. "10'-6\" measured,

  10'-0\" minimum")

- A green check icon or red X icon per row

Use this mock data (make most pass, one fail, to show both states):

- Clear height: 10'-6" vs 10'-0" min — PASS

- Column grid width: 21' vs 20' min — PASS

- Column grid length: 28' vs 30' min — FAIL

- Seats per screen: 77 vs 55 min — PASS

- Carpet area: 15,893 sqft vs 6,000 min — PASS

A close button (X) at the top of the drawer.

======================================================================

SCREEN 7: Export / review (route: /projects/:id/export)

======================================================================

Triggered by clicking "Export" in the canvas top bar.

- Large centered preview area showing a simplified mock drawing sheet:

  a bordered rectangle containing the floor plan (reuse the same zone

  layout from the canvas, smaller/simplified), with a title block in the

  bottom right corner showing: Project code, Property name, City/State,

  Client name, Net usage area, Scale, Drawn by, Checked by, Date, and

  "Connplex Cinemas Limited" as a footer line.

- Below the preview: two text inputs "Drawn by" and "Checked by", and a

  "Remarks" textarea.

- Two buttons: "Download PDF" and "Download DWG" (these can just show a

  toast/notification saying "Export simulated — this is a prototype" since

  there's no real file generation yet).

- Below that, a small collapsed list "Revision history" showing mock past

  revisions: R0 (today's date, "Initial draft").

======================================================================

NAVIGATION

======================================================================

Use React Router. All screens should be reachable via the flows described

above (dashboard → intake → floor setup → canvas → feasibility drawer /

export page). Add a persistent small "back to dashboard" link/icon in the

top bar on every screen except login and the dashboard itself.

======================================================================

DATA

======================================================================

Store all mock data in React state (Context or a simple store), not

hardcoded per-component, so the same project's data stays consistent as

you navigate between its screens during this prototype session. It does

not need to persist after a page refresh — that's fine for now.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/09265d48-450c-478f-a9f1-1af8397ba3d3).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
