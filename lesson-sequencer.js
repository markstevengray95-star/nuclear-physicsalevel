(() => {
"use strict";
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const STORAGE="aqaNuclearSequencerV2";
const sequence=[
 {id:"L0",tier:"Foundation",title:"Start here: atoms, nuclei and notation",code:"Bridge",minutes:50,sim:"radius",
  objectives:["Interpret A, Z and N correctly","Distinguish atomic and nuclear scales","Use nuclide notation confidently"],
  retrieval:["What particles are found in the nucleus?","What does atomic number tell you?"],
  teach:["Build a nucleus from proton and neutron numbers.","Connect A = Z + N to isotope notation.","Compare atomic radius (~10⁻¹⁰ m) with nuclear radius (~10⁻¹⁵ m)."],
  exam:"Explain why two isotopes of the same element have the same chemical identity but different nuclear mass.",
  success:["I can calculate N from A and Z","I can read isotope notation","I can compare atomic and nuclear scales"],
  astar:"Estimate how many orders of magnitude smaller a nucleus is than an atom and explain why diagrams are never to scale."},
 {id:"L1",tier:"Foundation",title:"How the nucleus was discovered",code:"3.8.1.1",minutes:55,sim:"rutherford",
  objectives:["Describe the Rutherford observations","Link observations to nuclear-model conclusions","Explain large-angle scattering using electrostatic repulsion"],
  retrieval:["What charge does an alpha particle have?","What did the plum-pudding model assume?"],
  teach:["Separate observations from conclusions.","Use impact parameter to explain different deflections.","Practise the chain: observation → inference → new model."],
  exam:"Explain how the results of alpha-particle scattering changed the accepted model of the atom.",
  success:["I distinguish observation and inference","I explain rare backward scattering","I use 'concentrated positive charge' precisely"],
  astar:"Explain why high alpha-particle energy and a tiny impact parameter change the closest approach and deflection."},
 {id:"L2",tier:"Core",title:"Alpha, beta and gamma",code:"3.8.1.2",minutes:55,sim:"radiation",
  objectives:["Compare α, β and γ","Explain ionisation and penetration","Interpret simple absorption data"],
  retrieval:["State the charge of α, β⁻ and γ.","Which radiation is electromagnetic?"],
  teach:["Compare charge, mass, speed and penetration.","Use absorption curves to identify unknown radiation.","Link ionisation to interaction with matter."],
  exam:"A source emits unknown radiation. Explain how absorption measurements could help identify it.",
  success:["I compare all three radiations","I interpret count-rate changes","I avoid saying gamma has a fixed stopping thickness"],
  astar:"Discuss why penetration and ionisation tend to show an inverse relationship for these radiations."},
 {id:"L3",tier:"Core",title:"Inverse square, background and RP12",code:"3.8.1.2 / RP12",minutes:60,sim:"radiation",
  objectives:["Apply I ∝ 1/r²","Correct count rate for background","Evaluate an inverse-square investigation"],
  retrieval:["What happens to intensity if distance doubles?","Why measure background radiation?"],
  teach:["Collect virtual count data at several distances.","Subtract background before analysis.","Plot corrected count rate against 1/r² and evaluate the trend."],
  exam:"Explain why background count rate should be measured for a long time and subtracted from source readings.",
  success:["I calculate 1/r² correctly","I subtract background correctly","I evaluate scatter and uncertainty"],
  astar:"Explain why the inverse-square approximation is best when the source behaves approximately as a point source."},
 {id:"L4",tier:"Core",title:"Random decay, activity and decay constant",code:"3.8.1.3",minutes:55,sim:"decay",
  objectives:["Explain random decay","Use A = λN","Interpret λ as probability per unit time"],
  retrieval:["What is one becquerel?","What does random mean for an individual nucleus?"],
  teach:["Compare individual random events with population behaviour.","Connect activity to N using λ.","Interpret units and proportionality."],
  exam:"Explain why the activity of a large radioactive sample decreases smoothly even though decay is random.",
  success:["I define activity","I interpret decay constant","I use A = λN"],
  astar:"Use a probability argument to explain the emergence of an exponential law from many independent nuclei."},
 {id:"L5",tier:"Secure",title:"Exponential decay, half-life and graphs",code:"3.8.1.3",minutes:60,sim:"decay",
  objectives:["Use N=N₀e⁻ˡᵗ and A=A₀e⁻ˡᵗ","Use T½=ln2/λ","Extract half-life or λ from graphical data"],
  retrieval:["How many half-lives leave 1/8?","What is the unit of λ?"],
  teach:["Move between half-life and decay constant.","Solve exponential decay calculations.","Recognise straight-line log forms and interpret gradients."],
  exam:"A graph of ln A against t is linear. Explain how its gradient can be used to determine half-life.",
  success:["I solve decay equations","I use ln graphs","I link gradient, λ and half-life"],
  astar:"Combine activity, molar mass and Avogadro constant in a multi-step decay problem."},
 {id:"L6",tier:"Secure",title:"Nuclear instability and decay equations",code:"3.8.1.4",minutes:55,sim:"stability",
  objectives:["Use N–Z stability ideas","Write α, β⁻, β⁺, electron-capture and γ equations","Track A and Z without memorising blindly"],
  retrieval:["What changes in beta-minus decay?","Does gamma change A or Z?"],
  teach:["Use N–Z movement to derive daughter nuclei.","Balance nucleon number and charge.","Connect decay mode to movement toward stability."],
  exam:"Write and explain a beta-minus decay equation, including the change in proton and neutron numbers.",
  success:["I balance nuclear equations","I explain beta transformations","I use the N–Z map"],
  astar:"Compare beta-plus emission and electron capture in terms of nuclear change and emitted particles."},
 {id:"L7",tier:"Secure",title:"Nuclear radius, closest approach and density",code:"3.8.1.5",minutes:60,sim:"radius",
  objectives:["Use R=r₀A¹ᐟ³","Explain closest approach","Show why nuclear density is approximately constant"],
  retrieval:["State the approximate scale of a nucleus.","What does A represent?"],
  teach:["Use cube-root scaling.","Link R³ ∝ A to constant density.","Connect scattering evidence to radius estimates and electron diffraction."],
  exam:"Show that R=r₀A¹ᐟ³ predicts an approximately constant nuclear density.",
  success:["I calculate R","I derive the density argument","I explain why electron diffraction probes nuclear size"],
  astar:"Combine Coulomb potential energy and kinetic energy to reason about closest approach."},
 {id:"L8",tier:"Secure",title:"Mass defect and binding energy",code:"3.8.1.6",minutes:60,sim:"massEnergy",
  objectives:["Define mass defect","Use ΔE=Δmc²","Convert u to MeV and calculate binding energy per nucleon"],
  retrieval:["What is meant by a bound system?","State E=mc²."],
  teach:["Compare separated-nucleon mass with nuclear mass.","Convert mass difference to energy.","Distinguish total binding energy from BE per nucleon."],
  exam:"Calculate the binding energy per nucleon from given nuclear and nucleon masses.",
  success:["I calculate mass defect","I convert u to MeV","I interpret BE per nucleon"],
  astar:"Explain binding energy as a system-energy concept rather than 'energy stored inside nucleons'."},
 {id:"L9",tier:"Exam",title:"Binding-energy curve, fusion and fission",code:"3.8.1.6–7",minutes:55,sim:"binding",
  objectives:["Interpret the BE-per-nucleon curve","Explain energy release in fusion and fission","Use mass-energy conservation"],
  retrieval:["Where is the BE-per-nucleon curve highest?","What happens to mass when energy is released?"],
  teach:["Read changes on the curve rather than memorising slogans.","Calculate energy from mass differences.","Compare light-nucleus fusion with heavy-nucleus fission."],
  exam:"Use the binding-energy-per-nucleon curve to explain why both fusion and fission can release energy.",
  success:["I interpret the curve","I link higher BE per nucleon to lower system mass","I explain both processes"],
  astar:"Evaluate which information can and cannot be inferred from the curve without additional reaction data."},
 {id:"L10",tier:"Exam",title:"Chain reactions and thermal reactors",code:"3.8.1.7",minutes:60,sim:"fission",
  objectives:["Explain induced fission and chain reactions","Distinguish moderator, control rods and coolant","Explain steady neutron balance"],
  retrieval:["What particle can induce fission?","What does a moderator do?"],
  teach:["Follow neutrons through successive fissions.","Separate neutron slowing from neutron absorption.","Link reactor components to physical functions."],
  exam:"Explain how a thermal reactor maintains a steady chain reaction and transfers energy for electricity generation.",
  success:["I explain the chain reaction","I distinguish component roles","I use neutron-balance language"],
  astar:"Analyse a reactor scenario in which neutron losses change and predict the qualitative response needed."},
 {id:"L11",tier:"Exam",title:"Nuclear power: safety, risk and evidence",code:"3.8.1.8",minutes:50,sim:"reactor",
  objectives:["Explain engineered safety systems","Discuss radioactive waste","Evaluate risk versus benefit using physics evidence"],
  retrieval:["Why is shielding needed?","Why does half-life matter for waste?"],
  teach:["Link each safety feature to a hazard.","Distinguish normal control, cooling and shutdown.","Practise balanced evaluative answers."],
  exam:"Evaluate the use of nuclear fission for electricity generation, using relevant physics.",
  success:["I explain safety systems","I discuss waste using activity and half-life","I construct evidence-based evaluation"],
  astar:"Write a judgement that distinguishes probability, consequence and uncertainty rather than listing generic pros and cons."},
 {id:"L12",tier:"Astar",title:"A* synoptic mastery: unfamiliar nuclear problems",code:"Synoptic",minutes:60,sim:"binding",
  objectives:["Combine equations across the topic","Interpret unfamiliar data","Construct multi-stage explanations with precise terminology"],
  retrieval:["Choose three nuclear equations from memory.","Name two common data-analysis traps."],
  teach:["Solve a mixed decay + mass-energy problem.","Critique an experimental conclusion.","Build a six-mark explanation from evidence to physics to judgement."],
  exam:"Complete a synoptic task combining decay, experimental data and binding energy, showing every reasoning step.",
  success:["I select equations without prompts","I justify assumptions","I evaluate evidence quantitatively","I write precise extended explanations"],
  astar:"Challenge complete: explain how the experimental, probabilistic and energy models of nuclear physics fit together without mixing their assumptions."}
];

let state;
try{state=JSON.parse(localStorage.getItem(STORAGE)||"{}")}catch{state={}}
state.mode=state.mode||"student";state.current=state.current||0;state.done=state.done||{};state.mastery=state.mastery||{};state.notes=state.notes||{};
let presentIndex=0;

function save(){localStorage.setItem(STORAGE,JSON.stringify(state));}
function ensureView(){
 const nav=$(".main-nav"); if(!nav||$("#view-sequence")) return;
 const b=document.createElement("button");b.className="nav-button";b.dataset.view="sequence";b.textContent="Lesson sequencer";nav.prepend(b);
 const main=nav.parentElement; const sec=document.createElement("section");sec.className="view";sec.id="view-sequence";
 sec.innerHTML='<div class="section-head"><div><span class="eyebrow">From zero to A*</span><h2>Complete Nuclear Physics lesson sequencer</h2></div><p class="muted">Use Student mode for self-study or Teacher mode to deliver the topic lesson by lesson.</p></div><div id="seqRoot"></div><div class="presentation-overlay" id="presentationOverlay"><button class="button presentation-close" id="presentationClose">Exit presentation</button><div class="presentation-inner"><div id="presentationSlide"></div><div class="presentation-controls"><button class="button" id="presentPrev">← Previous</button><button class="button primary" id="presentNext">Next →</button></div></div></div>';
 main.insertBefore(sec,$("#view-lab"));
 // Replace original nav handler behavior for this injected tab while allowing app.js handlers on old buttons.
 b.addEventListener("click",()=>openSequence());
 render();
}
function openSequence(){
 $$(".nav-button").forEach(x=>x.classList.toggle("active",x.dataset.view==="sequence"));
 $$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-sequence"));
 window.scrollTo({top:0,behavior:"smooth"});
}
function masteryFor(id){return state.mastery[id]||0}
function completion(){
 const d=sequence.filter(x=>state.done[x.id]).length; return {d,total:sequence.length,p:Math.round(100*d/sequence.length)};
}
function nextRecommended(){
 const first=sequence.findIndex(x=>!state.done[x.id]); return first<0?sequence.length-1:first;
}
function tierClass(t){return t.toLowerCase().replace("*","star")}
function render(){
 const root=$("#seqRoot"); if(!root)return;
 const c=completion(), avg=Math.round(sequence.reduce((a,x)=>a+masteryFor(x.id),0)/(sequence.length*3)*100)||0;
 root.className="seq-shell "+(state.mode==="teacher"?"teacher-mode":"");
 root.innerHTML=
 '<aside class="panel seq-sidebar">'+
   '<div class="seq-top"><div><strong>Learning route</strong><div class="muted small">'+c.d+' of '+c.total+' lessons complete</div></div></div>'+
   '<div class="seq-progress-line"><span style="width:'+c.p+'%"></span></div>'+
   '<div class="seq-summary"><div><strong>'+c.p+'%</strong><span>course</span></div><div><strong>'+avg+'%</strong><span>mastery</span></div><div><strong>'+sequence.filter(x=>x.tier==="Exam"&&state.done[x.id]).length+'/3</strong><span>exam lessons</span></div><div><strong>'+sequence.filter(x=>x.tier==="Astar"&&state.done[x.id]).length+'/1</strong><span>A* challenge</span></div></div>'+
   '<div class="seq-mode"><button class="button '+(state.mode==="student"?"active":"")+'" data-mode="student">Student mode</button><button class="button '+(state.mode==="teacher"?"active":"")+'" data-mode="teacher">Teacher mode</button></div>'+
   '<div class="seq-route">'+sequence.map((l,i)=>'<button class="seq-step '+(i===state.current?"active ":"")+(state.done[l.id]?"complete ":"")+'" data-lesson="'+i+'"><span class="seq-num">'+(state.done[l.id]?"✓":i+1)+'</span><strong>'+l.title+'</strong><small>'+l.code+' · '+l.minutes+' min</small><span class="seq-tier '+tierClass(l.tier)+'">'+l.tier+'</span></button>').join("")+'</div>'+
 '</aside>'+
 '<main class="panel seq-main">'+lessonHTML(sequence[state.current])+'</main>';
 $$("[data-mode]",root).forEach(b=>b.onclick=()=>{state.mode=b.dataset.mode;save();render()});
 $$("[data-lesson]",root).forEach(b=>b.onclick=()=>{state.current=Number(b.dataset.lesson);save();render()});
 wireLesson();
}
function lessonHTML(l){
 const m=masteryFor(l.id), next=nextRecommended();
 return '<section class="seq-hero"><span class="eyebrow">'+l.tier+' · '+l.code+'</span><h2>'+(state.current+1)+'. '+l.title+'</h2><p class="muted">Designed for a '+l.minutes+'-minute lesson. Progress from knowledge → model → exam application → mastery.</p><div class="seq-meta"><span>'+l.minutes+' minutes</span><span>'+l.objectives.length+' objectives</span><span>Simulation linked</span><span>Exam task</span></div></section>'+
 '<div class="seq-objectives">'+
  '<section class="seq-card"><h3>Learning objectives</h3><ul>'+l.objectives.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
  '<section class="seq-card"><h3>Success criteria</h3><ul>'+l.success.map(x=>'<li>'+x+'</li>').join("")+'</ul></section>'+
 '</div>'+
 '<div class="seq-delivery">'+
 phase("Do now / retrieval","5–8 min",'<ul>'+l.retrieval.map(x=>'<li>'+x+'</li>').join("")+'</ul>')+
 phase("Teach and model","15–20 min",'<ul>'+l.teach.map(x=>'<li>'+x+'</li>').join("")+'</ul>')+
 phase("Interactive simulation","10–15 min",'<p>Open the linked <strong>'+simName(l.sim)+'</strong> model. Change variables deliberately, predict first, then compare the result with the readout.</p><button class="button" data-open-sim="'+l.sim+'">Open simulation</button>')+
 phase("Exam application","10–15 min",'<p><strong>Exam task:</strong> '+l.exam+'</p><p class="muted">Require explicit physics vocabulary and a complete reasoning chain rather than keyword spotting.</p>')+
 phase("A* extension","5–10 min",'<p>'+l.astar+'</p>')+
 '</div>'+
 '<section class="seq-card" style="margin-top:12px"><h3>Mastery check</h3><div class="mastery-row"><span>Current level</span><div class="mastery-dots">'+[1,2,3].map(n=>'<button class="mastery-dot '+(m>=n?"on":"")+'" data-mastery="'+n+'" title="Set mastery '+n+'"></button>').join("")+'</div><strong>'+["Not checked","Developing","Secure","Exam-ready"][m]+'</strong></div><p class="mastery-label">1 = developing · 2 = secure · 3 = can apply independently in unfamiliar exam contexts</p></section>'+
 '<div class="seq-recommend student-only"><strong>Recommended next:</strong> '+(state.done[l.id]?(next===state.current?"Revisit weak mastery areas or attempt the A* challenge.":sequence[next].title):"Complete this lesson, then move to "+(sequence[Math.min(state.current+1,sequence.length-1)].title))+'</div>'+
 '<div class="teacher-panel"><section class="seq-card"><h3>Teacher delivery controls</h3><div class="teacher-tools"><div class="teacher-tool"><strong>Presentation mode</strong><span>Large classroom view of lesson phases.</span><button class="button" id="startPresent">Present lesson</button></div><div class="teacher-tool"><strong>Lesson status</strong><span>Mark the class sequence point.</span><button class="button" id="teacherComplete">'+(state.done[l.id]?"Reopen lesson":"Mark delivered")+'</button></div><div class="teacher-tool"><strong>Teaching note</strong><span>Saved on this device.</span><textarea id="teacherNote" style="width:100%;min-height:72px;background:#071522;color:var(--text);border:1px solid var(--border);border-radius:8px;padding:7px">'+escapeHTML(state.notes[l.id]||"")+'</textarea></div></div></section></div>'+
 '<div class="seq-actions"><button class="button primary" id="seqComplete">'+(state.done[l.id]?"Mark incomplete":"Mark lesson complete")+'</button><button class="button" id="seqPrevious" '+(state.current===0?"disabled":"")+'>← Previous lesson</button><button class="button" id="seqNext" '+(state.current===sequence.length-1?"disabled":"")+'>Next lesson →</button></div>';
}
function phase(title,time,html){return '<section class="seq-phase"><button><span>'+title+'</span><span class="time">'+time+'</span></button><div class="seq-phase-content">'+html+'</div></section>'}
function simName(id){const names={rutherford:"Rutherford scattering",radiation:"radiation and absorption",decay:"random decay",stability:"N–Z stability",radius:"nuclear radius",massEnergy:"mass defect",binding:"binding-energy curve",fission:"fission chain",reactor:"reactor systems"};return names[id]||id}
function escapeHTML(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[m]))}
function wireLesson(){
 $$(".seq-phase button",$("#seqRoot")).forEach(b=>b.onclick=()=>b.parentElement.classList.toggle("open"));
 $$("[data-mastery]",$("#seqRoot")).forEach(b=>b.onclick=()=>{const l=sequence[state.current];state.mastery[l.id]=Number(b.dataset.mastery);save();render()});
 $$("[data-open-sim]",$("#seqRoot")).forEach(b=>b.onclick=()=>openSim(b.dataset.openSim));
 $("#seqComplete").onclick=()=>toggleDone();
 if($("#teacherComplete"))$("#teacherComplete").onclick=()=>toggleDone();
 $("#seqPrevious").onclick=()=>{if(state.current>0){state.current--;save();render()}};
 $("#seqNext").onclick=()=>{if(state.current<sequence.length-1){state.current++;save();render()}};
 if($("#teacherNote"))$("#teacherNote").oninput=e=>{state.notes[sequence[state.current].id]=e.target.value;save()};
 if($("#startPresent"))$("#startPresent").onclick=startPresentation;
}
function toggleDone(){const id=sequence[state.current].id;state.done[id]=!state.done[id];save();render()}
function openSim(id){
 const tabs=$$(".sim-tab"); const idx=tabs.findIndex(b=>b.textContent.toLowerCase().includes(simName(id).split(" ")[0].toLowerCase()));
 const labBtn=$('.nav-button[data-view="lab"]'); if(labBtn)labBtn.click();
 if(idx>=0)setTimeout(()=>tabs[idx].click(),60);
}
function slidesFor(l){
 return [
  {eyebrow:l.code,title:l.title,body:"By the end: "+l.objectives.join(" · ")},
  {eyebrow:"Retrieval",title:"Do now",body:"<ul>"+l.retrieval.map(x=>"<li>"+x+"</li>").join("")+"</ul>"},
  {eyebrow:"Core model",title:"Build the physics",body:"<ul>"+l.teach.map(x=>"<li>"+x+"</li>").join("")+"</ul>"},
  {eyebrow:"Exam application",title:"Now apply it",body:"<p>"+l.exam+"</p>"},
  {eyebrow:"A* extension",title:"Push the reasoning",body:"<p>"+l.astar+"</p>"},
  {eyebrow:"Exit check",title:"Can you do these independently?",body:"<ul>"+l.success.map(x=>"<li>"+x+"</li>").join("")+"</ul>"}
 ];
}
function startPresentation(){presentIndex=0;$("#presentationOverlay").classList.add("open");renderPresent()}
function renderPresent(){const l=sequence[state.current],slides=slidesFor(l),s=slides[presentIndex];$("#presentationSlide").className="presentation-slide";$("#presentationSlide").innerHTML='<div><span class="eyebrow">'+s.eyebrow+'</span><h1>'+s.title+'</h1><div>'+s.body+'</div><p class="muted">'+(presentIndex+1)+' / '+slides.length+'</p></div>';$("#presentPrev").disabled=presentIndex===0;$("#presentNext").textContent=presentIndex===slides.length-1?"Finish":"Next →"}
document.addEventListener("click",e=>{
 if(e.target&&e.target.id==="presentationClose")$("#presentationOverlay").classList.remove("open");
 if(e.target&&e.target.id==="presentPrev"&&presentIndex>0){presentIndex--;renderPresent()}
 if(e.target&&e.target.id==="presentNext"){const n=slidesFor(sequence[state.current]).length;if(presentIndex<n-1){presentIndex++;renderPresent()}else $("#presentationOverlay").classList.remove("open")}
});
setTimeout(ensureView,0);
})();