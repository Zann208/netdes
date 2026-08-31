import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const workbenchCssPath = path.join(root, "lab-workbench.css");
const workbenchJsPath = path.join(root, "lab-workbench.js");
const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

function equal(actual, expected, message) {
  check(
    JSON.stringify(actual) === JSON.stringify(expected),
    message + "\n  expected: " + JSON.stringify(expected) + "\n  actual:   " + JSON.stringify(actual),
  );
}

function matches(regex) {
  return [...html.matchAll(regex)].map((match) => match[1]);
}

function article(id) {
  const start = html.indexOf('<article class="item lab" id="' + id + '">');
  if (start < 0) return "";
  const end = html.indexOf("</article>", start);
  return end < 0 ? "" : html.slice(start, end + 10);
}

const expectedLabs = Array.from(
  { length: 13 },
  (_, index) => "L" + String(index + 1).padStart(2, "0"),
);

check(
  html.includes("<title>NETDES // Network Engineering Study Console</title>"),
  "document title is not the independent NETDES title",
);
check(
  html.includes('data-study-console="netdes"') &&
    html.includes('data-console-id="netdes"') &&
    html.includes('data-console-name="Network Design & Troubleshooting"'),
  "shared Study Console body contract is incomplete",
);
for (const asset of [
  "https://zann208.github.io/study/shared/v1/study-system.css",
  "https://zann208.github.io/study/shared/v1/legacy-console.css",
  "./study-console-adapter.css",
  "./lab-workbench.css",
  "https://zann208.github.io/study/shared/v1/study-system.js",
  "./lab-workbench.js",
]) {
  check(html.includes(asset), "missing shared Study Console asset: " + asset);
}

for (const [label, file] of [
  ["lab workbench stylesheet", workbenchCssPath],
  ["lab workbench script", workbenchJsPath],
]) {
  check(fs.existsSync(file), "missing " + label);
}

if (fs.existsSync(workbenchJsPath)) {
  const workbenchJs = fs.readFileSync(workbenchJsPath, "utf8");
  try {
    new Function(workbenchJs);
  } catch (error) {
    failures.push("lab workbench script has invalid JavaScript: " + error.message);
  }
  for (const id of expectedLabs) {
    check(
      workbenchJs.includes(id + ":{practice:"),
      "lab workbench is missing practice data for " + id,
    );
  }
  for (const fragment of [
    "function makeTopology",
    "function wrapPhase",
    "What you will practice",
    "Practice",
    "Reset lab",
    "Interactive STP topology",
  ]) {
    check(workbenchJs.includes(fragment), "lab workbench feature is missing: " + fragment);
  }
  check(
    workbenchJs.includes("var TOPOLOGY_SOURCE={") &&
      workbenchJs.includes("var TOPOLOGY_RENDERERS={"),
    "lab workbench is missing the source-topology renderer contract",
  );
  for (const id of expectedLabs) {
    check(
      workbenchJs.includes(id + ":{note:"),
      "source-topology metadata is missing for " + id,
    );
  }

  const topologyAnchors = {
    L01: ["PC1", "swA", "swB", "PC2", "F0/...", "Gig0/1", "cross", "192.168.56.130/25"],
    L02: ["Room402", "Room 413", "VLAN 261", "VLAN 434", "Fa0/1", "Fa0/4", "Gi0/1", "Gi0/2"],
    L03: ["5th floor", "4th floor", "6th floor", "7th floor", "30th year bldg", "Gig0/2", "VLAN 100 faculty"],
    L04: [
      "SWA Gig1/0/1 - SWB Gig1/0/11",
      "SWA Gig1/0/2 - SWB Gig1/0/12",
      "SWA Gig1/0/3 - SWB Gig1/0/13",
    ],
    L05: ["Room401", "Room402", "rC(1941)", "swA(2960)", "swB(3650)", "G1/0/24", "192.168.100.1/30", "192.168.100.2/30"],
    L06: ["primary VLAN 10", "private VLAN 101", "private VLAN 102", "promiscuous port", "e1/0", "e2/1"],
    L07: ["000C.858B.5322", "0040.0B0B.0AB7", "0090.21D7.0E24", "000C.CFA1.904D", "VLAN 1"],
    L08: ["PCA", "192.168.10.5", "Fa0/11"],
    L09: ["20480", "24576", "32768", "40960"],
    L10: ["16384", "PCB", "192.168.10.6/24", "Fa0/12"],
    L11: ["16384", "PCB", "Fa0/12"],
    L12: ["IOU1", "IOU2", "IOU3", "IOU4", "e2/0", "e2/1", "cost 10,000,000"],
    L13: ["swA", "swB", "rC", "G1/0/1", "G1/0/2", "F0/1", "F0/2", "vlan40"],
  };
  for (const [id, fragments] of Object.entries(topologyAnchors)) {
    for (const fragment of fragments) {
      check(
        workbenchJs.includes(fragment),
        id + " source-faithful topology is missing: " + fragment,
      );
    }
  }
}

