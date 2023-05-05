import { useCallback, useEffect, useState } from "react";
const mimeType = "audio/webm";
export default function useAudio() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordingStatus, setRecordingStatus] = useState("inactive");
  const [stream, setStream] = useState(null);
  const [audioChunks, setAudioChunks] = useState([]);
  const [audio, setAudio] = useState(null);
  const [voiceIntensity, setVoiceIntensity] = useState(0);

  useEffect(() => {
    const callback = (event) => {
      if (typeof event.data === "undefined") return;
      if (event.data.size === 0) return;
      audioChunks.push(event.data);
      setAudioChunks([...audioChunks]);
    };
    if (mediaRecorder) {
      mediaRecorder?.start();
      mediaRecorder?.addEventListener("dataavailable", callback);
      return () => {
        mediaRecorder?.removeEventListener("dataavailable", callback);
      };
    }
  }, [mediaRecorder, audioChunks]);

  useEffect(() => {
    if (stream && mediaRecorder) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const microphone = audioContext.createMediaStreamSource(stream);
      const scriptProcessor = audioContext.createScriptProcessor(2048, 1, 1);
      analyser.smoothingTimeConstant = 0.8;
      analyser.fftSize = 1024;
      microphone.connect(analyser);
      analyser.connect(scriptProcessor);
      scriptProcessor.connect(audioContext.destination);
      const callback = () => {
        const array = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteFrequencyData(array);
        const arraySum = array.reduce((a, value) => a + value, 0);
        const average = arraySum / array.length;
        setVoiceIntensity(average);
      };
      scriptProcessor?.addEventListener("audioprocess", callback);
      return () => {
        scriptProcessor?.removeEventListener("audioprocess", callback);
      };
    }
  }, [mediaRecorder, stream]);

  const startRecording = useCallback(async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        setRecordingStatus("recording");
        const media = new MediaRecorder(streamData, { type: mimeType });
        setMediaRecorder(media);
        setStream(streamData);
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  }, []);

  const stopRecording = useCallback(() => {
    setRecordingStatus("inactive");
    mediaRecorder?.stop();
    stream.getTracks().forEach((track) => {
      track.stop();
      track.enabled = false;
    });
  }, [stream, mediaRecorder]);

  useEffect(() => {
    const callback = (audioChunks) => () => {
      //creates a blob file from the audiochunks data
      const audioBlob = new Blob(audioChunks, { type: mimeType });
      //creates a playable URL from the blob file.
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(audioUrl);
      setAudioChunks([]);
      setMediaRecorder(null);
    };
    mediaRecorder?.addEventListener("stop", callback(audioChunks));
    return () => {
      mediaRecorder?.removeEventListener("stop", callback(audioChunks));
    };
  }, [mediaRecorder, recordingStatus, audioChunks]);

  return {
    stream,
    startRecording,
    stopRecording,
    audio,
    voiceIntensity,
    recordingStatus,
  };
}
