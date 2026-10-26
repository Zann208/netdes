import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

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
  html.includes("<title>Network Design &amp; Troubleshooting</title>"),
  "document title is not the console title",
);
check(
  html.includes('data-study-console="netdes"') &&
    html.includes('data-console-id="netdes"') &&
    html.includes('data-console-name="Network Design & Troubleshooting"'),
  "shared Study Console body contract is incomplete",
);
for (const asset of [
  "https://zann208.github.io/study/shared/v3/boot.js",
  'data-console="netdes"',
  'data-v2="index.v2.html"',
  "./study-console-adapter.css",
  "./lab-workbench.css",
  "./lab-workbench.js",
  "./study-console.v3.js",
]) {
  check(html.includes(asset), "missing Study Console v3 asset: " + asset);
}
check(!html.includes("shared/v2/"), "index.html still loads Study Console v2 assets");
check(fs.existsSync(path.join(root, "index.v2.html")), "missing the frozen v2 page used by ?ui=v2");
{
  const manifest = fs.readFileSync(path.join(root, "study-console.v3.js"), "utf8");
  try { new Function(manifest); } catch (error) { failures.push("study-console.v3.js has invalid JavaScript: " + error.message); }
  for (const tab of ["home", "final", "blueprint", "flow", "notes", "labs", "terms", "drills", "intensive", "cheat", "author"]) {
    check(manifest.includes("id: '" + tab + "'"), "v3 manifest is missing view " + tab);
    check(html.includes('<section class="tab' + (tab === "home" ? " on" : "") + '" id="' + tab + '">'), "missing section for view " + tab);
  }
  for (const legacy of ['<nav><div class="navin">', 'id="sb"', 'id="pal"', 'id="csWrap"', 'id="fx"', 'id="rail"']) {
    check(!html.includes(legacy), "legacy navigation chrome is still in index.html: " + legacy);
  }
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
check(cardCount === 262, "expected 262 flashcards, found " + cardCount);
check(questionCount === 151, "expected 151 practice questions, found " + questionCount);
for (const fragment of [
  "<b>24</b><span>Topics</span>",
  "<b>13</b><span>Labs</span>",
  "<b>262</b><span>Cards</span>",
  "<b>151</b><span>Practice Qs</span>",
  'id="vTop">0/24',
  'id="vLab">0/13',
]) {
  check(html.includes(fragment), "home fallback count missing: " + fragment);
}

// Every lesson must be reachable, trackable, and represented in both practice banks.
const expectedTopics = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "10B", "11", "12", "13", "14", "15", "16", "17", "18", "18B", "19", "20", "21", "22"];
const topicSource = html.match(/var TOPICS=(\{[\s\S]*?\});/);
const orderSource = html.match(/var TORDER=(\[[\s\S]*?\]);/);
check(Boolean(topicSource && orderSource), "topic data or order is missing");
if (topicSource && orderSource) {
  const topicMap = vm.runInNewContext("(" + topicSource[1] + ")", {}, { timeout: 1000 });
  const order = vm.runInNewContext(orderSource[1], {}, { timeout: 1000 });
  equal(order, expectedTopics, "topic study order has changed");
  equal(Object.keys(topicMap).sort(), [...expectedTopics].sort(), "topic map membership is incorrect");
  equal(matches(/class="dn" data-k="(t[0-9B]+)"/g), expectedTopics.map((key) => "t" + key), "topic completion keys are incorrect");
  const banks = {};
  for (const kind of ["C", "Q"]) {
    banks[kind] = [...html.matchAll(new RegExp("^" + kind + "\\((.*)\\);$", "gm"))].map((match) => vm.runInNewContext("[" + match[1] + "]", {}, { timeout: 1000 }));
    for (const entry of banks[kind]) {
      check(Boolean(topicMap[entry[0]]), kind + " entry refers to a missing topic: " + entry[0]);
      if (kind === "Q") {
        check(entry[2].length === 4 && new Set(entry[2]).size === 4, "question must have four distinct choices: " + entry[1]);
        check(Number.isInteger(entry[3]) && entry[3] >= 0 && entry[3] < entry[2].length && Boolean(entry[4]), "question answer or explanation is invalid: " + entry[1]);
      }
    }
  }
  for (const key of expectedTopics) {
    check(idSet.has("t" + key), "missing topic article: " + key);
    check(html.includes('data-drill="' + key + '"'), "topic drill link is missing: " + key);
    for (const kind of ["C", "Q"]) check(banks[kind].some((entry) => entry[0] === key), "topic has no " + kind + " practice: " + key);
  }
  for (const [key, count] of [["16", 12], ["17", 13], ["18", 20], ["18B", 12], ["19", 12], ["20", 16], ["21", 16], ["22", 10]]) {
    check(banks.C.filter((entry) => entry[0] === key).length === count, "new topic card coverage is incomplete: " + key);
    check(banks.Q.filter((entry) => entry[0] === key).length === 8, "new topic scenario coverage is incomplete: " + key);
  }
}
for (const target of matches(/data-lesson-choice="([a-z-]+)"/g)) {
  check(idSet.has(target), "lesson explorer points to a missing panel: " + target);
  check(html.includes('aria-controls="' + target + '"'), "lesson explorer has no accessible control relationship: " + target);
}
check(html.includes('"L13":["DHCP","pools, exclusions, SLAAC","16"]'), "DHCP lab does not link to its new topic");

