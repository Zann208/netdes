# NETDES Lab Source Audit

This audit records how the LAB 01–LAB 13 workbench was reconciled with the newly supplied original lab files. Those files control technical content; the existing NETDES application remains the UI and interaction baseline.

## Numbering and presentation rules

- LAB 01 through LAB 13 retain their supplied numbers.
- No numbered lab is renamed as a module, unit, or exercise.
- IPv4 Subnetting is an unnumbered **Review** and is excluded from lab navigation counts and progress.
- Course identity, institutional branding, lecture labels beside labs, grading metadata, and LMS references were removed.
- Technical filenames, device names, passwords, addresses, VLAN names, and other values are retained when required to perform a lab.

## Per-lab reconciliation

| Console lab | Supplied source | Technical anchors checked | Result |
|---|---|---|---|
| LAB 01 — Basic Switch | `LAB01_BasicSwitch.pdf` | PT 9.0; PC1/PC2 `192.168.56.130–131/25`; swA/swB `.251–.252/25`; SSH v2; RSA 2048; `student/netdes`; sticky security on swA Fa0/1 | Existing walkthrough retained and source values confirmed |
| LAB 02 — VLAN and 802.1Q | `LAB02_VLAN.pdf` | swA Gi0/1 ↔ swB Gi0/2; VLAN 261 `staffs`; VLAN 434 `students`; all four IPv4 addresses; PC0/PC1 IPv6; Simulation-mode TPID/TCI inspection | Existing walkthrough retained and source values confirmed |
| LAB 03 — VTP | `Lab03_VTP.pdf` | swA server, swB client, swC transparent, swD server; VTP v2; domain `ENG`; required password; VLANs 30, 40, 50, 80, 100, 200 | Existing walkthrough retained and source values confirmed |
| LAB 04 — EtherChannel with LACP | `Lab04_LinkAggregation.pdf` | Catalyst 3650; exact Gi1/0/x link mapping; VLAN 100 `Net`; SWA group 3 active; SWB group 4 passive; Packet Tracer save/reopen workaround | Existing walkthrough retained and source values confirmed |
| LAB 05 — Inter-VLAN Routing | `Lab05_InterVLAN.pdf` | Four PC subnets; rC router-on-a-stick; swB SVIs; `192.168.100.0/30` routed link; OSPF/OSPFv3 area 0; IPv6 addresses and link-locals | Existing walkthrough retained and source values confirmed |
| LAB 06 — Private VLAN | `2026CPE434Lab06PrivateVLAN (1).pdf` | GNS3/VM and L2/L3 IOU; VPCS addresses; RB e0/0/e0/1; primary VLAN 10; community 101; isolated 102; SWA e0/0 promiscuous; exact host-port ranges; persistence commands | Missing lab added in full; contradictory IOU-support note corrected |
| LAB 07 — Determine Spanning Tree | `Lab07_DeterimineSTP.pdf` | VLAN 1; four exact MAC addresses; five exact switch links; default priority and Fast Ethernet cost; manual root/role calculation | Existing solved method retained; incorrect “software not allowed” claim removed |
| LAB 08 — Verifying Spanning Tree | `Lab08_VerifyingST.pdf` | `2026CPE434Lab08STP.pkt`; PCA `192.168.10.5` on SW3 Fa0/11 VLAN 10; one-minute convergence; `show spanning-tree` evidence | Existing verified reasoning retained; scores and grading labels removed |
| LAB 09 — Configuring Spanning Tree | `Lab09_ConfigSTP.pdf` | VLAN 10 priorities 20480/24576/32768/40960; SW2 `root primary`; Q1–Q8 sequence | Existing verified reasoning retained; scores and grading labels removed |
| LAB 10 — STP with Topology Changes | `Lab10_STPwithChanges.pdf` | Saved LAB 09 baseline; PCB `192.168.10.6` on SW4 Fa0/12; PortFast experiment; SW4 Fa0/9 shut/no-shut; readings within 29 seconds | Existing experiments retained; capture timing explained without grader metadata |
| LAB 11 — Rapid Spanning Tree | `Lab11_RSTP.pdf` | Saved LAB 10 baseline; only SW2 changes first; SW1 Fa0/2 shut/no-shut; then all four use Rapid PVST+; readings within 29 seconds | Existing experiments retained; source title typo documented; grading metadata removed |
| LAB 12 — Multiple Spanning Tree | `Lab12_MST.pdf` | GNS3/IOU order and MACs; five exact links; VLAN 51–70; region `netdes` revision 1; instances 1/2; IOU2/IOU4 roots; instance-2 cost 10,000,000 | Existing walkthrough retained; trunk commands restricted to topology interfaces |
| LAB 13 — DHCP | `2026CPE434Lab13DHCP.pdf` | `2026CPE434Lab13DHCPTopo.pkt`; DHL1–DHL4; exact SVIs/subinterfaces; four DHCP pool names, gateways, DNS values, ranges, and exclusions; IPv6 routing and Automatic clients | Missing lab added in full |

## Source numbering anomalies

- The title page inside `LAB02_VLAN.pdf` says “Lab03,” while the supplied filename and position in the complete set identify it as LAB 02. NETDES keeps **LAB 02** and does not shift later labs.
- The title page inside `Lab11_RSTP.pdf` says “Lab 10,” but its instructions begin from LAB 10 and the supplied filename identifies the new activity as LAB 11. NETDES keeps **LAB 11**.

## Application reconciliation

- The `LABS` data object now contains exactly `L01` through `L13`.
- Home counts, lab grid, sidebar, search, rail navigation, readiness, progress snapshots, and completion logic derive from that object.
- Stale stored `L00` completion state is filtered out automatically.
- Static study counts now match the data banks: 151 flashcards and 87 practice questions.
- The shared Study Console styles, adapter, script, course switcher, keyboard controls, local progress, drills, and STP simulator remain intact.
- Every LAB 01–LAB 13 article receives a responsive SVG topology, a compact practice checklist, phase completion markers, and optional solution-reveal controls from the local lab-workbench layer. LAB 07 is intentionally diagrammed as the supplied four-switch manual-calculation topology; PCA begins with LAB 08, and PCB begins with LAB 10.
- The existing interactive STP simulator is retained and placed with LAB 07 so the manual topology, role reasoning, and scenario controls remain together.

## Verification

Run:

```bash
node scripts/validate.mjs
git diff --check
```

The validator checks numbering, navigation, data counts, inline JavaScript syntax, retired metadata, and critical technical values from every supplied lab.
