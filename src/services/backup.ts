import { Card, Deck, Person, Session } from '../types/deck';
import { storage } from './storage';

// 統合バックアップデータの型定義
export interface KotobattlerBackupData {
  version: number;
  exportDate: string;
  cards: Card[];
  decks: Deck[];
  persons: Person[];
  session: Session;
  settings: {
    theme: 'dark' | 'light';
    displaySize: 'small' | 'medium' | 'large';
    displayCount: number;
    shortcutEnabled: boolean;
    currentDeckId: string;
  };
}

export const backupService = {
  // --- アプリ全体の統合JSONバックアップのエクスポート ---
  exportToJSON: (): void => {
    if (typeof window === 'undefined') return;

    const backupData: KotobattlerBackupData = {
      version: 1,
      exportDate: new Date().toISOString(),
      cards: storage.loadCards([]),
      decks: storage.loadDecks([]),
      persons: storage.loadPersons([]),
      session: storage.loadSession({ isActive: false, activePersonIds: [], usedCardIds: [] }),
      settings: {
        theme: storage.loadTheme('dark'),
        displaySize: storage.loadDisplaySize('large'),
        displayCount: storage.loadDisplayCount(3),
        shortcutEnabled: storage.loadShortcutEnabled(true),
        currentDeckId: storage.loadCurrentDeckId('deck-all')
      }
    };

    const jsonContent = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `Kotobattler_Complete_Backup_${dateStr}.json`;

    triggerDownload(blob, filename);
  },

  // --- アプリ全体の統合JSONバックアップからの復元 ---
  importFromJSON: (jsonText: string): boolean => {
    try {
      const parsed = JSON.parse(jsonText) as KotobattlerBackupData;
      
      // 基本チェック
      if (!parsed || typeof parsed !== 'object' || !parsed.cards || !parsed.decks) {
        console.error('Invalid backup format');
        return false;
      }

      // バージョン判定
      if (parsed.version && parsed.version > 1) {
        console.warn('Backup version is newer than supported. Trying to import anyway.');
      }

      // 各データをstorage経由で安全に保存
      storage.saveCards(parsed.cards);
      storage.saveDecks(parsed.decks);
      if (parsed.persons) storage.savePersons(parsed.persons);
      if (parsed.session) storage.saveSession(parsed.session);
      
      if (parsed.settings) {
        if (parsed.settings.theme) storage.saveTheme(parsed.settings.theme);
        if (parsed.settings.displaySize) storage.saveDisplaySize(parsed.settings.displaySize);
        if (parsed.settings.displayCount) storage.saveDisplayCount(parsed.settings.displayCount);
        if (parsed.settings.shortcutEnabled !== undefined) storage.saveShortcutEnabled(parsed.settings.shortcutEnabled);
        if (parsed.settings.currentDeckId) storage.saveCurrentDeckId(parsed.settings.currentDeckId);
      }

      return true;
    } catch (e) {
      console.error('Failed to import JSON backup', e);
      return false;
    }
  },

  // --- CSV形式の文字列変換 (cardsのみ) ---
  exportCSV: (cards: Card[]): string => {
    const header = ['title', 'text', 'star', 'tags', 'air'];
    const rows = cards.map(c => {
      const title = c.title ? `"${c.title.replace(/"/g, '""')}"` : '';
      const text = `"${c.text.replace(/"/g, '""')}"`;
      const star = c.star;
      const tags = `"${c.tags.join(';')}"`;
      const air = c.airSuitability || '普通';
      return [title, text, star, tags, air].join(',');
    });
    return [header.join(','), ...rows].join('\n');
  },

  // --- CSV形式のダウンロード (cardsのみ) ---
  downloadCSV: (cards: Card[]): void => {
    const csvContent = backupService.exportCSV(cards);
    const bom = new Uint8Array([0xEF, 0xBB, 0xBF]); // Excel文字化け防止用BOM
    const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `Kotobattler_${dateStr}_deck.csv`;

    triggerDownload(blob, filename);
  },

  // --- CSV行パーサー（カンマ区切りのクォーテーション対応） ---
  parseCSVLine: (text: string): string[] => {
    const result: string[] = [];
    let insideQuote = false;
    let entries: string[] = [];
    let current = '';

    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        entries.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    entries.push(current);
    
    return entries.map(e => {
      let val = e.trim();
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1);
      }
      return val.replace(/""/g, '"');
    });
  }
};

function triggerDownload(blob: Blob, filename: string): void {
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
