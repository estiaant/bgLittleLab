(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const canvas = $('world'), c = canvas.getContext('2d', {alpha:false});
  const W=640,H=400; c.imageSmoothingEnabled=false;
  const source = window.LAB_DATA || [];
  const extra = {
    id:'titration',tab:'Titration Tea',symbol:'♥',subject:'CHEMISTRY / P2',title:'Titration Tea',station:'STATION 05',type:'Acid–base neutralisation',
    question:'How much alkali is just enough?',
    description:'Slowly add sodium hydroxide from a burette into hydrochloric acid. At the equivalence point, the amounts of acid and base match.',
    mission:'Keep the acid volume the same. Increase its concentration. How much more alkali will you need?',
    variables:[
      {key:'acidC',name:'HCl concentration',unit:'mol/dm³',options:[0.05,0.10,0.15,0.20],defaults:1},
      {key:'acidV',name:'HCl sample volume',unit:'mL',options:[10,15,20,25],defaults:3},
      {key:'baseC',name:'NaOH concentration',unit:'mol/dm³',options:[0.10,0.15,0.20,0.25],defaults:2}
    ],
    controlNote:'A 1:1 reaction is assumed: HCl + NaOH → NaCl + H₂O. Ideal strong acid/strong base at 25 °C. The indicator change is schematic.',
    prediction:'Predict the NaOH volume to equivalence (mL)',outputKey:'baseV',outputName:'NaOH at equivalence',outputUnit:'mL',
    formula:'c(acid) × V(acid) = c(base) × V(base)',
    scienceNote:'Use the 1:1 mole ratio for HCl + NaOH. The exact indicator transition varies by indicator; this is a simplified visual endpoint, not a real titration curve.',
    ideas:['A balanced equation gives the mole ratio between acid and base.','At equivalence, n(HCl) = n(NaOH).','A more concentrated acid sample requires more of the same alkali.'],
    quizzes:[{q:'For a 1:1 reaction, what is true at the equivalence point?',choices:['The reacting amounts are equal in moles','Both liquids have the same volume','Both starting concentrations must be equal'],correct:0,why:'HCl reacts with NaOH in a 1:1 mole ratio, so n(acid) = n(base) at equivalence.'}]
  };
  const experiments=[...source,extra]; const EXP=Object.fromEntries(experiments.map(e=>[e.id,e]));
  const SCENES={desk:{label:'✦ YOUR COSY DESK',hint:'Pick up the coffee or notepad · visit either lab ♡'},physics:{label:'⚙ PHYSICS LAB',hint:'Tap a piece of apparatus to start an experiment'},chemistry:{label:'✿ CHEMISTRY LAB',hint:'Choose a beaker or burette to investigate'}};
  const paths={desk:'desk',physics:'physics',chemistry:'chemistry',momentum:'physics',gravity:'physics',stairs:'physics',rates:'chemistry',titration:'chemistry'};
  const titleOverlay=$('titleOverlay'), badge=$('canvasBadge'), sceneHint=$('sceneHint'), panel=$('panelContent');
  let scene='start',active=null,held=null,pickedAt=0,noteText='',notes=[],journal=[],run=null,result=null,quizChoice=null;
  let positions={cup:{x:178,y:178},notepad:{x:427,y:226}};
  let pointer={x:-99,y:-99,inside:false},hover='',soundOn=true,lastTime=0;
  const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)').matches || false;
  const ink='#503a50',ink2='#795369',cream='#fff0ca',skin='#f4b893',skinShadow='#d58e7f';
  const safeLoad=(name,fallback)=>{try{const v=localStorage.getItem('littlelab_v2_'+name);return v===null?fallback:JSON.parse(v)}catch(_){return fallback}};
  const safeSave=(name,v)=>{try{localStorage.setItem('littlelab_v2_'+name,JSON.stringify(v))}catch(_){}};
  noteText=safeLoad('note',''); journal=safeLoad('trials',[]); if(!Array.isArray(journal))journal=[];
  soundOn=safeLoad('music',true)!==false;
  const format=(x,d=2)=>String(Number(Number(x).toFixed(d)));
  const clamp=(x,a,b)=>Math.min(b,Math.max(a,x));
  const smooth=x=>x*x*(3-2*x);
  function rect(x,y,w,h,color){if(w<=0||h<=0)return;c.fillStyle=color;c.fillRect(Math.round(x),Math.round(y),Math.round(w),Math.round(h));}
  function poly(points,color){c.fillStyle=color;c.beginPath();c.moveTo(points[0][0],points[0][1]);for(let i=1;i<points.length;i++)c.lineTo(points[i][0],points[i][1]);c.closePath();c.fill();}
  function oval(cx,cy,rx,ry,color,pix=3){for(let y=-ry;y<=ry;y+=pix){let extent=Math.round(rx*Math.sqrt(Math.max(0,1-y*y/(ry*ry))));rect(cx-extent,cy+y,extent*2+pix,pix,color)}}
  function label(txt,x,y,color='#ffecd2',size=12,align='left'){c.fillStyle=color;c.font=`bold ${size}px monospace`;c.textAlign=align;c.textBaseline='middle';c.fillText(txt,Math.round(x),Math.round(y));c.textAlign='left';}
  function hashRand(seed){let state=seed>>>0;return()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296)}
  const rnd=hashRand(20271028);
  const background={};
  function buildBackground(key){const off=document.createElement('canvas');off.width=W;off.height=H;let old=c; /* backgrounds drawn once through the active canvas and then copied */
    drawBase(key); const cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.getContext('2d').drawImage(canvas,0,0);background[key]=cv;
  }
  function drawBase(key){
    rect(0,0,W,H,key==='chemistry'?'#403746':key==='physics'?'#324750':'#362e47');
    const r=hashRand(key==='desk'?112: key==='physics'?297:413);
    if(key==='desk'){
      for(let y=0;y<H;y+=24){rect(0,y,W,1,'#4a3a51');for(let x=0;x<W;x+=24)rect(x,y,1,24,'#47384f')}
      for(let i=0;i<100;i++)rect(Math.floor(r()*W),Math.floor(r()*H),r()>.7?3:2,2,'#574660');
    }else{
      const base=key==='physics'?'#557b7f':'#786880';const grout=key==='physics'?'#405b69':'#5e526f';
      rect(0,0,W,H,base);for(let x=0;x<W;x+=44)rect(x,0,3,H,grout);for(let y=0;y<H;y+=44)rect(0,y,W,3,grout);
      for(let i=0;i<130;i++)rect(Math.floor(r()*W),Math.floor(r()*H),3,3,key==='physics'?'#6d9891':'#917f98');
    }
    rect(18,18,604,370,'#201f32');rect(12,9,615,372,key==='physics'?'#34454c':key==='chemistry'?'#47424f':'#5f3d49');
    rect(17,14,606,360,key==='physics'?'#698687':key==='chemistry'?'#93849a':'#915b50');
    rect(23,21,593,345,key==='physics'?'#bfcbc0':key==='chemistry'?'#b0b7ab':'#f0b47e');
    rect(28,26,583,334,key==='physics'?'#89a9a6':key==='chemistry'?'#778d86':'#c4825c');
    if(key==='desk'){
      const boards=['#cc8a60','#d69465','#cb885e','#d69566','#c9895d','#d69867'];
      for(let i=0;i<6;i++){const y=29+i*55;rect(31,y,576,53,boards[i]);rect(31,y,576,2,'#e7ac79');rect(31,y+51,576,2,'#a76c51');for(let t=0;t<36;t++){const x=35+Math.floor(r()*550), yy=y+6+Math.floor(r()*39);rect(x,yy,5+Math.floor(r()*42),1,r()>.5?'#e7a673':'#ba7957')}}
      for(const [x,y] of [[110,93],[330,287],[523,194]]){rect(x-20,y,43,1,'#a66b4c');rect(x-13,y+3,26,1,'#e5a371');rect(x-6,y-2,14,1,'#b77c58')}
      // Stationery, a pressed leaf and a coffee coaster match the original desk.
      oval(178,178,43,41,'#976659');oval(177,175,39,37,'#efd4ab');oval(177,175,35,32,'#c99f82');oval(177,175,31,28,'#f3d8ad');
      rect(539,240,3,48,'#957852');poly([[541,252],[526,240],[512,237],[519,251],[536,258]],'#5b866a');rect(522,241,8,3,'#a4b794');poly([[542,274],[554,254],[567,248],[558,267],[544,281]],'#6e926d');
    }else if(key==='physics'){
      for(let y=28;y<359;y+=40){rect(31,y,577,2,'#b2d0c6');rect(31,y+38,577,2,'#6b8c8b')}
      for(let t=0;t<130;t++)rect(37+Math.floor(r()*558),32+Math.floor(r()*315),2+Math.floor(r()*15),1,r()>.5?'#92b5af':'#739b9a');
      // Power socket, screws, tape and a small pencil.
      rect(527,47,55,36,'#526b70');rect(532,44,52,35,'#ebddb4');rect(542,55,8,12,'#8c7c76');rect(561,55,8,12,'#8c7c76');
      rect(70,325,72,11,'#e0b880');rect(136,328,14,5,'#755d6e');
    }else{
      for(let y=29;y<357;y+=52){rect(31,y,577,2,'#a1b5ac');rect(31,y+49,577,3,'#5e827b')}
      for(let t=0;t<160;t++)rect(35+Math.floor(r()*560),31+Math.floor(r()*320),2+Math.floor(r()*14),1,r()>.5?'#99b5a9':'#6a948b');
      // little leaf and two pastel-coloured bottles at the side
      rect(69,66,14,21,'#68576d');rect(65,79,25,34,'#f0d2b1');rect(69,86,17,20,'#d3a0a2');rect(74,60,5,8,'#d1a583');
      rect(526,298,28,40,'#5a6b7c');rect(531,299,18,31,'#9dcee0');rect(535,289,10,12,'#ddc3a7');
    }
    rect(20,20,596,4,key==='desk'?'#f9c68e':key==='physics'?'#d8e6cc':'#cbd5b3');
    rect(20,22,4,342,key==='desk'?'#eaae7d':key==='physics'?'#bcd6c8':'#b2c4b0');
    rect(610,25,5,335,'#6c555a');rect(28,360,588,5,key==='desk'?'#93604e':'#516b6b');
    for(const [x,y] of [[27,23],[607,23],[27,357],[607,357]]){rect(x-2,y-2,9,9,'#69515b');rect(x,y,5,5,'#f1c895');rect(x+2,y+2,2,2,'#fff4c9')}
  }
  function drawDeskBG(){c.drawImage(background.desk,0,0)}
  function sparkle(x,y,t,color='#ffeca9'){const f=Math.floor(t/280)%3;if(f===0){rect(x-2,y-9,4,20,color);rect(x-9,y-2,18,4,color)}else if(f===1){rect(x,y-5,2,12,color);rect(x-5,y,12,2,color)}else{rect(x-1,y-4,2,8,color);rect(x-4,y-1,8,2,color)}}
  function cup(x,y,scale=1,t=0){c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);
    oval(2,7,33,30,'#6b4b55');oval(1,1,34,31,'#f4dbb5');oval(1,0,27,26,'#a97685');oval(0,-2,24,23,'#fff0cf');oval(0,-3,18,18,'#764d4b');oval(-2,-5,13,13,'#a3674d');oval(-7,-10,8,5,'#bd8464');
    rect(25,-9,12,18,'#fff1c9');rect(30,-5,11,11,'#774f5e');rect(30,-4,6,8,'#fff0d4');rect(-19,-14,7,3,'#fffaf0');
    if(!reduced){const s=Math.sin(t/350); if(s>0.6){rect(-4,-37,2,8,'#fff1d0');rect(9,-46,2,9,'#fff1d0')}}c.restore();}
  function smallNotebook(x,y,hot=false){c.save();c.translate(Math.round(x),Math.round(y));c.rotate(-0.08);
    rect(-38,-47,79,99,'#594452');rect(-35,-50,74,94,'#a66c7e');rect(-29,-44,62,82,'#fff1cc');rect(-26,-39,3,74,'#dba99e');
    for(let i=0;i<6;i++){rect(-42,-37+i*13,14,4,'#5c4357');rect(-40,-39+i*13,12,3,'#ebc389')}
    for(let i=0;i<6;i++)rect(-18,-17+i*11,43,1,'#c3d5cf');
    rect(-17,-34,19,3,'#b9808c');rect(13,-34,12,3,'#e0b9a7');
    if(noteText){c.fillStyle='#6e5465';c.font='bold 7px monospace';c.fillText(noteText.slice(0,13),-18,2,42);c.fillText(noteText.slice(13,26),-18,13,42)}else{rect(17,28,4,4,'#d89ba0');rect(13,24,4,4,'#d89ba0')}
    c.restore();if(hot)sparkle(x+44,y-48,performance.now());}
  function wrapText(str,n){let out=[];for(const raw of str.replace(/\r/g,'').split('\n')){let line='';for(const word of raw.split(' ')){if((line+' '+word).trim().length>n){if(line)out.push(line);line=word}else line=(line+' '+word).trim()}out.push(line)}return out}
  function openPage(x,y){rect(x+8,y+12,276,301,'#503d51');rect(x,y,277,300,'#a36e80');rect(x+8,y+7,264,280,'#e7c7ac');rect(x+12,y+9,255,273,'#fff1d0');rect(x+18,y+14,4,267,'#d3a6aa');
    for(let i=0;i<16;i++){let ly=y+19+i*16;rect(x-5,ly,25,7,'#5c4556');rect(x-3,ly-3,19,5,'#edc891');rect(x+5,ly-4,7,4,'#fff4cb')}
    label('MY LITTLE FIELD NOTES',x+39,y+34,'#9b6c7c',11);rect(x+37,y+47,206,2,'#dab6a5');for(let i=0;i<12;i++)rect(x+34,y+67+i*17,207,1,'#bed5d1');
    c.fillStyle='#695268';c.font='bold 11px monospace';wrapText(noteText,33).slice(0,12).forEach((line,i)=>c.fillText(line,x+38,y+64+i*17,204));
    if(!noteText){label('tap to write ♡',x+52,y+115,'#be929c',13)}
    rect(x+240,y+259,10,4,'#c98b9b');rect(x+243,y+255,4,12,'#c98b9b');}
  function heldHand(t,type){const bob=reduced?0:Math.sin(t/370)*2;
    poly([[0,399],[0,352],[31,337],[89,301],[139,254+bob],[156,269+bob],[149,306],[78,351],[53,400]],'#45374d');
    poly([[0,396],[0,355],[38,341],[104,302],[139,263+bob],[148,274+bob],[132,303],[64,379],[47,399]],'#4b7277');
    poly([[0,398],[0,361],[48,339],[105,304],[131,272+bob],[136,282+bob],[117,309],[55,373],[40,399]],'#86aaa1');
    rect(8,366,28,5,'#b4c4af');rect(54,337,19,5,'#b4c4af');
    poly([[121,282+bob],[143,269+bob],[164,275+bob],[180,289+bob],[170,311+bob],[142,316+bob],[124,304+bob]],ink);
    poly([[128,285+bob],[146,275+bob],[162,281+bob],[174,292+bob],[163,306+bob],[140,307+bob]],skinShadow);
    rect(139,282+bob,22,16,skin);rect(144,283+bob,12,5,'#ffddb0');
    if(type==='notepad'){for(let i=0;i<3;i++){rect(125+i*4,276-i*12+bob,33,8,ink);rect(129+i*4,277-i*12+bob,27,5,skin)} }else{rect(147,271+bob,31,19,ink);rect(150,272+bob,24,15,skin);rect(152,274+bob,19,5,'#ffdbaf')}}
  function heldScene(t){heldHand(t,held);if(held==='cup'){cup(180,284,1.5,t);rect(143,296,22,8,ink);rect(145,296,18,5,skin);rect(168,299,27,8,ink);rect(172,299,19,4,skin)}else{openPage(150,37);rect(138,267,46,20,ink);rect(144,267,38,14,skin);rect(139,299,37,11,ink);rect(144,300,30,7,skin)}}
  function postcard(x,y,title,subtitle,color,kind,hot,t){rect(x+4,y+6,117,77,'#7a5160');rect(x,y,117,75,'#5a455a');rect(x+4,y+4,109,67,color);rect(x+9,y+9,99,51,'#f5dec0');
    if(kind==='physics'){rect(x+18,y+22,39,4,'#84999a');rect(x+20,y+26,12,15,'#a16981');rect(x+42,y+26,12,15,'#7aa5a2');rect(x+18,y+42,42,3,'#6d737c');rect(x+21,y+44,5,4,ink);rect(x+48,y+44,5,4,ink)}
    else{oval(x+38,y+34,17,13,'#6e7e82');oval(x+37,y+31,14,11,'#c8dbcf');oval(x+37,y+32,10,7,'#c0a3b7');rect(x+25,y+17,20,7,'#ead9bf');rect(x+29,y+14,12,5,'#947c80')}
    label(title,x+87,y+28,'#775365',10,'center');label(subtitle,x+87,y+42,'#a67b7e',9,'center');rect(x+10,y+62,97,3,'#d1b09f');if(hot)sparkle(x+106,y+2,t)}
  function drawDesk(t){drawDeskBG();
    // A few desk props permanently frame the interactive toys.
    rect(64,77,89,17,'#7e5361');rect(68,72,85,17,'#edcf9d');label('LET\'S LEARN ♡',110,81,'#855d68',10,'center');
    postcard(339,63,'PHYSICS','enter lab','#a2b8a9','physics',hover==='goPhysics',t);
    postcard(470,65,'CHEMISTRY','enter lab','#b9abc1','chemistry',hover==='goChemistry',t);
    if(held!=='cup')cup(positions.cup.x,positions.cup.y,1,t);
    if(held!=='notepad')smallNotebook(positions.notepad.x,positions.notepad.y,hover==='notepad');
    // a pencil, little eraser and paperclip
    rect(260,298,117,8,'#8c6060');rect(263,293,106,8,'#e5af73');rect(369,293,14,8,'#b87982');poly([[259,293],[259,301],[244,297]],'#f4d9ad');rect(300,296,24,2,'#f8d8a9');
    rect(86,270,34,26,'#e8d4b7');rect(89,273,28,20,'#ebacc0');rect(97,277,11,6,'#f7d6dd');
    if(!held){if(hover==='cup')sparkle(positions.cup.x-42,positions.cup.y-36,t);if(hover==='notepad')sparkle(positions.notepad.x+45,positions.notepad.y-52,t)}
    else heldScene(t);
  }
  function benchCard(x,y,title,sub,color,kind,hot,t){rect(x+6,y+9,156,122,'#52606a');rect(x,y,156,120,'#604958');rect(x+4,y+4,148,112,color);rect(x+9,y+9,138,102,'#f0ddbc');
    label(title,x+78,y+25,'#715368',12,'center');label(sub,x+78,y+40,'#a58187',9,'center');
    if(kind==='momentum'){trackTrolley(x+41,y+82,'red',1);trackTrolley(x+96,y+82,'blue',1);rect(x+21,y+99,111,3,'#78858a')}
    else if(kind==='gravity'){rect(x+47,y+59,9,38,'#907e7b');rect(x+47,y+59,57,5,'#6f8588');oval(x+94,y+80,10,9,'#bd818d');oval(x+90,y+76,3,3,'#ffe0c4');rect(x+37,y+96,77,4,'#8da6a3')}
    else if(kind==='stairs'){for(let i=0;i<5;i++)rect(x+29+i*19,y+90-i*8,23,11+i*8,'#af9d8c');drawKid(x+57,y+69,0.6)}
    else if(kind==='rates'){glass(x+71,y+75,24,'#d8c391',.20);label('X',x+71,y+101,'#5e5263',16,'center')}
    else if(kind==='titration'){rect(x+65,y+50,9,46,'#8db8bc');rect(x+68,y+46,3,44,'#f1edcd');rect(x+55,y+97,35,4,'#8e7890');rect(x+51,y+88,43,15,'#bda9c6')}
    if(hot)sparkle(x+142,y+9,t);}
  function drawPhysicsRoom(t){c.drawImage(background.physics,0,0);rect(64,52,206,37,'#657d7d');rect(68,47,198,36,'#f7e3c3');label('THE PHYSICS CORNER',167,64,'#6c5a6b',16,'center');
    benchCard(59,119,'CRASH TRACK','momentum','#ba9ead','momentum',hover==='momentum',t);
    benchCard(243,119,'GRAVITY TOWER','free fall','#a6c2b5','gravity',hover==='gravity',t);
    benchCard(427,119,'STAIR SPRINT','work & power','#d7bc9d','stairs',hover==='stairs',t);
    rect(84,297,437,7,'#7d9698');rect(103,302,392,3,'#deebcd');
    rect(537,299,51,34,'#8a737e');rect(545,291,35,37,'#fff2d2');label('P1',562,307,'#9c718b',17,'center');label('♡',560,323,'#b78294',12,'center');
  }
  function drawChemRoom(t){c.drawImage(background.chemistry,0,0);rect(77,53,231,37,'#5d6874');rect(72,47,231,37,'#f4dbbd');label('THE CHEMISTRY CORNER',187,65,'#6c556a',16,'center');
    benchCard(128,130,'DISAPPEARING X','reaction rates','#b3c4b4','rates',hover==='rates',t);
    benchCard(355,130,'TITRATION TEA','acid + base','#c6abc3','titration',hover==='titration',t);
    rect(133,302,410,7,'#79938b');rect(145,309,387,3,'#bdd3b6');rect(56,260,32,46,'#b8bdac');rect(61,251,23,12,'#ebd0b3');
    rect(565,95,22,49,'#7e777f');rect(561,129,32,24,'#cfada5');rect(571,90,12,11,'#e5ceae');
  }
  function drawKid(x,y,scale=1,step=0){c.save();c.translate(x,y);c.scale(scale,scale);const bob=reduced?0:Math.sin(step*13)*2;
    rect(-7,14+bob,9,17,ink);rect(5,14-bob,9,17,ink);rect(-9,27+bob,12,5,'#e3d2b1');rect(4,27-bob,13,5,'#e3d2b1');
    rect(-16,-9,33,28,ink);rect(-12,-6,26,22,'#a16d84');rect(-4,-3,10,13,'#dc9ca1');
    rect(-21,-4,8,19,ink);rect(16,-4,8,19,ink);rect(-20,-1,6,13,skin);rect(17,-1,6,13,skin);
    rect(-14,-34,30,26,ink);rect(-10,-30,23,20,skin);rect(-15,-38,32,11,'#5a4957');rect(-11,-41,23,7,'#74576b');rect(-3,-19,4,4,ink);rect(8,-19,4,4,ink);rect(3,-13,6,2,'#b47b78');c.restore()}
  function trackTrolley(x,y,color,scale=1){c.save();c.translate(Math.round(x),Math.round(y));c.scale(scale,scale);rect(-37,-11,80,31,ink);rect(-33,-16,72,29,color==='red'?'#cb7885':'#79a3a7');rect(-28,-16,64,8,color==='red'?'#e6a2a5':'#a9c9c3');rect(-20,-29,40,12,'#e7c794');rect(-16,-27,32,7,'#b79783');for(let xx of [-23,24]){oval(xx,20,10,10,ink,2);oval(xx,20,6,6,'#e7cfa1',2)}rect(-46,1,12,6,ink);rect(38,1,13,6,ink);c.restore()}
  function glass(x,y,rx,fill,cloud){oval(x,y+19,rx+3,rx*.60,ink,2);oval(x,y+15,rx,rx*.65,'#eff2d8',2);oval(x,y+17,rx-5,rx*.52,fill,2);oval(x-5,y+8,rx*.32,rx*.2,'#fff3db',2);
    if(cloud>0){c.save();c.globalAlpha=clamp(cloud,0,.98);oval(x,y+16,rx-5,rx*.52,'#e2cf94',3);c.restore()}}
  function labBackdrop(which,t){rect(0,0,W,H,which==='chemistry'?'#756a83':'#627a81');rect(0,0,W,273,which==='chemistry'?'#aa9fb0':'#a4c2b4');
    for(let y=0;y<271;y+=40){rect(0,y,W,3,which==='chemistry'?'#8e819d':'#8caea7');for(let x=0;x<W;x+=40)rect(x,y,2,40,which==='chemistry'?'#90829d':'#8dac9f')}
    rect(30,66,106,132,'#5c5568');rect(35,59,99,131,'#f2deb9');rect(41,67,87,115,'#90abb0');rect(82,65,5,118,'#f5dcc0');rect(41,117,86,5,'#f5dcc0');
    // A small window showing a fluffy pixel cloud.
    rect(50,92,32,7,'#edf2cf');rect(56,86,23,7,'#edf2cf');rect(91,141,26,6,'#f5f0d9');rect(96,135,13,8,'#f5f0d9');
    rect(0,275,W,125,'#5e4758');rect(0,280,W,104,which==='chemistry'?'#8c727a':'#7d8b82');rect(0,286,W,89,which==='chemistry'?'#b48a86':'#a58d75');
    for(let i=0;i<7;i++){rect(i*97,289,3,86,which==='chemistry'?'#9c787d':'#927a6b');rect(i*97,296,93,2,'#c5a592')}
    rect(0,370,W,10,'#6b515b');rect(0,380,W,20,'#3e374a');
    rect(437,39,168,133,'#594b5e');rect(444,34,158,130,'#f1d9b1');rect(450,42,146,116,'#546c69');
    for(let y=61;y<143;y+=24)rect(456,y,134,2,'#76908b');
    label('FIELD NOTES',525,52,'#e4e1ba',11,'center');
    rect(472,108,32,38,'#c9aa90');rect(477,100,24,13,'#f3d4aa');rect(515,115,25,30,'#c9b3ad');rect(518,109,19,7,'#ffe5be');
    rect(548,99,29,47,'#aaa1aa');rect(555,93,16,9,'#e4c6a9');
    // cute potted succulent to the right of the worktop
    rect(572,231,38,31,'#664c5d');rect(578,227,26,31,'#e0ad89');rect(589,202,5,33,'#6f9a76');rect(581,211,7,18,'#95b68d');rect(594,208,8,20,'#8eb78b');
    rect(0,275,W,6,'#e5c69b');
  }
  function animationDuration(id,v){
    const model=calculate(id,v);
    const duration={
      momentum:1900-v.speed*280,
      gravity:500+model.main*1050,
      stairs:450+v.height/v.pace*140,
      rates:450+model.main*19,
      titration:550+model.main*23
    };
    return clamp(duration[id],650,1700);
  }

  function drawMomentum(t,p,v){labBackdrop('physics',t);label('THE CRASH TRACK',335,43,'#fff0cf',14,'center');
    rect(59,297,430,15,'#5b6370');rect(61,292,423,7,'#d1c9b5');rect(59,309,432,8,'#4d5663');for(let x=80;x<489;x+=40)rect(x,310,19,5,'#aab7a9');
    const m1=+v.redMass,m2=+v.blueMass, speed=+v.speed;let redX=150,blueX=374;const finalSpeed=(m1*speed)/(m1+m2), travel=Math.min(62,16+22*finalSpeed);
    if((run||result) && p<.68){redX=150+(p/.68)*132;}else if(run||result){redX=282+((p-.68)/.32)*travel;blueX=374+((p-.68)/.32)*travel;}
    trackTrolley(redX,271,'red',1.18);trackTrolley(blueX,271,'blue',1.18);
    for(let i=0;i<Math.round(m1*2);i++)rect(redX-23+i*12,224,10,12,'#e1c298');
    for(let i=0;i<Math.round(m2*2);i++)rect(blueX-23+i*12,224,10,12,'#e1c298');
    if(run && p>.65&&p<.77){sparkle(332,245,t,'#fff3b6');sparkle(347,263,t,'#edbd94')}
    for(let i=0;i<6;i++){rect(74+i*64,330,3,11,'#d5c3af');label(String(i),74+i*64,352,'#f4e4c9',9)}
    label('RED '+format(m1,1)+' kg',redX,207,'#fad0ca',11,'center');label('BLUE '+format(m2,1)+' kg',blueX,207,'#e1f3df',11,'center');

    if(run){label(p<.68?'→ → →':'→',redX+12,191,'#fff0cc',18,'center');}
  }
  function drawGravity(t,p,v){labBackdrop('physics',t);label('GRAVITY TOWER',335,43,'#fff0cd',14,'center');
    rect(190,69,15,263,'#626273');rect(197,66,134,7,'#e3c99a');rect(200,70,8,261,'#9bb7ab');rect(331,70,7,260,'#628588');
    for(let i=0;i<9;i++){const y=83+i*28;rect(204,y,8,3,'#edddbc');rect(321,y,8,3,'#edddbc');rect(206,y+2,115,1,'#b2cec2')}
    const height=+v.height,mass=+v.mass;const top=300-(height/4)*214;
    for(let i=0;i<=4;i++)label(`${i}m`,169,305-i*55,'#f1e3c9',10);
    rect(249,top-11,118,6,'#6a7577');rect(252,top-16,109,6,'#c7cfb4');
    const fall=(run||result) ? (p>=.10? Math.pow(clamp((p-.10)/.85,0,1),2):0):0;
    const ballY=top+(296-top)*fall;oval(303,ballY,10+mass*6,10+mass*6,'#644960',2);oval(301,ballY-2,7+mass*6,7+mass*6,'#c98699',2);rect(295,ballY-8,7,4,'#ffe1cb');
    rect(253,307,115,15,'#597176');rect(250,302,123,10,'#f5d7ad');
    if(run && fall>.09&&fall<.95){for(let i=0;i<4;i++)rect(296+(i%2)*10,ballY-16-i*12,3,6,'#f7d7bb')}
    label('drop from rest',307,345,'#ffedc9',12,'center');}
  function drawStairs(t,p,v){labBackdrop('physics',t);label('STAIR SPRINT',335,43,'#fff0cd',14,'center');
    const height=+v.height,pace=+v.pace,rise=90+height*22;
    for(let i=0;i<11;i++){const x=55+i*34,y=295-i*rise/10;rect(x,y,45,80+i*18,'#665d65');rect(x,y-7,45,12,'#e9c59e');rect(x,y+5,45,8,'#b19891');}
    const prog=(run||result)?p:0;const x=99+prog*333,y=260-prog*rise;
    drawKid(x,y,.95+v.mass/300,run?p*(4+pace*4):0);
    if(run){for(let i=0;i<4;i++)rect(x-27-i*12,y+14+i*5,5,3,'#e6c5aa')}
    label('START',70,335,'#ffe3ca',11);label('FINISH ♡',411,270-rise,'#fff1d1',12);
  }
  function drawRates(t,p,v){labBackdrop('chemistry',t);label('THE DISAPPEARING X',335,43,'#fff1d6',14,'center');
    rect(184,116,194,178,'#7e6876');rect(190,109,181,173,'#f0dfba');rect(207,126,148,139,'#fff1ce');
    // X lies under the container, rather than magically changing its colour.
    for(let i=0;i<71;i+=4){rect(245+i,172+i,10,7,'#514354');rect(315-i,172+i,10,7,'#514354')}
    const opacity=(run||result)?clamp((p-.06)/.78,0,.98):.05;
    glass(279,196,78,'#bfd9d1',opacity);
    // The black X is seen THROUGH the clear solution and progressively vanishes.
    c.save();c.globalAlpha=Math.max(0,1-opacity*1.12);for(let i=-27;i<=27;i+=3){rect(279+i-4,207+i*.65,9,7,'#59465a');rect(279+i-4,207-i*.65,9,7,'#59465a')}c.restore();
    if(run||result){const rr=hashRand(340);for(let i=0;i<83;i++){const x=207+rr()*140,y=156+rr()*80; if(Math.hypot(x-279,(y-207)*1.25)<67){c.globalAlpha=Math.min(.88,opacity);rect(x,y,3+rr()*6,3+rr()*4,'#edd9a4');c.globalAlpha=1}}}
    rect(100,142,56,74,'#5b5366');rect(106,134,45,77,'#e5e0c9');rect(112,143,33,56,'#bdd9ce');rect(121,132,15,9,'#e8bd98');rect(110,176,37,24,'#d3a5a9');
    label('Na₂S₂O₃',128,188,'#77576d',9,'center');

    if(run||result)label(opacity>.8?'X hidden!':'sulphur forming…',283,312,'#ffe8cf',13,'center');}
  function drawTitration(t,p,v){labBackdrop('chemistry',t);label('TITRATION TEA',335,43,'#fff1d2',14,'center');
    // Retort stand, clear burette, clamp, indicator and conical flask.
    rect(177,73,9,228,'#6c626d');rect(154,297,133,11,'#595763');rect(157,292,127,9,'#c1b9a4');
    rect(183,109,173,8,'#686473');rect(182,104,174,6,'#dac4a9');rect(343,95,15,27,'#d9b18b');
    rect(294,69,25,165,'#644e62');rect(298,67,17,164,'#e0f1d7');rect(301,77,11,123,'#b7caca');
    const poured=(run||result)?calculate('titration',v).main*p:0;rect(301,77,11,Math.max(0,123-poured*2),'#94b9bc');
    const indicator=(run||result)&&p>.80?'#d6b0ce':'#f1d6b6';
    rect(297,70,20,9,'#c2a49d');rect(295,232,22,7,'#806270');rect(302,239,8,15,'#e9d0a8');
    for(let i=0;i<10;i++)rect(297,92+i*11,5,i%2?1:2,'#8a8584');
    if(run&&p<.89&&p>.07){rect(304,250+((t/(2+v.baseC*15))%19),4,9,'#a7d3da')}
    poly([[281,258],[328,258],[325,276],[350,317],[346,329],[265,329],[260,317],[285,276]],'#5e5369');
    poly([[286,261],[324,261],[321,277],[343,314],[338,323],[271,323],[267,314],[289,277]],'#f0e3d2');
    poly([[282,298],[328,298],[338,317],[332,321],[277,321],[271,317]],indicator);
    rect(285,265,33,4,'#fff7e1');oval(304,320,28,5,run&&p>.8?'#c49ab7':'#f4d9b5',2);
    if(run && p>.82){sparkle(351,282,t,'#f8d8cf');sparkle(267,293,t,'#ffecbe')}
    label('equivalence = 1 : 1',303,351,'#fff0d4',12,'center');}
  function visualProgress(t){if(!run)return 0;return clamp((t-run.started)/run.duration,0,1)}
  function experimentScene(t){const v=run?.values||result?.values||selectedValues();const p=run?visualProgress(t):result?1:0;
    if(active==='momentum')drawMomentum(t,p,v);else if(active==='gravity')drawGravity(t,p,v);else if(active==='stairs')drawStairs(t,p,v);else if(active==='rates')drawRates(t,p,v);else if(active==='titration')drawTitration(t,p,v);
    rect(34,357,300,10,'#684f5e');rect(37,359,294,6,'#e3c1a4');if(run){rect(37,359,294*p,6,'#b57d94');}else{rect(37,359,294*(result?1:.03),6,'#b57d94')}
    if(run){label('SIMULATION RUNNING…',334,380,'#ffedc8',11,'center')}else if(result){label('EXPERIMENT COMPLETE ♡',332,380,'#ffedc8',11,'center')}else{label('CHANGE THE VARIABLES, THEN RUN',328,380,'#ffebd4',11,'center')}
  }
  function render(t){lastTime=t;if(scene==='start'||scene==='desk')drawDesk(t);else if(scene==='physics')drawPhysicsRoom(t);else if(scene==='chemistry')drawChemRoom(t);else experimentScene(t);
    if(run && visualProgress(t)>=1)finishRun();
    requestAnimationFrame(render)}
  function selectedValues(){const e=EXP[active];if(!e)return {};const ret={};for(const item of e.variables){const el=document.querySelector(`[data-variable="${item.key}"]`);const idx=el?Number(el.value):item.defaults;const option=item.options[clamp(idx,0,item.options.length-1)];ret[item.key]=typeof option==='object'?option.value:option; if(typeof option==='object')ret[item.key+'Label']=option.label}return ret}
  function calculate(id,v){let a=0,extras=[],formula='',explain='';
    switch(id){
      case'momentum':{
        const p=Number(v.redMass)*Number(v.speed),total=+v.redMass + +v.blueMass;
        a=p/total;const eBefore=.5*v.redMass*v.speed*v.speed,eAfter=.5*total*a*a;
        extras=[['Before',`${format(p,2)} kg·m/s`],['After',`${format(total*a,2)} kg·m/s`],['KE lost',`${format(eBefore-eAfter,2)} J`]];
        formula=`v = (${v.redMass} × ${v.speed}) / (${v.redMass} + ${v.blueMass}) = ${format(a,3)} m/s`;
        explain='Both trolleys stick together. Total momentum is conserved even though kinetic energy decreases.';break}
      case'gravity':{
        a=Math.sqrt(2*v.height/9.8);extras=[['Time²',`${format(a*a,3)} s²`],['g',`9.8 m/s²`],['Impact speed',`${format(9.8*a,2)} m/s`]];
        formula=`t = √(2 × ${v.height} / 9.8) = ${format(a,3)} s`;
        explain='With air resistance ignored, ball mass does not change its fall time. A height vs t² graph has gradient g/2.';break}
      case'stairs':{
        const work=v.mass*9.8*v.height,sec=v.height/v.pace;
        a=work/sec; extras=[['Work',`${format(work,2)} J`],['Climbing time',`${format(sec,2)} s`],['Vertical speed',`${format(v.pace,2)} m/s`]];
        formula=`P = mgh ÷ t = ${format(work,2)} ÷ ${format(sec,2)} = ${format(a,2)} W`;
        explain='Changing pace changes time and average power, but not the work done against gravity for the same mass and height.';break}
      case'rates':{
        a=6/v.concentration/Math.pow(1.45,(v.temp-20)/10);
        extras=[['Relative rate',`${format(1/a,4)} s⁻¹`],['Temperature',`${v.temp} °C`]];
        formula=`t = (6 / ${v.concentration}) ÷ 1.45^((${v.temp} − 20) / 10) = ${format(a,2)} s`;
        explain='The cross disappears when the simulated sulphur makes the mixture cloudy. The timing model is illustrative, not a universal rate law.';break}
      case'titration':{
        a=v.acidC*v.acidV/v.baseC;
        extras=[['Acid amount',`${format(v.acidC*v.acidV,3)} mmol`],['NaOH concentration',`${format(v.baseC,2)} mol/dm³`],['At equivalence','n(HCl) = n(NaOH)']];
        formula=`V(NaOH) = (${v.acidC} × ${v.acidV}) / ${v.baseC} = ${format(a,2)} mL`;
        explain='HCl and NaOH react 1:1. The ideal equivalence point is reached when the moles of alkali added equal the starting acid moles.';break}
    }
    return {main:a,extras,formula,explain};
  }
  function roomNote(room){return room==='desk'? 'Pick up the coffee or notepad. Click a science postcard to explore.':room==='physics'?'Try three hands-on physics investigations.':'Choose a chemistry experiment to learn by observing.'}
  function countBadges(){$('trialCount').textContent=String(journal.length)}
  function navUpdate(){document.body.classList.toggle('experiment-open',scene==='experiment');$('fieldNotesButton').hidden=scene!=='experiment';for(const b of document.querySelectorAll('[data-room]')){const selected=scene==='experiment'?paths[active]:scene==='start'?'desk':scene;b.classList.toggle('active',b.dataset.room===selected);b.setAttribute('aria-current',b.dataset.room===selected?'page':'false')}badge.textContent=scene==='experiment'?`✦ ${EXP[active].station} · ${EXP[active].subject}`:SCENES[scene]?.label||SCENES.desk.label;
    sceneHint.textContent=scene==='experiment'? '': SCENES[scene]?.hint || SCENES.desk.hint;
    sceneHint.style.display=scene==='experiment'?'none':'';
    $('sceneFooterLeft').textContent=scene==='experiment'?`✧ ${EXP[active].type}`:scene==='chemistry'?'✿ curiosity in every tiny bubble':scene==='physics'?'⚙ explore, predict, discover':'✦ a little world of big discoveries';}
  function infoPanel(){const expCount=id=>journal.filter(j=>j.id===id).length;
    if(scene==='start'||scene==='desk'){
      $('panelEyebrow').textContent='WELCOME, SCIENTIST';
      panel.innerHTML=`<div class="tiny-label">✧ HOME SWEET HOME</div><h2>Make yourself<br>at home. ♡</h2><p class="subtitle">A warm cup of coffee, a notebook full of ideas, and two little labs waiting to be explored.</p><div class="room-list"><button class="room-card" data-go="physics"><span class="emoji">⚙</span><span><strong>Physics lab</strong><small>Trolleys, gravity &amp; stairs · 3 experiments</small></span><span class="arr">›</span></button><button class="room-card" data-go="chemistry"><span class="emoji">✿</span><span><strong>Chemistry lab</strong><small>Cloudy mixtures &amp; titrations · 2 experiments</small></span><span class="arr">›</span></button></div><div class="note-box"><strong>✎ Your notepad</strong><br>${noteText?'Your little note is saved. Pick up the notepad to edit it!':'Pick up the notepad on the wooden table, then click its page to write something.'}</div><div class="micro-info">✦ Click an object to pick it up. Click an empty part of the table to put it down.</div>`;
    } else if(scene==='physics'||scene==='chemistry'){
      const chem=scene==='chemistry',ids=chem?['rates','titration']:['momentum','gravity','stairs'];
      $('panelEyebrow').textContent=chem?'CHEMISTRY · PAPER 2':'PHYSICS · PAPER 1';
      panel.innerHTML=`<div class="tiny-label">✧ CHOOSE YOUR INVESTIGATION</div><h2>${chem?'The bubbling<br>bench. ✿':'The curious<br>corner. ⚙'}</h2><p class="subtitle">${chem?'Swirl, pour and investigate changes you can see.':'Watch the little world move. Change one variable at a time and test your ideas.'}</p><div class="room-list">${ids.map((id,i)=>{const e=EXP[id],icons={momentum:'🚃',gravity:'☄',stairs:'↗',rates:'◉',titration:'⚗'};return `<button class="room-card" data-experiment="${id}"><span class="emoji">${icons[id]}</span><span><strong>${i+1}. ${e.title}</strong><small>${e.type} · ${expCount(id)} trials</small></span><span class="arr">›</span></button>`}).join('')}</div><div class="note-box"><strong>♡ Little lab tip</strong><br>Choose one apparatus on the table, or use the experiment cards above. Your measurements are collected in the journal.</div><button class="pixel-btn pale" type="button" data-go="desk">⌂ BACK TO DESK</button>`;
    }
  }
  function experimentPanel(){const e=EXP[active];$('panelEyebrow').textContent=e.subject;
    const options=(o)=>o.options.map((item,i)=>{const value=typeof item==='object'?item.value:item;const label=typeof item==='object'?`${item.label} · ${value} ${o.unit}`:`${value} ${o.unit}`;return `<option value="${i}" ${i===o.defaults?'selected':''}>${label}</option>`}).join('');
    panel.innerHTML=`<button class="back-link" type="button" data-go="${paths[active]}">‹ BACK TO ${paths[active].toUpperCase()} LAB</button><div class="tag">${e.station} · ${e.type.toUpperCase()}</div><h2>${e.title}</h2><p class="subtitle">${e.question}</p><div class="var-grid">${e.variables.map(v=>`<div class="var-row"><label for="var-${v.key}">${v.name}</label><select id="var-${v.key}" data-variable="${v.key}" aria-label="${v.name}">${options(v)}</select></div>`).join('')}</div><div class="prediction"><label for="predict">✎ ${e.prediction}</label><input id="predict" type="number" min="0" step="any" inputmode="decimal" placeholder="Your prediction (optional)"></div><div class="button-row"><button id="runButton" type="button" class="pixel-btn rose">▶ RUN EXPERIMENT</button><button type="button" class="pixel-btn pale" id="resetButton">↺ RESET</button></div><div id="resultSlot"></div>`;
    for(const sel of panel.querySelectorAll('[data-variable]'))sel.addEventListener('change',()=>{if(!run){result=null;quizChoice=null;$('resultSlot').innerHTML='';}playTap(330)});
    $('runButton').addEventListener('click',startRun);
    $('resetButton').addEventListener('click',()=>{run=null;result=null;quizChoice=null;experimentPanel();live('Experiment reset.');playTap(391)});
  }
  function setScene(next){if(next==='start')next='desk';if(!['desk','physics','chemistry'].includes(next))return;
    scene=next;active=null;held=null;run=null;result=null;quizChoice=null;titleOverlay.hidden=true;
    navUpdate();infoPanel();playTap(523);live(roomNote(scene));}
  function enterExperiment(id){if(!EXP[id])return;scene='experiment';active=id;held=null;run=null;result=null;quizChoice=null;titleOverlay.hidden=true;navUpdate();experimentPanel();playTap(587);live(`Opened ${EXP[id].title}`)}
  function startRun(){if(!active||run)return;const values=selectedValues();const predField=$('predict');const prediction=predField?.value.trim()===''?null:Number(predField.value);
    const model=calculate(active,values);result=null;quizChoice=null;
    run={started:performance.now(),duration:reduced?350:animationDuration(active,values),values,model,prediction};
    $('resultSlot').innerHTML='<p class="busy">✧ The little experiment is running…</p>';
    $('runButton').disabled=true;panel.querySelectorAll('select').forEach(s=>s.disabled=true);
    playTap(698);live(`Running ${EXP[active].title}`);
  }
  function finishRun(){if(!run||scene!=='experiment')return;const e=EXP[active],{values,model,prediction}=run;
    const closeness=prediction!==null && Number.isFinite(prediction)?Math.abs(prediction-model.main):null;
    const tolerance=Math.max(.02,Math.abs(model.main)*.05),close=closeness!==null&&closeness<=tolerance;
    journal.push({id:active,title:e.title,when:new Date().toISOString(),settings:values,output:model.main,unit:e.outputUnit,prediction});
    journal=journal.slice(-200);safeSave('trials',journal);countBadges();run=null;result={values,model,prediction,close,closeness};
    $('runButton').disabled=false;panel.querySelectorAll('select').forEach(s=>s.disabled=false);
    $('resultSlot').innerHTML='<p class="busy">Recorded! Open the wall Field Notes.</p>';playTap(785);live(`${e.title} complete. ${e.outputName}: ${format(model.main,3)} ${e.outputUnit}`)
  }
  function displayResult(observation=result){if(!observation)return;const e=EXP[active],{model,prediction,close}=observation;
    const feedback=prediction===null?'':`<p class="${close?'right':'try-again'}">${close?'♥ Your prediction was very close!':`✦ Your prediction: ${format(prediction,3)} ${e.outputUnit}. Compare it with the result.`}</p>`;
    $('notesResult').innerHTML=`<div class="result"><h3>✦ OBSERVATION RECORDED</h3><strong class="answer">${format(model.main,3)} ${e.outputUnit}</strong><b>${e.outputName}</b>${feedback}<div class="equation">${model.formula}</div>${model.extras.map(([title,value])=>`<p><strong>${title}:</strong> ${value}</p>`).join('')}<p>${model.explain}</p></div><div class="quiz"><strong>♡ QUICK QUESTION: ${e.quizzes[0].q}</strong>${e.quizzes[0].choices.map((a,i)=>`<button type="button" data-quiz="${i}">${a}</button>`).join('')}<div class="feedback" id="quizFeedback" aria-live="polite"></div></div>`;
    $('notesResult').querySelectorAll('[data-quiz]').forEach(b=>b.addEventListener('click',()=>{
      const choice=Number(b.dataset.quiz),q=e.quizzes[0];quizChoice=choice;
      $('notesResult').querySelectorAll('[data-quiz]').forEach(other=>{const n=+other.dataset.quiz;other.classList.toggle('correct',n===q.correct);other.classList.toggle('incorrect',n===choice&&choice!==q.correct)});
      $('quizFeedback').textContent=(choice===q.correct?'♥ Correct! ':'✦ Not quite. ')+q.why;playTap(choice===q.correct?659:330);
    }));}
  function live(s){$('liveStatus').textContent=s;}
  function coords(ev){const bounds=canvas.getBoundingClientRect();return {x:(ev.clientX-bounds.left)*W/bounds.width,y:(ev.clientY-bounds.top)*H/bounds.height}}
  function inBox(p,x,y,w,h){return p.x>=x&&p.x<=x+w&&p.y>=y&&p.y<=y+h}
  function hitAt(p){if(scene==='desk'||scene==='start'){
    if(held==='notepad'&&inBox(p,178,54,232,262))return 'page';
    if(held)return inBox(p,29,25,580,335)?'drop':'';
    if(inBox(p,339,63,119,81))return'goPhysics';if(inBox(p,470,65,118,80))return'goChemistry';
    if(Math.hypot(p.x-positions.cup.x,p.y-positions.cup.y)<42)return'cup';
    if(Math.abs(p.x-positions.notepad.x)<45&&Math.abs(p.y-positions.notepad.y)<55)return'notepad';
  }else if(scene==='physics'){
    if(inBox(p,59,119,156,120))return'momentum';if(inBox(p,243,119,156,120))return'gravity';if(inBox(p,427,119,156,120))return'stairs';
  }else if(scene==='chemistry'){
    if(inBox(p,128,130,156,120))return'rates';if(inBox(p,355,130,156,120))return'titration';
  }else if(scene==='experiment')return'runCanvas';return ''}
  function updateHover(){hover=hitAt(pointer);canvas.style.cursor=hover?'pointer':'default';}
  canvas.addEventListener('pointermove',e=>{pointer={...coords(e),inside:true};updateHover()});
  canvas.addEventListener('pointerleave',()=>{pointer.inside=false;hover='';canvas.style.cursor='default'});
  canvas.addEventListener('pointerdown',e=>{
    if(e.pointerType==='touch')e.preventDefault();const p=coords(e);pointer={...p,inside:true};updateHover();if(scene==='start')return;
    if(scene==='desk'){
      if(held==='notepad'&&hitAt(p)==='page'&&performance.now()-pickedAt>120){openNote();return}
      if(held){if(inBox(p,28,25,583,335)){const type=held,space=type==='cup'?45:54;positions[type]={x:clamp(p.x,67,570),y:clamp(p.y,space+28,348-space+10)};held=null;playTap(392);live('Object placed on the table.')}return}
      if(hover==='goPhysics'){setScene('physics');return}if(hover==='goChemistry'){setScene('chemistry');return}
      if(hover==='cup'||hover==='notepad'){held=hover;pickedAt=performance.now();playTap(523);live(held==='cup'?'Holding the coffee. Click the table to place it.':'Holding the notebook. Click the page to write or the table to place it.')}return;
    }
    if((scene==='physics'||scene==='chemistry')&&EXP[hover])enterExperiment(hover);
    if(scene==='experiment'&&!run&&p.y>305&&p.x>400){/* The scene is intentionally observational; use the visible run controls. */}
  });
  canvas.addEventListener('keydown',e=>{if(e.key==='Escape'){if(held){held=null;updateHover()}else if(scene==='experiment'){setScene(paths[active])}}else if(e.key==='Enter'||e.key===' '){if(scene==='start'){startGame()}else if(hover){e.preventDefault();canvas.dispatchEvent(new PointerEvent('pointerdown',{clientX:canvas.getBoundingClientRect().left+pointer.x*canvas.getBoundingClientRect().width/W,clientY:canvas.getBoundingClientRect().top+pointer.y*canvas.getBoundingClientRect().height/H,bubbles:true}))}}});
  document.addEventListener('click',e=>{const room=e.target.closest('[data-room],[data-go]'),exp=e.target.closest('[data-experiment]');if(room){if(scene==='start')titleOverlay.hidden=true;setScene(room.dataset.room||room.dataset.go)}else if(exp)enterExperiment(exp.dataset.experiment)});
  function startGame(){setScene('desk');resumeMusic();playTap(659);canvas.focus({preventScroll:true})}
  $('startButton').addEventListener('click',startGame);
  function openNote(){$('noteInput').value=noteText;countNote();$('noteModal').hidden=false;$('noteInput').focus();playTap(659)}
  function countNote(){$('noteCount').textContent=`${$('noteInput').value.length} / 160`}
  $('noteInput').addEventListener('input',countNote);
  function closeNote(save){if(save){noteText=$('noteInput').value.slice(0,160);safeSave('note',noteText);live('Your little note has been saved.');playTap(659)}$('noteModal').hidden=true;canvas.focus({preventScroll:true});if(scene==='desk')infoPanel()}
  $('noteSave').addEventListener('click',()=>closeNote(true));
  const escapeHTML=value=>String(value).replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  function graphFor(id,rows){
    const e=EXP[id];const g=e.graph||{x:'acidC',xLabel:'HCl concentration (mol/dm³)',y:'baseV',yLabel:'NaOH at equivalence (mL)'};
    const points=rows.map(row=>{const v=row.settings,m=calculate(id,v).main;return {x:g.x==='tSquared'?m*m:g.x==='time'?v.height/v.pace:+v[g.x],y:g.y==='height'?+v.height:g.y==='rate'?1/m:m}}).filter(p=>Number.isFinite(p.x)&&Number.isFinite(p.y));
    if(!points.length)return '';
    const maxX=Math.max(...points.map(p=>p.x),.01)*1.15,maxY=Math.max(...points.map(p=>p.y),.01)*1.15;
    return `<figure class="notes-graph"><div class="graph-scroll" tabindex="0" role="region" aria-label="Scrollable experiment graph"><svg viewBox="0 0 600 290" role="img" aria-label="${escapeHTML(g.yLabel)} versus ${escapeHTML(g.xLabel)}"><path d="M70 25V235H565" fill="none" stroke="#795369" stroke-width="3"/>${[0,.5,1].map(f=>`<text x="60" y="${239-f*200}" text-anchor="end">${format(maxY*f,3)}</text><text x="${70+f*490}" y="254" text-anchor="middle">${format(maxX*f,3)}</text>`).join('')}${points.map((p,i)=>`<circle cx="${70+p.x/maxX*490}" cy="${235-p.y/maxY*200}" r="6" fill="#a96785"><title>Run ${i+1}: ${p.x}, ${p.y}</title></circle>`).join('')}<text x="310" y="281" text-anchor="middle">${escapeHTML(g.xLabel)}</text><text transform="translate(17 140) rotate(-90)" text-anchor="middle">${escapeHTML(g.yLabel)}</text></svg></div><figcaption>Recorded runs only; other variables may differ. Compare the settings table before drawing conclusions.</figcaption></figure>`;
  }
  function openJournal(){
    const wrap=$('journalContent'),rows=active?journal.filter(r=>r.id===active):journal;
    $('journalTitle').textContent=active?EXP[active].title+' · Field notes':'My field notes ♡';
    $('notesResult').innerHTML='';
    if(!rows.length)wrap.innerHTML='<div class="empty-journal">Run an experiment, then return to this wall for your notes and graphs.</div>';
    else{
      const ids=active?[active]:[...new Set(rows.map(r=>r.id))];
      wrap.innerHTML=ids.filter(id=>EXP[id]).map(id=>{const e=EXP[id],trials=rows.filter(r=>r.id===id);return `<section class="experiment-notes"><h3>${escapeHTML(e.title)}</h3><p>${escapeHTML(e.mission)}</p><p>${escapeHTML(e.controlNote)}</p><p class="graph-hint">Scroll sideways to see every variable and the full graph.</p><div class="journal-table-wrap" tabindex="0" role="region" aria-label="Recorded experiment runs"><table class="journal-table"><thead><tr><th>Run</th>${e.variables.map(v=>`<th>${escapeHTML(v.name)} (${escapeHTML(v.unit)})</th>`).join('')}<th>${escapeHTML(e.outputName)} (${escapeHTML(e.outputUnit)})</th></tr></thead><tbody>${trials.map((row,i)=>`<tr><td>${i+1}</td>${e.variables.map(v=>`<td>${escapeHTML(row.settings[v.key+'Label']?row.settings[v.key+'Label']+' · '+row.settings[v.key]:row.settings[v.key])}</td>`).join('')}<td>${format(+row.output,3)}</td></tr>`).join('')}</tbody></table></div>${graphFor(id,trials)}<p>${escapeHTML(e.scienceNote)}</p><p>${escapeHTML(calculate(id,trials.at(-1).settings).formula)}</p></section>`}).join('')+'<p class="model-disclaimer">Numbers and graphs use the stated ideal scientific models. Animation playback is compressed; it does not represent real elapsed time.</p>';
    }
    if(active&&rows.length){const last=rows.at(-1),model=calculate(active,last.settings),prediction=last.prediction??null;displayResult({model,prediction,close:prediction!==null&&Math.abs(prediction-model.main)<=Math.max(.02,Math.abs(model.main)*.05)})}
    $('journalModal').hidden=false;$('journalModal').querySelector('.journal-paper').scrollTop=0;document.querySelector('main').inert=true;$('journalModal').querySelector('[data-close]').focus();playTap(523);
  }
  function closeJournal(){$('journalModal').hidden=true;document.querySelector('main').inert=false;(active?$('fieldNotesButton'):$('journalButton')).focus()}
  $('fieldNotesButton').addEventListener('click',openJournal);
  $('printNotes').addEventListener('click',()=>window.print());
  $('journalModal').addEventListener('keydown',event=>{
    if(event.key!=='Tab')return;const controls=[...$('journalModal').querySelectorAll('button,input,select,textarea,a[href],[tabindex="0"]')].filter(el=>!el.disabled);const first=controls[0],last=controls.at(-1);
    if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
  });
  $('journalButton').addEventListener('click',openJournal);
  $('exportButton').addEventListener('click',()=>{if(!journal.length){live('Run an experiment before exporting your journal.');return}
    const csvRows=[['Date','Experiment','Variable settings','Main result','Unit']];for(const r of (active?journal.filter(r=>r.id===active):journal)){const settings=Object.entries(r.settings||{}).filter(([k])=>!k.endsWith('Label')).map(([k,v])=>k+'='+v).join('; ');csvRows.push([r.when,r.title,settings,format(+r.output,5),r.unit])}
    const csv=csvRows.map(row=>row.map(s=>'"'+String(s).replace(/"/g,'""')+'"').join(',')).join('\r\n');
    const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='little-lab-field-notes.csv';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  $('clearJournal').addEventListener('click',()=>{if(!journal.length)return;if(!window.confirm(active?'Clear recorded runs for this experiment?':'Clear all saved experiment trials on this device?'))return;journal=active?journal.filter(r=>r.id!==active):[];result=null;safeSave('trials',journal);countBadges();openJournal();if(scene==='physics'||scene==='chemistry')infoPanel();live('All saved trials cleared.')});
  document.querySelectorAll('[data-close]').forEach(b=>b.addEventListener('click',()=>{if(b.dataset.close==='note')closeNote(false);else{closeJournal()}}));
  for(const id of ['noteModal','journalModal'])$(id).addEventListener('pointerdown',e=>{if(e.target===e.currentTarget){if(id==='noteModal')closeNote(false);else closeJournal()}});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('noteModal').hidden)closeNote(false);else if(!$('journalModal').hidden)closeJournal();else if(held)held=null;else if(scene==='experiment')setScene(paths[active])}if((e.ctrlKey||e.metaKey)&&e.key==='Enter'&&!$('noteModal').hidden)closeNote(true)});
  // Three miniature original chiptune loops, synthesized with browser Web Audio.
  // No samples, external files, libraries, or pre-existing compositions.
  let audio=null,master=null,clock=null,musicTick=0,nextNote=0,track='desk';
  const tunes={
    desk:{bpm:84,chords:[[60,64,67,72],[57,60,64,69],[53,57,60,65],[55,59,62,67]],pattern:[0,1,2,3,2,1,3,null],wave:'triangle'},
    physics:{bpm:100,chords:[[62,66,69,74],[59,62,66,71],[55,59,62,67],[57,61,64,69]],pattern:[0,2,1,3,1,2,3,null],wave:'square'},
    chemistry:{bpm:76,chords:[[65,69,72,77],[60,65,69,72],[57,60,64,69],[62,65,69,74]],pattern:[0,1,3,2,1,null,2,3],wave:'sine'}
  };
  function noteSound(midi,time,len,vol,wave){if(!audio||!master)return;const osc=audio.createOscillator(),gain=audio.createGain();osc.type=wave;osc.frequency.setValueAtTime(440*Math.pow(2,(midi-69)/12),time);gain.gain.setValueAtTime(.0001,time);gain.gain.exponentialRampToValueAtTime(Math.max(vol,.001),time+.018);gain.gain.exponentialRampToValueAtTime(.0001,time+len);osc.connect(gain);gain.connect(master);osc.start(time);osc.stop(time+len+.025)}
  function musicSchedule(){if(!audio||audio.state!=='running'||!soundOn)return;const nextTrack=scene==='experiment'?paths[active]:scene==='chemistry'?'chemistry':scene==='physics'?'physics':'desk';if(track!==nextTrack){track=nextTrack;musicTick=0;nextNote=audio.currentTime+.07}
    const tune=tunes[track],step=60/tune.bpm/2;while(nextNote<audio.currentTime+.23){const bar=Math.floor(musicTick/8)%4,beat=musicTick%8,idx=tune.pattern[beat],chord=tune.chords[bar];if(idx!==null){noteSound(chord[idx]+(beat===3?12:0),nextNote,step*.8,track==='physics'?.010:.019,tune.wave);if(beat===3||beat===7)noteSound(chord[1]+12,nextNote,step*.35,.008,'triangle')}
      if(beat===0){noteSound(chord[0]-12,nextNote,step*4.3,.023,'sine');noteSound(chord[0],nextNote,step*1.3,.009,'triangle')}musicTick++;nextNote+=step}}
  function resumeMusic(){if(!soundOn)return;try{if(!audio){const Actx=window.AudioContext||window.webkitAudioContext;if(!Actx)return;audio=new Actx();master=audio.createGain();master.gain.value=.6;master.connect(audio.destination);nextNote=audio.currentTime+.05}if(audio.state==='suspended')audio.resume();if(!clock)clock=setInterval(musicSchedule,75);musicSchedule()}catch(_){}}
  function playTap(note=523){if(!audio||audio.state!=='running'||!soundOn)return;noteSound(69+12*Math.log2(note/440),audio.currentTime+.015,.13,.024,'triangle')}
  $('musicToggle').addEventListener('click',()=>{soundOn=!soundOn;safeSave('music',soundOn);updateMusicButton();if(soundOn){if(audio)nextNote=audio.currentTime+.06;resumeMusic()}else if(audio&&master)master.gain.setTargetAtTime(.0001,audio.currentTime,.05);if(soundOn&&audio&&master)master.gain.setTargetAtTime(.6,audio.currentTime,.1)});
  function updateMusicButton(){const b=$('musicToggle');b.classList.toggle('off',!soundOn);b.setAttribute('aria-pressed',String(soundOn));b.querySelector('span').textContent=soundOn?'MUSIC ON':'MUSIC OFF'}
  document.addEventListener('visibilitychange',()=>{if(!audio)return;if(document.hidden)audio.suspend();else if(soundOn)audio.resume().then(()=>{nextNote=audio.currentTime+.05})});
  // Make the interactive desk and both workshops visually consistent from the very first frame.
  buildBackground('desk');buildBackground('physics');buildBackground('chemistry');
  countBadges();updateMusicButton();navUpdate();infoPanel();requestAnimationFrame(render);
})();
