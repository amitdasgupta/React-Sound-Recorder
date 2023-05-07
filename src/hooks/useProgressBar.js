import { useEffect, useState } from "react";

export default function useProgressBar(timeToAnimate, onCompletion) {
  const [width, setWidth] = useState(0);
  const [active, setActive] = useState(false);
  const [initialTime, setInitialtime] = useState(null);
  useEffect(() => {
    let frameId = null;
    const animate = (time) => {
      if (!initialTime) {
        setInitialtime(time);
        frameId = requestAnimationFrame(animate);
        return;
      }
      if (!active) {
        return cancelAnimationFrame(frameId);
      }
      let runTime = time - initialTime;
      const relativeProgress = runTime / timeToAnimate;
      const widthPercent = 100 * Math.min(1, relativeProgress);
      setWidth(widthPercent);
      if (runTime < timeToAnimate) {
        frameId = requestAnimationFrame(animate);
      } else {
        onCompletion && onCompletion();
        resetProgressBar();
        setActive(false);
        setInitialtime(null);
      }
    };
    if (active) {
      frameId = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(frameId);
  }, [onCompletion, timeToAnimate, active, initialTime]);
  const stopProgressBar = () => setActive(false);
  const startProgressBar = () => setActive(true);
  const resetProgressBar = () => setWidth(0);
  return {
    startProgressBar,
    stopProgressBar,
    width,
    active,
    resetProgressBar,
  };
}
