import { motion } from 'framer-motion';
import { useMemo } from 'react';

const COLORS = ['#06b6d4', '#ec4899', '#f59e0b', '#22c55e', '#8b5cf6', '#ef4444'];
const COUNT = 60;

interface Piece {
  x: number;
  delay: number;
  color: string;
  rotation: number;
  size: number;
}

export function Confetti() {
  const pieces = useMemo<Piece[]>(() =>
    Array.from({ length: COUNT }, () => ({
      x: Math.random() * 100,
      delay: Math.random() * 0.8,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 720 - 360,
      size: 6 + Math.random() * 8,
    })),
  []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {pieces.map((p, i) => (
        <motion.div
          key={i}
          initial={{ y: -20, x: `${p.x}vw`, opacity: 1, rotate: 0, scale: 1 }}
          animate={{ y: '110vh', rotate: p.rotation, opacity: 0, scale: 0.5 }}
          transition={{ duration: 2.5 + Math.random(), delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
        />
      ))}
    </div>
  );
}
