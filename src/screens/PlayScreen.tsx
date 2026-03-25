import { useCallback, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useGame } from '../state/GameContext';
import { SwipeCard } from '../components/SwipeCard';
import { Timer } from '../components/Timer';
import { TeamPicker } from '../components/TeamPicker';
import { ROUNDS } from '../utils/constants';

export function PlayScreen() {
  const { state, dispatch } = useGame();
  const [timerRunning, setTimerRunning] = useState(true);
  const roundId = state.activeRounds[state.currentRoundIndex];
  const round = ROUNDS[(roundId ?? 1) - 1];
  const currentWord = state.wordPool[state.currentWordIndex];
  if (!state.teams[state.currentTeamIndex]) return null;
  const hasMoreWords = state.currentWordIndex < state.wordPool.length;

  const handleTimerExpire = useCallback(() => {
    setTimerRunning(false);
    dispatch({ type: 'TIMER_EXPIRED' });
  }, [dispatch]);

  function handleSwipeUp() {
    if (!hasMoreWords) return;
    dispatch({ type: 'SWIPE_CORRECT' });
  }

  function handleSwipeDown() {
    if (!hasMoreWords) return;
    dispatch({ type: 'SWIPE_SKIP' });
  }

  function handleGlobalWordSelect(teamId: string) {
    dispatch({ type: 'GLOBAL_WORD_ASSIGNED', teamId });
  }

  function handleGlobalWordSkip() {
    dispatch({ type: 'GLOBAL_WORD_SKIPPED' });
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-dvh flex flex-col bg-bg"
    >
      {/* Header */}
      <div className="relative flex items-center justify-center px-4 pt-4">
        <div className="absolute left-4 text-sm text-white/40">
          {round.emoji} {round.name}
        </div>
        <Timer
          duration={state.timerDuration}
          onExpire={handleTimerExpire}
          running={timerRunning}
        />
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          className="absolute right-4 text-white/20 hover:text-white/50 text-xs transition-colors"
        >
          Вийти
        </button>
      </div>

      {/* Team name */}
      <div className="text-center text-cyan font-bold text-lg mt-1">
        {state.teams[state.currentTeamIndex].name}
      </div>

      {/* Timer expired banner */}
      {state.timerExpired && !state.showTeamPicker && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 text-sm font-bold mt-1"
        >
          Час вийшов! Останній свайп
        </motion.div>
      )}

      {/* Card area */}
      <div className="flex-1 relative mt-2" style={{ touchAction: 'none' }}>
        <AnimatePresence mode="popLayout">
          {hasMoreWords && currentWord && (
            <SwipeCard
              key={`${state.currentWordIndex}-${currentWord}`}
              word={currentWord}
              onSwipeUp={handleSwipeUp}
              onSwipeDown={handleSwipeDown}
              isLast={state.timerExpired}
            />
          )}
        </AnimatePresence>

        {!hasMoreWords && (
          <div className="absolute inset-0 flex items-center justify-center text-white/30 text-lg">
            Слова закінчились!
          </div>
        )}
      </div>

      {/* Score counter */}
      <div className="text-center pb-4 text-white/40 text-sm">
        Вгадано: <span className="text-cyan font-bold">{state.turnResults.filter(r => r.guessed).length}</span>
      </div>

      {/* Round 3 Team Picker */}
      {state.showTeamPicker && state.globalWord && (
        <TeamPicker
          teams={state.teams}
          word={state.globalWord}
          onSelect={handleGlobalWordSelect}
          onSkip={handleGlobalWordSkip}
        />
      )}
    </motion.div>
  );
}
