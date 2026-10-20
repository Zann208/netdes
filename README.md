# NETDES — Network Engineering Study Console

An offline-capable study workspace for switching, routing, redundancy, addressing, and network services.

**[Live console](https://zann208.github.io/netdes/)** · **[Lab source audit](docs/LAB-SOURCE-AUDIT.md)**

The app is intentionally lightweight: the console is a single `index.html` page with no framework or build step. It uses the shared Study Console shell for consistent navigation while keeping NETDES content independent.

## What is inside

| Section | Purpose |
|---|---|
| **Blueprint** | Connects the switching and routing concepts as one system |
| **Flow** | Shows the prepare → configure → verify → troubleshoot workflow |
| **Final** | Final exam brief and countdown, final-scope readiness, a final-only timed mock, configuration writing, system analysis cases, a five-day plan, the final cheat sheet (PDF + preview), and Master the cheat sheet drills |
| **Topics** | Twenty-four technical explanations with IOS commands and failure modes |
| **Labs** | LAB 01 through LAB 13 with original numbering and source-matched details |
| **Drills** | 262 flashcards, 151 practice questions, and generated exercises |
| **Practice** | Timed review, weak-point tracking, and an STP port-role solver |
| **Cheatsheet / Terms** | Compact reference tables and terminology |

The IPv4 subnetting Review is intentionally unnumbered and does not affect the 13-lab progress count.

## Latest update: final exam

Topics 18B–22 complete the final scope: first hop redundancy (HSRP), high availability, Quality of Service, monitoring, and basic security. They add an HSRP failover explorer, a logical-switch and supervisor-redundancy comparison, a DSCP decoder, a syslog threshold checker, a security-zone diagram, 66 flashcards, 40 scenario questions, 16 command-recall tasks, and 37 glossary entries.

The **Final** tab collects the exam brief (20 October, 15:30–18:30, closed book with one A4 sheet), readiness for the eight final-scope topics (16, 17, 18, 18B, 19, 20, 21, 22), a final-only timed mock with an optional midterm mix, 12 configuration-writing tasks with mark checklists, 20 output-analysis cases, a five-day plan, the final cheat sheet, and the Master the cheat sheet drills.

The **final cheat sheet** lives in `cheatsheet/`: `CNDM_Final_Cheatsheet.pdf` (one A4 sheet, landscape, both sides, chapters 16–23) and `final.html`, the same sheet as a page, which the Final tab shows in a zoomable preview. **Master the cheat sheet** has three drills: *Find it fast* (32 timed lookups with the sheet in hand; every answer names the side, column and heading), *Beyond the sheet* (28 scenarios answered with the sheet covered), and *Rebuild from memory* (12 key tables, 111 blanks). A mastery score combines the three.

**Quick recap** (near the top of the Final tab) is a last-read summary with short explanations: midterm topics 01–15, marking where each idea appears inside final questions, and final topics 16–22.

**Midterm in the final** covers midterm topics that may reappear: *Rapid midterm* (15 questions per round from the midterm question bank, weighted toward VLANs, EtherChannel, inter-VLAN routing and STP), *Midterm inside final* (20 questions joining a midterm idea to a final topic), and *Numbers from memory* (8 tables: STP timers and costs, bridge priority, DTP, EtherChannel modes, VLAN ranges, RSTP, VTP).

Topics 16–18 cover DHCP and relay, enterprise campus design, and integrating WLANs. Existing card/question indices and LAB 01–LAB 13 content remain stable.

[Topic source audit](docs/TOPIC-SOURCE-AUDIT.md) records slide coverage and technical clarifications.

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

The validator checks the shared shell contract, the Final tab's exam facts and practice sets, technical anchors for Topics 18B–22, HTML IDs and navigation targets, JavaScript syntax, exact LAB 01–LAB 13 membership, workbench coverage, dynamic data keys, study-item counts, retired metadata, and critical technical anchors from every source lab.

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

## Languages

The header button switches between **EN / MY**. Burmese (MY) covers Topics 16–22, the Final tab (including its configuration tasks, analysis cases and five-day plan), and the 111 flashcards and 64 practice questions for those topics. Commands, CLI exhibits, the cheat sheet and its drill questions stay in English to match the exam paper. Technical terms (VLAN, DHCP, HSRP, CAPWAP, DSCP…) are kept in English inside the Burmese text.

- Translations live in `i18n/my.js`, loaded only when MY is selected, with the Noto Sans Myanmar font.
- Lesson elements carry `data-i18n` keys; `scripts/validate.mjs` fails if any key, card or question lacks a Burmese string.
- Flashcard progress stays keyed to the English card text, so switching languages does not reset "known" cards.
