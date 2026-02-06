const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
  .then(stream => video.srcObject = stream);

function capture() {
  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
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
    alert("Sharing not supported");
  }
}
