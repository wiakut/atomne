import { motion } from 'framer-motion';
import type { Team } from '../state/gameReducer';
import { GlowButton } from './GlowButton';

interface TeamPickerProps {
  teams: Team[];
  word: string;
  onSelect: (teamId: string) => void;
  onSkip: () => void;
}

export function TeamPicker({ teams, word, onSelect, onSkip }: TeamPickerProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-40 px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-bg-card border border-pink/30 rounded-2xl p-6 w-full max-w-sm flex flex-col gap-4"
      >
        <div className="text-center">
          <div className="text-xs text-pink uppercase tracking-widest mb-1">Глобальне слово</div>
          <div className="text-2xl font-bold text-white">{word}</div>
          <p className="text-white/40 text-sm mt-1">Хто відгадав?</p>
        </div>

        <div className="flex flex-col gap-2">
          {teams.map(team => (
            <GlowButton
              key={team.id}
              onClick={() => onSelect(team.id)}
              color="cyan"
              className="w-full text-base"
            >
              {team.name}
            </GlowButton>
          ))}
        </div>

        <button
          onClick={onSkip}
          className="text-white/40 text-sm underline mt-2"
        >
          Ніхто не відгадав
        </button>
      </motion.div>
    </motion.div>
  );
}
