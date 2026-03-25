export interface RoundDef {
  id: number;
  name: string;
  emoji: string;
  description: string;
  rules: string;
}

export const ROUNDS: RoundDef[] = [
  {
    id: 1,
    name: 'Дай рєспєкт',
    emoji: '🫡',
    description: 'Поясни слово будь-яким способом',
    rules: 'Словами, жестами — без обмежень. Слова вигадані вами!',
  },
  {
    id: 2,
    name: 'Запускаю атомне',
    emoji: '💣',
    description: 'Покажи слово жестами',
    rules: 'Тільки пантоміма! Жодних слів чи звуків.',
  },
  {
    id: 3,
    name: 'Проектор-Ж',
    emoji: '🎬',
    description: 'Класичний Alias — поясни словами',
    rules: 'Без однокореневих слів і прямих перекладів. Коли час спливе — слово стає глобальним!',
  },
  {
    id: 4,
    name: 'Ухилянт',
    emoji: '🇬🇧',
    description: 'Поясни англійське слово англійською',
    rules: 'Тільки англійська мова! Explain the word using only English.',
  },
];

export const DEFAULT_TIMER = 60;
export const DEFAULT_WORDS_PER_TEAM = 10;
export const MIN_TEAMS = 2;
export const MAX_TEAMS = 6;
