import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer({ value = 30, type = "INCR" }) {
  const [time, setTime] = useState(0);
  const [active, setActive] = useState(false);
  const counter = useRef(0);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (!active) {
        clearInterval(timerId);
        return;
      }
      counter.current += 10;
      if (counter.current < 1000) {
        return;
      } else {
        counter.current = 0;
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
    }, 10);
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
