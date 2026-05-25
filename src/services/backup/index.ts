import { Card, Deck, Person, Session } from '../../types/deck';
import { storage } from '../storage';

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
    keepPreviousMembers?: boolean;
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
        currentDeckId: storage.loadCurrentDeckId('deck-all'),
        keepPreviousMembers: storage.loadKeepPreviousMembers(true)
      }
    };

    const jsonContent = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `Kotobattler_Complete_Backup_${dateStr}.json`;

    triggerDownload(blob, filename);
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
  }
};

export function triggerDownload(blob: Blob, filename: string): void {
  if (typeof window === 'undefined') return;
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
