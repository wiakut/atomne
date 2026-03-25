import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ScreenWrapper } from '../components/ScreenWrapper';
import { teamNames } from '../data/teamNames';
import { shuffle } from '../utils/shuffle';
import { DEFAULT_TIMER, DEFAULT_WORDS_PER_TEAM, MIN_TEAMS, MAX_TEAMS, ROUNDS } from '../utils/constants';

export function SetupScreen() {
  const { dispatch } = useGame();
  const [teamCount, setTeamCount] = useState(2);
  const [names, setNames] = useState<string[]>(['', '']);
  const [timer, setTimer] = useState(String(DEFAULT_TIMER));
  const [wordsPerTeam, setWordsPerTeam] = useState(String(DEFAULT_WORDS_PER_TEAM));
  const [enabledRounds, setEnabledRounds] = useState([true, true, true, true]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  function handleTeamCount(count: number) {
    const clamped = Math.max(MIN_TEAMS, Math.min(MAX_TEAMS, count));
    setTeamCount(clamped);
    setNames(prev => {
      const next = [...prev];
      while (next.length < clamped) next.push('');
      return next.slice(0, clamped);
    });
  }

  function generateNames() {
    const shuffled = shuffle(teamNames);
    setNames(shuffled.slice(0, teamCount));
  }

  function handleStart() {
    const timerNum = Number(timer);
    const wordsNum = Number(wordsPerTeam);

    if (!Number.isInteger(timerNum) || timerNum < 5) {
      setValidationError('Таймер: мінімум 5 секунд');
      return;
    }
    if (timerNum > 300) {
      setValidationError('Таймер: максимум 300 секунд');
      return;
    }
    if (!Number.isInteger(wordsNum) || wordsNum < 1) {
      setValidationError('Слів на команду: мінімум 1');
      return;
    }
    if (wordsNum > 50) {
      setValidationError('Слів на команду: максимум 50');
      return;
    }
    if (!enabledRounds.some(Boolean)) {
      setValidationError('Оберіть хоча б один раунд');
      return;
    }

    setValidationError(null);
    const teams = names.map((name, i) => ({
      id: `team-${i}`,
      name: name.trim() || `Команда ${i + 1}`,
      scores: [],
    }));
    dispatch({
      type: 'START_GAME',
      teams,
      timerDuration: timerNum,
      enabledRounds,
      wordsPerTeam: wordsNum,
    });
  }

  const atLeastOneRound = enabledRounds.some(Boolean);

  return (
    <ScreenWrapper className="justify-between">
      <div className="flex-1 flex flex-col gap-6">
        {/* Title */}
        <div className="text-center pt-4">
          <h1 className="text-4xl font-bold text-glow-cyan text-cyan">AtomAlias</h1>
          <p className="text-white/60 mt-1">Alias для своїх</p>
        </div>

        {/* Team count */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Кількість команд</label>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleTeamCount(teamCount - 1)}
              className="w-10 h-10 rounded-lg border border-cyan/30 text-cyan text-xl flex items-center justify-center"
            >
              −
            </button>
            <span className="text-2xl font-bold text-white w-8 text-center">{teamCount}</span>
            <button
              onClick={() => handleTeamCount(teamCount + 1)}
              className="w-10 h-10 rounded-lg border border-cyan/30 text-cyan text-xl flex items-center justify-center"
            >
              +
            </button>
          </div>
        </div>

        {/* Team names */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm text-white/60">Назви команд</label>
            <button onClick={generateNames} className="text-sm text-cyan underline">
              Згенерувати
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {names.map((name, i) => (
              <input
                key={i}
                value={name}
                onChange={e => {
                  const next = [...names];
                  next[i] = e.target.value;
                  setNames(next);
                }}
                placeholder={`Команда ${i + 1}`}
                className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-white placeholder:text-white/30 focus:border-cyan/50 focus:outline-none"
              />
            ))}
          </div>
        </div>

        {/* Timer */}
        <div>
          <label className="text-sm text-white/60 mb-2 block">Таймер (секунди)</label>
          <input
            type="number"
            value={timer}
            onChange={e => { setTimer(e.target.value); setValidationError(null); }}
            className="bg-bg-card border border-white/10 rounded-lg px-3 py-2 text-white w-24 focus:border-cyan/50 focus:outline-none"
          />
        </div>

        {/* Advanced settings */}
        <div>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-white/40 underline"
          >
            {showAdvanced ? 'Сховати налаштування' : 'Розширені налаштування'}
          </button>
          {showAdvanced && (
            <div className="mt-3 flex flex-col gap-3 bg-bg-card rounded-lg p-3 border border-white/5">
              <div>
                <label className="text-sm text-white/60 mb-1 block">Раунди</label>
                {ROUNDS.map((round, i) => (
                  <label key={round.id} className="flex items-center gap-2 py-1">
                    <input
                      type="checkbox"
                      checked={enabledRounds[i]}
                      onChange={() => {
                        const next = [...enabledRounds];
                        next[i] = !next[i];
                        setEnabledRounds(next);
                      }}
                      className="accent-cyan"
                    />
                    <span className="text-sm text-white/80">
                      {round.emoji} {round.name}
                    </span>
                  </label>
                ))}
              </div>
              <div>
                <label className="text-sm text-white/60 mb-1 block">
                  Слів на команду (Раунд 1)
                </label>
                <input
                  type="number"
                  value={wordsPerTeam}
                  onChange={e => { setWordsPerTeam(e.target.value); setValidationError(null); }}
                  className="bg-bg border border-white/10 rounded-lg px-3 py-2 text-white w-24 focus:border-cyan/50 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Start button */}
      <div className="pt-4 pb-2">
        {validationError && (
          <div className="text-red-400 text-sm text-center mb-2">{validationError}</div>
        )}
        <GlowButton onClick={handleStart} disabled={!atLeastOneRound} variant="filled" size="lg" className="w-full">
          Почати гру
        </GlowButton>
      </div>
    </ScreenWrapper>
  );
}
