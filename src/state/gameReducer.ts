import { shuffle } from '../utils/shuffle';
import { wordsUkrPantomime } from '../data/wordsUkrPantomime';
import { wordsUkrAlias } from '../data/wordsUkrAlias';
import { wordsEngElementary } from '../data/wordsEngElementary';

// ── Types ──────────────────────────────────────────────

export type Screen =
  | 'setup'
  | 'roundRules'
  | 'wordInput'
  | 'turnReady'
  | 'play'
  | 'turnSummary'
  | 'leaderboard'
  | 'final';

export interface Team {
  id: string;
  name: string;
  scores: number[]; // score per round
}

export interface TurnResult {
  word: string;
  guessed: boolean;
  globalTeamName?: string; // which team guessed the global word (Round 3)
}

export interface GameState {
  screen: Screen;
  // Setup
  teams: Team[];
  timerDuration: number;
  enabledRounds: boolean[];
  wordsPerTeam: number;
  // Game progress
  currentRoundIndex: number;
  currentTeamIndex: number;
  // Active rounds (filtered by enabled)
  activeRounds: number[]; // round ids (1-4) that are enabled
  // Round 1 custom words
  customWords: string[];
  customWordsPerTeam: string[][]; // words indexed by team
  wordInputTeamIndex: number;
  // Current turn
  wordPool: string[];
  currentWordIndex: number;
  turnResults: TurnResult[];
  timerExpired: boolean;
  // Round 3 global word
  globalWord: string | null;
  showTeamPicker: boolean;
}

export const initialState: GameState = {
  screen: 'setup',
  teams: [],
  timerDuration: 60,
  enabledRounds: [true, true, true, true],
  wordsPerTeam: 10,
  currentRoundIndex: 0,
  currentTeamIndex: 0,
  activeRounds: [1, 2, 3, 4],
  customWords: [],
  customWordsPerTeam: [],
  wordInputTeamIndex: 0,
  wordPool: [],
  currentWordIndex: 0,
  turnResults: [],
  timerExpired: false,
  globalWord: null,
  showTeamPicker: false,
};

// ── Helpers ────────────────────────────────────────────

/** Round 1: pick `count` random words from all teams except `excludeTeamIndex` */
function getRound1PoolForTeam(
  customWordsPerTeam: string[][],
  excludeTeamIndex: number,
  count: number,
): string[] {
  const otherWords = customWordsPerTeam
    .filter((_, i) => i !== excludeTeamIndex)
    .flat();
  const shuffled = shuffle(otherWords);
  return shuffled.slice(0, count);
}

function getWordPoolForRound(roundId: number, customWords: string[]): string[] {
  switch (roundId) {
    case 1: return shuffle(customWords);
    case 2: return shuffle(wordsUkrPantomime);
    case 3: return shuffle(wordsUkrAlias);
    case 4: return shuffle(wordsEngElementary);
    default: return [];
  }
}

// ── Actions ────────────────────────────────────────────

export type GameAction =
  | { type: 'START_GAME'; teams: Team[]; timerDuration: number; enabledRounds: boolean[]; wordsPerTeam: number }
  | { type: 'START_WORD_INPUT' }
  | { type: 'SUBMIT_WORDS'; words: string[] }
  | { type: 'PREPARE_ROUND' }
  | { type: 'START_TURN' }
  | { type: 'SWIPE_CORRECT' }
  | { type: 'SWIPE_SKIP' }
  | { type: 'TIMER_EXPIRED' }
  | { type: 'GLOBAL_WORD_ASSIGNED'; teamId: string }
  | { type: 'GLOBAL_WORD_SKIPPED' }
  | { type: 'END_TURN' }
  | { type: 'NEXT_TEAM' }
  | { type: 'NEXT_ROUND' }
  | { type: 'NEW_GAME' }
  | { type: 'RESTORE_STATE'; state: GameState };

