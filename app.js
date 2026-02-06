let video = document.getElementById("video");
let jobType = "";
let stepIndex = 0;

const stepsHWS = [
"Removed Brand","Removed Model","Removed Serial",
"Installed Brand","Installed Model","Installed Serial"
];

const stepsAC = [
"Removed Brand","Removed Model","Removed Serial",
"Outdoor1 Brand","Outdoor1 Model","Outdoor1 Serial",
"Outdoor2 Brand","Outdoor2 Model","Outdoor2 Serial",
"Indoor1 Brand","Indoor1 Model","Indoor1 Serial"
];

let results = {};

function selectType(type){
 jobType = type;
 document.getElementById("start").style.display="none";
 document.getElementById("scanner").style.display="block";
 startCamera();
 nextStep();
}

function startCamera(){
 navigator.mediaDevices.getUserMedia({
  video:{ facingMode:"environment" }
 }).then(stream=> video.srcObject=stream);
}

function nextStep(){
 const steps = jobType==="HWS"?stepsHWS:stepsAC;
 if(stepIndex>=steps.length) return;
 document.getElementById("fieldTitle").innerText=steps[stepIndex];
}

function capture(){
 const canvas=document.createElement("canvas");
 canvas.width=video.videoWidth;
 canvas.height=video.videoHeight;
 const ctx=canvas.getContext("2d");
 ctx.drawImage(video,0,0);

 Tesseract.recognize(canvas,"eng").then(({data:{text}})=>{
  const key=document.getElementById("fieldTitle").innerText;
  results[key]=text.trim();
  document.getElementById("output").value=generateText();
  stepIndex++;
  nextStep();
 });
}

function generateText(){
 let t="JOB TYPE: "+jobType+"\n\n";
 for(let k in results){
  t+=k+": "+results[k]+"\n";
 }
 return t;
}

function shareText(){
 const text=document.getElementById("output").value;
 if(navigator.share){
  navigator.share({text});
 }
}
