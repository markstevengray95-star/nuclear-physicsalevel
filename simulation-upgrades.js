(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
let showVectors=true,showLabels=true,dataMode=false,challengeMode=true,raf=0;
const profiles={
 "Rutherford scattering":{
  what:"Electrostatic deflection of positive alpha particles by a compact positive nucleus.",
  scale:"Trajectory shape is qualitative; nuclear and atomic distances are greatly enlarged.",
  challenge:"Predict what happens to the deflection when the alpha particle passes closer to the nucleus.",
  answers:["Deflection increases","Deflection decreases","No change"],correct:0
 },
 "Radiation and absorption":{
  what:"Different penetration and attenuation behaviour for α, β and γ.",
  scale:"Absorber thickness is a relative teaching control rather than calibrated material data.",
  challenge:"Which radiation should lose the largest fraction of its beam first as absorber is added?",
  answers:["Alpha","Beta","Gamma"],correct:0
 },
 "Random decay and half-life":{
  what:"Random individual decays producing predictable exponential population behaviour.",
  scale:"The displayed nuclei are a finite visual sample; the equation is the population model.",
  challenge:"If the elapsed time increases by one half-life, what happens to the expected number remaining?",
  answers:["It halves","It doubles","It becomes zero"],correct:0
 },
 "N–Z stability map":{
  what:"How decay processes change neutron number N and proton number Z.",
  scale:"The stable band is schematic and intended to show direction of nuclear change.",
  challenge:"Which process increases Z by one while leaving A unchanged?",
  answers:["Beta minus","Alpha","Gamma"],correct:0
 },
 "Nuclear radius and density":{
  what:"Cube-root scaling of radius with nucleon number and its constant-density consequence.",
  scale:"The drawn nuclei are schematic; the numerical radius readout uses the model equation.",
  challenge:"If A increases by a factor of 8, how does R change?",
  answers:["R doubles","R ×8","R halves"],correct:0
 },
 "Mass defect and binding energy":{
  what:"Mass-energy difference between separated nucleons and a bound nucleus.",
  scale:"The energy bar is a comparison visual; the MeV calculation is the quantitative result.",
  challenge:"What does a larger binding energy per nucleon usually indicate?",
  answers:["More tightly bound nucleus","Larger atom","Greater electron charge"],correct:0
 },
 "Binding-energy curve":{
  what:"Average binding energy per nucleon across nuclide mass number.",
  scale:"The curve is a teaching approximation of the overall trend, not a high-precision isotope database.",
  challenge:"Why can both light-nucleus fusion and heavy-nucleus fission release energy?",
  answers:["Products move toward higher BE per nucleon","Nucleons disappear","Charge is lost"],correct:0
 },
 "Fission chain reaction":{
  what:"Generation-to-generation neutron balance in an induced-fission chain.",
  scale:"The multiplication control is conceptual rather than a reactor-design calculation.",
  challenge:"What describes an approximately steady chain reaction?",
  answers:["Neutron population roughly maintained","Neutron population doubles","All neutrons disappear"],correct:0
 },
 "Thermal reactor systems":{
  what:"Distinct roles of moderation, neutron absorption, heat transfer and shielding.",
  scale:"The reactor diagram is functional rather than a blueprint of a real plant.",
  challenge:"Which component primarily slows neutrons?",
  answers:["Moderator","Control rods","Coolant"],correct:0
 }
};
function ensure(){
 const wrap=$(".viewer-wrap"); if(!wrap||$(".sim-overlay-canvas")) return;
 const c=document.createElement("canvas");c.className="sim-overlay-canvas";wrap.appendChild(c);
 const vc=$(".viewer-controls"); if(vc){
  const bar=document.createElement("div");bar.className="sim-upgrade-bar";
  bar.innerHTML='<button class="sim-upgrade-toggle active" data-up="vectors">Physics overlay</button><button class="sim-upgrade-toggle active" data-up="labels">Labels</button><button class="sim-upgrade-toggle" data-up="data">Data mode</button><button class="sim-upgrade-toggle active" data-up="challenge">Challenge mode</button>';
  vc.insertAdjacentElement("afterend",bar);
  const grid=document.createElement("div");grid.className="sim-insight-grid";grid.id="simInsightGrid";bar.insertAdjacentElement("afterend",grid);
  const ch=document.createElement("div");ch.id="simUpgradeChallenge";grid.insertAdjacentElement("afterend",ch);
  bar.addEventListener("click",e=>{
   const b=e.target.closest("[data-up]");if(!b)return;
   const k=b.dataset.up;if(k==="vectors")showVectors=!showVectors;if(k==="labels")showLabels=!showLabels;if(k==="data")dataMode=!dataMode;if(k==="challenge")challengeMode=!challengeMode;
   b.classList.toggle("active",({vectors:showVectors,labels:showLabels,data:dataMode,challenge:challengeMode})[k]);renderInfo();
  });
 }
 new MutationObserver(()=>renderInfo()).observe($("#simTitle"),{childList:true,subtree:true});
 renderInfo();loop();
}
function title(){return ($("#simTitle")?.textContent||"").trim()}
function renderInfo(){
 const p=profiles[title()]||{what:"Interactive AQA nuclear-physics teaching model.",scale:"Visual scale is schematic.",challenge:"Predict the effect of changing the main control.",answers:["Increase","Decrease","No change"],correct:0};
 const g=$("#simInsightGrid");if(g)g.innerHTML='<div class="sim-insight"><strong>Physics being modelled</strong><span>'+p.what+'</span></div><div class="sim-insight"><strong>Model limitation</strong><span>'+p.scale+'</span></div><div class="sim-insight"><strong>How to use it</strong><span>Predict first, change one variable, observe the model, then explain the change with physics.</span></div>';
 const box=$("#simUpgradeChallenge");if(!box)return;
 if(!challengeMode){box.innerHTML="";return}
 box.className="sim-challenge";box.innerHTML='<h3>Simulation challenge</h3><p>'+p.challenge+'</p><div class="prediction-row">'+p.answers.map((a,i)=>'<button data-pred="'+i+'">'+a+'</button>').join("")+'</div><div class="small muted" id="predFeedback">Choose before changing the control.</div>'+(dataMode?dataPanel():"");
 $$("[data-pred]",box).forEach(b=>b.onclick=()=>{
   $$("[data-pred]",box).forEach(x=>x.classList.remove("selected"));b.classList.add("selected");
   $("#predFeedback").textContent=Number(b.dataset.pred)===p.correct?"Good prediction. Now test it in the model and explain why.":"Test it in the model, then use the readout to revise your prediction.";
 });
}
function dataPanel(){
 const rows={
  "Rutherford scattering":[["Variable","Effect"],["impact parameter ↓","deflection ↑"],["alpha energy ↑","deflection ↓"]],
  "Random decay and half-life":[["Quantity","Relationship"],["N","N₀e⁻ˡᵗ"],["T½","ln2 / λ"]],
  "Nuclear radius and density":[["Quantity","Relationship"],["R","r₀A¹ᐟ³"],["volume","∝ A"]],
  "Mass defect and binding energy":[["Quantity","Relationship"],["ΔE","Δmc²"],["1 u","931.5 MeV"]],
  "Binding-energy curve":[["Region","Energy route"],["light nuclei","fusion toward peak"],["heavy nuclei","fission toward peak"]],
  "Thermal reactor systems":[["System","Main role"],["moderator","slow neutrons"],["control rods","absorb neutrons"],["coolant","transfer thermal energy"]]
 }[title()]||[["Mode","Purpose"],["prediction","before changing variable"],["observation","what changes"],["explanation","why it changes"]];
 return '<div class="sim-mini-data"><table>'+rows.map((r,i)=>'<tr>'+r.map(x=>(i===0?'<th>'+x+'</th>':'<td>'+x+'</td>')).join("")+'</tr>').join("")+'</table></div>'
}
function arrow(ctx,x1,y1,x2,y2,color){
 ctx.strokeStyle=color;ctx.fillStyle=color;ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(x1,y1);ctx.lineTo(x2,y2);ctx.stroke();
 const a=Math.atan2(y2-y1,x2-x1),s=8;ctx.beginPath();ctx.moveTo(x2,y2);ctx.lineTo(x2-Math.cos(a-.55)*s,y2-Math.sin(a-.55)*s);ctx.lineTo(x2-Math.cos(a+.55)*s,y2-Math.sin(a+.55)*s);ctx.closePath();ctx.fill();
}
function overlay(){
 const c=$(".sim-overlay-canvas"),base=$("#simCanvas");if(!c||!base)return;
 const r=base.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);if(c.width!==Math.round(r.width*dpr)||c.height!==Math.round(r.height*dpr)){c.width=Math.round(r.width*dpr);c.height=Math.round(r.height*dpr)}
 const ctx=c.getContext("2d");ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,r.width,r.height);
 if(!showVectors&&!showLabels)return;
 const t=title();
 ctx.font="700 12px system-ui";
 if(t==="Rutherford scattering"){
   if(showVectors){arrow(ctx,r.width*.70,r.height*.50,r.width*.61,r.height*.36,"rgba(255,125,140,.9)");}
   if(showLabels){ctx.fillStyle="#ffd2d8";ctx.fillText("electrostatic repulsion",r.width*.49,r.height*.31)}
 } else if(t==="Nuclear radius and density"){
   if(showVectors){arrow(ctx,r.width*.34,r.height*.5,r.width*.46,r.height*.5,"rgba(103,199,255,.9)")}
   if(showLabels){ctx.fillStyle="#cfefff";ctx.fillText("R ∝ A¹ᐟ³",r.width*.38,r.height*.45)}
 } else if(t==="Fission chain reaction"){
   if(showLabels){ctx.fillStyle="#cfefff";ctx.fillText("follow neutron generations →",18,32)}
 } else if(t==="Thermal reactor systems"){
   if(showLabels){ctx.fillStyle="#cfefff";ctx.fillText("neutron control",18,34);ctx.fillStyle="#9fe6ff";ctx.fillText("heat transfer loop",r.width*.62,r.height*.20)}
 } else if(t==="Binding-energy curve"){
   if(showVectors){arrow(ctx,r.width*.13,r.height*.60,r.width*.28,r.height*.30,"rgba(99,217,164,.9)");arrow(ctx,r.width*.83,r.height*.47,r.width*.35,r.height*.28,"rgba(255,170,185,.9)")}
   if(showLabels){ctx.fillStyle="#8ff0bf";ctx.fillText("fusion → higher BE/nucleon",r.width*.08,r.height*.67);ctx.fillStyle="#ffb1bd";ctx.fillText("fission → higher BE/nucleon",r.width*.60,r.height*.58)}
 } else if(t==="Random decay and half-life"){
   if(showLabels){ctx.fillStyle="#cfefff";ctx.fillText("individual events: random",20,30);ctx.fillText("population: exponential",r.width*.63,30)}
 }
}
function loop(){overlay();raf=requestAnimationFrame(loop)}
setTimeout(ensure,50);
})();