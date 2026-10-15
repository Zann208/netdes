# Topics 16–22 source audit

This update integrates the three supplied decks into the existing NETDES study path. The decks were extracted as text, with key command and topology pages also rendered for visual inspection. Technical content is organized into original explanations, comparisons, command patterns, and practice; public course and identity metadata is omitted.

## Coverage

| Supplied deck | Pages | Destination and coverage |
|---|---|---|
| `CPE434Slide16DHCP-1.pdf` | 3–5 | Topic 16: host configuration, local broadcast boundary, DORA walkthrough, UDP ports, multiple offers |
| Same | 6–9 | Pool setup, inclusive exclusions, gateway/DNS/lease options, pools per VLAN or subinterface, binding verification |
| Same | 10–11 | Relay example: VLAN 10, 10.1.10.1/24, server 20.5.5.5; client-facing helper configuration |
| Same | 12–13 | IPv6 SLAAC, interface configuration, M/O flags; connection to IPv6 and LAB 13 |
| `CPE434Slide17EnterpriseCampusNetworkDesign.pdf` | 3–11 | Topic 17: segmentation, growth, predictable traffic, hierarchy, local/remote/enterprise service paths |
| Same | 12–17 | Access/distribution/core roles and capabilities; collapsed core |
| Same | 18–25 | Redundancy, single points of failure, modular switch blocks, VLAN and broadcast boundaries |
| Same | 26–31 | Port/capacity sizing, traffic and policy load, historical user guideline, block growth and split conditions |
| Same | 32–36 | Interactive shared-VLAN/local-VLAN/routed-access comparison; source arrangement of distribution above access, dual uplinks, interconnect and boundary differences |
| Same | 37–42 | Dual core, equal-cost paths, multinode core, collapsed core |
| `CPE434Slide18IntegratingWLAN.pdf` | 3–7 | Topic 18: CSMA/CA, DIFS/backoff, collision limitations, full standards comparison from the deck |
| Same | 8–12 | IBSS/BSS/ESS, association, AP bridging, SSID/VLAN mapping |
| Same | 13–20 | Cells, overlap/holes, honeycomb and three-dimensional reuse, power/capacity, microcells/picocells, BSS coloring |
| Same | 21–25 | Autonomous architecture, trunks, SSID extension and roaming VLAN scope |
| Same | 26–37 | Unified architecture, split-MAC, LAP/WLC roles, CAPWAP control/data, DTLS and certificates, VLAN extent, controller services, LAP startup |
| Same | 38–44 | Autonomous/central traffic paths, same-AP traffic, DLS/FlexConnect exceptions, autonomous roaming |
| Same | 45–54 | Intracontroller and Layer 2 intercontroller roaming, latency claim scope, authentication and key management |
| Same | 55–60 | Layer 3 roaming, anchor/foreign WLC roles, EoIP, retained client address, guest anchor; before/after redraw |
| Same | 61–62 | Mobility groups, mobility list, controller trust and coordination |

Cover, outline, and bibliography pages are not separate lessons. Repeated incremental figures are explained through comparison rather than duplicated as static slides.

## Clarifications

