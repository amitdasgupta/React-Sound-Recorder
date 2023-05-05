import { useRef } from "react";

export default function Audio({ audioFile }) {
  const audioRef = useRef(null);
  return (
    <div>
      <audio ref={audioRef} src={audioFile} controls></audio>
      <div onClick={() => audioRef?.current?.stop()}>Stop Audio</div>
    </div>
  );
}
