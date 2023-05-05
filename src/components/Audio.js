import { forwardRef } from "react";

function Audio({ className, audioFile }, ref) {
  return (
    <div>
      <audio className={className} ref={ref} src={audioFile} controls></audio>
    </div>
  );
}

export default forwardRef(Audio);
