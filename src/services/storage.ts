import { Card, Deck, Person, Session } from '../types/deck';

// 保存データのバージョン定義
const CURRENT_VERSION = 1;

export interface StorageDataWrapper<T> {
  version: number;
  data: T;
}

let storageLoadErrorOccurred = false;

// 例外安全なJSONパース関数
export function safeParse<T>(jsonStr: string | null, fallback: T): T {
  if (!jsonStr) return fallback;
  try {
    const wrapper = JSON.parse(jsonStr) as StorageDataWrapper<T> | T;
    
    // バージョン管理されている形式かどうかを判定
    if (wrapper && typeof wrapper === 'object' && 'version' in wrapper && 'data' in wrapper) {
      // 将来的なマイグレーション処理を呼び出す
      const migratedData = migrateData((wrapper as StorageDataWrapper<any>).version, (wrapper as StorageDataWrapper<any>).data);
      return migratedData as T;
    }
    
    // バージョン管理以前の古いデータ形式の場合、そのままTとして扱う（下位互換性）
    return wrapper as T;
  } catch (error) {
    console.error('Failed to parse storage data, returning fallback:', error);
    storageLoadErrorOccurred = true; // 破損を検知
    return fallback;
  }
}

// 将来的なマイグレーション関数
function migrateData<T>(version: number, data: T): T {
  if (version < CURRENT_VERSION) {
    console.log(`Migrating data from version ${version} to ${CURRENT_VERSION}`);
    // ここで将来的なスキーマ変換を行う
  }
  return data;
}

// 共通ヘルパー: バージョン付きデータとしてlocalStorageに保存
function setItemWithVersion<T>(key: string, data: T): void {
  if (typeof window !== 'undefined') {
    const wrapper: StorageDataWrapper<T> = {
      version: CURRENT_VERSION,
      data
    };
    localStorage.setItem(key, JSON.stringify(wrapper));
  }
}

const KEYS = {
  CARDS: 'squid_cards',
  DECKS: 'squid_decks',
  PERSONS: 'squid_persons',
  SESSION: 'squid_session',
  CURRENT_DECK_ID: 'squid_current_deck_id',
  DISPLAY_COUNT: 'squid_display_count',
  SHORTCUT_ENABLED: 'squid_shortcut_enabled',
  THEME: 'squid_theme',
  DISPLAY_SIZE: 'squid_display_size'
} as const;

export const storage = {
  // --- カード ---
  loadCards: (fallback: Card[]): Card[] => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.CARDS);
    return safeParse<Card[]>(data, fallback);
  },
  saveCards: (cards: Card[]): void => {
    // localStorageの容量制限/運用ルール: バイナリデータの保存は禁止
    setItemWithVersion(KEYS.CARDS, cards);
  },

  // --- デッキ ---
  loadDecks: (fallback: Deck[]): Deck[] => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.DECKS);
    return safeParse<Deck[]>(data, fallback);
  },
  saveDecks: (decks: Deck[]): void => {
    setItemWithVersion(KEYS.DECKS, decks);
  },

  // --- 人物 ---
  loadPersons: (fallback: Person[]): Person[] => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.PERSONS);
    return safeParse<Person[]>(data, fallback);
  },
  savePersons: (persons: Person[]): void => {
    setItemWithVersion(KEYS.PERSONS, persons);
  },

  // --- セッション ---
  loadSession: (fallback: Session): Session => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.SESSION);
    return safeParse<Session>(data, fallback);
  },
  saveSession: (session: Session): void => {
    setItemWithVersion(KEYS.SESSION, session);
  },

  // --- 設定値の永続化（シンプルかつ安全） ---
  loadTheme: (fallback: 'dark' | 'light'): 'dark' | 'light' => {
    if (typeof window === 'undefined') return fallback;
    const theme = localStorage.getItem(KEYS.THEME);
    return (theme === 'dark' || theme === 'light') ? theme : fallback;
  },
  saveTheme: (theme: 'dark' | 'light'): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.THEME, theme);
    }
  },

  loadDisplaySize: (fallback: 'small' | 'medium' | 'large'): 'small' | 'medium' | 'large' => {
    if (typeof window === 'undefined') return fallback;
    const size = localStorage.getItem(KEYS.DISPLAY_SIZE);
    return (size === 'small' || size === 'medium' || size === 'large') ? size : fallback;
  },
  saveDisplaySize: (size: 'small' | 'medium' | 'large'): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.DISPLAY_SIZE, size);
    }
  },

  loadDisplayCount: (fallback: number): number => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.DISPLAY_COUNT);
    if (!data) return fallback;
    const num = Number(data);
    return isNaN(num) ? fallback : num;
  },
  saveDisplayCount: (count: number): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.DISPLAY_COUNT, String(count));
    }
  },

  loadShortcutEnabled: (fallback: boolean): boolean => {
    if (typeof window === 'undefined') return fallback;
    const data = localStorage.getItem(KEYS.SHORTCUT_ENABLED);
    if (data === 'true') return true;
    if (data === 'false') return false;
    return fallback;
  },
  saveShortcutEnabled: (enabled: boolean): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.SHORTCUT_ENABLED, String(enabled));
    }
  },

  loadCurrentDeckId: (fallback: string): string => {
    if (typeof window === 'undefined') return fallback;
    return localStorage.getItem(KEYS.CURRENT_DECK_ID) || fallback;
  },
  saveCurrentDeckId: (deckId: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KEYS.CURRENT_DECK_ID, deckId);
    }
  },

  // 破損検知とデータリセットのAPI
  hasLoadError: (): boolean => storageLoadErrorOccurred,
  clearLoadError: (): void => {
    storageLoadErrorOccurred = false;
  },
  clearAll: (): void => {
    if (typeof window !== 'undefined') {
      localStorage.clear();
    }
  }
};