// Topics 18B–22: technical anchors that must survive future edits.
const topicAnchors = {
  t18B: ["standby 1 ip 10.1.1.1", "standby 1 priority 110", "10.1.1.129", "0000.0C07.ACxx", "0000.0C9F.Fxxx", "224.0.0.102", "gratuitous ARP", "preempt"],
  t19: ["StackWise", "VSS", "RPR+", "SSO", "Nonstop Forwarding", "RIB", "FIB", "nine"],
  t20: ["DSCP 46", "AFxy = 8x + 2y", "ECN", "WRED", "token bucket", 'id="dscpTool"', "IntServ", "DiffServ"],
  t21: ["%SYS-5-CONFIG_I", "service timestamps log datetime", "show ntp associations", "UDP 161", "UDP 162", "snmp-server group NetOps v3 priv", "remote-span", "encapsulation replicate", 'id="sevTool"'],
  t22: ["Availability", "Integrity", "Confidentiality", "DMZ", "stateful", "signatures", "NGFW", "NGIPS"],
};
for (const [id, required] of Object.entries(topicAnchors)) {
  const start = html.indexOf('id="' + id + '"');
  const body = start < 0 ? "" : html.slice(start, html.indexOf("</article>", start));
  check(Boolean(body), "missing topic article " + id);
  for (const fragment of required) check(body.includes(fragment), id + " is missing anchor: " + fragment);
}

