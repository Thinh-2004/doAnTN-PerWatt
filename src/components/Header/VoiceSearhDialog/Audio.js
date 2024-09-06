import React, { useEffect, useRef, useState } from "react";

const Audio = ({ checkRecording }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const canvasRef = useRef(null);
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const audioStreamRef = useRef(null);
  const imageRef = useRef(null);

  const stopRecording = () => {
    if (audioStreamRef.current) {
      audioStreamRef.current.getTracks().forEach((track) => track.stop());
      audioStreamRef.current = null;
    }
  
    if (audioCtxRef.current && audioCtxRef.current.state !== "closed") {
      audioCtxRef.current.close().then(() => {
        audioCtxRef.current = null;
      });
    }
  };

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const canvasCtx = canvasElement.getContext("2d");
  
    const handleSuccess = (stream) => {
      audioStreamRef.current = stream;
  
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = audioCtx;
  
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
  
      source.connect(analyser);
  
      const draw = () => {
        if (!checkRecording) {
          canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
          return; // Ngừng vẽ khi không còn ghi âm
        }
  
        requestAnimationFrame(draw);
  
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
  
        analyser.getByteFrequencyData(dataArray);
  
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  
        const cx = canvasElement.width / 2;
        const cy = canvasElement.height / 2;
        const maxRadius = Math.min(canvasElement.width, canvasElement.height) / 2;
        const imgSize = maxRadius * 0.6;
        const innerRadius = imgSize / 2;
  
        if (checkRecording && imageRef.current) {
          const img = imageRef.current;
          canvasCtx.save();
          canvasCtx.beginPath();
          canvasCtx.arc(cx, cy, innerRadius, 0, 2 * Math.PI, false);
          canvasCtx.clip();
          canvasCtx.drawImage(img, cx - innerRadius, cy - innerRadius, imgSize, imgSize);
          canvasCtx.restore();
        }
  
        const outerRadius = maxRadius;
  
        canvasCtx.save();
        canvasCtx.globalCompositeOperation = "source-over";
  
        for (let i = 0; i < bufferLength; i++) {
          const radius = (dataArray[i] / 255) * (outerRadius - innerRadius) + innerRadius;
          const angle = (i / bufferLength) * 2 * Math.PI;
          const x = cx + radius * Math.cos(angle);
          const y = cy + radius * Math.sin(angle);
  
          const waveRadius = 2;
          canvasCtx.beginPath();
          canvasCtx.arc(x, y, waveRadius, 0, 2 * Math.PI, false);
          canvasCtx.fillStyle = "rgba(255, 0, 0, 1)";
          canvasCtx.fill();
        }
  
        canvasCtx.restore();
      };
  
      draw();
    };
  
    const handleError = (error) => {
      console.error("Error accessing media devices.", error);
    };
  
    if (checkRecording && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then(handleSuccess)
        .catch(handleError);
    }
  
    return () => {
      stopRecording();
    };
  }, [checkRecording]);

  useEffect(() => {
    const img = new Image();
    img.src = "/images/micro.png";
    img.onload = () => {
      setImageSrc(img.src);
      imageRef.current = img;
    };
  }, []);

  return (
    <section>
      <canvas ref={canvasRef} width="300" height="300" />
    </section>
  );
};

export default Audio;