const ids = matches(/\bid="([^"]+)"/g);
const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
equal(duplicateIds, [], "duplicate HTML IDs found");
const idSet = new Set(ids);

for (const [attribute, regex] of [
  ["data-tab", /\bdata-tab="([A-Za-z][A-Za-z0-9_-]*)"/g],
  ["data-tabgo", /\bdata-tabgo="([A-Za-z][A-Za-z0-9_-]*)"/g],
  ["data-goto", /\bdata-goto="([A-Za-z][A-Za-z0-9_-]*)"/g],
  ["data-lab", /\bdata-lab="([A-Za-z][A-Za-z0-9_-]*)"/g],
]) {
  for (const target of matches(regex)) {
    check(idSet.has(target), attribute + " points to missing #" + target);
  }
}

const inlineIds = new Set(matches(/\bid=\\"([^"]+)\\"/g));
const runtimeIds = new Set([...ids, ...inlineIds]);
for (const target of matches(/getElementById\(["']([^"']+)["']\)/g)) {
  check(runtimeIds.has(target), "getElementById references missing #" + target);
}

const inlineScripts = [
  ...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g),
].map((match) => match[1]);
check(inlineScripts.length === 1, "expected one inline app script, found " + inlineScripts.length);
for (const [index, source] of inlineScripts.entries()) {
  try {
    new Function(source);
  } catch (error) {
    failures.push("inline script " + (index + 1) + " has invalid JavaScript: " + error.message);
  }
}

const articleLabs = matches(/<article class="item lab" id="(L\d{2})">/g);
equal(articleLabs, expectedLabs, "lab article sequence is not exactly LAB 01–LAB 13");

const labsObject = html.match(/var LABS=\{([\s\S]*?)\};/);
check(Boolean(labsObject), "LABS data object is missing");
if (labsObject) {
  const objectLabs = [...labsObject[1].matchAll(/"(L\d{2})":/g)].map((match) => match[1]);
  equal(objectLabs, expectedLabs, "LABS object keys are not exactly L01–L13");
}

const checkboxLabs = matches(/class="dn" data-k="(L\d{2})"/g);
equal(checkboxLabs, expectedLabs, "lab completion keys are not exactly L01–L13");
check(
  html.includes('<article class="item" id="subnet-review">') &&
    !html.includes('<article class="item lab" id="subnet-review">'),
  "subnetting Review must exist and must not count as a lab",
);

