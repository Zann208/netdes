"use strict";
(function(){
  var codes=["261434","CPE434","269430","269202","269497","261305"];
  function clean(s){
    var out=String(s==null?"":s);
    codes.forEach(function(code){
      out=out.replace(new RegExp("\\s*[·:/-]*\\s*"+code+"\\b","g"),"");
    });
    return out.replace(/\s{2,}/g," ").trim();
  }
  function apply(){
    document.title=clean(document.title)||"Network Design Console";
    var root=document.body||document.documentElement;
    if(!root)return;
    var walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
    var nodes=[],n;
    while((n=walker.nextNode()))nodes.push(n);
    nodes.forEach(function(node){
      var p=node.parentElement;
      if(!p||/^(SCRIPT|STYLE|PRE|CODE|TEXTAREA)$/i.test(p.tagName))return;
      var value=node.nodeValue, next=clean(value);
      if(next!==value)node.nodeValue=next;
    });
    document.querySelectorAll('[title],[aria-label]').forEach(function(el){
      ['title','aria-label'].forEach(function(a){if(el.hasAttribute(a))el.setAttribute(a,clean(el.getAttribute(a)));});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
  setTimeout(apply,300);
})();
