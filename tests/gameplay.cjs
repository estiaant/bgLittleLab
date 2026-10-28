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
  // Extreme settings still complete with scientific results and no failure effects.
  for(const sel of await page.locator('[data-variable]').all()){const count=await sel.locator('option').count();await sel.selectOption(id==='titration'&&await sel.getAttribute('data-variable')==='baseC'?'0':String(count-1));}
  await page.locator('#runButton').click();await page.waitForFunction(()=>!document.querySelector('#runButton').disabled);
  const after=await page.locator('#world').screenshot();assert.ok(!before.equals(after));
  await page.locator('#fieldNotesButton').click();assert.equal(await page.locator('.journal-table tbody tr').count(),2);assert.equal(await page.locator('.notes-graph circle').count(),2);
  const extreme={momentum:2,gravity:Math.sqrt(8/9.8),stairs:85*9.8*1.5,rates:20/Math.pow(1.45,1.5),titration:50};
  assert.ok(Math.abs(parseFloat(await page.locator('.answer').innerText())-extreme[id])<.00051);
  assert.ok(!/mishap|overshoot|cloud burst|wobbly|overflow/i.test(await page.locator('#journalContent').innerText()));
  assert.ok(await page.evaluate(()=>JSON.parse(localStorage.getItem('littlelab_v2_trials')).every(row=>!('mishap' in row))));
  console.log('PASS',id,expected,'and extreme scientific result');
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
 // Historical annotations must not reappear or erase stored measurements.
 await page.evaluate(()=>{const rows=JSON.parse(localStorage.getItem('littlelab_v2_trials'));rows[0].mishap='LEGACY FAILURE EFFECT';localStorage.setItem('littlelab_v2_trials',JSON.stringify(rows))});
 await page.reload();await page.locator('#startButton').click();await page.locator('[data-room="physics"]').click();await page.locator('[data-experiment="momentum"]').click();
 for(const [width,height] of [[320,740],[360,800],[390,844],[768,1024],[844,390]]){
  await page.setViewportSize({width,height});
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  for(const selector of ['.nav-button','#musicToggle','.back-link','[data-variable]','#predict','#runButton','#resetButton']){
   for(const el of await page.locator(selector).all())assert.ok((await el.boundingBox()).height>=44,selector+' touch target at '+width);
  }
  for(const el of await page.locator('[data-variable],#predict').all())assert.ok(await el.evaluate(e=>parseFloat(getComputedStyle(e).fontSize)>=16));
  const contrast=await page.locator('#runButton').evaluate(e=>{const s=getComputedStyle(e);const lum=color=>{const [r,g,b]=color.match(/\d+/g).slice(0,3).map(Number).map(v=>{v/=255;return v<=.04045?v/12.92:((v+.055)/1.055)**2.4});return .2126*r+.7152*g+.0722*b};const a=lum(s.color),b=lum(s.backgroundColor);return (Math.max(a,b)+.05)/(Math.min(a,b)+.05)});assert.ok(contrast>=4.5,'Run button contrast at '+width);
  assert.ok(await page.locator('.clipboard').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
  await page.screenshot({path:path.join(output,'mobile-'+width+'.png'),fullPage:true});
  await page.locator('#fieldNotesButton').click();assert.equal(await page.locator('.journal-table tbody tr').count(),2);assert.ok(!(await page.locator('#journalContent').innerText()).includes('LEGACY FAILURE EFFECT'));
  assert.ok(await page.locator('.journal-paper').evaluate(e=>e.scrollWidth<=e.clientWidth));
  assert.ok(await page.locator('.notes-graph svg').evaluate(e=>e.getBoundingClientRect().width>=540));
  await page.screenshot({path:path.join(output,'notes-'+width+'.png'),fullPage:true});
  await page.locator('.journal-paper').evaluate(e=>e.scrollTop=e.scrollHeight);
  const close=await page.locator('.journal-paper .close-cross').boundingBox();assert.ok(close.y>=0&&close.y+close.height<=height);
  await page.keyboard.press('Escape');
 }
 await page.goto(base+'/play-offline.html');await page.locator('#startButton').click();await page.locator('[data-room="chemistry"]').click();await page.locator('[data-experiment="rates"]').click();await page.locator('#runButton').click();await page.waitForFunction(()=>!document.querySelector('#runButton').disabled);await page.locator('#fieldNotesButton').click();assert.ok(await page.locator('.notes-graph').isVisible());
 assert.deepEqual(errors,[]);console.log('PASS scoped history, reload persistence, quizzes, CSV, print button/PDF, focus trap, mobile, standalone, no page errors');console.log('Artifacts:',output);await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
