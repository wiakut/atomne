import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ROUNDS } from '../utils/constants';

export function RoundRulesScreen() {
  const { state, dispatch } = useGame();
  const roundId = state.activeRounds[state.currentRoundIndex];
  const round = ROUNDS[(roundId ?? 1) - 1];
  if (!round) return null;

  function handleStart() {
    if (roundId === 1 && state.enabledRounds[0]) {
      // Round 1: go through word input phase first
      dispatch({ type: 'START_WORD_INPUT' });
    } else {
      // Rounds 2-4: prepare pool and go to turnReady
      dispatch({ type: 'PREPARE_ROUND' });
    }
  }

  return (
    <ScreenWrapper className="justify-center items-center text-center gap-6">
      {/* Exit button */}
      <button
        onClick={() => dispatch({ type: 'NEW_GAME' })}
        className="absolute top-5 right-5 text-white/30 hover:text-white/60 text-sm transition-colors"
      >
        Вийти
      </button>

      <div className="text-white/40 text-sm uppercase tracking-widest">
        Раунд {state.currentRoundIndex + 1} з {state.activeRounds.length}
      </div>
      <div className="text-6xl">{round.emoji}</div>
      <h2 className="text-3xl font-bold text-cyan text-glow-cyan">{round.name}</h2>
      <p className="text-lg text-white/80 max-w-xs">{round.description}</p>
      <p className="text-sm text-white/50 max-w-xs">{round.rules}</p>
      <GlowButton onClick={handleStart} variant="filled" className="mt-4 min-w-48">
        Старт
      </GlowButton>
    </ScreenWrapper>
  );
}
