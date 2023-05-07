import { useEffect, useRef, useState } from "react";
import {
  FaRegPlayCircle,
  FaPauseCircle,
  FaMicrophoneAlt,
} from "react-icons/fa";
import { useTimer } from "../hooks/useTimer";
import { giveMinutesAndSecondsFromSeconds } from "../utils";
import useAudio from "../hooks/useAudio";
import Wave from "react-wavify";
import Audio from "./Audio";
import ProgressBar from "./ProgressBar";

export default function SoundRecorder({ timeLimit = 60 }) {
  const [showApp, setShowApp] = useState(false);
  const [recordingVoice, setRecordingVoice] = useState(false);
  const [audioTime, setAudioTime] = useState(0);
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(null);
  const [someVoiceIsRecorded, setSomeVoiceIsRecorded] = useState(false);
  const { time, stopTimer, startTimer, resetTimer } = useTimer({
    value: timeLimit,
    status: recordingVoice,
    type: "INCR",
  });
  const { startRecording, stopRecording, audio, voiceIntensity } = useAudio();
  const { minutes, seconds } = giveMinutesAndSecondsFromSeconds(time);
  const { minutes: min, seconds: sec } =
    giveMinutesAndSecondsFromSeconds(timeLimit);
  const { minutes: recordingMin, seconds: recordingSec } =
    giveMinutesAndSecondsFromSeconds(audioTime);
  useEffect(() => {
    if (time >= timeLimit) {
      setRecordingVoice(false);
      stopRecording();
      stopTimer();
    }
  }, [time, setRecordingVoice, timeLimit, stopRecording, stopTimer]);

  useEffect(() => {
    if (audioRef.current && time >= audioTime) {
      setTimeout(() => {
        setPlaying(null);
        stopTimer();
        resetTimer();
      }, 1000);
    }
  }, [time, setPlaying, stopTimer, resetTimer, audioTime]);

  const startApp = async () => {
    const permision = await startRecording();
    if (permision) {
      setShowApp(true);
      setRecordingVoice(true);
      startTimer();
    }
  };

  const playRecording = () => {
    if (playing === null) {
      resetTimer();
    }
    startTimer();
    audioRef?.current?.play();
    setPlaying(true);
  };

  const stopAudioPlay = () => {
    audioRef?.current?.pause();
    setPlaying(false);
    stopTimer();
  };

  return (
    <div className="flex flex-col border border-blue-900 mx-auto mt-20 gap-10 p-6 pb-10 bg-[#0e0931] text-white rounded-2xl max-w-[500px] ">
      {showApp ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 items-start">
              <div className="text-gray-400 cursor-pointer text-3xl">
                {recordingVoice
                  ? "Recording"
                  : playing
                  ? "Playing"
                  : "Recording paused"}
              </div>
              <div>
                <span className="text-4xl font-medium">{`${minutes.toLocaleString(
                  "en-US",
                  { minimumIntegerDigits: 2 }
                )}:${seconds.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                })} `}</span>
                <span className="text-2xl text-gray-400">{`/ ${(someVoiceIsRecorded
                  ? recordingMin
                  : min
                ).toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                })}:${(someVoiceIsRecorded ? recordingSec : sec).toLocaleString(
                  "en-US",
                  {
                    minimumIntegerDigits: 2,
                  }
                )}`}</span>
              </div>
            </div>
            <div className="flex gap-2 items-center">
              <div className="cursor-pointer">
                {recordingVoice && (
                  <FaPauseCircle
                    size={40}
                    className="stroke-[#0e0931]"
                    onClick={() => {
                      setRecordingVoice(false);
                      stopRecording();
                      stopTimer();
                      setAudioTime(time);
                      setSomeVoiceIsRecorded(true);
                    }}
                  />
                )}
              </div>
              <div
                className={`px-6 font-medium ${
                  someVoiceIsRecorded
                    ? "bg-purple-700 cursor-pointer"
                    : "bg-gray-800 cursor-not-allowed"
                } rounded-md  bg-purple-700px-4 py-2  `}
                onClick={() => {
                  if (someVoiceIsRecorded) {
                    alert("Sent audio to server");
                  }
                }}
              >
                Send
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center gap-4">
            {recordingVoice ? (
              <Wave
                fill="#f79902"
                paused={false}
                options={{
                  height: 20,
                  amplitude: voiceIntensity,
                  speed: 2,
                  points: 1,
                }}
              />
            ) : (
              <div className="flex justify-between w-full items-center">
                <div
                  className="cursor-pointer"
                  onClick={playing ? stopAudioPlay : playRecording}
                >
                  {playing ? (
                    <FaPauseCircle size={40} className="text-purple-700" />
                  ) : (
                    <FaRegPlayCircle size={40} className="text-purple-700" />
                  )}
                </div>
                {audio && (
                  <>
                    <div className="w-[80%] h-1">
                      <ProgressBar
                        className="h-1 w-full"
                        time={playing !== null ? time : 0}
                        totalTime={audioTime}
                      />
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
          {audio && (
            <>
              <Audio
                className="invisible h-0"
                audioFile={audio}
                ref={audioRef}
              />
            </>
          )}
        </>
      ) : (
        <div onClick={startApp} className="cursor-pointer mx-auto">
          <FaMicrophoneAlt size={40} />
        </div>
      )}
    </div>
  );
}
