import { useCallback, useEffect, useState } from "react";

export function useTimer({ value = 30, type = "INCR" }) {
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  useEffect(() => {
    const timerId = setInterval(() => {
      if (!active) {
        clearInterval(timerId);
        return;
      }
      if (type === "INCR") {
        if (time >= value) {
          clearInterval(timerId);
          return;
        }
        setTime((time) => time + 1);
      } else {
        if (time <= 0) {
          clearInterval(timerId);
          return;
        }
        setTime((time) => time - 1);
      }
    }, 1000);
    return () => {
      clearInterval(timerId);
    };
  }, [value, type, time, active]);
  const stopTimer = useCallback(() => setActive(false), []);
  const startTimer = useCallback(() => setActive(true), []);
  const resetTimer = useCallback(() => setTime(0), []);
  return {
    time: time,
    stopTimer,
    startTimer,
    resetTimer,
  };
}
