(() => {
"use strict";
const STORE="aqaNuclearPlatformV1";
const $=(s,r=document)=>r.querySelector(s);
const $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s??"").replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
const now=()=>Date.now(), day=86400000;
let state={};
try{state=JSON.parse(localStorage.getItem(STORE)||"{}")}catch{state={}}
function normalise(){
 state.performance=state.performance||{};
 state.diagnostic=state.diagnostic||{answers:{},completed:false};
 state.retrieval=state.retrieval||{};
 state.misconceptions=state.misconceptions||{};
 state.confidence=state.confidence||{};
 state.written=state.written||{};
 state.simChallenges=state.simChallenges||{};
 state.practical=state.practical||{};
 state.synoptic=state.synoptic||{};
 state.assignments=state.assignments||{teacher:[],student:null};
 state.teacherRecords=state.teacherRecords||[];
 state.paper=state.paper||{history:[]};
 state.accessibility=state.accessibility||{};
 state.history=state.history||[];
 state.ui=state.ui||{tab:"today"};
}
normalise();
const save=()=>{try{localStorage.setItem(STORE,JSON.stringify(state))}catch{}};
function C(){return window.NuclearCourse||null}
function lessons(){return C()?.lessons||[]}
function exams(){return C()?.exam||[]}
function lessonState(i){try{return C()?.getLessonState(i)||{}}catch{return {}}}
function lessonProgress(i){try{return C()?.progress(i)||0}catch{return 0}}
function activeLesson(){try{return C()?.lessonIndex()||0}catch{return 0}}
function questionBank(){
 const out=[];
 lessons().forEach((p,i)=>{
   (p.exit||[]).forEach((q,n)=>out.push({id:`L${i}-E${n}`,lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3],kind:"retrieval"}));
   (p.practice||[]).forEach((q,n)=>out.push({id:`L${i}-P${n}`,lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3],kind:"practice"}));
 });
 return out;
}
const misconceptions=[
 ["A, Z and N","The element is fixed by proton number Z. Isotopes keep Z the same and change neutron number N."],
 ["Rutherford evidence","Most alpha particles passing through shows atoms are mostly empty space; rare large-angle deflections show positive charge and mass are concentrated in a tiny nucleus."],
 ["Radiation properties","Alpha, beta and gamma are not ranked by one universal 'danger' scale. Ionisation, penetration and exposure context all matter."],
 ["Inverse-square law","Use background-corrected count rate and compare it with 1/r². Doubling distance gives about one quarter of the ideal source contribution."],
 ["Radiation risk","Risk depends on type, activity, time, distance, shielding and whether material is internal or external."],
 ["Random decay","Individual nuclei decay unpredictably, but each has a constant probability per unit time and large samples follow a predictable statistical trend."],
 ["Half-life and lambda","Half-life and decay constant are inversely related: T½ = ln2/λ. Activity follows exponential decay."],
 ["Moles to activity","The common chain is mass → moles → nuclei → activity. Use n=m/M, N=nN_A and A=λN."],
 ["N–Z decay changes","Alpha changes A by −4 and Z by −2; β− makes Z+1; β+/electron capture makes Z−1; gamma leaves A and Z unchanged."],
 ["Gamma energy levels","Gamma emission changes nuclear energy state, not nucleon numbers. Photon energy equals the level spacing ΔE=hf."],
 ["Closest approach","The alpha is repelled by the positive nucleus. In the head-on model, initial kinetic energy becomes electrostatic potential energy at closest approach."],
 ["Electron diffraction","High-momentum electrons have short de Broglie wavelength. The diffraction pattern depends on nuclear size."],
 ["Radius and density","R ∝ A^(1/3), so volume ∝ A. Since nuclear mass is also roughly ∝ A, density is approximately constant."],
 ["Mass defect","A bound nucleus has less mass-energy than separated nucleons. Binding energy corresponds to the mass defect through ΔE=Δmc²."],
 ["Binding energy curve","Fusion and fission can release energy when products are more tightly bound overall, moving toward higher binding energy per nucleon."],
 ["Chain reactions","A fission chain depends on neutron production versus neutron losses. Keep criticality reasoning qualitative at this level."],
 ["Reactor roles","Moderator slows neutrons, control rods absorb neutrons and coolant transfers thermal energy."],
 ["Nuclear safety","Shielding, distance/remote handling, shutdown systems and waste containment address different parts of risk."],
 ["Synoptic modelling","Choose the physical model before calculating, state assumptions and distinguish evidence from inference."]
];
function lessonMetric(i){
 const p=lessons()[i],s=lessonState(i);
 const diag=state.diagnostic.answers?.[i];
 const wrong=state.performance[`lesson-${i}`]?.wrong||0;
 return {title:p?.title||`Lesson ${i+1}`,progress:lessonProgress(i),diag:diag?.correct??null,wrong};
}
function questionIdFor(el){
 if(!el)return null;
 if(el.dataset.lpQid)return el.dataset.lpQid;
 const panel=el.closest("[data-il-panel]");
 const lesson=activeLesson();
 let part=panel?.dataset.ilPanel||"lesson";
 let idx=0;
 const group=el.closest(".il-q,.il-vocab-q,.il-exam-card");
 if(group){
   const siblings=$$(".il-q,.il-vocab-q,.il-exam-card",panel||document);
   idx=Math.max(0,siblings.indexOf(group));
 }
 const id=`L${lesson}-${part}-${idx}`;
 if(group)group.dataset.lpQid=id;
 return id;
}
function scheduleRetrieval(qid,correct){
 const q=questionBank().find(x=>x.id===qid);
 if(!q)return;
 const r=state.retrieval[qid]||{streak:0,interval:0,due:now()};
 if(correct){r.streak++;r.interval=[1,3,7,14,30,60][Math.min(r.streak-1,5)];}
 else{r.streak=0;r.interval=1;}
 r.due=now()+r.interval*day;r.last=now();state.retrieval[qid]=r;save();
}
function recordAnswer(el,correct){
 const qid=questionIdFor(el),lesson=activeLesson(),key=`lesson-${lesson}`;
 const p=state.performance[key]||{correct:0,wrong:0,streak:0};
 if(correct){p.correct++;p.streak++;}else{p.wrong++;p.streak=0;recordMisconception(lesson);}
 state.performance[key]=p;
 const conf=state.confidence[qid]?.value;
 if(conf){state.confidence[qid].attempts=(state.confidence[qid].attempts||0)+1;state.confidence[qid].correct=(state.confidence[qid].correct||0)+(correct?1:0);}
 save();injectAdaptive();renderIfOpen();
}
function recordMisconception(i){
 const m=state.misconceptions[i]||{count:0,last:0};m.count++;m.last=now();state.misconceptions[i]=m;save();
}
document.addEventListener("click",e=>{
 const btn=e.target.closest("[data-so],[data-cco],[data-po]");
 if(!btn)return;
 const box=btn.closest(".il-q");const wasDisabled=btn.disabled;
 if(wasDisabled)return;
 setTimeout(()=>{
   const correct=btn.classList.contains("correct")||!!box?.querySelector("button.correct");
   const wrong=btn.classList.contains("wrong");
   if(correct||wrong)recordAnswer(box||btn,correct&&!wrong);
 },40);
},true);
function annotateConfidence(){
 $$(".il-q,.il-exam-card").forEach((box,n)=>{
   if(box.querySelector(".lp-confidence"))return;
   const id=questionIdFor(box);if(!id)return;
   const row=document.createElement("div");row.className="lp-confidence";row.innerHTML='<span class="muted small">Before answering:</span>'+
    ["guessing","unsure","confident"].map(v=>`<button type="button" data-conf="${v}" class="${state.confidence[id]?.value===v?"selected":""}">${v==="guessing"?"Guessing":v==="unsure"?"Unsure":"Confident"}</button>`).join("");
   const h=box.querySelector("h4,h3");if(h)h.insertAdjacentElement("afterend",row);else box.prepend(row);
   row.querySelectorAll("[data-conf]").forEach(b=>b.addEventListener("click",()=>{
     state.confidence[id]=state.confidence[id]||{};state.confidence[id].value=b.dataset.conf;save();
     row.querySelectorAll("button").forEach(x=>x.classList.toggle("selected",x===b));
   }));
 });
}
function adaptiveNeeded(i){
 const p=state.performance[`lesson-${i}`]||{wrong:0,correct:0,streak:0};
 return p.wrong>=2 && p.streak<3;
}
function injectAdaptive(){
 const root=$("#interactiveLessonWorkspace");if(!root)return;
 const old=$("#lpAdaptive",root);if(old)old.remove();
 const i=activeLesson();if(!adaptiveNeeded(i))return;
 const p=lessons()[i];if(!p)return;
 const box=document.createElement("article");box.id="lpAdaptive";box.className="lp-adaptive";
 box.innerHTML=`<h4>Adaptive reteach recommended</h4><p>You have had several attempts in this lesson. Rebuild the core model before continuing.</p><div class="lp-actions"><button type="button" id="lpReteach">Open short reteach</button><button type="button" id="lpExtraPractice">Extra practice</button></div><div id="lpAdaptiveBody"></div>`;
 root.querySelector(".il-body")?.prepend(box);
 $("#lpReteach",box).onclick=()=>{
   const body=$("#lpAdaptiveBody",box);
   body.innerHTML=`<div class="lp-coach"><strong>${esc(p.learn?.[0]?.[0]||p.title)}</strong><p>${p.learn?.[0]?.[1]||p.intro}</p><p><strong>Remember:</strong> ${p.learn?.[0]?.[2]||""}</p></div>`;
 };
 $("#lpExtraPractice",box).onclick=()=>{
   const q=p.exit?.[0];if(!q)return;
   $("#lpAdaptiveBody",box).innerHTML=`<div class="lp-question"><h4>${esc(q[0])}</h4><div class="lp-options">${q[1].map((o,j)=>`<button type="button" data-adapt="${j}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback" id="lpAdaptFb">Choose an answer.</div></div>`;
   $$("[data-adapt]",box).forEach(b=>b.onclick=()=>{
     const ok=Number(b.dataset.adapt)===q[2];b.classList.add(ok?"correct":"wrong");$("#lpAdaptFb",box).textContent=(ok?"Correct — ":"Review — ")+q[3];
     if(ok){const perf=state.performance[`lesson-${i}`]||{};perf.streak=3;state.performance[`lesson-${i}`]=perf;save();}
   });
 };
}
const STOP=new Set("the a an and or to of in on for with from is are was were be been being this that it as by at into than then if using use used".split(" "));
function keywords(s){return [...new Set(String(s).toLowerCase().replace(/[^a-z0-9λ²⁻+]/g," ").split(/\s+/).filter(x=>x.length>3&&!STOP.has(x)))];}
function pointHit(answer,point){
 const a=String(answer).toLowerCase(),ks=keywords(point);if(!ks.length)return false;
 return ks.filter(k=>a.includes(k)).length>=Math.max(1,Math.ceil(ks.length*.35));
}
function commandCoach(q){
 const first=(String(q).trim().match(/^([A-Za-z]+)/)||[])[1]?.toLowerCase()||"";
 const map={
  explain:"Build cause → physics principle/equation → effect. Link each statement.",
  calculate:"State the equation, rearrange if needed, substitute consistent units, calculate and give the unit.",
  evaluate:"Use relevant physics evidence, limitations/risk and a justified conclusion.",
  state:"Give a precise fact. Do not add unnecessary explanation unless it helps accuracy.",
  describe:"Say what the data/graph/model shows. Quote a trend or value where useful.",
  show:"Start from the supplied relationship/data and show each mathematical step clearly.",
  compare:"Give linked similarities/differences using the same physical quantity."
 };
 return map[first]||"Identify the command word, use precise nuclear terminology and make every sentence earn a mark.";
}
function enhanceExamCards(){
 $$(".il-exam-card").forEach(card=>{
   if(card.querySelector(".lp-exam-coach"))return;
   const lesson=activeLesson(),n=Number(card.dataset.exq||0),q=exams()?.[lesson]?.[n];if(!q)return;
   const call=document.createElement("div");call.className="lp-coach lp-exam-coach";call.innerHTML=`<strong>Exam technique</strong><span>${esc(commandCoach(q.q))}</span><div class="lp-actions"><button type="button" data-coach-answer>Coach my written answer</button></div><div data-coach-result></div>`;
   const ta=card.querySelector("textarea");if(ta)ta.insertAdjacentElement("beforebegin",call);else card.appendChild(call);
   $("[data-coach-answer]",call).onclick=()=>{
     const ans=ta?.value||"",hits=q.points.map(p=>pointHit(ans,p));
     state.written[`L${lesson}-Q${n}`]={answer:ans,hits,at:now()};save();
     $("[data-coach-result]",call).innerHTML=`<div class="lp-markpoints">${q.points.map((p,k)=>`<div class="lp-markpoint ${hits[k]?"hit":"miss"}"><strong>${hits[k]?"Likely covered":"Check this point"}</strong> · ${esc(p)}</div>`).join("")}</div><p class="muted small">This is a coaching check, not an official mark. Compare your wording with the revealed mark points.</p>`;
   };
 });
}
function diagnosticQuestions(){return lessons().map((p,i)=>{const q=p.exit?.[0]||p.practice?.[0];return q?{lesson:i,title:p.title,q:q[0],opts:q[1],a:q[2],why:q[3]}:null}).filter(Boolean)}
function diagnosticScore(){const a=state.diagnostic.answers||{},qs=diagnosticQuestions();const done=Object.keys(a).length,correct=Object.values(a).filter(x=>x.correct).length;return {done,correct,total:qs.length,pct:done?Math.round(correct/done*100):0}}
function dueRetrieval(){
 const bank=questionBank();const scheduled=bank.filter(q=>state.retrieval[q.id]&&state.retrieval[q.id].due<=now());
 const weak=bank.filter(q=>state.diagnostic.answers?.[q.lesson]?.correct===false&&!state.retrieval[q.id]).slice(0,8);
 return [...scheduled,...weak].filter((x,i,a)=>a.findIndex(y=>y.id===x.id)===i);
}
function revisionItems(){
 const items=[];
 dueRetrieval().slice(0,2).forEach(q=>items.push({type:"Spaced retrieval",title:q.title,detail:q.q,lesson:q.lesson}));
 Object.entries(state.misconceptions).sort((a,b)=>(b[1].count||0)-(a[1].count||0)).slice(0,2).forEach(([i,m])=>items.push({type:"Misconception",title:lessons()[i]?.title,detail:misconceptions[i]?.[1]||"Review this lesson.",lesson:Number(i)}));
 lessons().forEach((p,i)=>{if(lessonProgress(i)<60)items.push({type:"Incomplete learning",title:p.title,detail:`${lessonProgress(i)}% complete`,lesson:i})});
 return items.filter((x,i,a)=>a.findIndex(y=>y.title===x.title&&y.type===x.type)===i).slice(0,5);
}
function renderToday(){
 const host=$("#lp-today");if(!host)return;
 const avg=lessons().length?Math.round(lessons().reduce((a,_,i)=>a+lessonProgress(i),0)/lessons().length):0;
 const due=dueRetrieval().length,mis=Object.keys(state.misconceptions).filter(i=>state.misconceptions[i].count>0).length,diag=diagnosticScore();
 const rev=revisionItems();
 host.innerHTML=`<div class="lp-grid three">
  <article class="lp-card"><div class="lp-stat"><div><strong>${avg}%</strong><span>course completion</span></div><span>19 lessons</span></div><div class="lp-progress"><i style="width:${avg}%"></i></div></article>
  <article class="lp-card"><div class="lp-stat"><div><strong>${due}</strong><span>retrieval questions due</span></div><span>spaced practice</span></div></article>
  <article class="lp-card"><div class="lp-stat"><div><strong>${mis}</strong><span>misconceptions flagged</span></div><span>targeted reteach</span></div></article>
 </div>
 <div class="lp-grid" style="margin-top:12px"><article class="lp-card"><h3>Your 5 things to revise today</h3><div class="lp-list">${rev.length?rev.map(x=>`<div class="lp-list-item"><div><strong>${esc(x.title)}</strong><small>${esc(x.type)} · ${esc(x.detail)}</small></div><button type="button" data-open-lesson="${x.lesson}">Open</button></div>`).join(""):'<p class="muted">Complete the diagnostic or some lesson checks and this list will personalise itself.</p>'}</div></article>
 <article class="lp-card"><h3>Diagnostic snapshot</h3><div class="lp-score"><div class="lp-score-ring ${diag.pct>=70?"good":"warn"}">${diag.pct}%</div><div><strong>${diag.correct} / ${diag.done}</strong><p class="muted">correct from ${diag.total} topic checks attempted.</p></div></div><div class="lp-actions"><button type="button" data-lp-go="diagnostic" class="primary">Open diagnostic</button><button type="button" data-lp-go="retrieval">Retrieval practice</button></div></article></div>`;
 bindOpenLessons(host);
}
function renderDiagnostic(){
 const host=$("#lp-diagnostic");if(!host)return;const qs=diagnosticQuestions(),score=diagnosticScore();
 host.innerHTML=`<div class="lp-hero"><div><h3>Whole-topic diagnostic</h3><p>One core check from every lesson. Results create a personal pathway; they do not block access to the course.</p></div><div class="lp-score"><div class="lp-score-ring ${score.pct>=70?"good":"warn"}">${score.pct}%</div><span>${score.done}/${score.total} attempted</span></div></div>
 <div class="lp-actions"><button type="button" id="lpResetDiagnostic">Reset diagnostic</button></div>
 <div id="lpDiagnosticQs">${qs.map((q,n)=>{const a=state.diagnostic.answers[n];return `<article class="lp-question" data-diagnostic="${n}"><span class="lp-chip">Lesson ${n+1}</span><h4>${esc(q.q)}</h4><div class="lp-options">${q.opts.map((o,j)=>`<button type="button" data-da="${j}" ${a?"disabled":""} class="${a&&j===q.a?"correct":a&&j===a.choice&&!a.correct?"wrong":""}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback">${a?(a.correct?"Correct — ":"Review — ")+esc(q.why):"Choose the answer you think is best."}</div></article>`}).join("")}</div>`;
 $$("#lpDiagnosticQs [data-da]",host).forEach(b=>b.onclick=()=>{
   const card=b.closest("[data-diagnostic]"),i=Number(card.dataset.diagnostic),q=qs[i],choice=Number(b.dataset.da),correct=choice===q.a;
   state.diagnostic.answers[i]={choice,correct,at:now()};if(Object.keys(state.diagnostic.answers).length===qs.length)state.diagnostic.completed=true;
   if(!correct)recordMisconception(q.lesson);
   const bank=questionBank().find(x=>x.lesson===q.lesson);if(bank){state.retrieval[bank.id]={streak:correct?1:0,interval:correct?3:1,due:now()+(correct?3:1)*day,last:now()};}
   save();renderDiagnostic();renderToday();
 });
 $("#lpResetDiagnostic",host).onclick=()=>{state.diagnostic={answers:{},completed:false};save();renderDiagnostic();renderToday()};
}
function renderRetrieval(){
 const host=$("#lp-retrieval");if(!host)return;const due=dueRetrieval();
 host.innerHTML=`<div class="lp-hero"><div><h3>Spaced retrieval</h3><p>Questions return after 1, 3, 7, 14, 30 and 60 days depending on success.</p></div><span class="lp-chip due">${due.length} due now</span></div><div id="lpRetrievalBody"></div>`;
 const body=$("#lpRetrievalBody",host);
 if(!due.length){body.innerHTML='<article class="lp-card"><h4>Nothing due right now</h4><p class="muted">Keep completing lesson checks; weak or newly learned material will be scheduled automatically.</p></article>';return}
 const q=due[0];body.innerHTML=`<article class="lp-question"><span class="lp-chip">${esc(q.title)}</span><h4>${esc(q.q)}</h4><div class="lp-options">${q.opts.map((o,j)=>`<button type="button" data-rq="${j}">${esc(o)}</button>`).join("")}</div><div class="lp-feedback" id="lpRetrieveFb">Answer from memory before checking notes.</div></article>`;
 $$("[data-rq]",body).forEach(b=>b.onclick=()=>{const correct=Number(b.dataset.rq)===q.a;b.classList.add(correct?"correct":"wrong");$("#lpRetrieveFb",body).textContent=(correct?"Correct — ":"Review — ")+q.why;scheduleRetrieval(q.id,correct);if(!correct)recordMisconception(q.lesson);setTimeout(renderRetrieval,450);});
}
function renderMisconceptions(){
 const host=$("#lp-misconceptions");if(!host)return;
 const rows=Object.entries(state.misconceptions).filter(([,m])=>m.count>0).sort((a,b)=>b[1].count-a[1].count);
 host.innerHTML=`<div class="lp-hero"><div><h3>Misconception detector</h3><p>Repeated wrong answers are grouped into the physics idea most likely to need reteaching.</p></div><span class="lp-chip weak">${rows.length} areas flagged</span></div><div class="lp-list">${rows.length?rows.map(([i,m])=>`<div class="lp-list-item"><div><strong>${esc(misconceptions[i]?.[0]||lessons()[i]?.title)}</strong><small>${m.count} flagged attempt${m.count===1?"":"s"} · ${esc(misconceptions[i]?.[1]||"Review the lesson.")}</small></div><button type="button" data-open-lesson="${i}">Reteach</button></div>`).join(""):'<article class="lp-card"><p class="muted">No repeated misconceptions flagged yet.</p></article>'}</div>`;
 bindOpenLessons(host);
}
function calibration(){
 const vals=Object.values(state.confidence).filter(x=>x.attempts);
 const by={guessing:[0,0],unsure:[0,0],confident:[0,0]};vals.forEach(x=>{const k=x.value||"unsure";by[k][0]+=x.correct||0;by[k][1]+=x.attempts||0});return by;
}
function renderConfidence(){
 const host=$("#lp-confidence");if(!host)return;const cal=calibration();
 host.innerHTML=`<div class="lp-hero"><div><h3>Confidence calibration</h3><p>Students judge confidence before answering. Confident mistakes are prioritised because they often reveal stronger misconceptions.</p></div></div><div class="lp-grid three">${Object.entries(cal).map(([k,v])=>`<article class="lp-card"><h4>${k[0].toUpperCase()+k.slice(1)}</h4><div class="lp-stat"><strong>${v[1]?Math.round(v[0]/v[1]*100):0}%</strong><span>accuracy · ${v[1]} attempts</span></div></article>`).join("")}</div>`;
}
function bindOpenLessons(root){
 $$("[data-open-lesson]",root).forEach(b=>b.onclick=()=>{
   const i=Number(b.dataset.openLesson),nav=$('.nav-button[data-view="sequence"]');if(nav)nav.click();
   setTimeout(()=>{const steps=$$(".seq-step");if(steps[i])steps[i].click()},100);
 });
}
function renderIfOpen(){if($("#view-platform.active-view"))renderPlatformTab(state.ui.tab)}
function renderPlatformTab(tab){
 state.ui.tab=tab;save();
 $$(".lp-tab").forEach(b=>b.classList.toggle("active",b.dataset.lpTab===tab));
 $$(".lp-panel").forEach(p=>p.classList.toggle("active",p.id===`lp-${tab}`));
 ({today:renderToday,diagnostic:renderDiagnostic,retrieval:renderRetrieval,misconceptions:renderMisconceptions,confidence:renderConfidence,calculations:renderCalculations,challenges:renderChallenges}[tab]||(()=>{}))();
}
function buildPlatformView(){
 const nav=$(".main-nav"),main=$("main");if(!nav||!main)return;
 let btn=$('.nav-button[data-view="platform"]');if(!btn){btn=document.createElement("button");btn.className="nav-button";btn.dataset.view="platform";btn.textContent="Learning dashboard";nav.appendChild(btn);}
 let sec=$("#view-platform");if(!sec){sec=document.createElement("section");sec.className="view";sec.id="view-platform";sec.innerHTML=`<div class="lp-shell"><div class="lp-hero"><div><span class="eyebrow">Adaptive learning</span><h2>Learning dashboard</h2><p>Diagnostics, spaced retrieval, misconceptions, exam coaching, revision, teacher tools and progress all use the same lesson record.</p></div><div class="lp-actions"><button type="button" id="lpResume" class="primary">Resume lesson</button></div></div><div class="lp-tabs">
 ${[["today","Today"],["diagnostic","Diagnostic"],["retrieval","Retrieval"],["misconceptions","Misconceptions"],["confidence","Confidence"],["calculations","Calculations"],["challenges","Challenges"],["glossary","Glossary"],["paper","Paper generator"],["teacher","Teacher"],["reports","Reports"],["settings","Settings"]].map(x=>`<button type="button" class="lp-tab" data-lp-tab="${x[0]}">${x[1]}</button>`).join("")}
 </div>${["today","diagnostic","retrieval","misconceptions","confidence","calculations","challenges","glossary","paper","teacher","reports","settings"].map(x=>`<div class="lp-panel" id="lp-${x}"></div>`).join("")}</div>`;main.appendChild(sec);}
 const open=()=>{$$(".nav-button").forEach(b=>b.classList.toggle("active",b.dataset.view==="platform"));$$(".view").forEach(v=>v.classList.toggle("active-view",v.id==="view-platform"));renderPlatformTab(state.ui.tab||"today");window.scrollTo({top:0,behavior:"smooth"});};
 btn.addEventListener("click",open);
 $$(".lp-tab",sec).forEach(b=>b.onclick=()=>renderPlatformTab(b.dataset.lpTab));
 sec.addEventListener("click",e=>{const go=e.target.closest("[data-lp-go]");if(go)renderPlatformTab(go.dataset.lpGo);});
 $("#lpResume",sec).onclick=()=>{const b=$('.nav-button[data-view="sequence"]');if(b)b.click()};
 renderPlatformTab(state.ui.tab||"today");
}
const observer=new MutationObserver(()=>{annotateConfidence();enhanceExamCards();injectAdaptive()});
observer.observe(document.body,{childList:true,subtree:true});
setInterval(()=>{if($("#interactiveLessonWorkspace")){annotateConfidence();enhanceExamCards();}},1200);
function init(){
 if(!C()){setTimeout(init,100);return}
 buildPlatformView();annotateConfidence();enhanceExamCards();injectAdaptive();buildPracticalNotebook();
}
setTimeout(init,150);


/* Feature: calculation workspace */
const calcTools=[
 {id:"activity",name:"Activity",eq:"A = λN",prompt:"Find activity from decay constant and number of undecayed nuclei.",units:"A in Bq; λ in s⁻¹; N has no unit",steps:["Choose A = λN","Use consistent inverse-time units for λ","Substitute λ and N","Give activity in Bq"]},
 {id:"halflife",name:"Half-life / decay constant",eq:"T½ = ln2 / λ",prompt:"Convert between half-life and decay constant.",units:"T½ and λ must use reciprocal time units",steps:["Choose T½ = ln2/λ","Rearrange if finding λ","Convert time units consistently","State the reciprocal-time unit for λ"]},
 {id:"decay",name:"Exponential decay",eq:"N = N₀e^(−λt)",prompt:"Find number remaining or activity after a time.",units:"λt must be dimensionless",steps:["Choose the exponential law","Make λ and t compatible","Evaluate the exponent","Use A=λN if activity is required"]},
 {id:"moles",name:"Sample nuclei",eq:"N = (m/M)N_A",prompt:"Convert a pure isotope sample mass to number of nuclei.",units:"Use matching mass units for m and M",steps:["Find moles n=m/M","Use N=nN_A","Keep significant figures sensible","Use N in later activity calculations if needed"]},
 {id:"radius",name:"Nuclear radius",eq:"R = r₀A^(1/3)",prompt:"Estimate nuclear radius.",units:"R and r₀ use the same length unit",steps:["Use the cube root of A","Multiply by r₀","Convert fm to m only if required","Interpret as a nuclear-scale estimate"]},
 {id:"binding",name:"Binding energy",eq:"E = Δmc² or E(MeV)=Δm(u)×931.5",prompt:"Convert mass defect to binding energy.",units:"Use kg/J or u/MeV consistently",steps:["Find/identify mass defect","Choose SI or u→MeV route","Calculate total binding energy","Divide by A only if BE per nucleon is requested"]},
 {id:"gamma",name:"Gamma photon",eq:"ΔE = hf",prompt:"Relate nuclear level spacing to gamma frequency.",units:"Use joules with h in J s",steps:["Find level energy difference","Convert eV/keV/MeV to joules if needed","Use f=ΔE/h","Check the frequency is in the gamma range"]},
 {id:"closest",name:"Closest approach",eq:"E_k = k(2e)(Ze)/r",prompt:"Use the head-on Coulomb energy model.",units:"Use joules, coulombs and metres in SI",steps:["Convert alpha energy to joules","Use alpha charge +2e and target charge +Ze","Rearrange for r","Interpret the result in femtometres"]}
];
function renderCalculations(){
 const host=$("#lp-calculations");if(!host)return;
 const selected=state.ui.calc||calcTools[0].id,tool=calcTools.find(x=>x.id===selected)||calcTools[0];
 host.innerHTML=`<div class="lp-hero"><div><h3>Calculation workspace</h3><p>Students build the method themselves: equation → rearrangement → substitution → result → units.</p></div></div>
 <div class="lp-grid"><article class="lp-card"><label class="lp-field"><span>Calculation</span><select id="lpCalcSelect">${calcTools.map(x=>`<option value="${x.id}" ${x.id===tool.id?"selected":""}>${x.name}</option>`).join("")}</select></label><div class="lp-coach"><strong>${tool.eq}</strong><span>${tool.prompt}</span><p class="muted small">${tool.units}</p></div><ol>${tool.steps.map(x=>`<li>${x}</li>`).join("")}</ol></article>
 <article class="lp-card"><label class="lp-field"><span>1 · Equation</span><input id="lpCalcEq" placeholder="Write the equation"></label><label class="lp-field"><span>2 · Rearranged equation</span><input id="lpCalcRearr" placeholder="Rearrange if needed"></label><label class="lp-field"><span>3 · Substitution</span><input id="lpCalcSub" placeholder="Substitute values with units"></label><label class="lp-field"><span>4 · Final answer</span><input id="lpCalcAns" placeholder="Answer"></label><label class="lp-field"><span>5 · Unit / interpretation</span><input id="lpCalcUnit" placeholder="Unit and one-sentence interpretation"></label><div class="lp-actions"><button type="button" class="primary" id="lpCalcCheck">Check method</button><button type="button" id="lpCalcHint">Hint</button></div><div id="lpCalcFeedback"></div></article></div>`;
 $("#lpCalcSelect",host).onchange=e=>{state.ui.calc=e.target.value;save();renderCalculations()};
 $("#lpCalcHint",host).onclick=()=>{$("#lpCalcFeedback",host).innerHTML=`<div class="lp-feedback lp-warn">Start from <strong>${tool.eq}</strong>. ${esc(tool.steps[1])}</div>`};
 $("#lpCalcCheck",host).onclick=()=>{
   const vals=["lpCalcEq","lpCalcRearr","lpCalcSub","lpCalcAns","lpCalcUnit"].map(id=>$("#"+id,host).value.trim());
   const complete=vals.filter(Boolean).length;
   const eqWords=keywords(tool.eq),eqHit=eqWords.some(k=>vals[0].toLowerCase().includes(k))||vals[0].replace(/\s/g,"").length>3;
   $("#lpCalcFeedback",host).innerHTML=`<div class="lp-feedback ${complete===5&&eqHit?"lp-good":"lp-warn"}"><strong>${complete===5&&eqHit?"Method complete":"Keep building the method"}</strong><p>${complete}/5 stages completed. ${!eqHit?"Write the governing equation before substituting. ":""}Check units and significant figures before accepting the result.</p></div>`;
 };
}

/* Feature: simulation challenge mode + A* synoptic challenges */
const simMissionText=[
 ["Nuclear scale challenge","Use the radius model to find two nuclei whose radii differ by about a factor of 2. Explain why their A values do not differ by a factor of 2."],
 ["Rutherford investigation","Change impact parameter and alpha energy separately. Find conditions for a large deflection and explain the result using Coulomb repulsion."],
 ["Radiation detective","Use absorber changes to distinguish alpha, beta and gamma. Explain why gamma should be described as attenuated."],
 ["Inverse-square mission","Choose two distances with a factor of 2 between them. Predict and then test the corrected count-rate ratio."],
 ["Risk decision","Use the radiation model to justify a suitable radiation type for a monitoring application and state one limitation."],
 ["Random-decay evidence","Compare individual decay events with the smooth population trend and explain why both are consistent."],
 ["Half-life mission","Set a half-life, predict the fraction after three half-lives, then verify the model."],
 ["Activity chain","Use Formula Coach to connect sample mass → nuclei → activity and explain each conversion."],
 ["Stability map mission","Predict how alpha, beta-minus and beta-plus/electron capture move a point on an N–Z graph before testing."],
 ["Gamma-level mission","Choose two transitions with different energy gaps and compare emitted photon frequency."],
 ["Closest-approach mission","Find two alpha energies that give clearly different closest-approach distances and explain the inverse relationship."],
 ["Diffraction mission","Keep electron wavelength fixed and change nuclear radius. Record how the first minimum moves."],
 ["Density mission","Compare A and 8A and use the displayed radii to show the cube-root relationship."],
 ["Mass-energy mission","Change mass defect and explain how total binding energy responds."],
 ["Binding-curve mission","Identify one light and one heavy region where moving toward more tightly bound products can release energy."],
 ["Chain-reaction mission","Compare decreasing, roughly steady and increasing neutron-generation behaviour using only qualitative neutron balance."],
 ["Moderation mission","Compare collision energy loss for different moderator-mass ratios and explain the mechanical reason."],
 ["Reactor-systems mission","Identify moderator, control rods, coolant and shielding and explain why each has a different physical role."],
 ["Synoptic simulation audit","Pick two simulations from different specification sections. State the model assumption and one observable prediction for each."]
];
const synoptic=[
 {q:"A radioactive sample question gives mass, molar mass, half-life and elapsed time. Build the full calculation route to current activity.",points:["m/M to obtain moles","multiply by N_A for nuclei","λ=ln2/T½","apply exponential decay","A=λN with consistent units"]},
 {q:"A new scattering experiment shows mostly straight paths and rare large-angle deflections. Explain how you would distinguish observation, model and inference.",points:["state observations separately","identify electrostatic interaction/model","large force implies concentrated charge","most straight paths imply mostly empty space","state a model limitation/assumption"]},
 {q:"Compare closest-approach and electron-diffraction methods for learning about nuclear size.",points:["closest approach uses Coulomb energy","diffraction uses matter waves","both probe fm scale","different model assumptions","both connect measured behaviour to nuclear radius"]},
 {q:"Explain why both fission and fusion can release energy without saying that mass or energy is destroyed.",points:["products can have greater BE per nucleon","bound system has lower total rest mass","mass-energy difference appears as released energy","conservation of energy is maintained"]},
 {q:"Evaluate a thermal reactor system using neutron physics, heat transfer and safety rather than a list of component names.",points:["moderator slows neutrons","control rods absorb neutrons","coolant transfers heat","shielding/containment reduce exposure","risk-benefit conclusion uses physics evidence"]},
 {q:"An unfamiliar nuclear-physics graph is provided. Describe a strong A* strategy before doing any calculation.",points:["identify axes/units","describe trend with evidence","select relevant model/equation","quantify gradient/proportion/uncertainty where possible","state assumptions and justified conclusion"]}
];
function renderChallenges(){
 const host=$("#lp-challenges");if(!host)return;const i=Number(state.ui.challengeLesson??activeLesson()),mission=simMissionText[i]||simMissionText[0],saved=state.simChallenges[i]||{};
 host.innerHTML=`<div class="lp-grid"><article class="lp-card"><span class="eyebrow">Simulation challenge mode</span><h3>${esc(mission[0])}</h3><p>${esc(mission[1])}</p><label class="lp-field"><span>Choose lesson challenge</span><select id="lpChallengeLesson">${lessons().map((p,n)=>`<option value="${n}" ${n===i?"selected":""}>${n+1}. ${esc(p.title)}</option>`).join("")}</select></label><label class="lp-field"><span>Prediction</span><textarea id="lpChallengePredict">${esc(saved.predict||"")}</textarea></label><label class="lp-field"><span>Evidence / readings</span><textarea id="lpChallengeEvidence">${esc(saved.evidence||"")}</textarea></label><label class="lp-field"><span>Physics explanation</span><textarea id="lpChallengeExplain">${esc(saved.explain||"")}</textarea></label><div class="lp-actions"><button type="button" class="primary" id="lpSaveChallenge">Save challenge</button><button type="button" id="lpOpenChallengeLesson">Open lesson</button></div><div id="lpChallengeFb"></div></article>
 <article class="lp-card"><span class="eyebrow">A* synoptic mastery</span><h3>Multi-topic challenges</h3><div id="lpSynopticList">${synoptic.map((x,n)=>{const v=state.synoptic[n]||{};return `<div class="lp-question"><h4>${n+1}. ${esc(x.q)}</h4><textarea class="lp-field" data-syn-answer="${n}" style="width:100%;min-height:100px;background:#061421;color:var(--text);border:1px solid var(--border);border-radius:9px;padding:9px">${esc(v.answer||"")}</textarea><div class="lp-actions"><button type="button" data-syn-check="${n}">Check reasoning</button></div><div data-syn-result="${n}"></div></div>`}).join("")}</div></article></div>`;
 $("#lpChallengeLesson",host).onchange=e=>{state.ui.challengeLesson=Number(e.target.value);save();renderChallenges()};
 $("#lpSaveChallenge",host).onclick=()=>{state.simChallenges[i]={predict:$("#lpChallengePredict",host).value,evidence:$("#lpChallengeEvidence",host).value,explain:$("#lpChallengeExplain",host).value,completed:$("#lpChallengePredict",host).value.trim().length>15&&$("#lpChallengeEvidence",host).value.trim().length>15&&$("#lpChallengeExplain",host).value.trim().length>25,at:now()};save();$("#lpChallengeFb",host).innerHTML='<div class="lp-feedback lp-good">Challenge saved. Revisit it later and improve the evidence/explanation.</div>'};
 $("#lpOpenChallengeLesson",host).onclick=()=>{const nav=$('.nav-button[data-view="sequence"]');if(nav)nav.click();setTimeout(()=>{const steps=$(".seq-step");if(steps[i])steps[i].click()},100)};
 $("[data-syn-answer]",host).forEach(t=>t.oninput=()=>{const n=Number(t.dataset.synAnswer);state.synoptic[n]=state.synoptic[n]||{};state.synoptic[n].answer=t.value;save()});
 $("[data-syn-check]",host).forEach(b=>b.onclick=()=>{const n=Number(b.dataset.synCheck),x=synoptic[n],ans=state.synoptic[n]?.answer||"",hits=x.points.map(p=>pointHit(ans,p));state.synoptic[n]={answer:ans,hits,completed:hits.filter(Boolean).length>=Math.ceil(x.points.length*.6)};save();$('[data-syn-result="'+n+'"]',host).innerHTML='<div class="lp-markpoints">'+x.points.map((p,k)=>`<div class="lp-markpoint ${hits[k]?"hit":"miss"}">${hits[k]?"Likely included":"Strengthen"} · ${esc(p)}</div>`).join("")+'</div>'});
}

/* Feature: virtual practical notebook */
function buildPracticalNotebook(){
 const view=$("#view-practical");if(!view||$("#lpPracticalNotebook",view))return;
 const box=document.createElement("article");box.id="lpPracticalNotebook";box.className="panel pad";box.style.marginTop="16px";
 const p=state.practical;
 box.innerHTML=`<div class="section-head"><div><span class="eyebrow">Student practical record</span><h3>Virtual RP12 notebook</h3></div><p class="muted">All writing stays in the app alongside the virtual measurements and graph.</p></div><div class="lp-grid">
 <div><label class="lp-field"><span>Prediction / hypothesis</span><textarea data-practical="prediction">${esc(p.prediction||"")}</textarea></label><label class="lp-field"><span>Independent, dependent and control variables</span><textarea data-practical="variables">${esc(p.variables||"")}</textarea></label><label class="lp-field"><span>Method / data-quality notes</span><textarea data-practical="method">${esc(p.method||"")}</textarea></label></div>
 <div><label class="lp-field"><span>Conclusion using inverse-square evidence</span><textarea data-practical="conclusion">${esc(p.conclusion||"")}</textarea></label><label class="lp-field"><span>Evaluation / uncertainties</span><textarea data-practical="evaluation">${esc(p.evaluation||"")}</textarea></label><div class="lp-actions"><button type="button" id="lpCapturePractical">Capture current results summary</button></div><div id="lpPracticalCapture" class="lp-feedback">${esc(p.capture||"No result snapshot saved yet.")}</div></div></div>`;
 view.appendChild(box);
 $("[data-practical]",box).forEach(t=>t.oninput=()=>{state.practical[t.dataset.practical]=t.value;save()});
 $("#lpCapturePractical",box).onclick=()=>{
   const rows=$("#practicalRows tr").map(tr=>tr.innerText.trim()).filter(Boolean);const fit=$("#fitReadout")?.textContent||"";
   state.practical.capture=`Saved ${new Date().toLocaleDateString()}: ${rows.length} result rows. Graph/fit: ${fit}`;save();$("#lpPracticalCapture",box).textContent=state.practical.capture;
 };
}

/*__LP_FEATURES__*/ 
})();