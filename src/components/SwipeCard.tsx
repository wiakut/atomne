import { motion, useMotionValue, useTransform, type PanInfo } from 'framer-motion';

interface SwipeCardProps {
  word: string;
  onSwipeUp: () => void;
  onSwipeDown: () => void;
  isLast?: boolean;
}

const SWIPE_THRESHOLD = 100;
const VELOCITY_THRESHOLD = 500;

export function SwipeCard({ word, onSwipeUp, onSwipeDown, isLast = false }: SwipeCardProps) {
  const y = useMotionValue(0);
  const rotate = useTransform(y, [-200, 0, 200], [-8, 0, 8]);
  const bgOpacity = useTransform(y, [-200, -50, 0, 50, 200], [0.3, 0.1, 0, 0.1, 0.3]);
  const greenOpacity = useTransform(y, [-200, -50, 0], [1, 0.3, 0]);
  const redOpacity = useTransform(y, [0, 50, 200], [0, 0.3, 1]);

  function handleDragEnd(_: unknown, info: PanInfo) {
    const { offset, velocity } = info;
    if (offset.y < -SWIPE_THRESHOLD || velocity.y < -VELOCITY_THRESHOLD) {
      onSwipeUp();
    } else if (offset.y > SWIPE_THRESHOLD || velocity.y > VELOCITY_THRESHOLD) {
      onSwipeDown();
    }
  }

  return (
    <motion.div
      drag="y"
      dragConstraints={{ top: 0, bottom: 0 }}
      dragElastic={0.7}
      onDragEnd={handleDragEnd}
      style={{ y, rotate }}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.15 } }}
      className="absolute inset-4 rounded-2xl bg-bg-card border border-cyan/20 flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      whileDrag={{ scale: 1.02 }}
    >
      {/* Green overlay (swipe up = correct) */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-green-500 pointer-events-none"
        style={{ opacity: greenOpacity }}
      />
      {/* Red overlay (swipe down = skip) */}
      <motion.div
        className="absolute inset-0 rounded-2xl bg-red-500 pointer-events-none"
        style={{ opacity: redOpacity }}
      />

      {/* Word */}
      <span className="text-3xl sm:text-4xl font-bold text-white text-center px-6 z-10 select-none">
        {word}
      </span>

      {/* Hint arrows */}
      <div className="absolute top-4 left-0 right-0 text-center text-green-400/40 text-xs select-none pointer-events-none">
        ↑ Вгадано
      </div>
      <div className="absolute bottom-4 left-0 right-0 text-center text-red-400/40 text-xs select-none pointer-events-none">
        ↓ Пропустити
      </div>

      {isLast && (
        <div className="absolute top-4 right-4 bg-pink/80 text-white text-xs px-2 py-0.5 rounded-full font-bold z-20">
          ОСТАННЄ
        </div>
      )}
    </motion.div>
  );
}
