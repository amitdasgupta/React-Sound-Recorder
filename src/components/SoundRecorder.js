import { useEffect, useState } from "react";
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

export default function SoundRecorder({ timeLimit = 60 }) {
  const [showApp, setShowApp] = useState(false);
  const [recordingVoice, setRecordingVoice] = useState(false);
  const someVoiceIsRecorded = false;
  const { time, stopTimer, restartTimer } = useTimer({
    value: timeLimit,
    status: recordingVoice,
    type: "INCR",
  });
  const { startRecording, stopRecording, audio, voiceIntensity } = useAudio();
  const { minutes, seconds } = giveMinutesAndSecondsFromSeconds(time);
  const { minutes: min, seconds: sec } =
    giveMinutesAndSecondsFromSeconds(timeLimit);
  useEffect(() => {
    if (time >= timeLimit) {
      setRecordingVoice(false);
      stopRecording();
    }
  }, [time, setRecordingVoice, timeLimit, stopRecording]);

  const startApp = () => {
    setShowApp(true);
    startRecording();
    setRecordingVoice(true);
    restartTimer();
  };
  return (
    <div className="flex flex-col border border-blue-900 mx-auto mt-20 gap-10 p-6 pb-10 bg-[#0e0931] text-white rounded-2xl max-w-[500px] ">
      {showApp ? (
        <>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2 items-start">
              <div className="text-gray-400 cursor-pointer text-3xl">
                {recordingVoice ? "Recording" : "Recording paused"}
              </div>
              <div>
                <span className="text-4xl font-medium">{`${minutes.toLocaleString(
                  "en-US",
                  { minimumIntegerDigits: 2 }
                )}:${seconds.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                })} `}</span>
                <span className="text-2xl text-gray-400">{`/ ${min.toLocaleString(
                  "en-US",
                  { minimumIntegerDigits: 2 }
                )}:${sec.toLocaleString("en-US", {
                  minimumIntegerDigits: 2,
                })}`}</span>
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
              <div className="flex justify-between w-full">
                <FaRegPlayCircle size={40} className="text-purple-700" />
                {audio && <Audio audioFile={audio} />}
              </div>
            )}
          </div>
        </>
      ) : (
        <div onClick={startApp} className="cursor-pointer mx-auto">
          <FaMicrophoneAlt size={40} />
        </div>
      )}
    </div>
  );
}
