import { chromium } from "playwright";

const url = process.env.TEST_URL || "http://127.0.0.1:3000";
const browser = await chromium.launch({headless:true});
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });
await page.addInitScript(() => {
  localStorage.setItem("aqaNuclearInteractiveV1", JSON.stringify({
    0:{pages:{"0":true},practice:{},sim:{},reinforce:{vocab:{}},worked:1,short:false,exitBest:0,tab:"learn"}
  }));
});
const errors=[];
page.on("pageerror",e=>errors.push("PAGE: "+e.message));
page.on("console",msg=>{ if(msg.type()==="error") errors.push("CONSOLE: "+msg.text()); });
page.on("response",res=>{ if(res.status()>=400) errors.push("HTTP "+res.status()+" "+res.url()); });

async function must(sel,label){
  await page.waitForSelector(sel,{state:"visible",timeout:10000});
  console.log("PASS",label);
}
try{
  await page.goto(url,{waitUntil:"domcontentloaded",timeout:15000});
  await must("body","page loaded");
  await must('.nav-button[data-view="sequence"]',"lesson sequencer nav");
  await page.click('.nav-button[data-view="sequence"]');
  await must("#view-sequence.active-view","lesson sequencer opens");
  await must("#interactiveLessonWorkspace","interactive workspace renders");

  await page.click('[data-il-tab="starter"]');
  await must('[data-il-panel="starter"].active',"starter tab opens");
  await must('[data-sq="0"] [data-so]',"starter question buttons");
  await page.locator('[data-sq="0"] [data-so]').first().click();
  await page.waitForTimeout(100);
  const fb=await page.locator('[data-sq="0"] .il-feedback').innerText();
  if(!fb.trim()) throw new Error("Starter answer produced no feedback");
  console.log("PASS starter answer feedback");

  await page.click('[data-il-tab="learn"]');
  await must('[data-il-panel="learn"].active',"learn tab opens");
  await must("[data-cco]","knowledge check renders");
  await must("#lessonDepthPanel","full-spec lesson teaching");
  await must("#completeLessonNotes","complete lesson reference notes");
  const noteSections=await page.locator("#completeLessonNotes .cln-sections article").count();
  if(noteSections<3) throw new Error("Complete lesson notes did not render enough teaching sections");
  await page.locator("#ldRecall").fill("A complete explanation using the key nuclear physics relationship and evidence.");
  await page.click("#ldCompare");
  await must("#ldFeedback .ld-feedback","lesson depth retrieval feedback");
  const nextCount=await page.locator('[data-il-panel="learn"] #ilNext').count();
  if(!nextCount){
    const learnHtml=await page.locator('[data-il-panel="learn"]').innerHTML();
    throw new Error("Next knowledge chunk missing. Learn panel HTML: "+learnHtml.slice(0,5000));
  }
  if(!(await page.locator('[data-il-panel="learn"] #ilNext').isDisabled())) throw new Error("Next knowledge chunk should be locked before a correct check");
  const conceptOptions=page.locator("[data-cco]");
  for(let n=0;n<await conceptOptions.count();n++){
    const btn=conceptOptions.nth(n);
    if(await btn.isDisabled()) continue;
    await btn.click();
    await page.waitForTimeout(30);
    if(!(await page.locator('[data-il-panel="learn"] #ilNext').isDisabled())) break;
  }
  if(await page.locator('[data-il-panel="learn"] #ilNext').isDisabled()) throw new Error("Knowledge check could not be completed");
  console.log("PASS knowledge-check gate");
  await page.click('[data-il-panel="learn"] #ilNext');
  console.log("PASS next knowledge chunk");

  await page.click('[data-il-tab="example"]');
  await must('[data-il-panel="example"].active',"worked example opens");
  await page.click("#ilReveal");
  console.log("PASS worked example reveal");

  await page.click('[data-il-tab="practice"]');
  await must('[data-il-panel="practice"].active',"practice opens");
  const practiceOptions=page.locator('[data-pq="0"] [data-po]');
  for(let n=0;n<await practiceOptions.count();n++){
    const btn=practiceOptions.nth(n);
    if(await btn.isDisabled()) continue;
    await btn.click();
    await page.waitForTimeout(20);
    if((await page.locator('[data-pq="0"] .il-feedback').innerText()).startsWith("Correct")) break;
  }
  await page.locator("#ilShort").fill("A complete physics explanation using the relevant model and relationship.");
  await page.click("#ilModelBtn");
  console.log("PASS guided practice answer");

  await page.click('[data-il-tab="reinforce"]');
  await must('[data-il-panel="reinforce"].active',"reinforce opens");
  await must(".il-vocab-q","reinforcement tasks render");

  await page.click('[data-il-tab="simulation"]');
  await must('[data-il-panel="simulation"].active',"simulation activity opens");
  await page.locator("#ilPrediction").fill("I predict the measured quantity will change because the relevant physical relationship changes.");
  await page.locator("#ilExplanation").fill("The simulation result supports the prediction because the displayed change follows the relevant nuclear physics model.");
  console.log("PASS simulation written responses");

  await page.click('[data-il-tab="exam"]');
  await must('[data-il-panel="exam"].active',"exam questions open");
  await must("[data-exq]","exam question renders");
  await page.locator("[data-exam-answer]").first().fill("Test answer using relevant nuclear physics.");
  await page.locator("[data-reveal-ms]").first().click();
  await must("[data-ms]:not(.hidden)","mark points reveal");

  await must('.nav-button[data-view="platform"]',"learning dashboard nav");
  await page.click('.nav-button[data-view="platform"]');
  await must("#view-platform.active-view","learning dashboard opens");
  for (const tab of ["diagnostic","retrieval","calculations","challenges","glossary","paper","teacher","reports","settings"]) {
    await page.click('[data-lp-tab="'+tab+'"]');
    await must("#lp-"+tab+".active","dashboard tab "+tab);
  }
  await page.click('[data-lp-tab="diagnostic"]');
  await must("[data-diagnostic]","diagnostic questions render");
  await page.click('[data-lp-tab="calculations"]');
  await page.locator("#lpCalcEq").fill("A = lambda N");
  await page.locator("#lpCalcRearr").fill("A = lambda N");
  await page.locator("#lpCalcSub").fill("values with units");
  await page.locator("#lpCalcAns").fill("1.0e6");
  await page.locator("#lpCalcUnit").fill("Bq");
  await page.click("#lpCalcCheck");
  await must("#lpCalcFeedback .lp-feedback","calculation method feedback");
  await page.click('[data-lp-tab="challenges"]');
  await page.locator("#lpChallengePredict").fill("I predict the output will change when the selected physical variable is changed.");
  await page.locator("#lpChallengeEvidence").fill("The simulation produced a measurable change that I recorded and compared.");
  await page.locator("#lpChallengeExplain").fill("The result follows the nuclear physics relationship shown in the lesson and simulation readout.");
  await page.click("#lpSaveChallenge");
  await must("#lpChallengeFb .lp-feedback","simulation challenge saves");
  await page.click('[data-lp-tab="glossary"]');
  await must("#lpGlossarySearch","glossary search");
  await page.locator("#lpGlossAttempt").fill("A course definition recalled from memory.");
  await page.click("#lpGlossReveal");
  await must("#lpGlossCompare .lp-feedback","glossary active recall feedback");
  await page.click('[data-lp-tab="paper"]');
  await page.click("#lpGeneratePaper");
  await must("[data-paper-answer]","paper generator questions");
  await page.locator("[data-paper-answer]").first().fill("The answer includes the relevant nuclear physics relationship, evidence and calculation steps.");
  await page.click("#lpAutoMarkPaper");
  await must(".lp-auto-score","paper auto-mark result");
  await must(".lp-paper-summary","paper auto-mark total");
  await page.click('[data-lp-tab="teacher"]');
  await must("#lpBuildAssignment","assignment builder");
  await page.click("#lpBuildAssignment");
  if(!(await page.locator("#lpAssignmentCode").inputValue()).trim()) throw new Error("Assignment code was not generated");
  console.log("PASS teacher assignment code");
  await page.click('[data-lp-tab="reports"]');
  await must("#lpPrintableReport","progress report");
  await page.click('[data-lp-tab="settings"]');
  await must("[data-a11y]","accessibility controls");
  const swReady=await page.evaluate(async()=>{if(!("serviceWorker" in navigator))return false;try{await Promise.race([navigator.serviceWorker.ready,new Promise((_,rej)=>setTimeout(()=>rej(new Error("timeout")),5000))]);return true}catch{return false}});
  if(!swReady) throw new Error("Service worker did not become ready");
  const manifestOk=await page.evaluate(async()=>{const r=await fetch("/manifest.webmanifest");return r.ok});
  if(!manifestOk) throw new Error("PWA manifest did not load");
  console.log("PASS PWA offline registration");
  console.log("PASS integrated learning platform");

  await must('.nav-button[data-view="mastery"]',"A-star hub nav");
  await page.click('.nav-button[data-view="mastery"]');
  await must("#view-mastery.active-view","A-star hub opens");
  await must("#diagQuestion","A-star diagnostic renders");

  await page.click('.nav-button[data-view="lab"]');
  await must("#view-lab.active-view","simulation lab opens");
  await page.locator(".sim-tab",{hasText:"Fission chain reaction"}).click();
  await must('[data-key="eventStage"]',"fission event-stage control");
  await page.locator('[data-key="eventStage"]').evaluate(el=>{el.value="5";el.dispatchEvent(new Event("input",{bubbles:true}))});
  await page.waitForTimeout(120);
  const fissionReadout=await page.locator("#simReadout").innerText();
  if(!/U-236|prompt neutrons|next generation/i.test(fissionReadout)) throw new Error("Detailed fission sequence did not update");
  console.log("PASS detailed fission sequence");
  for (const simName of [
    "Random decay and half-life",
    "N–Z stability map",
    "Nuclear radius and density",
    "Mass defect and binding energy",
    "Binding-energy curve",
    "Neutron moderation by collisions"
  ]) {
    await page.locator(".sim-tab",{hasText:simName}).click();
    await page.waitForTimeout(80);
    const txt=await page.locator("#simReadout").innerText();
    if(!txt.trim()) throw new Error("Empty simulation readout for "+simName);
  }
  console.log("PASS upgraded simulation suite");

  await must('.nav-button[data-view="rutherfordexp"]',"3D Rutherford nav");
  await page.click('.nav-button[data-view="rutherfordexp"]');
  await must("#view-rutherfordexp.active-view","3D Rutherford view opens");
  await must("#rutherfordExperimentCanvas","Rutherford canvas exists");

  await page.waitForTimeout(500);
  if(errors.length) throw new Error("Browser errors:\n"+errors.join("\n"));
  console.log("BROWSER_SMOKE_OK");
} finally {
  if(errors.length) console.error(errors.join("\n"));
  await browser.close();
}
