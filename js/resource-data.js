/*
 * All numbers and variables used in this proof of concept live here.
 * Four discrete bands are provided per control. Results are derived from
 * transparent, deterministic school-level mathematical models in app.js.
 * The 4 animation families are drawn locally in scene.js.
 */
window.LAB_DATA = [
  {
    id:'momentum',tab:'Crash Track',symbol:'⇥',subject:'PHYSICS / P1',title:'The Crash Track',
    station:'STATION 01',type:'Momentum investigation',
    question:'Can two trolleys crash without losing momentum?',
    description:'Launch the red trolley into a blue trolley at rest. They stick together. Change the masses and launch speed, then observe their shared final velocity.',
    mission:'Try keeping launch speed fixed and increasing the blue trolley mass. What happens to the final velocity?',
    variables:[
      {key:'redMass',name:'Red trolley mass',unit:'kg',options:[0.5,1,1.5,2],defaults:0},
      {key:'blueMass',name:'Blue trolley mass',unit:'kg',options:[0.5,1,1.5,2],defaults:0},
      {key:'speed',name:'Launch velocity',unit:'m/s',options:[1,2,3,4],defaults:1}
    ],
    controlNote:'The blue trolley begins at rest. Both trolleys stick together. Assume negligible external horizontal force.',
    prediction:'Predict the final common velocity (m/s)',
    outputKey:'v', outputName:'Final velocity',outputUnit:'m/s',
    columns:[['redMass','Red mass (kg)'],['blueMass','Blue mass (kg)'],['speed','Launch (m/s)'],['v','Final (m/s)'],['pBefore','Momentum (kg·m/s)']],
    graph:{x:'blueMass',xLabel:'Blue trolley mass (kg)',y:'v',yLabel:'Final velocity (m/s)'},
    formula:'m₁u₁ + m₂u₂ = (m₁ + m₂)v',
    ideas:['Momentum = mass × velocity.','Total momentum before equals total momentum after in an isolated system.','The trolleys stick together: this is a perfectly inelastic collision.','Kinetic energy decreases; momentum is still conserved.'],
    scienceNote:'Choose right as positive. The simulation ignores friction and air resistance. Kinetic energy lost is transferred to other energy forms.',
    quizzes:[
      {q:'After a perfectly inelastic collision, which quantity must be conserved in an isolated system?',choices:['Total momentum','Total kinetic energy','Each trolley’s speed'],correct:0,why:'The total momentum of an isolated system is conserved, even though kinetic energy may decrease.'},
      {q:'You double the mass of the stationary blue trolley. What happens to the combined final speed?',choices:['It increases','It decreases','It stays unchanged'],correct:1,why:'With the same incoming momentum and a larger combined mass, the final velocity is smaller.'}
    ]
  },
  {
    id:'gravity',tab:'Gravity Tower',symbol:'↓',subject:'PHYSICS / P1',title:'The Gravity Tower',
    station:'STATION 02',type:'Free-fall investigation',
    question:'How can we measure the acceleration of gravity?',
    description:'Raise a metal ball to a measured height, release it from rest and use the timer to measure the fall. Compare heights and ball masses.',
    mission:'Try dropping differently sized balls from the same height. Does changing mass change fall time in this ideal model?',
    variables:[
      {key:'height',name:'Release height',unit:'m',options:[0.5,1,2,4],defaults:2},
      {key:'mass',name:'Ball mass',unit:'kg',options:[0.1,0.2,0.5,1],defaults:1}
    ],
    controlNote:'Earth gravity is set to 9.8 m/s². The ball starts from rest; air resistance and timer errors are ignored.',
    prediction:'Predict the time of fall (seconds)',
    outputKey:'t',outputName:'Fall time',outputUnit:'s',
    columns:[['height','Height (m)'],['mass','Mass (kg)'],['t','Fall time (s)'],['tSquared','Time² (s²)'],['g','Calculated g (m/s²)']],
    graph:{x:'tSquared',xLabel:'Time squared (s²)',y:'height',yLabel:'Drop height (m)'},
    formula:'h = ½gt²     →     g = 2h / t²',
    ideas:['Objects dropped from rest accelerate downwards.','In ideal free fall, acceleration is approximately 9.8 m/s² on Earth.','The fall time depends on drop height, not object mass (with negligible air resistance).','A plot of height against time squared has gradient g/2.'],
    scienceNote:'The displayed time is ideal simulated time, independent of animation playback speed. Height is the vertical distance fallen.',
    quizzes:[
      {q:'If you double the drop height, does the fall time double?',choices:['Yes, exactly','No, it increases by a factor of √2','No, it stays the same'],correct:1,why:'Because h = ½gt², time is proportional to √h when g is constant.'},
      {q:'A height-versus-time² graph has gradient 4.9. What is g?',choices:['4.9 m/s²','9.8 m/s²','19.6 m/s²'],correct:1,why:'Gradient = g/2, so g = 2 × 4.9 = 9.8 m/s².'}
    ]
  },
  {
    id:'stairs',tab:'Stair Sprint',symbol:'↗',subject:'PHYSICS / P1',title:'The Stair Sprint',
    station:'STATION 03',type:'Work and power investigation',
    question:'Why does running upstairs require more power?',
    description:'Send the same character up the stairs at four different paces. Change mass or vertical height and measure work done against gravity and average power.',
    mission:'Keep mass and height constant. Change only the pace from walk to sprint. Compare work and power.',
    variables:[
      {key:'mass',name:'Character mass',unit:'kg',options:[40,55,70,85],defaults:1},
      {key:'height',name:'Vertical height',unit:'m',options:[1.5,2,3,4],defaults:2},
      {key:'pace',name:'Climbing pace',unit:'m/s upward',options:[{label:'Walk',value:0.5},{label:'Jog',value:0.75},{label:'Run',value:1},{label:'Sprint',value:1.5}],defaults:0}
    ],
    controlNote:'The pace bands represent average vertical speed, not speed along the steps. Ignore energy losses and body biomechanics.',
    prediction:'Predict the average power (watts)',
    outputKey:'power',outputName:'Average power',outputUnit:'W',
    columns:[['mass','Mass (kg)'],['height','Height (m)'],['paceLabel','Pace'],['time','Time (s)'],['work','Work (J)'],['power','Power (W)']],
    graph:{x:'time',xLabel:'Climb time (s)',y:'power',yLabel:'Average power (W)'},
    formula:'W = mgh     |     P = W / Δt',
    ideas:['Work done against gravity equals the gain in gravitational potential energy: mgh.','Average power is work divided by time.','Shorter climbing time means greater power for the same mass and height.','Vertical rise matters; the total distance travelled along the steps is not h.'],
    scienceNote:'The simplified power result is the average rate of work against gravity, not the total metabolic power of a human.',
    quizzes:[
      {q:'With the same mass and staircase, running in half the time changes the work done against gravity by…',choices:['A factor of 2','A factor of ½','No change'],correct:2,why:'W = mgh. With the same m and h, work does not depend on the time taken.'},
      {q:'If you halve the climbing time while keeping work constant, power…',choices:['Doubles','Halves','Remains constant'],correct:0,why:'P = W/t. Halving t doubles average power.'}
    ]
  },
  {
    id:'rates',tab:'Disappearing X',symbol:'✕',subject:'CHEMISTRY / P2',title:'The Disappearing Cross',
    station:'STATION 04',type:'Reaction-rate investigation',
    question:'Why does the cross disappear faster sometimes?',
    description:'Mix sodium thiosulphate solution with hydrochloric acid. Watch sulphur form and cloud the mixture until the black cross underneath is no longer visible.',
    mission:'Keep temperature constant, then increase sodium thiosulphate concentration. How does this affect time and relative rate (1/t)?',
    variables:[
      {key:'concentration',name:'Thiosulphate concentration',unit:'mol/dm³',options:[0.1,0.15,0.2,0.3],defaults:0},
      {key:'temp',name:'Solution temperature',unit:'°C',options:[20,25,30,35],defaults:0}
    ],
    controlNote:'Total mixture volume and HCl concentration/volume remain constant. The endpoint is the same cloudiness threshold in every trial.',
    prediction:'Predict the time until the cross disappears (s)',
    outputKey:'t',outputName:'Cross disappears',outputUnit:'s',
    columns:[['concentration','Conc. (mol/dm³)'],['temp','Temp (°C)'],['t','Time (s)'],['rate','Relative rate (s⁻¹)']],
    graph:{x:'concentration',xLabel:'Thiosulphate concentration (mol/dm³)',y:'rate',yLabel:'Relative rate, 1/t (s⁻¹)'},
    formula:'Relative rate ≈ 1 / t',
    ideas:['Sulphur forms and makes the mixture cloudy, hiding the X.','More frequent effective particle collisions increase reaction rate.','Increasing concentration or temperature generally decreases the time to a fixed endpoint in this setup.','For the same endpoint, 1/time is a useful relative-rate measure, not an absolute concentration rate.'],
    scienceNote:'Illustrative rule only: t = (6 / concentration) ÷ 1.45^((temperature − 20)/10). It is NOT a universal rate law. Mixing is simulated; a real reaction can release irritating SO₂.',
    quizzes:[
      {q:'What is the dependent variable directly observed in the disappearing-cross investigation?',choices:['Concentration of solution','Time until the cross disappears','Volume of hydrochloric acid'],correct:1,why:'You measure the time to reach a fixed cloudiness endpoint and may then use its reciprocal as a relative-rate indicator.'},
      {q:'If the time to the fixed endpoint changes from 60 s to 30 s, the relative reaction rate…',choices:['Doubles','Halves','Remains constant'],correct:0,why:'Because the relative rate is 1/t, halving the time doubles the relative rate.'}
    ]
  }
];
