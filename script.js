const questionBank = [
{type:'logique', q:"Suite: 3, 9, 27, ?", o:["54","72","81","90"], a:"81"},
{type:'logique', q:"Suite: 1, 4, 9, 16, ?", o:["20","24","25","30"], a:"25"},
{type:'math', q:"15% de 200 = ?", o:["20","25","30","35"], a:"30"},
{type:'math', q:"(12²) = ?", o:["124","144","154","164"], a:"144"},
{type:'verbal', q:"Synonyme de COMPLEXE", o:["Simple","Compliqué","Clair","Court"], a:"Compliqué"},
{type:'verbal', q:"Livre est à Lire ce que Fourchette est à ?", o:["Manger","Couper","Boire","Cuire"], a:"Manger"}
];

let questions=[];
let index=0;
let score=0;
let timeLeft=20;
let timer;
let stats={logique:0,math:0,verbal:0,total:{logique:0,math:0,verbal:0}};
let selected=null;

function startTest(){
  questions=generateTest();
  document.getElementById('start').classList.add('hidden');
  document.getElementById('quiz').classList.remove('hidden');
  document.getElementById('nextBtn').classList.remove('hidden');
  loadQuestion();
}

function generateTest(){
  let arr=[];
  for(let i=0;i<50;i++){
    let q=questionBank[Math.floor(Math.random()*questionBank.length)];
    arr.push(q);
    stats.total[q.type]++;
  }
  return arr;
}

function loadQuestion(){
  resetTimer();
  if(index>=questions.length) return showResult();

  let q=questions[index];
  let html=`<h2>Question ${index+1}</h2>`;
  html+=`<div class='timer'>⏱️ ${timeLeft}s</div>`;
  html+=`<p>${q.q}</p>`;

  q.o.forEach(opt=>{
    html+=`<div class='option' onclick="selectOption('${opt}')">${opt}</div>`;
  });

  html+=`<div class='progress'>${index+1}/50</div>`;
  document.getElementById('quiz').innerHTML=html;
}

function selectOption(opt){
  selected=opt;
}

function nextQuestion(){
  if(!selected) return alert("Choisis une réponse");

  let q=questions[index];
  if(selected===q.a){
    score++;
    stats[q.type]++;
  }

  selected=null;
  index++;
  loadQuestion();
}

function resetTimer(){
  clearInterval(timer);
  timeLeft=20;

  timer=setInterval(()=>{
    timeLeft--;
    let el=document.querySelector('.timer');
    if(el) el.innerText=`⏱️ ${timeLeft}s`;

    if(timeLeft<=0){
      clearInterval(timer);
      index++;
      loadQuestion();
    }
  },1000);
}

function showResult(){
  document.getElementById('quiz').classList.add('hidden');
  document.getElementById('nextBtn').classList.add('hidden');

  let iq=100+(score-25)*2;

  let logiquePct=Math.round((stats.logique/(stats.total.logique||1))*100);
  let mathPct=Math.round((stats.math/(stats.total.math||1))*100);
  let verbalPct=Math.round((stats.verbal/(stats.total.verbal||1))*100);

  let html=`<h2>Résultat</h2>`;
  html+=`<p>Score: ${score}/50</p>`;
  html+=`<p>QI estimé: ${iq}</p>`;
  html+=`<h3>Profil :</h3>`;
  html+=`<p>Logique: ${logiquePct}%</p>`;
  html+=`<p>Math: ${mathPct}%</p>`;
  html+=`<p>Verbal: ${verbalPct}%</p>`;
  html+=`<button onclick="location.reload()">Recommencer</button>`;

  document.getElementById('result').classList.remove('hidden');
  document.getElementById('result').innerHTML=html;

  localStorage.setItem('iq',iq);
}
