import { useState } from 'react';
import { useGame } from '../state/GameContext';
import { GlowButton } from '../components/GlowButton';
import { ScreenWrapper } from '../components/ScreenWrapper';

export function WordInputScreen() {
  const { state, dispatch } = useGame();
  const team = state.teams[state.wordInputTeamIndex];
  const [words, setWords] = useState<string[]>(Array(state.wordsPerTeam).fill(''));
  const [showEntry, setShowEntry] = useState(false);
  if (!team) return null;

  function handleSubmit() {
    const validWords = words.map(w => w.trim()).filter(Boolean);
    dispatch({ type: 'SUBMIT_WORDS', words: validWords });
    setWords(Array(state.wordsPerTeam).fill(''));
    setShowEntry(false);
  }

  if (!showEntry) {
    return (
      <ScreenWrapper className="justify-center items-center text-center gap-6">
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          className="absolute top-5 right-5 text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          Вийти
        </button>

        <div className="text-white/40 text-sm">
          Введення слів — {state.wordInputTeamIndex + 1} з {state.teams.length}
        </div>
        <h2 className="text-2xl font-bold text-pink text-glow-pink">
          Черга команди
        </h2>
        <div className="text-3xl font-bold text-white">{team.name}</div>
        <p className="text-white/50 text-sm max-w-xs">
          Передайте телефон цій команді. Інші не підглядають!
        </p>
        <GlowButton onClick={() => setShowEntry(true)} color="pink" variant="filled" className="min-w-48">
          Ввести слова
        </GlowButton>
      </ScreenWrapper>
    );
  }

  const filledCount = words.filter(w => w.trim()).length;

  return (
    <ScreenWrapper className="gap-4">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowEntry(false)}
          className="text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          ← Назад
        </button>
        <button
          onClick={() => dispatch({ type: 'NEW_GAME' })}
          className="text-white/30 hover:text-white/60 text-sm transition-colors"
        >
          Вийти
        </button>
      </div>

      <div className="text-center">
        <h2 className="text-xl font-bold text-pink">{team.name}</h2>
        <p className="text-white/50 text-sm">
          Введіть {state.wordsPerTeam} слів ({filledCount}/{state.wordsPerTeam})
        </p>
      </div>
      <div className="flex-1 flex flex-col gap-2 overflow-y-auto">
        {words.map((word, i) => (
          <input
            key={i}
            value={word}
            onChange={e => {
              const next = [...words];
              next[i] = e.target.value;
              setWords(next);
            }}
            placeholder={`Слово ${i + 1}`}
            className="bg-bg-card border border-white/10 rounded-lg px-3 py-2.5 text-white placeholder:text-white/30 focus:border-pink/50 focus:outline-none transition-colors"
          />
        ))}
      </div>
      <GlowButton
        onClick={handleSubmit}
        color="pink"
        variant="filled"
        disabled={filledCount < 1}
        className="w-full"
      >
        {state.wordInputTeamIndex + 1 >= state.teams.length ? 'Готово — грати!' : 'Передати далі'}
      </GlowButton>
    </ScreenWrapper>
  );
}
