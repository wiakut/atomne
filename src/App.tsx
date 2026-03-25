import { AnimatePresence } from 'framer-motion';
import { useGame } from './state/GameContext';
import { SetupScreen } from './screens/SetupScreen';
import { RoundRulesScreen } from './screens/RoundRulesScreen';
import { WordInputScreen } from './screens/WordInputScreen';
import { TurnReadyScreen } from './screens/TurnReadyScreen';
import { PlayScreen } from './screens/PlayScreen';
import { TurnSummaryScreen } from './screens/TurnSummaryScreen';
import { LeaderboardScreen } from './screens/LeaderboardScreen';
import { FinalScreen } from './screens/FinalScreen';

export default function App() {
  const { state } = useGame();

  return (
    <div className="min-h-dvh bg-bg flex flex-col">
      <AnimatePresence mode="wait">
        {state.screen === 'setup' && <SetupScreen key="setup" />}
        {state.screen === 'roundRules' && <RoundRulesScreen key={`rules-${state.currentRoundIndex}`} />}
        {state.screen === 'wordInput' && (
          <WordInputScreen key={`wordinput-${state.wordInputTeamIndex}`} />
        )}
        {state.screen === 'turnReady' && (
          <TurnReadyScreen key={`ready-${state.currentRoundIndex}-${state.currentTeamIndex}`} />
        )}
        {state.screen === 'play' && (
          <PlayScreen key={`play-${state.currentRoundIndex}-${state.currentTeamIndex}`} />
        )}
        {state.screen === 'turnSummary' && (
          <TurnSummaryScreen key={`summary-${state.currentRoundIndex}-${state.currentTeamIndex}`} />
        )}
        {state.screen === 'leaderboard' && <LeaderboardScreen key={`lb-${state.currentRoundIndex}`} />}
        {state.screen === 'final' && <FinalScreen key="final" />}
      </AnimatePresence>
    </div>
  );
}
