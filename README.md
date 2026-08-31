# NETDES — Network Engineering Study Console

An offline-capable study workspace for switching, routing, redundancy, addressing, and network services.

**[Live console](https://zann208.github.io/netdes/)** · **[Lab source audit](docs/LAB-SOURCE-AUDIT.md)**

The app is intentionally lightweight: the console is a single `index.html` page with no framework or build step. It uses the shared Study Console shell for consistent navigation while keeping NETDES content independent.

## What is inside

| Section | Purpose |
|---|---|
| **Blueprint** | Connects the switching and routing concepts as one system |
| **Flow** | Shows the prepare → configure → verify → troubleshoot workflow |
| **Topics** | Sixteen technical explanations with IOS commands and failure modes |
| **Labs** | LAB 01 through LAB 13 with original numbering and source-matched details |
| **Drills** | 151 flashcards, 87 practice questions, and generated exercises |
| **Practice** | Timed review, weak-point tracking, and an STP port-role solver |
| **Cheatsheet / Terms** | Compact reference tables and terminology |

The IPv4 subnetting Review is intentionally unnumbered and does not affect the 13-lab progress count.

## Authoritative lab set

The current workbench includes:

- LAB 01 — Basic Switch
- LAB 02 — VLAN and 802.1Q Tag Inspection
- LAB 03 — VTP
- LAB 04 — EtherChannel with LACP
- LAB 05 — Inter-VLAN Routing
- LAB 06 — Private VLAN
- LAB 07 — Determine Spanning Tree
- LAB 08 — Verifying Spanning Tree
- LAB 09 — Configuring Spanning Tree
- LAB 10 — STP with Topology Changes
- LAB 11 — Configuring Rapid Spanning Tree
- LAB 12 — Configuring Multiple Spanning Tree
- LAB 13 — DHCP

Each lab now opens as a structured workbench:

- A short **What you will practice** checklist
- A responsive, figure-matched topology redraw with device, interface, VLAN/region, and link labels
- The existing addressing/VLAN plan and platform notes
- Focused configuration phases with per-phase completion markers
- Clearly separated commands, verification evidence, expected results, and troubleshooting
- A **Practice** mode that hides hints, solution commands, and expected results until you choose to reveal them

The diagrams are responsive redraws of the supplied lab figures. They preserve the figure layout and networking relationships while using NETDES styling; they are not creative rearrangements of an equivalent network. The original tables and command sequences remain the detailed source inside each lab.

## Implementation

- Vanilla HTML, CSS, and JavaScript
- Shared Study Console shell plus NETDES adapter and lab-workbench stylesheets
- Inline SVG and Canvas 2D visualizations
- `localStorage` for lab, phase, and preference progress
- GitHub Pages deployment from `main`

## Validate

Run the repository validator before publishing:

```bash
node scripts/validate.mjs
```

The validator checks the shared shell contract, HTML IDs and navigation targets, JavaScript syntax, exact LAB 01–LAB 13 membership, workbench coverage, dynamic data keys, study-item counts, retired metadata, and critical technical anchors from every source lab.

## Run locally

```bash
git clone https://github.com/Zann208/netdes.git
cd netdes
node scripts/validate.mjs
open index.html
```

You can also serve the folder with any static HTTP server.

## Accessibility

The console includes keyboard navigation, visible focus states, reduced-motion handling, a light theme, a skip link, responsive navigation, scalable topology SVGs, and accessible Study/Practice controls.
