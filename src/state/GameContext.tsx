import { createContext, useContext, useEffect, useReducer, type ReactNode } from 'react';
import { gameReducer, initialState, type GameAction, type GameState } from './gameReducer';
import { clearState, loadState, saveState } from './persistence';

interface GameContextValue {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

const GameContext = createContext<GameContextValue>(null!);

export function useGame() {
  return useContext(GameContext);
}

function getInitialState(): GameState {
  const saved = loadState();
  if (saved && saved.screen !== 'setup') {
    // Restore saved game, but redirect play → turnReady (don't resume timers)
    if (saved.screen === 'play') {
      return { ...saved, screen: 'turnReady', timerExpired: false };
    }
    return saved;
  }
  return initialState;
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, null, getInitialState);

  // Persist state on every change
  useEffect(() => {
    if (state.screen === 'setup') {
      clearState();
    } else {
      saveState(state);
    }
  }, [state]);

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      {children}
    </GameContext.Provider>
  );
}
