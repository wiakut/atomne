import { useEffect, useRef, useState } from 'react';
import { playTick, playAlarm } from '../audio/sounds';

interface TimerProps {
  duration: number;
  onExpire: () => void;
  running: boolean;
}

export function Timer({ duration, onExpire, running }: TimerProps) {
  const [secondsLeft, setSecondsLeft] = useState(duration);
  const startTimeRef = useRef<number | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (!running) return;

    startTimeRef.current = Date.now();
    expiredRef.current = false;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current!) / 1000);
      const remaining = Math.max(0, duration - elapsed);
      setSecondsLeft(remaining);

      if (remaining <= 3 && remaining > 0) {
        playTick();
      }

      if (remaining === 0 && !expiredRef.current) {
        expiredRef.current = true;
        playAlarm();
        onExpire();
        clearInterval(interval);
      }
    }, 200); // Check frequently for accuracy

    return () => clearInterval(interval);
  }, [duration, onExpire, running]);

  const isUrgent = secondsLeft <= 3 && secondsLeft > 0;
  const isExpired = secondsLeft === 0;

  return (
    <div
      className={`text-center font-mono text-2xl font-bold transition-colors ${
        isExpired
          ? 'text-red-500'
          : isUrgent
            ? 'text-red-400 animate-pulse'
            : 'text-white/70'
      }`}
    >
      {secondsLeft}с
    </div>
  );
}
