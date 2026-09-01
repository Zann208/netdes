(function(){
  "use strict";

  /*
   * These are redraws of the supplied lab figures, not inferred network maps.
   * Keep each renderer tied to its LAB number so a later content update cannot
   * silently change the learner's visual reference.
   */
  var LAB_DATA={
    L01:{practice:["Secure switch access with SSH","Configure management SVIs","Apply sticky port security","Verify access and saved state"]},
    L02:{practice:["Create VLAN 261 and VLAN 434","Assign four access ports","Build an 802.1Q trunk","Inspect TPID and TCI in Simulation mode"]},
    L03:{practice:["Configure VTPv2 roles","Build the ENG domain","Trace VLAN propagation","Explain transparent and client behavior"]},
    L04:{practice:["Observe STP before bundling","Form an active/passive LACP channel","Configure the Port-Channel trunk","Verify SU and P bundle flags"]},
    L05:{practice:["Build router-on-a-stick gateways","Configure Layer 3 switch SVIs","Route across the /30 link with OSPF","Verify IPv4 and IPv6 reachability"]},
    L06:{practice:["Create primary and secondary PVLANs","Map community and isolated host ports","Configure the promiscuous router link","Prove the connectivity policy"]},
    L07:{practice:["Elect the root bridge by BID","Choose one root port per non-root","Assign designated ports per segment","Identify the two blocked ports"]},
    L08:{practice:["Verify PVST+ with show output","Compare VLAN 1 and VLAN 10 trees","Read root, role, state and cost","Explain every tie-break"]},
    L09:{practice:["Set exact bridge priorities","Verify displayed priority plus VLAN ID","Use root primary on SW2","Recalculate every changed port role"]},
    L10:{practice:["Capture classic STP transition states","Measure link-failure convergence","Apply PortFast to a host port","Explain role/state independence"]},
    L11:{practice:["Mix 802.1D and RSTP safely","Compare legacy and rapid recovery","Verify per-port backward compatibility","Explain proposal/agreement"]},
    L12:{practice:["Build one MST region","Map VLANs 51–60 and 61–70","Elect a different root per instance","Steer instance 2 with path cost"]},
    L13:{practice:["Serve DHCP from an L3 switch","Serve DHCP over router-on-a-stick","Constrain leases with exclusions","Verify DHCP and IPv6 SLAAC"]}
  };

  var TOPOLOGY_SOURCE={
    L01:{note:"Source-faithful redraw · PC1 — swA — swB — PC2, including the crossover link.",key:[]},
    L02:{note:"Figure-matched redraw · Room402/Room413 placement, the two VLAN bands, endpoints and trunk follow the supplied topology.",key:[["legend-vlan261","VLAN 261 · staffs"],["legend-vlan434","VLAN 434 · students"],["legend-trunk","802.1Q trunk"]]},
    L03:{note:"Figure-matched redraw · switch placement, floor labels, VTP roles, trunks and VLAN ownership follow the supplied topology.",key:[["legend-server","VTP server"],["legend-client","VTP client"],["legend-transparent","VTP transparent"]]},
    L04:{note:"Figure-matched redraw · SWA/SWB placement, pcX/pcY, three physical links and interface mapping follow the supplied topology.",key:[["legend-ether","three physical links"],["legend-trunk","EtherChannel trunk"]]},
    L05:{note:"Figure-matched redraw · Room401/Room402, router-on-a-stick, multilayer switch, hosts and the /30 routed link follow the supplied topology.",key:[["legend-room401","Room401 · router-on-a-stick"],["legend-room402","Room402 · SVIs"],["legend-routed","192.168.100.0/30"]]},
    L06:{note:"Figure-matched redraw · PC5/RB/SWA placement plus primary, community, isolated and promiscuous-port regions follow the supplied topology.",key:[["legend-primary","primary VLAN 10"],["legend-community","community VLAN 101"],["legend-isolated","isolated VLAN 102"]]},
    L07:{note:"Figure-matched redraw · VLAN 1, bridge IDs, all five links and interface labels follow the supplied topology.",key:[]},
    L08:{note:"Figure-matched redraw · the LAB 07 switch geometry is preserved and PCA is added exactly as the supplied LAB 08 figure shows.",key:[]},
    L09:{note:"Figure-matched redraw · LAB 08 geometry is preserved with the supplied VLAN 10 priorities in their original switch positions.",key:[]},
    L10:{note:"Figure-matched redraw · PCA/PCB, bridge priorities and the four-switch geometry follow the supplied topology.",key:[]},
    L11:{note:"Figure-matched redraw · the RSTP exercise keeps the same supplied four-switch, two-host layout and priorities.",key:[]},
    L12:{note:"Figure-matched redraw · IOU placement, all five links and the MST instance-2 cost link follow the supplied topology.",key:[["legend-mst","MST region"],["legend-mst-cost","instance 2 path-cost link"]]},
    L13:{note:"Figure-matched redraw · swA with PC1/PC2 and rC→swB with PC3/PC4 keep the supplied left/right placement.",key:[]}
  };

  function esc(s){return String(s).replace(/[&<>\"]/g,function(c){return{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]})}
  function tx(x,y,value,cls,anchor){
    return '<text class="'+(cls||"topo-text")+'" x="'+x+'" y="'+y+'"'+(anchor?' text-anchor="'+anchor+'"':"")+'>'+esc(value)+'</text>';
  }
  function tl(x,y,values,cls,anchor,step){
    var out='<text class="'+(cls||"topo-text")+'" x="'+x+'" y="'+y+'"'+(anchor?' text-anchor="'+anchor+'"':"")+'>';
    values.forEach(function(value,index){out+='<tspan x="'+x+'" dy="'+(index?(step||15):0)+'">'+esc(value)+'</tspan>'});
    return out+"</text>";
  }
  function box(x,y,w,h,cls,rx){
    return '<rect class="'+(cls||"topo-region")+'" x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(rx===undefined?10:rx)+'"/>';
  }
  function link(x1,y1,x2,y2,cls){
    return '<line class="topo-link '+(cls||"physical")+'" x1="'+x1+'" y1="'+y1+'" x2="'+x2+'" y2="'+y2+'"/>';
  }
  function sw(x,y,variant){
    var cls="topo-device topo-switch"+(variant?" "+variant:"");
    return '<g class="'+cls+'"><rect class="topo-switch-body" x="'+(x-48)+'" y="'+(y-22)+'" width="96" height="44" rx="6"/><path class="topo-switch-face" d="M'+(x-48)+" "+(y-2)+"H"+(x+48)+'"/><path class="topo-switch-arrows" d="M'+(x-27)+" "+(y-9)+"h17m-3-4 4 4-4 4M"+(x+27)+" "+(y+9)+"H"+(x+10)+"m3-4-4 4 4 4\"/><circle class=\"topo-led\" cx=\""+(x-34)+"\" cy=\""+(y+11)+"\" r=\"2\"/><circle class=\"topo-led\" cx=\""+(x-26)+"\" cy=\""+(y+11)+"\" r=\"2\"/></g>";
  }
  function router(x,y){
    return '<g class="topo-device topo-router"><ellipse class="topo-router-body" cx="'+x+'" cy="'+y+'" rx="50" ry="24"/><path class="topo-router-arrows" d="M'+(x-28)+" "+y+"h20m-5-5 5 5-5 5M"+(x+28)+" "+y+"h-20m5-5-5 5 5 5\"/></g>";
  }
  function pc(x,y){
    return '<g class="topo-device topo-pc"><rect class="topo-pc-screen" x="'+(x-27)+'" y="'+(y-25)+'" width="54" height="34" rx="3"/><rect class="topo-pc-stand" x="'+(x-5)+'" y="'+(y+10)+'" width="10" height="8" rx="1"/><path class="topo-pc-base" d="M'+(x-21)+" "+(y+21)+"h42l-7 9h-28z\"/></g>";
  }
  function building(x,y){
    var windows="";
    for(var row=0;row<3;row++)for(var col=0;col<3;col++)windows+='<rect class="topo-building-window" x="'+(x-14+col*10)+'" y="'+(y-16+row*10)+'" width="5" height="5"/>';
    return '<g class="topo-building"><rect class="topo-building-body" x="'+(x-22)+'" y="'+(y-27)+'" width="44" height="54" rx="2"/>'+windows+'</g>';
  }
  function canvas(id,title,viewBox,content){
    var titleId="topology-title-"+id.toLowerCase();
    return '<svg class="topology-svg topology-'+id.toLowerCase()+'" viewBox="'+viewBox+'" role="img" aria-labelledby="'+titleId+'" xmlns="http://www.w3.org/2000/svg"><title id="'+titleId+'">LAB '+esc(id.slice(1))+" — "+esc(title)+" — source-faithful topology redraw</title>"+content+"</svg>";
  }

  function lab01(title){
    var s="";
    s+=link(125,220,307,220,"physical")+link(403,220,597,220,"crossover")+link(693,220,875,220,"physical");
    s+=tx(215,172,"Check interface name in the Packet Tracer file.","topo-note","middle")+tx(785,172,"Check interface name in the Packet Tracer file.","topo-note","middle");
    s+=tx(204,207,"F0/...","topo-port","middle")+tx(281,207,"F0/1","topo-port","middle")+tx(505,207,"Gig0/1","topo-port","middle")+tx(563,207,"Gig0/1","topo-port","middle")+tx(720,207,"F0/2","topo-port","middle")+tx(798,207,"F0/...","topo-port","middle");
    s+=tx(214,246,"straight","topo-note","middle")+tx(500,246,"cross","topo-note","middle")+tx(787,246,"straight","topo-note","middle");
    s+=pc(96,220)+sw(355,220)+sw(645,220)+pc(904,220);
    s+=tx(96,298,"PC1","topo-device-label","middle")+tx(96,322,"192.168.56.130/25","topo-address","middle");
    s+=tx(355,298,"swA","topo-device-label","middle")+tx(645,298,"swB","topo-device-label","middle");
    s+=tx(904,298,"PC2","topo-device-label","middle")+tx(904,322,"192.168.56.131/25","topo-address","middle");
    return canvas("L01",title,"0 0 1000 380",s);
  }

  function lab02(title){
    var s="";
    /* Match the supplied figure's mental map: Room402 on the left, Room413 on
       the right, with VLAN 261 spanning the upper hosts and VLAN 434 spanning
       the lower hosts across the trunk. */
    s+=box(55,62,430,408,"topo-region vlan-room vlan-room402",24)+box(515,62,430,408,"topo-region vlan-room vlan-room413",24);
    s+=box(72,102,856,112,"topo-region vlan261",12)+box(72,326,856,112,"topo-region vlan434",12);
    s+=tx(270,50,"Room402","topo-room-label","middle")+tx(730,50,"Room 413","topo-room-label","middle");
    s+=tl(500,126,["VLAN 261","staffs"],"topo-vlan261-label","middle",18)+tl(500,352,["VLAN 434","students"],"topo-vlan434-label","middle",18);
    s+=link(205,177,277,239,"physical")+link(205,383,277,281,"physical")+link(323,260,677,260,"trunk")+link(723,239,795,177,"physical")+link(723,281,795,383,"physical");
    s+=tx(225,218,"Fa0/1","topo-port","middle")+tx(228,340,"Fa0/2","topo-port","middle")+tx(372,246,"Gi0/1","topo-port","middle")+tx(500,239,"trunk","topo-link-note","middle")+tx(628,246,"Gi0/2","topo-port","middle")+tx(775,218,"Fa0/3","topo-port","middle")+tx(772,340,"Fa0/4","topo-port","middle");
    s+=pc(175,170)+pc(175,390)+sw(300,260)+sw(700,260)+pc(825,170)+pc(825,390);
    s+=tx(175,225,"PC0","topo-device-label","middle")+tx(175,445,"PC2","topo-device-label","middle")+tx(252,258,"swA","topo-device-label","end")+tx(748,258,"swB","topo-device-label","start")+tx(825,225,"PC1","topo-device-label","middle")+tx(825,445,"PC3","topo-device-label","middle");
    return canvas("L02",title,"0 0 1000 510",s);
  }

  function floorTile(x,y,w,h,label){
    return box(x,y,w,h,"topo-region floor-tile",0)+tx(x+w/2,y-10,label,"topo-floor-label","middle");
  }
  function lab03(title){
    var s="";
    /* Mirror the supplied VTP figure: SWA / 5th floor at the top, SWB / 4th
       floor at left, SWC / 6th floor below SWA, and SWD / 7th floor at right. */
    s+=box(365,64,425,150,"topo-region floor-tile",0);
    s+=box(28,228,270,138,"topo-region floor-tile",0);
    s+=box(330,248,325,205,"topo-region floor-tile",0);
    s+=box(720,248,245,205,"topo-region floor-tile",0);
    s+=tx(578,51,"5th floor","topo-floor-label","middle");
    s+=tx(163,396,"4th floor","topo-floor-label","middle");
    s+=tx(492,486,"6th floor","topo-floor-label","middle");
    s+=tx(842,486,"7th floor","topo-floor-label","middle");

    s+=link(479,159,247,279,"trunk")+link(515,165,500,302,"trunk")+link(548,330,782,330,"trunk");
    s+=tx(346,215,"trunk","topo-link-note","middle")+tx(532,236,"trunk","topo-link-note","start")+tx(667,314,"trunk","topo-link-note","middle");
    s+=tx(431,172,"Gig0/2","topo-port","middle")+tx(270,268,"Gig0/1","topo-port","middle");
    s+=tx(532,189,"Gig0/1","topo-port","start")+tx(517,292,"Gig0/1","topo-port","start");
    s+=tx(570,315,"Gig0/2","topo-port","middle")+tx(758,315,"Gig0/1","topo-port","middle");

    s+=sw(520,145)+sw(200,300)+sw(500,330)+sw(830,330);
    s+=tx(520,111,"swA","topo-device-label","middle")+tx(397,126,"server","topo-role","start");
    s+=tl(613,127,["VLAN 30 bachelor","VLAN 40 grad"],"topo-vlan-note","start",20);
    s+=tx(200,276,"swB","topo-device-label","middle")+tx(55,322,"client","topo-role","start");
    s+=tx(500,371,"swC","topo-device-label","middle")+tx(500,404,"VLAN 100 faculty","topo-vlan-note","middle")+tx(500,432,"transparent","topo-role","middle");
    s+=tx(830,306,"swD","topo-device-label","middle")+tx(830,408,"server","topo-role","middle");
    s+=building(160,446)+tx(160,506,"30th year bldg","topo-building-label","middle");
    return canvas("L03",title,"0 0 1000 535",s);
  }

  function lab04(title){
    var s="";
    s+=tx(315,76,"VLAN100","topo-vlan-small","middle")+tx(315,94,"Net","topo-note","middle")+tx(685,76,"VLAN100","topo-vlan-small","middle")+tx(685,94,"Net","topo-note","middle");
    s+=link(127,208,272,208,"physical")+link(728,208,873,208,"physical");
    s+=link(368,185,632,185,"ether")+link(368,208,632,208,"ether")+link(368,231,632,231,"ether");
    s+='<ellipse class="topo-channel" cx="500" cy="208" rx="16" ry="48"/>';
    s+=tx(198,194,"Gig1/0/21","topo-port","middle")+tx(802,194,"Gig1/0/21","topo-port","middle")+tx(403,165,"Gig1/0/1-3","topo-port","middle")+tx(597,165,"Gig1/0/11-13","topo-port","middle");
    s+=pc(95,208)+sw(320,208,"topo-l3")+sw(680,208,"topo-l3")+pc(905,208);
    s+=tx(95,282,"pcX","topo-device-label","middle")+tx(320,140,"SWA","topo-device-label","middle")+tx(680,140,"SWB","topo-device-label","middle")+tx(905,282,"pcY","topo-device-label","middle");
    s+=tl(500,332,["SWA Gig1/0/1 - SWB Gig1/0/11","SWA Gig1/0/2 - SWB Gig1/0/12","SWA Gig1/0/3 - SWB Gig1/0/13"],"topo-mapping","middle",19);
    return canvas("L04",title,"0 0 1000 410",s);
  }

  function lab05(title){
    var s="";
    /* Keep the professor figure's two-room split: Room401 is the green
       router-on-a-stick side; Room402 is the yellow multilayer-switch side. */
    s+=box(20,58,490,415,"topo-region intervlan-room intervlan-room401",0)+box(530,58,450,415,"topo-region intervlan-room intervlan-room402",0);
    s+=tx(35,91,"Room401","topo-room-corner","start")+tx(965,91,"Room402","topo-room-corner","end");
    s+=building(520,82);

    s+=link(275,167,250,246,"trunk")+link(323,137,712,137,"routed")+link(211,287,132,393,"physical")+link(289,287,329,393,"physical")+link(727,176,647,393,"physical")+link(793,176,858,393,"physical");
    s+=tx(247,202,"G0/0","topo-port","end")+tx(267,222,"G0/1","topo-port","start");
    s+=tx(343,119,"G0/1","topo-port","middle")+tx(430,119,"192.168.100.1/30","topo-address","middle")+tx(616,119,"192.168.100.2/30","topo-address","middle")+tx(694,119,"G1/0/24","topo-port","middle");
    s+=tx(169,335,"F0/1","topo-port","middle")+tx(316,335,"F0/2","topo-port","middle")+tx(672,281,"G1/0/3","topo-port","middle")+tx(826,281,"G1/0/4","topo-port","middle");

    s+=router(275,138)+sw(250,268)+sw(760,145,"topo-l3")+pc(120,414)+pc(335,414)+pc(645,414)+pc(865,414);
    s+=tx(275,101,"rC(1941)","topo-device-label","middle")+tx(310,286,"swA(2960)","topo-device-label","start")+tx(760,105,"swB(3650)","topo-device-label","middle");
    s+=tl(78,330,["vlan10","year1"],"topo-vlan-group","start",24)+tl(349,330,["vlan20","year2"],"topo-vlan-group","start",24);
    s+=tl(550,330,["vlan30","year3"],"topo-vlan-group","start",24)+tl(880,330,["vlan40","year4"],"topo-vlan-group","middle",24);
    s+=tx(120,471,"PC1","topo-device-label","middle")+tx(335,471,"PC2","topo-device-label","middle")+tx(645,471,"PC3","topo-device-label","middle")+tx(865,471,"PC4","topo-device-label","middle");
    return canvas("L05",title,"0 0 1000 515",s);
  }

  function lab06(title){
    var s="";
    s+=box(72,238,856,268,"topo-pvlan-boundary",0)+box(95,338,350,145,"topo-region pvlan-community",0)+box(555,338,350,145,"topo-region pvlan-isolated",0);
    s+=tx(500,258,"promiscuous port","topo-pvlan-boundary-label","middle")+tx(900,258,"primary VLAN 10","topo-pvlan-boundary-label","end");
    s+=tl(112,362,["private VLAN 101","community"],"topo-pvlan-label","start",17)+tl(572,362,["private VLAN 102","isolated"],"topo-pvlan-label","start",17);
    s+=link(342,115,438,134,"physical")+link(500,164,500,272,"routed")+link(468,303,225,410,"pvlan")+link(490,305,340,410,"pvlan")+link(532,305,660,410,"pvlan")+link(550,303,775,410,"pvlan");
    s+=tx(390,105,"e0/1","topo-port","middle")+tx(519,221,"e0/0","topo-port","start")+tx(310,348,"e1/0","topo-port","middle")+tx(388,360,"e1/1","topo-port","middle")+tx(613,360,"e2/0","topo-port","middle")+tx(690,348,"e2/1","topo-port","middle");
    s+=pc(310,110)+router(470,145)+sw(510,292)+pc(210,430)+pc(350,430)+pc(650,430)+pc(790,430);
    s+=tx(310,72,"PC5","topo-device-label","middle")+tx(470,109,"RB","topo-device-label","middle")+tx(510,325,"SWA","topo-device-label","middle");
    s+=tx(210,469,"PC1","topo-device-label","middle")+tx(350,469,"PC2","topo-device-label","middle")+tx(650,469,"PC3","topo-device-label","middle")+tx(790,469,"PC4","topo-device-label","middle");
    return canvas("L06",title,"0 0 1000 550",s);
  }

  function stpLab(id,title){
    var s="",isManual=id==="L07",hasPca=!isManual,hasPcb=id==="L10"||id==="L11";
    var priorities=null;
    if(id==="L09")priorities=["20480","24576","32768","40960"];
    if(id==="L10"||id==="L11")priorities=["20480","16384","32768","40960"];
    s+=link(480,112,480,232,"physical")+link(520,112,520,232,"physical")+link(456,272,313,417,"physical")+link(544,272,687,417,"physical")+link(328,440,672,440,"physical");
    if(hasPca)s+=link(116,440,232,440,"physical");
    if(hasPcb)s+=link(768,440,884,440,"physical");
    s+=tx(466,140,"Fa0/1","topo-port","end")+tx(466,220,"Fa0/4","topo-port","end")+tx(534,140,"Fa0/2","topo-port","start")+tx(534,220,"Fa0/3","topo-port","start");
    s+=tx(438,296,"Fa0/5","topo-port","end")+tx(339,395,"Fa0/7","topo-port","middle")+tx(562,296,"Fa0/6","topo-port","start")+tx(661,395,"Fa0/9","topo-port","middle")+tx(405,428,"Fa0/8","topo-port","middle")+tx(595,428,"Fa0/10","topo-port","middle");
    if(hasPca)s+=tx(176,428,"Fa0/11","topo-port","middle");
    if(hasPcb)s+=tx(824,428,"Fa0/12","topo-port","middle");
    s+=sw(500,90)+sw(500,250)+sw(280,440)+sw(720,440);
    s+=tx(432,88,"SW1","topo-device-label","end")+tx(432,250,"SW2","topo-device-label","end")+tx(280,500,"SW3","topo-device-label","middle")+tx(720,500,"SW4","topo-device-label","middle");
    if(isManual){
      s+=tx(575,80,"000C.858B.5322","topo-mac","start")+tx(575,240,"0040.0B0B.0AB7","topo-mac","start")+tx(280,525,"0090.21D7.0E24","topo-mac","middle")+tx(720,525,"000C.CFA1.904D","topo-mac","middle");
      s+=tx(500,40,"VLAN 1","topo-vlan-small","middle");
    }else{
      s+=pc(85,440)+tx(85,390,"VLAN 10","topo-vlan-small","middle")+tx(85,490,"PCA","topo-device-label","middle")+tx(85,516,"192.168.10.5/24","topo-address","middle");
      if(hasPcb)s+=pc(915,440)+tx(915,390,"VLAN 10","topo-vlan-small","middle")+tx(915,490,"PCB","topo-device-label","middle")+tx(915,516,"192.168.10.6/24","topo-address","middle");
    }
    if(priorities){
      s+=tx(565,92,"configured priority: "+priorities[0],"topo-priority","start")+tx(565,252,"configured priority: "+priorities[1],"topo-priority","start")+tx(280,548,"configured priority: "+priorities[2],"topo-priority","middle")+tx(720,548,"configured priority: "+priorities[3],"topo-priority","middle");
    }
    return canvas(id,title,"0 0 1000 585",s);
  }

  function lab12(title){
    var s="";
    s+=link(462,125,292,247,"trunk")+link(538,125,708,247,"trunk")+link(292,293,462,395,"trunk")+link(538,395,708,293,"trunk")+link(342,270,658,270,"mst-cost");
    s+=tx(423,147,"e0/0","topo-port","middle")+tx(330,225,"e0/1","topo-port","middle")+tx(577,147,"e1/3","topo-port","middle")+tx(670,225,"e1/2","topo-port","middle")+tx(330,317,"e0/2","topo-port","middle")+tx(423,373,"e0/3","topo-port","middle")+tx(577,373,"e1/0","topo-port","middle")+tx(670,317,"e1/1","topo-port","middle")+tx(369,257,"e2/0","topo-port","middle")+tx(631,257,"e2/1","topo-port","middle");
    s+=tx(500,297,"MST instance 2 · cost 10,000,000","topo-mst-cost-label","middle");
    s+=sw(500,100,"topo-iou")+sw(250,270,"topo-iou")+sw(750,270,"topo-iou")+sw(500,420,"topo-iou");
    s+=tx(500,62,"IOU1","topo-device-label","middle")+tx(205,268,"IOU2","topo-device-label","end")+tx(795,268,"IOU4","topo-device-label","start")+tx(500,480,"IOU3","topo-device-label","middle");
    s+=tx(500,145,"aabb.cc00.0100","topo-mac","middle")+tx(250,323,"aabb.cc00.0200","topo-mac","middle")+tx(750,323,"aabb.cc00.0400","topo-mac","middle")+tx(500,505,"aabb.cc00.0300","topo-mac","middle");
    return canvas("L12",title,"0 0 1000 555",s);
  }

  function lab13(title){
    var s="";
    s+=link(272,283,137,412,"physical")+link(328,283,390,412,"physical")+link(700,145,700,242,"trunk")+link(662,283,617,412,"physical")+link(738,283,883,412,"physical");
    s+=tx(214,335,"G1/0/1","topo-port","middle")+tx(353,335,"G1/0/2","topo-port","middle")+tx(675,190,"G0/1","topo-port","end")+tx(725,190,"G0/1","topo-port","start")+tx(637,335,"F0/1","topo-port","middle")+tx(815,335,"F0/2","topo-port","middle");
    s+=tx(142,373,"vlan10","topo-vlan-group","middle")+tx(407,373,"vlan20","topo-vlan-group","middle")+tx(592,373,"vlan30","topo-vlan-group","middle")+tx(870,373,"vlan40","topo-vlan-group","middle");
    s+=sw(300,260,"topo-l3")+sw(700,260)+router(700,120)+pc(110,435)+pc(410,435)+pc(590,435)+pc(890,435);
    s+=tx(300,205,"swA","topo-device-label","middle")+tx(700,205,"swB","topo-device-label","middle")+tx(765,125,"rC","topo-device-label","start");
    s+=tx(110,495,"PC1","topo-device-label","middle")+tx(410,495,"PC2","topo-device-label","middle")+tx(590,495,"PC3","topo-device-label","middle")+tx(890,495,"PC4","topo-device-label","middle");
    return canvas("L13",title,"0 0 1000 545",s);
  }

  var TOPOLOGY_RENDERERS={
    L01:lab01,L02:lab02,L03:lab03,L04:lab04,L05:lab05,L06:lab06,
    L07:function(title){return stpLab("L07",title);},
    L08:function(title){return stpLab("L08",title);},
    L09:function(title){return stpLab("L09",title);},
    L10:function(title){return stpLab("L10",title);},
    L11:function(title){return stpLab("L11",title);},
    L12:lab12,L13:lab13
  };
  function topologySvg(id,title){
    return TOPOLOGY_RENDERERS[id](title);
  }
  function topologyLegend(items){
    if(!items||!items.length)return "";
    return '<div class="lab-topology-legend">'+items.map(function(item){return '<span class="'+esc(item[0])+'">'+esc(item[1])+"</span>"}).join("")+"</div>";
  }
  function makeTopology(id,data,title){
    var source=TOPOLOGY_SOURCE[id]||{note:"Source-faithful topology redraw.",key:[]};
    var el=document.createElement("div");el.className="lab-topology";
    el.innerHTML='<div class="lab-topology-head"><h4>Topology</h4><p>'+esc(source.note)+'</p></div>'+topologySvg(id,title)+topologyLegend(source.key);
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