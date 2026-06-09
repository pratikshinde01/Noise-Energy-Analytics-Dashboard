// =========================
// Elements
// =========================

const noiseEl = document.getElementById("noise");
const voltageEl = document.getElementById("voltage");
const powerEl = document.getElementById("power");
const efficiencyEl = document.getElementById("efficiency");

const batteryCard =
document.getElementById("batteryCard");

const prediction =
document.getElementById("prediction");

const circleValue =
document.getElementById("circleValue");

const statusText =
document.getElementById("statusText");

const clock =
document.getElementById("clock");

const themeBtn =
document.getElementById("themeBtn");

const logoutBtn =
document.getElementById("logoutBtn");

const simulationBtn =
document.getElementById("simulationBtn");

const micBtn =
document.getElementById("micBtn");

const pdfBtn =
document.getElementById("pdfBtn");

const excelBtn =
document.getElementById("excelBtn");

const historyTable =
document.getElementById("historyTable");

// =========================
// Variables
// =========================

let battery = 0;
let totalEnergy = 0;

let mode = "simulation";

// =========================
// Chart
// =========================

const ctx =
document.getElementById("chart");

const gradient =
ctx.getContext("2d")
.createLinearGradient(0,0,0,400);

gradient.addColorStop(
0,
"rgba(0,255,255,.6)"
);

gradient.addColorStop(
1,
"rgba(0,255,255,0)"
);

const chart =
new Chart(ctx,{
type:"line",

data:{
labels:[],
datasets:[{
label:"Noise Level",

data:[],

borderColor:"cyan",

backgroundColor:gradient,

fill:true,

borderWidth:3,

tension:.4
}]
},

options:{
responsive:true,

scales:{
y:{
beginAtZero:true,
max:100
}
}
}
});

// =========================
// Local Storage Database
// =========================

let historyData =
JSON.parse(
localStorage.getItem(
"energyHistory"
)
) || [];

function saveHistory(record){

historyData.push(record);

if(historyData.length > 30){
historyData.shift();
}

localStorage.setItem(
"energyHistory",
JSON.stringify(historyData)
);

renderHistory();

}

function renderHistory(){

historyTable.innerHTML = "";

historyData
.slice()
.reverse()
.forEach(item=>{

historyTable.innerHTML += `

<tr>
<td>${item.time}</td>
<td>${item.noise}</td>
<td>${item.power}</td>
<td>${item.battery}</td>
</tr>

`;

});

}

renderHistory();

// =========================
// Dashboard Update
// =========================

function updateDashboard(noise){

const voltage =
(noise * 0.12).toFixed(2);

const power =
(voltage * 0.5).toFixed(2);

const efficiency =
(noise * 0.8).toFixed(0);

const futurePower =
(Number(power) * 1.15)
.toFixed(2);

battery += Math.random()*1.2;

if(battery > 100){
battery = 100;
}

totalEnergy +=
Number(power)/100;

// UI Update

noiseEl.textContent =
noise + " dB";

voltageEl.textContent =
voltage + " V";

powerEl.textContent =
power + " W";

efficiencyEl.textContent =
efficiency + " %";

batteryCard.textContent =
battery.toFixed(0) + "%";

circleValue.textContent =
battery.toFixed(0) + "%";

prediction.textContent =
futurePower + " W";

// Status

if(noise < 40){

statusText.innerHTML =
"🟢 LOW";

statusText.style.color =
"#22c55e";

}
else if(noise < 70){

statusText.innerHTML =
"🟡 MEDIUM";

statusText.style.color =
"#facc15";

}
else{

statusText.innerHTML =
"🔴 HIGH";

statusText.style.color =
"#ef4444";

}

// Graph

chart.data.labels.push("");

chart.data.datasets[0]
.data.push(noise);

if(
chart.data.labels.length > 25
){

chart.data.labels.shift();

chart.data.datasets[0]
.data.shift();

}

chart.update();

// Save History

saveHistory({

time:
new Date()
.toLocaleTimeString(),

noise:
noise + " dB",

power:
power + " W",

battery:
battery.toFixed(0) + "%"

});

}

// =========================
// Simulation Mode
// =========================

setInterval(()=>{

if(mode !== "simulation"){
return;
}

const noise =
Math.floor(
Math.random()*100
);

updateDashboard(noise);

},1000);

// =========================
// Microphone Mode
// =========================

simulationBtn.onclick = ()=>{

mode = "simulation";

alert(
"Simulation Mode Activated"
);

};

micBtn.onclick = async ()=>{

try{

const stream =
await navigator
.mediaDevices
.getUserMedia({
audio:true
});

const audioContext =
new AudioContext();

const analyser =
audioContext
.createAnalyser();

const microphone =
audioContext
.createMediaStreamSource(
stream
);

microphone.connect(
analyser
);

const data =
new Uint8Array(
analyser.frequencyBinCount
);

mode = "mic";

function detect(){

if(mode !== "mic"){
return;
}

analyser
.getByteFrequencyData(
data
);

let avg =
data.reduce(
(a,b)=>a+b,
0
)/data.length;

updateDashboard(
Math.floor(avg)
);

requestAnimationFrame(
detect
);

}

detect();

alert(
"Microphone Mode Activated"
);

}
catch(error){

alert(
"Microphone Permission Denied"
);

}

};

// =========================
// PDF Report
// =========================

pdfBtn.onclick = ()=>{

const { jsPDF } =
window.jspdf;

const doc =
new jsPDF();

doc.setFontSize(18);

doc.text(
"Noise Energy Report",
20,
20
);

doc.text(
"Noise : " +
noiseEl.textContent,
20,
50
);

doc.text(
"Voltage : " +
voltageEl.textContent,
20,
70
);

doc.text(
"Power : " +
powerEl.textContent,
20,
90
);

doc.text(
"Efficiency : " +
efficiencyEl.textContent,
20,
110
);

doc.text(
"Battery : " +
batteryCard.textContent,
20,
130
);

doc.save(
"NoiseEnergyReport.pdf"
);

};

// =========================
// Excel Report
// =========================

excelBtn.onclick = ()=>{

let data =
JSON.parse(
localStorage.getItem(
"energyHistory"
)
);

const sheet =
XLSX.utils
.json_to_sheet(data);

const workbook =
XLSX.utils.book_new();

XLSX.utils
.book_append_sheet(
workbook,
sheet,
"History"
);

XLSX.writeFile(
workbook,
"EnergyHistory.xlsx"
);

};

// =========================
// Theme Toggle
// =========================

themeBtn.onclick = ()=>{

document.body
.classList.toggle(
"light-mode"
);

themeBtn.innerHTML =
document.body
.classList.contains(
"light-mode"
)
?
"🌞 Mode"
:
"🌙 Mode";

};

// =========================
// Clock
// =========================

setInterval(()=>{

clock.textContent =
new Date()
.toLocaleTimeString();

},1000);

// =========================
// Logout
// =========================

logoutBtn.onclick = ()=>{

if(
confirm(
"Logout from Dashboard?"
)
){

window.location.href =
"login.html";

}

};

// =========================
// Particles
// =========================

particlesJS(
"particles-js",
{

particles:{

number:{
value:80
},

color:{
value:"#00ffff"
},

shape:{
type:"circle"
},

opacity:{
value:.5
},

size:{
value:3
},

move:{
enable:true,
speed:2
}

}

}
);