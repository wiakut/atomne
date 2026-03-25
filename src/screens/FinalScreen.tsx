import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { ProgressBar } from '../components/ProgressBar';
import { Confetti } from '../components/Confetti';
import { ROUNDS } from '../utils/constants';

export function FinalScreen() {
  const { state, dispatch } = useGame();

  if (state.teams.length === 0) return null;

  const teamScores = state.teams.map(t => ({
    ...t,
    total: t.scores.reduce((a, b) => a + b, 0),
  })).sort((a, b) => b.total - a.total);

  const maxScore = Math.max(1, teamScores[0]?.total ?? 1);
  const winner = teamScores[0];

  return (
    <ScreenWrapper className="justify-center items-center gap-5">
      <Confetti />
      <div className="text-5xl">🏆</div>
      <h2 className="text-3xl font-bold text-cyan text-glow-cyan">{winner.name}</h2>
      <p className="text-white/50">Переможець з рахунком {winner.total}!</p>

      <div className="w-full max-w-sm flex flex-col gap-3 mt-2">
        {teamScores.map((team, i) => (
          <div key={team.id} className="bg-white/[0.03] rounded-xl p-3">
            <div className="flex justify-between items-center mb-1">
              <span className={i === 0 ? 'text-cyan font-bold' : 'text-white/80'}>
                {i === 0 ? '👑 ' : ''}{team.name}
              </span>
              <span className="text-cyan font-bold text-lg">{team.total}</span>
            </div>
            <ProgressBar value={team.total} max={maxScore} color={i === 0 ? 'cyan' : 'pink'} />
            <div className="flex gap-2 mt-2 flex-wrap">
              {state.activeRounds.map((roundId, ri) => {
                const round = ROUNDS[roundId - 1];
                const score = team.scores[ri] ?? 0;
                return (
                  <span
                    key={roundId}
                    className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40"
                  >
                    {round.emoji} {score}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <GlowButton onClick={() => dispatch({ type: 'NEW_GAME' })} variant="filled" color="pink" className="mt-4 min-w-48">
        Нова гра
      </GlowButton>
    </ScreenWrapper>
  );
}
