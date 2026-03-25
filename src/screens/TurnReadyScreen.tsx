import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ROUNDS } from '../utils/constants';
import { unlockAudio } from '../audio/sounds';

export function TurnReadyScreen() {
  const { state, dispatch } = useGame();
  const team = state.teams[state.currentTeamIndex];
  const roundId = state.activeRounds[state.currentRoundIndex];
  const round = ROUNDS[(roundId ?? 1) - 1];
  if (!team) return null;

  function handleReady() {
    unlockAudio();
    dispatch({ type: 'START_TURN' });
  }

  return (
    <ScreenWrapper className="justify-center items-center text-center gap-6">
      <button
        onClick={() => dispatch({ type: 'NEW_GAME' })}
        className="absolute top-5 right-5 text-white/30 hover:text-white/60 text-sm transition-colors"
      >
        Вийти
      </button>

      <div className="text-white/40 text-sm uppercase tracking-widest">
        {round.emoji} {round.name}
      </div>
      <h2 className="text-2xl font-bold text-white/60">Хід команди</h2>
      <div className="text-4xl font-bold text-cyan text-glow-cyan">{team.name}</div>
      <p className="text-white/40 text-sm max-w-xs">
        Передайте телефон команді та натисніть «Готові»
      </p>
      <GlowButton onClick={handleReady} variant="filled" className="mt-4 min-w-48">
        Готові
      </GlowButton>
    </ScreenWrapper>
  );
}