// Final exam center: tab, exam facts, practice tools, and printable sheet.
check(html.includes('<section class="tab" id="final">'), "FINAL section is missing");
for (const fragment of [
  "Tuesday 20 October 2026",
  "15:30–18:30",
  "<b>620</b>",
  "one A4 sheet, both sides",
  "midterm A4 sheet is returned during the exam",
  "Pencil, eraser, pen",
  "Theory · device configuration · system analysis",
  "from DHCP to the end of the slides",
  'new Date("2026-10-20T15:30:00+07:00")',
  'var FKEYS=["16","17","18","18B","19","20","21","22"]',
  'id="finMockPanel"',
  'id="finCfgPanel"',
  'id="finAnaPanel"',
  'id="sheetPanel"',
  'id="sheetFrame"',
  'id="masterPanel"',
  'cheatsheet/CNDM_Final_Cheatsheet.pdf',
]) {
  check(html.includes(fragment), "final exam center is missing: " + fragment);
}
const cfgCount = (html.match(/\{t:"(?:16|17|18|18B|19|20|21|22)",title:"[^"]+",\s*task:/g) || []).length;
const anaCount = (html.match(/\{t:"(?:16|17|18|18B|19|20|21|22)",title:"[^"]+",x:/g) || []).length;
check(cfgCount === 12, "expected 12 configuration tasks, found " + cfgCount);
check(anaCount === 20, "expected 20 analysis cases, found " + anaCount);
const adapterCss = fs.readFileSync(path.join(root, "study-console-adapter.css"), "utf8");
check(adapterCss.includes(".sheet-cover.on") && adapterCss.includes(".mst-in.right"), "cheat sheet viewer styles are missing");
for (const f of ["cheatsheet/final.html", "cheatsheet/CNDM_Final_Cheatsheet.pdf"]) {
  check(fs.existsSync(path.join(root, f)), "missing " + f);
}
{
  const sheet = fs.readFileSync(path.join(root, "cheatsheet/final.html"), "utf8");
  const sheetIds = new Set([...sheet.matchAll(/<h[23] id="([^"]+)"/g)].map((m) => m[1]));
  check(sheetIds.size >= 50, "cheat sheet headings need ids, found " + sheetIds.size);
  const locM = html.match(/var SHEETLOC=(\{.*?\});/);
  check(!!locM, "SHEETLOC map is missing");
  const loc = locM ? JSON.parse(locM[1]) : {};
  for (const id of sheetIds) check(id in loc, "SHEETLOC has no entry for sheet heading " + id);
  const refs = [...html.matchAll(/\{t:"[0-9B]+",s:"([a-z0-9]+)",q:"/g)].map((m) => m[1]);
  const refs2 = [...html.matchAll(/\{k:"[a-z0-9]+",title:"[^"]+",s:"([a-z0-9]+)",t:"/g)].map((m) => m[1]);
  for (const id of refs.concat(refs2)) check(sheetIds.has(id), "mastery item points at unknown sheet heading " + id);
  const look = (html.match(/\{t:"(?:16|17|18|18B|19|20|21|22)",s:"[a-z0-9]+",q:"[^"]+",o:\[[^\]]+\],n:/g) || []).length;
  const und = (html.match(/\{t:"(?:16|17|18|18B|19|20|21|22)",s:"[a-z0-9]+",q:"[^"]+",o:\[[^\]]+\],w:/g) || []).length;
  const reb = (html.match(/\{k:"[a-z0-9]+",title:"[^"]+",s:"[a-z0-9]+",t:"[0-9B]+",h:\[/g) || []).length;
  check(look >= 30, "expected at least 30 Find it fast items, found " + look);
  check(und >= 25, "expected at least 25 Beyond the sheet cases, found " + und);
  check(reb >= 10, "expected at least 10 Rebuild tables, found " + reb);
  console.log("Cheat sheet mastery: " + look + " lookups, " + und + " cases, " + reb + " tables, " + sheetIds.size + " sheet headings");
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

// Burmese layer: every tagged element and every final-scope card/question needs a translation.
const myFile = new URL("../i18n/my.js", import.meta.url);
check(fs.existsSync(myFile), "missing i18n/my.js (Burmese layer)");
let myKeys = 0;
if (fs.existsSync(myFile)) {
  const mySrc = fs.readFileSync(myFile, "utf8");
  const MY = JSON.parse(mySrc.slice(mySrc.indexOf("=") + 1, mySrc.lastIndexOf(";")));
  const tagged = [...html.matchAll(/data-i18n="([^"]+)"/g)].map((m) => m[1]);
  myKeys = tagged.length;
  check(new Set(tagged).size === tagged.length, "duplicate data-i18n keys");
  for (const key of tagged) check(typeof MY.s[key] === "string", "Burmese string missing for " + key);
  const finalTopics = new Set(["16", "17", "18", "18B", "19", "20", "21", "22"]);
  for (const m of html.matchAll(/^C\("([^"]+)","((?:[^"\\]|\\.)*)"/gm)) {
    if (finalTopics.has(m[1])) check(MY.cards[JSON.parse('"' + m[2] + '"')], "Burmese card missing: " + m[2].slice(0, 50));
  }
  for (const m of html.matchAll(/^Q\("([^"]+)","((?:[^"\\]|\\.)*)"/gm)) {
    if (finalTopics.has(m[1])) check(MY.qs[JSON.parse('"' + m[2] + '"')], "Burmese question missing: " + m[2].slice(0, 50));
  }
  check(MY.fin && MY.fin.cfg.length === 12 && MY.fin.ana.length === 20, "Burmese final-tab tasks incomplete");
  check(html.includes('function cardId(c){return c.t+"|"+(c.qe!==undefined?c.qe:c.q)}'), "card progress must stay keyed to English text");
}

if (failures.length) {
  console.error("NETDES validation failed (" + failures.length + ")");
  for (const failure of failures) console.error("- " + failure);
  process.exit(1);
}

console.log("NETDES validation passed");
console.log("- " + expectedLabs.length + " labs: " + expectedLabs.join(", "));
console.log("- " + cardCount + " flashcards, " + questionCount + " practice questions");
console.log("- " + ids.length + " unique IDs, " + inlineScripts.length + " inline script");
console.log("- Burmese layer: " + myKeys + " strings");