// ── Reducer ────────────────────────────────────────────

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME': {
      const activeRounds = [1, 2, 3, 4].filter((_, i) => action.enabledRounds[i]);
      return {
        ...initialState,
        screen: 'roundRules',
        teams: action.teams.map(t => ({ ...t, scores: activeRounds.map(() => 0) })),
        timerDuration: action.timerDuration,
        enabledRounds: action.enabledRounds,
        wordsPerTeam: action.wordsPerTeam,
        activeRounds,
        currentRoundIndex: 0,
        currentTeamIndex: 0,
      };
    }

    case 'START_WORD_INPUT':
      return {
        ...state,
        screen: 'wordInput',
        wordInputTeamIndex: 0,
        customWords: [],
      };

    case 'SUBMIT_WORDS': {
      const newCustomWords = [...state.customWords, ...action.words];
      const newPerTeam = [...state.customWordsPerTeam];
      newPerTeam[state.wordInputTeamIndex] = action.words;
      const nextTeamIdx = state.wordInputTeamIndex + 1;
      if (nextTeamIdx >= state.teams.length) {
        // All teams submitted — build pool for first team (excluding their own words)
        const pool = getRound1PoolForTeam(newPerTeam, 0, state.wordsPerTeam);
        return {
          ...state,
          customWords: newCustomWords,
          customWordsPerTeam: newPerTeam,
          wordInputTeamIndex: nextTeamIdx,
          wordPool: pool,
          currentWordIndex: 0,
          screen: 'turnReady',
          currentTeamIndex: 0,
        };
      }
      return {
        ...state,
        customWords: newCustomWords,
        customWordsPerTeam: newPerTeam,
        wordInputTeamIndex: nextTeamIdx,
        screen: 'wordInput',
      };
    }

    case 'PREPARE_ROUND': {
      const roundId = state.activeRounds[state.currentRoundIndex];
      const pool = getWordPoolForRound(roundId, state.customWords);
      return {
        ...state,
        wordPool: pool,
        currentWordIndex: 0,
        screen: 'turnReady',
        currentTeamIndex: 0,
      };
    }

    case 'START_TURN':
      return {
        ...state,
        screen: 'play',
        turnResults: [],
        timerExpired: false,
        globalWord: null,
        showTeamPicker: false,
      };

    case 'SWIPE_CORRECT': {
      const word = state.wordPool[state.currentWordIndex];
      const nextIndex = state.currentWordIndex + 1;
      const wordsExhausted = nextIndex >= state.wordPool.length;
      const currentRound = state.activeRounds[state.currentRoundIndex];
      const isGlobalWord = (currentRound === 2 || currentRound === 3 || currentRound === 4) && state.timerExpired;

      // For global words, don't award the point yet — GLOBAL_WORD_ASSIGNED will handle it
      const newResults = [...state.turnResults, { word, guessed: !isGlobalWord }];
      const teams = isGlobalWord
        ? state.teams
        : state.teams.map((t, i) => {
            if (i !== state.currentTeamIndex) return t;
            const scores = [...t.scores];
            scores[state.currentRoundIndex] = (scores[state.currentRoundIndex] || 0) + 1;
            return { ...t, scores };
          });

      if (state.timerExpired || wordsExhausted) {
        if (isGlobalWord) {
          return {
            ...state,
            teams,
            turnResults: newResults,
            globalWord: word,
            showTeamPicker: true,
          };
        }
        return {
          ...state,
          teams,
          turnResults: newResults,
          currentWordIndex: nextIndex,
          screen: 'turnSummary',
        };
      }

      return {
        ...state,
        teams,
        turnResults: newResults,
        currentWordIndex: nextIndex,
      };
    }

    case 'SWIPE_SKIP': {
      const word = state.wordPool[state.currentWordIndex];
      const newResults = [...state.turnResults, { word, guessed: false }];
      const nextIndex = state.currentWordIndex + 1;
      const wordsExhausted = nextIndex >= state.wordPool.length;

      if (state.timerExpired || wordsExhausted) {
        return {
          ...state,
          turnResults: newResults,
          currentWordIndex: nextIndex,
          screen: 'turnSummary',
        };
      }

      return {
        ...state,
        turnResults: newResults,
        currentWordIndex: nextIndex,
      };
    }

    case 'TIMER_EXPIRED':
      return { ...state, timerExpired: true };

    case 'GLOBAL_WORD_ASSIGNED': {
      const assignedTeam = state.teams.find(t => t.id === action.teamId);
      const teams = state.teams.map(t => {
        if (t.id !== action.teamId) return t;
        const scores = [...t.scores];
        scores[state.currentRoundIndex] = (scores[state.currentRoundIndex] || 0) + 1;
        return { ...t, scores };
      });
      // Mark the global word in turn results as guessed by the assigned team
      const updatedResults = [...state.turnResults];
      const lastIdx = updatedResults.length - 1;
      if (lastIdx >= 0 && updatedResults[lastIdx].word === state.globalWord) {
        updatedResults[lastIdx] = {
          ...updatedResults[lastIdx],
          guessed: true,
          globalTeamName: assignedTeam?.name,
        };
      }
      return {
        ...state,
        teams,
        turnResults: updatedResults,
        showTeamPicker: false,
        globalWord: null,
        currentWordIndex: state.currentWordIndex + 1,
        screen: 'turnSummary',
      };
    }

    case 'GLOBAL_WORD_SKIPPED':
      return {
        ...state,
        showTeamPicker: false,
        globalWord: null,
        currentWordIndex: state.currentWordIndex + 1,
        screen: 'turnSummary',
      };

    case 'END_TURN':
      return { ...state, screen: 'turnSummary' };

    case 'NEXT_TEAM': {
      const nextTeam = state.currentTeamIndex + 1;
      if (nextTeam >= state.teams.length) {
        return { ...state, screen: 'leaderboard' };
      }
      // Round 1: rebuild word pool excluding the next team's own words
      const currentRoundId = state.activeRounds[state.currentRoundIndex];
      if (currentRoundId === 1) {
        const pool = getRound1PoolForTeam(state.customWordsPerTeam, nextTeam, state.wordsPerTeam);
        return {
          ...state,
          currentTeamIndex: nextTeam,
          wordPool: pool,
          currentWordIndex: 0,
          screen: 'turnReady',
        };
      }
      return {
        ...state,
        currentTeamIndex: nextTeam,
        screen: 'turnReady',
      };
    }

    case 'NEXT_ROUND': {
      const nextRound = state.currentRoundIndex + 1;
      if (nextRound >= state.activeRounds.length) {
        return { ...state, screen: 'final' };
      }
      return {
        ...state,
        currentRoundIndex: nextRound,
        currentTeamIndex: 0,
        screen: 'roundRules',
      };
    }

    case 'NEW_GAME':
      return { ...initialState };

    case 'RESTORE_STATE':
      if (action.state.screen === 'play') {
        return { ...action.state, screen: 'turnReady', timerExpired: false };
      }
      return action.state;

    default:
      return state;
  }
}
