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
    L02:{note:"Source-faithful redraw · Room 402 and Room 413 retain their VLAN bands and trunk placement.",key:[["legend-vlan261","VLAN 261 · staffs"],["legend-vlan434","VLAN 434 · students"],["legend-trunk","802.1Q trunk"]]},
    L03:{note:"Source-faithful redraw · floor tiles, VTP roles, and VLAN ownership match the supplied figure.",key:[["legend-server","VTP server"],["legend-client","VTP client"],["legend-transparent","VTP transparent"]]},
    L04:{note:"Source-faithful redraw · three individual physical links remain visible inside the LACP bundle.",key:[["legend-ether","three physical links"],["legend-trunk","EtherChannel trunk"]]},
    L05:{note:"Source-faithful redraw · Room401 and Room402 keep their original router, switch, host, and /30 layout.",key:[["legend-room401","Room401 · router-on-a-stick"],["legend-room402","Room402 · SVIs"],["legend-routed","192.168.100.0/30"]]},
    L06:{note:"Source-faithful redraw · primary, community, isolated, and promiscuous-port relationships are shown as supplied.",key:[["legend-primary","primary VLAN 10"],["legend-community","community VLAN 101"],["legend-isolated","isolated VLAN 102"]]},
    L07:{note:"Source-faithful redraw · VLAN 1, bridge IDs, all five links, and every interface label are retained.",key:[]},
    L08:{note:"Source-faithful redraw · the LAB 07 switching layout plus PCA on VLAN 10.",key:[]},
    L09:{note:"Source-faithful redraw · VLAN 10 priorities and ports follow the supplied configuration figure.",key:[]},
    L10:{note:"Source-faithful redraw · both access hosts and the configured bridge priorities are retained.",key:[]},
    L11:{note:"Source-faithful redraw · the RSTP exercise starts from the same four-switch, two-host layout.",key:[]},
    L12:{note:"Source-faithful redraw · the five links, IOU placement, and red MST instance-2 cost link match the source.",key:[["legend-mst","MST region"],["legend-mst-cost","instance 2 path-cost link"]]},
    L13:{note:"Source-faithful redraw · the independent Layer 3-switch and router-on-a-stick domains keep their supplied placement.",key:[]}
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
    s+=box(65,55,370,410,"topo-region vlan-room vlan-room402",26)+box(565,55,370,410,"topo-region vlan-room vlan-room413",26);
    s+=box(78,105,344,98,"topo-region vlan261",0)+box(78,310,344,105,"topo-region vlan434",0);
    s+=box(578,105,344,98,"topo-region vlan261",0)+box(578,310,344,105,"topo-region vlan434",0);
    s+=tx(250,48,"Room402","topo-room-label","middle")+tx(750,48,"Room 413","topo-room-label","middle");
    s+=tl(250,135,["VLAN 261","staffs"],"topo-vlan261-label","middle",18)+tl(750,135,["VLAN 261","staffs"],"topo-vlan261-label","middle",18);
    s+=tl(250,347,["VLAN 434","students"],"topo-vlan434-label","middle",18)+tl(750,347,["VLAN 434","students"],"topo-vlan434-label","middle",18);
    s+=link(208,178,277,238,"physical")+link(208,367,277,282,"physical")+link(323,260,677,260,"trunk")+link(723,238,792,178,"physical")+link(723,282,792,367,"physical");
    s+=tx(222,216,"Fa0/1","topo-port","middle")+tx(225,337,"Fa0/2","topo-port","middle")+tx(372,246,"Gi0/1","topo-port","middle")+tx(500,239,"trunk","topo-link-note","middle")+tx(627,246,"Gi0/2","topo-port","middle")+tx(778,216,"Fa0/3","topo-port","middle")+tx(775,337,"Fa0/4","topo-port","middle");
    s+=pc(180,172)+pc(180,370)+sw(300,260)+sw(700,260)+pc(820,172)+pc(820,370);
    s+=tx(180,227,"PC0","topo-device-label","middle")+tx(180,425,"PC2","topo-device-label","middle")+tx(252,258,"swA","topo-device-label","end")+tx(748,258,"swB","topo-device-label","start")+tx(820,227,"PC1","topo-device-label","middle")+tx(820,425,"PC3","topo-device-label","middle");
    return canvas("L02",title,"0 0 1000 510",s);
  }

  function floorTile(x,y,w,h,label){
    return box(x,y,w,h,"topo-region floor-tile",0)+tx(x+w/2,y-10,label,"topo-floor-label","middle");
  }
  function lab03(title){
    var s="";
    s+=floorTile(365,66,270,108,"5th floor")+floorTile(55,222,270,112,"4th floor")+floorTile(365,340,270,126,"6th floor")+floorTile(700,255,245,210,"7th floor");
    s+=link(468,169,244,258,"trunk")+link(500,169,500,374,"trunk")+link(548,402,748,365,"trunk");
    s+=tx(325,214,"trunk","topo-link-note","middle")+tx(520,265,"trunk","topo-link-note","start")+tx(650,360,"trunk","topo-link-note","middle");
    s+=tx(428,157,"Gig0/2","topo-port","middle")+tx(260,246,"Gig0/1","topo-port","middle")+tx(487,157,"Gig0/1","topo-port","middle")+tx(487,361,"Gig0/1","topo-port","middle")+tx(561,390,"Gig0/2","topo-port","middle")+tx(737,353,"Gig0/1","topo-port","middle");
    s+=sw(500,145)+sw(210,280)+sw(500,400)+sw(795,365);
    s+=tx(500,121,"swA","topo-device-label","middle")+tx(390,102,"server","topo-role","start")+tl(570,101,["VLAN 30 bachelor","VLAN 40 grad"],"topo-vlan-note","start",17);
    s+=tx(170,273,"swB","topo-device-label","end")+tx(74,304,"client","topo-role","start");
    s+=tx(500,431,"swC","topo-device-label","middle")+tx(500,456,"transparent","topo-role","middle")+tx(500,476,"VLAN 100 faculty","topo-vlan-note","middle");
    s+=tx(795,342,"swD","topo-device-label","middle")+tx(795,420,"server","topo-role","middle");
    s+=building(155,426)+tx(155,476,"30th year bldg","topo-building-label","middle");
    return canvas("L03",title,"0 0 1000 520",s);
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
    s+=box(55,52,420,430,"topo-region intervlan-room intervlan-room401",0)+box(525,52,420,430,"topo-region intervlan-room intervlan-room402",0);
    s+=tx(69,76,"Room401","topo-room-corner","start")+tx(931,76,"Room402","topo-room-corner","end");
    s+=link(255,169,255,247,"trunk")+link(302,138,698,138,"routed")+link(215,289,152,376,"physical")+link(295,289,358,376,"physical")+link(700,189,648,376,"physical")+link(780,189,852,376,"physical");
    s+=tx(232,203,"G0/0","topo-port","end")+tx(278,221,"G0/1","topo-port","start")+tx(340,121,"G0/1","topo-port","middle")+tx(418,121,"192.168.100.1/30","topo-address","middle")+tx(580,121,"192.168.100.2/30","topo-address","middle")+tx(650,121,"G1/0/24","topo-port","middle");
    s+=tx(179,333,"F0/1","topo-port","middle")+tx(330,333,"F0/2","topo-port","middle")+tx(651,285,"G1/0/3","topo-port","middle")+tx(822,285,"G1/0/4","topo-port","middle");
    s+=router(255,140)+sw(255,270)+sw(740,165,"topo-l3")+pc(145,400)+pc(365,400)+pc(645,400)+pc(855,400);
    s+=tx(255,107,"rC(1941)","topo-device-label","middle")+tx(255,318,"swA(2960)","topo-device-label","middle")+tx(740,112,"swB(3650)","topo-device-label","middle");
    s+=tl(145,354,["vlan10","year1"],"topo-vlan-group","middle",18)+tl(365,354,["vlan20","year2"],"topo-vlan-group","middle",18)+tl(645,354,["vlan30","year3"],"topo-vlan-group","middle",18)+tl(855,354,["vlan40","year4"],"topo-vlan-group","middle",18);
    s+=tx(145,453,"PC1","topo-device-label","middle")+tx(365,453,"PC2","topo-device-label","middle")+tx(645,453,"PC3","topo-device-label","middle")+tx(855,453,"PC4","topo-device-label","middle");
    return canvas("L05",title,"0 0 1000 525",s);
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
      s+=tx(432,105,"000C.858B.5322","topo-mac","end")+tx(432,267,"0040.0B0B.0AB7","topo-mac","end")+tx(280,522,"0090.21D7.0E24","topo-mac","middle")+tx(720,522,"000C.CFA1.904D","topo-mac","middle")+tx(125,220,"VLAN 1","topo-vlan-small","middle");
    }else{
      s+=pc(85,440)+tx(85,390,"VLAN 10","topo-vlan-small","middle")+tx(85,490,"PCA","topo-device-label","middle")+tx(85,516,(hasPcb?"192.168.10.5/24":"192.168.10.5"),"topo-address","middle");
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
