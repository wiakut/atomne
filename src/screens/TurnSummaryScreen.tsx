import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ROUNDS } from '../utils/constants';
import { motion } from 'framer-motion';

export function TurnSummaryScreen() {
  const { state, dispatch } = useGame();
  const team = state.teams[state.currentTeamIndex];
  if (!team) return null;
  const stolen = state.turnResults.filter(r => !!r.globalTeamName).length;
  const guessed = state.turnResults.filter(r => r.guessed && !r.globalTeamName).length;
  const skipped = state.turnResults.filter(r => !r.guessed && !r.globalTeamName).length;
  const roundId = state.activeRounds[state.currentRoundIndex];
  const round = ROUNDS[(roundId ?? 1) - 1];

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -40 }}
      transition={{ duration: 0.25 }}
      className="relative h-dvh flex flex-col px-4 py-6"
    >
      <button
        onClick={() => dispatch({ type: 'NEW_GAME' })}
        className="absolute top-5 right-5 text-white/30 hover:text-white/60 text-sm transition-colors z-10"
      >
        Вийти
      </button>

      <div className="flex flex-col items-center gap-2 pt-4 shrink-0">
        <div className="text-white/40 text-xs uppercase tracking-widest">
          {round.emoji} {round.name}
        </div>
        <h2 className="text-xl font-bold text-white/60">{team.name}</h2>
        <div className="text-5xl font-bold text-cyan text-glow-cyan">{guessed}</div>
        <div className="flex gap-4 text-sm">
          <span className="text-green-400">+{guessed} вгадано</span>
          {stolen > 0 && <span className="text-yellow-400">{stolen} вкрадено</span>}
          <span className="text-white/30">{skipped} пропущено</span>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto my-3 w-full max-w-xs mx-auto">
        <div className="flex flex-col gap-1">
          {state.turnResults.map((r, i) => {
            const isGlobal = !!r.globalTeamName;
            const colorClass = isGlobal
              ? 'text-yellow-400 bg-yellow-400/5'
              : r.guessed
                ? 'text-green-400 bg-green-400/5'
                : 'text-white/30 bg-white/[0.02]';
            return (
              <div
                key={i}
                className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-sm ${colorClass}`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="truncate">{r.word}</span>
                  {r.globalTeamName && (
                    <span className="text-xs text-yellow-400 bg-yellow-400/10 px-1.5 py-0.5 rounded shrink-0">
                      {r.globalTeamName}
                    </span>
                  )}
                </div>
                <span className="shrink-0 ml-2">{isGlobal ? r.globalTeamName : r.guessed ? '+1' : '—'}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="shrink-0 flex justify-center">
        <GlowButton onClick={() => dispatch({ type: 'NEXT_TEAM' })} variant="filled" className="w-full max-w-xs">
          Далi
        </GlowButton>
      </div>
    </motion.div>
  );
}
