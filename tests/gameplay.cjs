const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const path=require('node:path');
const fs=require('node:fs');
const output=fs.mkdtempSync(path.join(require('node:os').tmpdir(),'littlelab-test-'));
const base=process.env.BASE_URL||'http://127.0.0.1:8000';
(async()=>{
 const browser=await chromium.launch({executablePath:process.env.CHROMIUM_PATH||'/usr/bin/chromium',headless:true,args:['--no-sandbox']});
 const context=await browser.newContext({viewport:{width:1440,height:1080}}),page=await context.newPage();
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/');await page.locator('#startButton').click();
 const records=[['momentum','physics','1 m/s'],['gravity','physics','0.639 s'],['stairs','physics','269.5 W'],['rates','chemistry','60 s'],['titration','chemistry','12.5 mL']];
 for(const [id,room,expected] of records){
  await page.locator(`[data-room="${room}"]`).click();await page.locator(`[data-experiment="${id}"]`).click();
  await page.locator('#fieldNotesButton').click();assert.match(await page.locator('#journalContent').innerText(),/Run an experiment/);await page.keyboard.press('Escape');
  const before=await page.locator('#world').screenshot();
  await page.locator('#predict').fill(expected.split(' ')[0]);
  const started=Date.now();await page.locator('#runButton').click();await page.waitForFunction(()=>!document.querySelector('#runButton').disabled);assert.ok(Date.now()-started<2500);
  await page.locator('#fieldNotesButton').click();assert.equal(await page.locator('.answer').innerText(),expected);assert.match(await page.locator('.result').innerText(),/prediction was very close/);assert.equal(await page.locator('.journal-table tbody tr').count(),1);assert.equal(await page.locator('.notes-graph circle').count(),1);
  await page.locator('[data-quiz="0"]').click();assert.ok(await page.locator('#quizFeedback').innerText());await page.keyboard.press('Escape');
  // Every extreme control setting produces a distinct, recorded fictional mishap.
  for(const sel of await page.locator('[data-variable]').all()){const count=await sel.locator('option').count();await sel.selectOption(id==='titration'&&await sel.getAttribute('data-variable')==='baseC'?'0':String(count-1));}
  await page.locator('#runButton').click();await page.waitForFunction(()=>!document.querySelector('#runButton').disabled);
  const after=await page.locator('#world').screenshot();assert.ok(!before.equals(after));
  await page.locator('#fieldNotesButton').click();assert.equal(await page.locator('.journal-table tbody tr').count(),2);assert.equal(await page.locator('.notes-graph circle').count(),2);
  const mishap=await page.locator('.journal-table tbody tr').last().locator('td').last().innerText();assert.ok(mishap.length>15&&!mishap.includes('normally'));console.log('PASS',id,expected,mishap);
  assert.equal(await page.locator('main').evaluate(e=>e.inert),true);
  await page.locator('[data-close="journal"]').first().focus();await page.keyboard.press('Shift+Tab');assert.equal(await page.evaluate(()=>document.activeElement.textContent.trim()),'DONE ♥');
  if(id==='momentum'){
   await page.screenshot({path:path.join(output,'notes-new.png'),fullPage:true});
   await page.evaluate(()=>{window.print=()=>{window.printCalled=true}});await page.locator('#printNotes').click();assert.equal(await page.evaluate(()=>window.printCalled),true);
   await page.emulateMedia({media:'print'});assert.equal(await page.locator('main').isVisible(),false);assert.equal(await page.locator('#journalContent').isVisible(),true);await page.pdf({path:path.join(output,'field-notes.pdf'),format:'A4',printBackground:true});await page.emulateMedia({media:'screen'});
   const dl=page.waitForEvent('download');await page.locator('#exportButton').click();const d=await dl;await d.saveAs(path.join(output,'notes.csv'));
  }
  await page.keyboard.press('Escape');
 }
 await page.reload();assert.equal(await page.locator('#trialCount').innerText(),'10');await page.locator('#startButton').click();await page.locator('[data-room="physics"]').click();await page.locator('[data-experiment="momentum"]').click();
 await page.screenshot({path:path.join(output,'desktop-new.png'),fullPage:true});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(output,'mobile-new.png'),fullPage:true});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.locator('#fieldNotesButton').click();assert.equal(await page.locator('.journal-table tbody tr').count(),2);await page.keyboard.press('Escape');
 await page.goto(base+'/play-offline.html');await page.locator('#startButton').click();await page.locator('[data-room="chemistry"]').click();await page.locator('[data-experiment="rates"]').click();await page.locator('#runButton').click();await page.waitForFunction(()=>!document.querySelector('#runButton').disabled);await page.locator('#fieldNotesButton').click();assert.ok(await page.locator('.notes-graph').isVisible());
 assert.deepEqual(errors,[]);console.log('PASS scoped history, reload persistence, quizzes, CSV, print button/PDF, focus trap, mobile, standalone, no page errors');console.log('Artifacts:',output);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
