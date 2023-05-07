import { forwardRef } from "react";

function Audio({ className, audioFile }, ref) {
  return (
    <audio className={className} ref={ref} src={audioFile} controls></audio>
  );
}

export default forwardRef(Audio);
