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

Each lab keeps the topology, device names, interfaces, addresses, VLAN values, protocol-specific settings, configuration order, expected behavior, verification, troubleshooting, and source questions needed to perform it.

## Implementation

- Vanilla HTML, CSS, and JavaScript
- Shared Study Console shell plus a NETDES adapter stylesheet
- Inline SVG and Canvas 2D visualizations
- `localStorage` for progress and preferences
- GitHub Pages deployment from `main`

## Validate

Run the repository validator before publishing:

```bash
node scripts/validate.mjs
```

The validator checks the shared shell contract, HTML IDs and navigation targets, JavaScript syntax, exact LAB 01–LAB 13 membership, dynamic data keys, study-item counts, retired metadata, and critical technical anchors from every source lab.

## Run locally

```bash
git clone https://github.com/Zann208/netdes.git
cd netdes
node scripts/validate.mjs
open index.html
```

You can also serve the folder with any static HTTP server.

## Accessibility

The console includes keyboard navigation, visible focus states, reduced-motion handling, a light theme, a skip link, and responsive navigation.