const retiredPatterns = [
  [/\bLAB\s*00\b/i, "retired LAB 00 label"],
  [/\bL00\b/, "retired L00 key"],
  [/Computer Network Design and Management/i, "complete course name"],
  [/Chiang Mai University/i, "university branding"],
  [/Mango CMU/i, "LMS reference"],
  [/\bNetAcad\b/i, "LMS/vendor portal reference"],
  [/\bsemester\b/i, "semester metadata"],
  [/\bprof(?:essor|'s)?\b/i, "instructor metadata"],
  [/Resource slots/i, "placeholder resource panel"],
  [/Full solved key/i, "grading-style solved-key label"],
  [/verified against the grader/i, "grader metadata"],
  [/\b(?:CPE434Slide|SLIDE\d|Slide_?\d)/, "raw slide identifier"],
];
for (const [regex, label] of retiredPatterns) {
  check(!regex.test(html), "retired public metadata remains: " + label);
}

for (const id of expectedLabs) {
  const body = article(id);
  check(Boolean(body), "missing " + id + " article");
  const headerEnd = body.indexOf("</div>");
  const header = headerEnd < 0 ? body : body.slice(0, headerEnd);
  check(!/\blectures?\b/i.test(header), id + " header still contains a lecture label");
  check(!/\b(?:score|grader|pts)\b/i.test(body), id + " contains grading metadata");
}

const cardCount = (html.match(/^C\(/gm) || []).length;
const questionCount = (html.match(/^Q\(/gm) || []).length;
check(cardCount === 151, "expected 151 flashcards, found " + cardCount);
check(questionCount === 87, "expected 87 practice questions, found " + questionCount);
for (const fragment of [
  "<b>16</b><span>Topics</span>",
  "<b>13</b><span>Labs</span>",
  "<b>151</b><span>Cards</span>",
  "<b>87</b><span>Practice Qs</span>",
  'id="vTop">0/16',
  'id="vLab">0/13',
]) {
  check(html.includes(fragment), "home fallback count missing: " + fragment);
}

const anchors = {
  L01: [
    "192.168.56.130/25",
    "192.168.56.131/25",
    "192.168.56.251/25",
    "192.168.56.252/25",
    "crypto key generate rsa",
    "switchport port-security mac-address sticky",
  ],
  L02: [
    "swA Fa0/1",
    "swB Fa0/3",
    "261 <span",
    "434 <span",
    "CAFE:10::11/64",
    "CAFE:10::12/64",
    "TPID",
    "TCI",
  ],
  L03: [
    '<td class="mono">swA</td><td>5th</td><td class="ok">server</td>',
    '<td class="mono">swB</td><td>4th</td><td>client</td>',
    '<td class="mono">swC</td><td>6th</td><td>transparent</td>',
    "vtp domain ENG",
    "vtp password 261434",
    "name bachelor",
    "name grad",
  ],
  L04: [
    "Gi1/0/1",
    "Gi1/0/11",
    "Gi1/0/3",
    "Gi1/0/13",
    "channel-group 3 mode active",
    "channel-group 4 mode passive",
    "show etherchannel summary",
  ],
  L05: [
    "2026CPE434Lab05InterVLANBase.pkt",
    "192.168.100.1/30",
    "192.168.100.2/30",
    "CAFE:1::1/64",
    "FE80::FACE:10",
    "ipv6 router ospf 1",
    "router-id 192.168.100.1",
  ],
  L06: [
    "200.10.10.11/24",
    "100.1.1.201/24",
    "private-vlan community",
    "private-vlan isolated",
    "private-vlan association 101,102",
    "switchport mode private-vlan promiscuous",
    "interface range Ethernet2/0 - 1",
    "PC3 ↔ PC4",
  ],
  L07: [
    "000C.858B.5322",
    "0040.0B0B.0AB7",
    "0090.21D7.0E24",
    "000C.CFA1.904D",
    "Packet Tracer is not required.",
  ],
  L08: [
    "2026CPE434Lab08STP.pkt",
    "PCA 192.168.10.5",
    "SW3 Fa0/11",
    "show spanning-tree",
    "Verified reasoning key",
  ],
  L09: [
    "20480",
    "24576",
    "32768",
    "40960",
    "spanning-tree vlan 10 root primary",
    "16394",
  ],
  L10: [
    "192.168.10.6/24",
    "SW4 Fa0/12",
    "within 29 s",
    "spanning-tree portfast",
    "shutdown",
    "no shutdown",
  ],
  L11: [
    "spanning-tree mode rapid-pvst",
    "SW1 Fa0/2",
    "within the first 29 seconds",
    "all four",
    "Peer(STP)",
  ],
  L12: [
    "aabb.cc00.<b>0100",
    "IOU2 e2/0",
    "IOU4 e2/1",
    "instance 1 vlan 51-60",
    "instance 2 vlan 61-70",
    "cost 10000000",
    "interface range Ethernet0/0 , Ethernet1/3",
  ],
  L13: [
    "2026CPE434Lab13DHCPTopo.pkt",
    "vlnet10",
    "vlnet20",
    "vlnet30",
    "vlnet40",
    "ip dhcp excluded-address 200.20.1.1 200.20.1.100",
    "ip dhcp excluded-address 200.30.1.101 200.30.1.254",
    "CAFE:10::1/64",
    "BEEF:40::1/64",
  ],
};

for (const [id, required] of Object.entries(anchors)) {
  const body = article(id);
  for (const fragment of required) {
    check(body.includes(fragment), id + " is missing source anchor: " + fragment);
  }
}

check(
  html.includes("function isLab(k){return Object.prototype.hasOwnProperty.call(LABS,k)}") &&
    html.includes("doneSet=doneSet.filter") &&
    html.includes("Object.keys(LABS).length"),
  "dynamic lab counting or stale-progress filtering is missing",
);

if (failures.length) {
  console.error("NETDES validation failed (" + failures.length + ")");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("NETDES validation passed");
console.log("- " + expectedLabs.length + " labs: " + expectedLabs.join(", "));
console.log("- " + cardCount + " flashcards, " + questionCount + " practice questions");
console.log("- " + ids.length + " unique IDs, " + inlineScripts.length + " inline script");
