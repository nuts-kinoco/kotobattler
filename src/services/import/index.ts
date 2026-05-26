import { storage } from '../storage';
import { KotobattlerBackupData } from '../backup';

export const importService = {
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
      if (parsed.airModes) storage.saveAirModes(parsed.airModes);
      
      if (parsed.settings) {
        if (parsed.settings.theme) storage.saveTheme(parsed.settings.theme);
        if (parsed.settings.displaySize) storage.saveDisplaySize(parsed.settings.displaySize);
        if (parsed.settings.displayCount) storage.saveDisplayCount(parsed.settings.displayCount);
        if (parsed.settings.shortcutEnabled !== undefined) storage.saveShortcutEnabled(parsed.settings.shortcutEnabled);
        if (parsed.settings.currentDeckId) storage.saveCurrentDeckId(parsed.settings.currentDeckId);
        if (parsed.settings.keepPreviousMembers !== undefined) storage.saveKeepPreviousMembers(parsed.settings.keepPreviousMembers);
        if (parsed.settings.operationMode) storage.saveOperationMode(parsed.settings.operationMode);
      }

      return true;
    } catch (e) {
      console.error('Failed to import JSON backup', e);
      return false;
    }
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
