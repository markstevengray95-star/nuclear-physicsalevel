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
  await page.click("#ilNext");
  console.log("PASS concept next");

  await page.click('[data-il-tab="example"]');
  await must('[data-il-panel="example"].active',"worked example opens");
  await page.click("#ilReveal");
  console.log("PASS worked example reveal");

  await page.click('[data-il-tab="practice"]');
  await must('[data-il-panel="practice"].active',"practice opens");
  await page.locator('[data-pq="0"] [data-po]').first().click();
  console.log("PASS practice answer");

  await page.click('[data-il-tab="reinforce"]');
  await must('[data-il-panel="reinforce"].active',"reinforce opens");
  await must(".il-vocab-q","reinforcement tasks render");

  await page.click('[data-il-tab="exam"]');
  await must('[data-il-panel="exam"].active',"exam questions open");
  await must("[data-exq]","exam question renders");
  await page.locator("[data-exam-answer]").first().fill("Test answer using relevant nuclear physics.");
  await page.locator("[data-reveal-ms]").first().click();
  await must("[data-ms]:not(.hidden)","mark points reveal");

  await must('.nav-button[data-view="mastery"]',"A-star hub nav");
  await page.click('.nav-button[data-view="mastery"]');
  await must("#view-mastery.active-view","A-star hub opens");
  await must("#diagQuestion","A-star diagnostic renders");

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
