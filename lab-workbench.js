(function(){
  "use strict";
  var LAB_DATA={
    L01:{practice:["Secure switch access with SSH","Configure management SVIs","Apply sticky port security","Verify access and saved state"],nodes:[
      ["PC1","endpoint",80,210,"192.168.56.130/25"],["swA","switch",300,210,"2960 · 192.168.56.251"],["swB","switch",600,210,"2960 · 192.168.56.252"],["PC2","endpoint",820,210,"192.168.56.131/25"]],links:[
      [0,1,"Fa0 ↔ Fa0/1","access"],[1,2,"Gi0/1 ↔ Gi0/1 · cross-over","trunk"],[2,3,"Fa0/2 ↔ Fa0","access"]]},
    L02:{practice:["Create VLAN 261 and VLAN 434","Assign four access ports","Build an 802.1Q trunk","Inspect TPID and TCI in Simulation mode"],nodes:[
      ["PC0","endpoint",80,105,"VLAN 261 · .10.11"],["PC2","endpoint",80,315,"VLAN 434 · .20.21"],["swA","switch",300,210,"Room 402"],["swB","switch",600,210,"Room 413"],["PC1","endpoint",820,105,"VLAN 261 · .10.12"],["PC3","endpoint",820,315,"VLAN 434 · .20.22"]],links:[
      [0,2,"Fa0/1 · VLAN 261","access"],[1,2,"Fa0/2 · VLAN 434","access"],[2,3,"Gi0/1 ↔ Gi0/2 · 802.1Q","trunk"],[3,4,"Fa0/3 · VLAN 261","access"],[3,5,"Fa0/4 · VLAN 434","access"]]},
    L03:{practice:["Configure VTPv2 roles","Build the ENG domain","Trace VLAN propagation","Explain transparent and client behavior"],nodes:[
      ["swA","switch",450,80,"SERVER · 5th floor"],["swB","switch",170,220,"CLIENT · 4th floor"],["swC","switch",600,220,"TRANSPARENT · 6th floor"],["swD","switch",720,365,"SERVER · 7th floor"]],links:[
      [0,1,"Gi0/2 ↔ Gi0/1","trunk"],[0,2,"Gi0/1 ↔ Gi0/1","trunk"],[2,3,"Gi0/2 ↔ Gi0/1","trunk"]]},
    L04:{practice:["Observe STP before bundling","Form an active/passive LACP channel","Configure the Port-Channel trunk","Verify SU and P bundle flags"],nodes:[
      ["pcX","endpoint",70,210,"VLAN 100"],["SWA","l3",280,210,"3650 · LACP active"],["SWB","l3",620,210,"3650 · LACP passive"],["pcY","endpoint",830,210,"VLAN 100"]],links:[
      [0,1,"Gi1/0/21","access"],[1,2,"Gi1/0/1–3 ↔ Gi1/0/11–13 · Po3/Po4","bundle"],[2,3,"Gi1/0/21","access"]]},
    L05:{practice:["Build router-on-a-stick gateways","Configure Layer 3 switch SVIs","Route across the /30 link with OSPF","Verify IPv4 and IPv6 reachability"],nodes:[
      ["PC1","endpoint",55,95,"VLAN 10 · .10.11"],["PC2","endpoint",55,325,"VLAN 20 · .20.11"],["swA","switch",245,210,"2960 · L2"],["rC","router",450,210,"1941 · router-on-a-stick"],["swB","l3",655,210,"3650 · SVIs"],["PC3","endpoint",830,95,"VLAN 30 · .30.11"],["PC4","endpoint",830,325,"VLAN 40 · .40.11"]],links:[
      [0,2,"Fa0/1 · VLAN 10","access"],[1,2,"Fa0/2 · VLAN 20","access"],[2,3,"Gi0/1 ↔ G0/0 · 802.1Q","trunk"],[3,4,"G0/1 .100.1 ↔ Gi1/0/24 .100.2 /30","routed"],[4,5,"Gi1/0/3 · VLAN 30","access"],[4,6,"Gi1/0/4 · VLAN 40","access"]]},
    L06:{practice:["Create primary and secondary PVLANs","Map community and isolated host ports","Configure the promiscuous router link","Prove the connectivity policy"],nodes:[
      ["PC1","endpoint",70,65,".10.11 · community"],["PC2","endpoint",70,165,".10.12 · community"],["PC3","endpoint",70,285,".10.21 · isolated"],["PC4","endpoint",70,385,".10.22 · isolated"],["SWA","switch",365,220,"L2 IOU · primary 10"],["RB","router",630,220,"e0/0 .10.1 · e0/1 100.1.1.1"],["PC5","endpoint",835,220,"100.1.1.201/24"]],links:[
      [0,4,"e1/0 · secondary 101","access"],[1,4,"e1/1 · secondary 101","access"],[2,4,"e2/0 · secondary 102","access"],[3,4,"e2/1 · secondary 102","access"],[4,5,"e0/0 ↔ e0/0 · promiscuous","routed"],[5,6,"e0/1","access"]]},
    L07:{practice:["Elect the root bridge by BID","Choose one root port per non-root","Assign designated ports per segment","Identify the two blocked ports"],shared:"stp-plain"},
    L08:{practice:["Verify PVST+ with show output","Compare VLAN 1 and VLAN 10 trees","Read root, role, state and cost","Explain every tie-break"],shared:"stp"},
    L09:{practice:["Set exact bridge priorities","Verify displayed priority plus VLAN ID","Use root primary on SW2","Recalculate every changed port role"],shared:"stp"},
    L10:{practice:["Capture classic STP transition states","Measure link-failure convergence","Apply PortFast to a host port","Explain role/state independence"],shared:"stp-hosts"},
    L11:{practice:["Mix 802.1D and RSTP safely","Compare legacy and rapid recovery","Verify per-port backward compatibility","Explain proposal/agreement"],shared:"stp-hosts"},
    L12:{practice:["Build one MST region","Map VLANs 51–60 and 61–70","Elect a different root per instance","Steer instance 2 with path cost"],nodes:[
      ["IOU1","switch",450,65,"aabb.cc00.0100"],["IOU2","switch",170,220,"ROOT · MST1"],["IOU4","switch",730,220,"ROOT · MST2"],["IOU3","switch",450,385,"aabb.cc00.0300"]],links:[
      [0,1,"e0/0 ↔ e0/1","trunk"],[0,2,"e1/3 ↔ e1/2","trunk"],[1,3,"e0/2 ↔ e0/3","trunk"],[3,2,"e1/0 ↔ e1/1","trunk"],[1,2,"e2/0 ↔ e2/1 · MST2 cost 10,000,000","blocked"]]},
    L13:{practice:["Serve DHCP from an L3 switch","Serve DHCP over router-on-a-stick","Constrain leases with exclusions","Verify DHCP and IPv6 SLAAC"],nodes:[
      ["PC1","endpoint",65,75,"DHCP · VLAN 10"],["PC2","endpoint",65,185,"DHCP · VLAN 20"],["swA","l3",300,130,"SVIs · DHCP server"],["swB","switch",575,305,"VLAN 30/40 · L2"],["rC","router",760,305,"subinterfaces · DHCP server"],["PC3","endpoint",300,285,"DHCP · VLAN 30"],["PC4","endpoint",300,395,"DHCP · VLAN 40"]],links:[
      [0,2,"Gi1/0/1 · VLAN 10","access"],[1,2,"Gi1/0/2 · VLAN 20","access"],[5,3,"Fa0/1 · VLAN 30","access"],[6,3,"Fa0/2 · VLAN 40","access"],[3,4,"Gi0/1 ↔ Gi0/1 · 802.1Q","trunk"]]}
  };
  var STP_PLAIN={nodes:[
    ["SW1","switch",450,65,"000C.858B.5322"],["SW2","switch",450,215,"0040.0B0B.0AB7"],["SW3","switch",190,365,"0090.21D7.0E24"],["SW4","switch",710,365,"000C.CFA1.904D"]],links:[
    [0,1,"Fa0/1→Fa0/4","access"],[0,1,"Fa0/2→Fa0/3","access",34],[1,2,"Fa0/5 ↔ Fa0/7","access"],[1,3,"Fa0/6 ↔ Fa0/9","access"],[2,3,"Fa0/8 ↔ Fa0/10","access"]]};
  var STP=JSON.parse(JSON.stringify(STP_PLAIN));
  STP.nodes.push(["PCA","endpoint",45,365,"SW3 Fa0/11 · VLAN 10"]);
  STP.links.push([4,2,"Fa0 ↔ Fa0/11","access"]);
  var STP_HOSTS=JSON.parse(JSON.stringify(STP));
  STP_HOSTS.nodes.push(["PCB","endpoint",830,365,"SW4 Fa0/12 · VLAN 10"]);
  STP_HOSTS.links.push([5,3,"Fa0 ↔ Fa0/12","access"]);

  function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function lineGeom(a,b,offset){
    var dx=b[2]-a[2],dy=b[3]-a[3],len=Math.sqrt(dx*dx+dy*dy)||1,ox=-(dy/len)*(offset||0),oy=(dx/len)*(offset||0);
    return {x1:a[2]+ox,y1:a[3]+oy,x2:b[2]+ox,y2:b[3]+oy,mx:(a[2]+b[2])/2+ox,my:(a[3]+b[3])/2+oy};
  }
  function nodeSvg(n){
    var name=esc(n[0]),type=n[1],x=n[2],y=n[3],sub=esc(n[4]||"");
    var w=type==="endpoint"?116:150,h=58,x0=x-w/2,y0=y-h/2;
    var icon=type==="endpoint"?'<rect x="'+(x0+10)+'" y="'+(y0+12)+'" width="23" height="16" rx="2" fill="none" stroke="currentColor"/><line x1="'+(x0+16)+'" y1="'+(y0+33)+'" x2="'+(x0+28)+'" y2="'+(y0+33)+'" stroke="currentColor"/>':type==="router"?'<circle cx="'+(x0+22)+'" cy="'+y+'" r="12" fill="none" stroke="currentColor"/><path d="M'+(x0+14)+' '+y+'h16m-5-5 5 5-5 5" fill="none" stroke="currentColor"/>':'<rect x="'+(x0+10)+'" y="'+(y0+15)+'" width="27" height="14" rx="2" fill="none" stroke="currentColor"/><circle class="port-dot" cx="'+(x0+16)+'" cy="'+(y0+22)+'" r="1.6"/><circle class="port-dot" cx="'+(x0+23)+'" cy="'+(y0+22)+'" r="1.6"/><circle class="port-dot" cx="'+(x0+30)+'" cy="'+(y0+22)+'" r="1.6"/>';
    return '<g class="node '+type+'" style="color:var(--'+(type==="endpoint"?'am':type==="router"||type==="l3"?'gr':'cy')+')"><rect class="node-box" x="'+x0+'" y="'+y0+'" width="'+w+'" height="'+h+'" rx="10"/>'+icon+'<text class="node-title" x="'+(x0+43)+'" y="'+(y-2)+'">'+name+'</text><text class="node-sub" x="'+(x0+10)+'" y="'+(y0+h+16)+'">'+sub+'</text></g>';
  }
  function topologySvg(data,title){
    var links="",nodes="";
    data.links.forEach(function(l,i){var a=data.nodes[l[0]],b=data.nodes[l[1]],g=lineGeom(a,b,l[4]||(i===1&&l[0]===0&&l[1]===1?-28:0));if(l[3]==="bundle"){[-10,0,10].forEach(function(offset){var member=lineGeom(a,b,offset);links+='<line class="link bundle" x1="'+member.x1+'" y1="'+member.y1+'" x2="'+member.x2+'" y2="'+member.y2+'"/>'})}else{links+='<line class="link '+esc(l[3]||"access")+'" x1="'+g.x1+'" y1="'+g.y1+'" x2="'+g.x2+'" y2="'+g.y2+'"/>'}links+='<text class="link-label" x="'+g.mx+'" y="'+(g.my-8)+'" text-anchor="middle">'+esc(l[2])+'</text>'});
    data.nodes.forEach(function(n){nodes+=nodeSvg(n)});
    return '<svg viewBox="0 0 900 460" role="img" aria-label="'+esc(title)+' topology diagram" xmlns="http://www.w3.org/2000/svg">'+links+nodes+'</svg>';
  }
  function makeTopology(id,data,title){
    var set=data.shared==="stp-plain"?STP_PLAIN:data.shared==="stp"?STP:data.shared==="stp-hosts"?STP_HOSTS:data;
    var el=document.createElement("div");el.className="lab-topology";
    var labels={access:"access / physical",trunk:"trunk",bundle:"EtherChannel",routed:"routed / gateway",blocked:"blocked / constrained"};
    var types=[];set.links.forEach(function(link){var type=link[3]||"access";if(types.indexOf(type)<0)types.push(type)});
    el.innerHTML='<div class="lab-topology-head"><h4>Topology</h4><p>Interfaces and roles follow the authoritative lab material.</p></div>'+topologySvg(set,"LAB "+id.slice(1)+" "+title)+'<div class="lab-topology-legend">'+types.map(function(type){return '<span class="'+type+'">'+labels[type]+'</span>'}).join("")+'</div>';
    return el;
  }
  function phaseCandidates(lab){return Array.prototype.filter.call(lab.querySelectorAll(":scope > h4"),function(h){return /phase|part|steps|sequence|experiments|sections|method/i.test(h.textContent)})}
  function wrapPhase(h,id,n){
    var box=document.createElement("section");box.className="lab-phase";box.dataset.phase=id+"-"+n;
    h.parentNode.insertBefore(box,h);box.appendChild(h);
    var next=box.nextSibling;
    while(next&&!(next.nodeType===1&&(next.matches("h4,.foot")||next.classList.contains("lab-phase")))){var move=next;next=next.nextSibling;box.appendChild(move)}
    var check=document.createElement("label");check.className="lab-phase-check";check.innerHTML='<input type="checkbox"> Phase complete';box.appendChild(check);
    var input=check.querySelector("input"),key="netdes-phase-"+id+"-"+n;
    try{input.checked=localStorage.getItem(key)==="1"}catch(e){}
    box.classList.toggle("is-done",input.checked);
    input.addEventListener("change",function(){box.classList.toggle("is-done",input.checked);try{localStorage.setItem(key,input.checked?"1":"0")}catch(e){}});
  }
  function markSolutions(lab){
    lab.querySelectorAll("details").forEach(function(d){d.classList.add("lab-solution")});
    lab.querySelectorAll(".box.rl").forEach(function(x){x.classList.add("lab-expected")});
    lab.querySelectorAll(".box.trap").forEach(function(x){x.classList.add("lab-hint")});
  }
  function revealBar(lab){
    var bar=document.createElement("div");bar.className="lab-reveal";
    [["Hint",".lab-hint"],["Commands",".lab-solution"],["Expected result",".lab-expected"]].forEach(function(spec){var b=document.createElement("button");b.className="lab-action";b.textContent="Reveal "+spec[0].toLowerCase();b.addEventListener("click",function(){lab.querySelectorAll(spec[1]).forEach(function(x){x.classList.add("revealed");if(x.tagName==="DETAILS")x.open=true});b.disabled=true;b.textContent=spec[0]+" revealed"});bar.appendChild(b)});
    var first=lab.querySelector(".lab-phase");(first||lab.querySelector(".tldr")).insertAdjacentElement(first?"beforebegin":"afterend",bar);
  }
  function resetLab(id,lab){
    lab.querySelectorAll(".lab-phase-check input").forEach(function(i){i.checked=false;i.dispatchEvent(new Event("change"))});
    lab.querySelectorAll(".revealed").forEach(function(x){x.classList.remove("revealed");if(x.tagName==="DETAILS")x.open=false});
    var done=lab.querySelector('.dn[data-k="'+id+'"]');if(done&&done.checked){done.click()}
    lab.scrollIntoView({behavior:"smooth",block:"start"});
  }
  function shell(id,lab,data){
    var shell=document.createElement("div");shell.className="lab-shell";
    shell.innerHTML='<div class="lab-shell-top"><span class="lab-shell-label">What you will practice</span><div class="lab-mode" role="group" aria-label="Lab display mode"><button type="button" data-mode="study" aria-pressed="true">Study</button><button type="button" data-mode="practice" aria-pressed="false">Practice</button></div><button class="lab-action" type="button" data-reset>Reset lab</button></div><ul class="lab-practice-list">'+data.practice.map(function(x){return"<li>"+esc(x)+"</li>"}).join("")+'</ul>';
    shell.querySelectorAll("[data-mode]").forEach(function(b){b.addEventListener("click",function(){var practice=b.dataset.mode==="practice";lab.classList.toggle("practice-mode",practice);shell.querySelectorAll("[data-mode]").forEach(function(x){x.setAttribute("aria-pressed",String(x===b))});if(practice)lab.querySelectorAll("details.lab-solution").forEach(function(d){d.open=false})})});
    shell.querySelector("[data-reset]").addEventListener("click",function(){resetLab(id,lab)});
    return shell;
  }
  function buildIndex(labs){
    var host=document.querySelector("#labs .wrap"),title=host&&host.querySelector("h1");if(!host||!title)return;
    var nav=document.createElement("nav");nav.className="lab-index";nav.setAttribute("aria-label","Lab Workbench index");
    labs.forEach(function(lab){var id=lab.id,b=document.createElement("button"),name=lab.querySelector("h3").textContent.trim();b.type="button";b.title="LAB "+id.slice(1)+" — "+name;b.textContent=id.slice(1);var done=lab.querySelector('.dn[data-k="'+id+'"]');if(done)b.classList.toggle("done",done.checked);b.addEventListener("click",function(){lab.scrollIntoView({behavior:"smooth",block:"start"})});if(done)done.addEventListener("change",function(){b.classList.toggle("done",done.checked)});nav.appendChild(b)});
    title.insertAdjacentElement("afterend",nav);
  }
  function enhance(){
    var labs=Array.prototype.slice.call(document.querySelectorAll("article.lab[id]"));buildIndex(labs);
    labs.forEach(function(lab){var id=lab.id,data=LAB_DATA[id];if(!data)return;var header=lab.querySelector(":scope > .ph"),title=header.querySelector("h3").textContent.trim(),lede=lab.querySelector(":scope > .tldr");header.insertAdjacentElement("afterend",shell(id,lab,data));var anchor=Array.prototype.find.call(lab.querySelectorAll(":scope > h4"),function(h){return /topology|ผัง|สิ่งที่โจทย์|setup|ตั้งต้น/i.test((h.textContent||"")+" "+(h.dataset.th||""))});(anchor||lede).insertAdjacentElement(anchor?"beforebegin":"afterend",makeTopology(id,data,title));markSolutions(lab);phaseCandidates(lab).forEach(function(h,n){wrapPhase(h,id,n+1)});revealBar(lab)
    });
    var sim=document.getElementById("sim"),l7=document.getElementById("L07");if(sim&&l7){var foot=l7.querySelector(":scope > .foot");sim.classList.add("lab-stp-simulator");sim.querySelector("h2").textContent="Interactive STP topology";l7.insertBefore(sim,foot)}
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",enhance);else enhance();
})();
