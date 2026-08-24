# NETDES — Network Design Study Console

An offline-first study console for **261434 Computer Network Design and Management (CPE434)** at Chiang Mai University.

**[Case study](https://zann208.github.io/projects/netdes/)** · **[Live console](https://zann208.github.io/netdes/)**

The project is intentionally simple to run: the console lives in one `index.html` file with no framework or build step.

## Why I built it

The course material is spread across lecture decks, lab sheets and quiz material. The useful connections are not always in the same file. A lecture may explain a rule, a lab turns it into Cisco IOS commands, and the evidence that the configuration worked appears later in verification output.

NETDES keeps those parts together. The main study pattern is:

**concept → configuration → verification → practice**

## What is inside

| Section | Purpose |
|---|---|
| **Blueprint** | Shows how the main course topics depend on each other |
| **Flow** | Connects lecture topics to their lab work |
| **Lectures** | Course notes rewritten for revision and comprehension |
| **Labs** | Objectives, addressing, configurations, verification output and worked reasoning |
| **Drills** | Flashcards, quiz questions and generated practice |
| **Exam** | Timed review, weak-point tracking and the STP port-role solver |
| **Cheatsheet / Terms** | Compact reference tables and terminology |

The current lab workbench covers material from subnetting and switch setup through VLANs, inter-VLAN routing, STP, RSTP and MST. Lab 12 is still marked in progress in the console.

## Network topics covered

- IPv4/IPv6 addressing and subnetting
- Basic switch setup, SSH and port security
- VLANs and 802.1Q trunking
- VTP concepts
- EtherChannel
- Router-on-a-stick and Layer 3 switching
- Private VLANs
- STP / PVST+
- RSTP / Rapid PVST+
- MST concepts

## STP port-role solver

The console includes an educational IEEE 802.1D port-role solver. It is designed to make the decision process visible rather than hide it behind a final answer.

The solver works through:

1. root bridge election using Bridge ID
2. root-path selection using path cost and tie-break values
3. designated-port selection per segment
4. blocked-port classification for the remaining ports

The implementation compares path cost, Bridge IDs and port IDs. Root-path values are updated repeatedly until no better candidate is found; the source describes this as a Bellman-Ford-style convergence step.

The console also contains worked STP scenarios from the course labs. Standalone automated test files referenced by an earlier version of this README are not currently present in the repository, so I do not treat the old fuzz-test figures as reproducible evidence here.

## Configuration and verification

A main goal of the lab pages is to keep configuration next to the commands used to check it. For example, a VLAN access-port workflow pairs configuration such as:

```text
vlan 10
 name STUDENTS
!
interface Fa0/1
 switchport mode access
 switchport access vlan 10
```

with checks such as:

```text
show vlan brief
show interfaces status
show interfaces fa0/1 switchport
```

That is the part of the project I find most useful: it makes the expected network state explicit and gives a concrete way to verify it.

## Implementation

- Vanilla HTML, CSS and JavaScript
- Canvas 2D visualisations
- `localStorage` for progress and preferences
- inline SVG
- no framework or bundler

## Run locally

```bash
git clone https://github.com/Zann208/netdes.git
cd netdes
open index.html
```

Or simply open `index.html` in a browser.

## Accessibility

The console includes keyboard navigation, visible focus states, reduced-motion handling, a light theme and a skip link.

## Note on course content

The notes are my own revision material and restatement of course concepts. Lecture slides, lab sheets and original figures remain the property of the course instructor and are not redistributed here.

Built by **Thu Htoo Zan** — Information Systems & Network Engineering, Chiang Mai University

[Portfolio](https://zann208.github.io/) · [LinkedIn](https://www.linkedin.com/in/thu-htoo-zan-8866ab377/) · [Email](mailto:thuhtoozan_1@cmu.ac.th)