- DHCP page 6 has `exclude-address`; the valid IOS command is `excluded-address`. Confirmed against [Cisco's DHCP server configuration guide](https://www.cisco.com/c/en/us/td/docs/ios-xml/ios/ipaddr_dhcp/configuration/15-mt/dhcp-15-mt-book/config-dhcp-server.html).
- DHCP page 4 illustrates broadcast replies. The lesson distinguishes that example from conditional unicast/broadcast delivery and renewal, per [RFC 2131](https://www.rfc-editor.org/rfc/rfc2131.html#section-4.1).
- The relay slide's text extraction loses digits in `vlan10` and `255.255.255.0`. Rendered page 11 confirms the full values used here.
- SLAAC's M/O flags are explained as DHCPv6 indicators; a suitable autonomous prefix advertisement is still needed. The new documentation-prefix configuration is explicitly separate from original LAB 13 addressing.
- Campus page 3 describes a shared Ethernet segment, not the collision behavior of every modern switch. The 2,000-user figure is presented as the deck's historical guideline, not a hard protocol limit.
- WLAN maximum PHY rates and roaming latency figures are identified as slide/theoretical/platform values. Controller startup, recovery, tunneling, and forwarding descriptions are scoped to the architecture in the deck.
- WLAN page 50's previous-AP/eight-entry description is identified as Sticky Key Caching, not a universal PKC limit. See [Cisco's fast-secure roaming explanation](https://www.cisco.com/c/en/us/support/docs/wireless-mobility/wireless-lan-wlan/116493-technote-technology-00.html).
- WLAN page 56 calls AP-1/AP-2 the controllers in the text; the figures identify WLC-1/WLC-2 as anchor/foreign. The redraw and questions use the controller roles shown in the figures.
- Keeping an IP address does not alone distinguish Layer 2 from Layer 3 mobility: the illustrated Layer 3 tunnel preserves it too.

## Integration and preservation

- Append topic keys 16, 17, and 18 after the existing 16 entries (including 10B): 19 topics total.
- Append 45 cards and 24 questions after existing entries: 196 cards and 111 questions. Existing indices remain stable for stored progress.
- Add five command-recall tasks and 30 glossary rows; connect the new topics to home, blueprint, index, topic rail, search, progress, drills, and quick reference.
- Point LAB 13's topic association to DHCP Topic 16. Preserve all 13 original lab articles, configs, diagrams, workbench data, and numbering.
- Scope explorer styling to the new lessons; retain the shared theme, reading controls, and full-width body fix.

## Topics 18B–22 and the Final tab

The five further decks complete the final scope (“from DHCP to the end of the slides”). The unnumbered first-hop redundancy deck is placed as **18B**, following the existing 10B convention, so the remaining topic numbers match their decks.

| Supplied deck | Pages | Destination and coverage |
|---|---|---|
| First Hop Redundancy | 3–5 | Topic 18B: gateway single point of failure, second router, virtual IP; HSRP/VRRP/GLBP comparison |
| Same | 7–11 | Active/standby, virtual IP/MAC, failover with gratuitous ARP, version 1/2 table, active-router selection and preemption |
| Same | 12–16 | Interface commands, R1/R2 example (10.1.1.9 priority 110, 10.1.1.129, VIP 10.1.1.1, version 2), `show standby` and `show standby brief` reading |
| High Availability | 3–13 | Topic 19: HA definition, paired switches and links, logical access and distribution switches, multichassis EtherChannel, StackWise (nine members, master, one IP), VSS and VSL |
| Same | 14–23 | Supervisor engine, redundant supervisors and power, RPR / RPR+ / SSO readiness and failover times, NSF, RIB vs FIB question |
| Quality of Service | 3–12 | Topic 20: requirement table, jitter targets, traffic profiles, QoS roles, best effort / IntServ / DiffServ, Cisco QoS pipeline |
| Same | 13–26 | CoS, IP Precedence, DSCP, ECN, phone markings, classification methods, trust boundary and default maps, marking, PHB homework, AF table and binary decoding |
| Same | 27–33 | Shaping vs policing, token bucket, dropper and marker policers |
| Same | 34–51 | FIFO, WRR, strict priority/LLQ, custom queuing, tail drop, RED/WRED with the threshold example, best practice, AutoQoS |
| Monitoring | 3–16 | Topic 21: syslog format and severities, console and buffer logging, timestamps, clock and time zone, NTP configuration, stratum and association-symbol homework |
| Same | 17–36 | SNMP manager/agent, MIB/OID tree, operations and ports, versions, SNMPv3 levels, v1/v2c/v3 configuration and the NetOps example, example managers |
| Same | 37–53 | Local SPAN and RSPAN, configuration, `encapsulation replicate`, RSPAN VLAN behavior, three-switch VLAN 99 example, verification and removal |
| Basic Security | 3–12 | Topic 22: CIA triad, firewall placement and filtering, DMZ zones, IPS, NGFW, NGIPS, product examples |

### Clarifications

- FHRP slide 7 writes “HRRP”; the protocol is HSRP. The failover figure is captioned as Fig. 3 but is the deck's Fig. 4.
- HA slide 17 writes “PRP/PRP+” for RPR/RPR+, and slide 22 writes “NFS” and “EIRP” for NSF and EIGRP. Failover times are presented as the deck's comparative guide.
- QoS slide 15 says ECN is the last 2 bits of DSCP; the lesson states they are the last 2 bits of the ToS/DS byte after the 6 DSCP bits. The WRED example is reproduced with its 50% and 80% thresholds. RED's benefit is explained as applying to TCP, which reduces its rate after loss.
- Monitoring slide 28 writes the SNMP view keywords as include/exclude; IOS uses `included`/`excluded`. Slide 42's “NEVER cannot” is read as never connecting a SPAN destination back into an active network. `logging buffered` size and level are shown combined in the practice task (`logging buffered 16384 warnings`).
- Security slide 8's caption says IDS for an inline IPS figure; the lesson distinguishes a SPAN-fed IDS from an inline IPS.

### Final tab

- Exam facts follow the announcement: 20 October 2026, 15:30–18:30 (ignore the registration website), room 620, written paper with multiple choice and written answers covering theory, device configuration, and system analysis, closed book with one two-sided A4 sheet, midterm sheet returned during the exam, bring pencil, eraser, pen.
- The final mock draws only from topics 16, 17, 18, 18B, 19, 20, 21, 22, with an optional one-in-five midterm mix. Configuration tasks and analysis cases use addresses and outputs consistent with the decks' examples.
- The A4 sheet prints on exactly two A4 pages (verified by rendering to PDF).
- Code blocks on the shared light reading surface now use the theme text color; previously their light text was hard to read in light mode.
