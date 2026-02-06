const video = document.getElementById("video");
let streamStarted = false;

function selectType(type) {
  document.getElementById("home").style.display = "none";
  document.getElementById("scanner").style.display = "block";
  document.getElementById("scanTitle").innerText = type + " Scanner";

  startCamera();
}

function goHome() {
  document.getElementById("home").style.display = "block";
  document.getElementById("scanner").style.display = "none";
}

function startCamera() {
  if (streamStarted) return;

  navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then(stream => {
      video.srcObject = stream;
      streamStarted = true;
    })
    .catch(() => alert("Camera permission denied"));
}

function capture() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);

  document.getElementById("output").value = "Scanning...";

  Tesseract.recognize(canvas, "eng")
    .then(({ data: { text } }) => {
      document.getElementById("output").value = text;
    });
}

function shareText() {
  const text = document.getElementById("output").value;

  if (navigator.share) {
    navigator.share({ text });
  } else {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard");
  }
}
