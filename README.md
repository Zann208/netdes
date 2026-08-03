# NETDES — Network Design Study Console

An offline-first, single-file study console for **261434 Computer Network Design and Management** (CPE434) at Chiang Mai University.

**→ [Live demo](https://zann208.github.io/netdes/)**

One HTML file. No framework, no build step, no dependencies, no network calls. Open it and it works — on a laptop with no internet, in an exam hall, on a phone.

---

## Why I built it

Course material arrives as a pile of PDFs: 16 lecture decks, 12 lab sheets, and a separate quiz on the university LMS for each lab. Nothing links to anything. Revising means opening six files and holding the connections in your head.

So I built the thing I wanted: every topic in one place, cross-linked, with the theory wired to the lab that tests it — plus a trainer that generates unlimited practice problems instead of the handful in the slides.

---

## What's inside

| Section | What it does |
|---|---|
| **Blueprint** | Every topic mapped onto one campus network diagram with clickable hotspots, plus a 17-step problem→solution chain explaining why the syllabus is ordered the way it is |
| **Flow** | The course pipeline — lecture → lab → graded quiz — and which lab maps to which lecture |
| **Lectures** | 16 decks rewritten for comprehension: mechanism first, then tables, worked sequences, commands and exam traps |
| **Labs** | All 12 labs as a full manual — objective, addressing table, every numbered step from the sheet, complete per-device configs, annotated `show` output telling you which line proves it worked, and solved keys for the four STP labs |
| **Drills** | 152 flashcards with a weak-card filter, an 88-question mock exam, and three infinite generators |
| **Exam** | Timed simulator with a per-topic report, weak-point radar, and the port-role solver |
| **Cheatsheet / Terms** | Every number and table; 40 acronyms, searchable |

---

## Engineering highlights

**A working STP implementation.** The port-role solver isn't a lookup table — it runs the real 802.1D algorithm: root election by Bridge ID, Dijkstra for path cost, then the four-step tie-break (cost → sender BID → sender port priority → sender port number). It generates a random scenario, grades your answer and explains the resolution.

Validated against all four hand-solved lab answers, then fuzzed with **20,000 randomised scenarios** — zero violations of the invariants (exactly 2 blocked ports, 3 root ports, one designated end per link).

```
PASS Lab09 priorities      | root SW1 | blocked 2 | rootports 3
PASS Lab09 root primary    | root SW2 | blocked 2 | rootports 3
PASS Lab08 VLAN1 default   | root SW1 | blocked 2 | rootports 3
PASS Lab08 VLAN10 raised   | root SW4 | blocked 2 | rootports 3
20000 random scenarios (7998 with tied priorities) — violations: 0
```

**Canvas background that teaches.** Three switchable visualisations rendered only in the page margins, so they never sit behind text and auto-disable below 1100px. One of them animates the actual 802.1D state machine — blocking (20s) → listening (15s) → learning (15s) → forwarding — with port role tags and hello BPDUs propagating from the root every 2 seconds.

**Adaptive navigation.** A priority+ overflow menu measures the header and moves the least-used tabs into a dropdown when space runs short, recalculating on resize, font load and language switch.

**Bilingual EN/TH.** ~310 translated nodes with technical terms deliberately left in English — *"ตัดการรอ Max Age 20 วินาที เมื่อเกิด indirect failure"* — which is how Thai network engineers actually write.

**Everything persists.** Progress, mastered cards, quiz history, answer accuracy per topic, theme, language and scroll position per section, all in `localStorage`.

---

## Tech

Vanilla HTML · CSS custom properties for theming · plain JavaScript · Canvas 2D · localStorage · inline SVG

No React, no Tailwind, no bundler. 329 KB, one file, zero dependencies.

## Run it

```bash
git clone https://github.com/Zann208/netdes.git
cd netdes
open index.html          # that's it
```

## Accessibility

Skip link, `<main>` landmark, visible focus rings, full keyboard navigation (`Ctrl K` search, `J`/`K` between topics, `?` for shortcuts), `prefers-reduced-motion` respected by every animation, and a light theme with contrast-checked pairs.

---

## Note on content

The notes are my own restatement of course concepts, written for comprehension rather than transcription. Lecture slides, lab sheets and figures remain the property of the course instructor and are not redistributed here.

## License

Code is [MIT](LICENSE). Course-derived study notes are shared for educational use.

---

Built by **Zann** — Computer Engineering, Chiang Mai University
[Portfolio](https://zann208.github.io) · [Email](mailto:thuhtoozan_1@cmu.ac.th)
