export type CardState = 'unused' | 'used' | 'skipped' | 'sealed';

export type OperationMode = 'auto' | 'desktop' | 'touch';

export interface AirMode {
  id: string;
  name: string;
}

export type AirSuitability = string;

export interface Card {
  id: string;
  title?: string;
  text: string;
  star: number; // 0〜5の評価
  tags: string[];
  memo?: string;
  airSuitability?: AirSuitability;
  relatedPersonIds?: string[]; // 関連人物ID
  state: CardState;
  // 再出現ルール
  reappearRule?: 'everytime' | 'session_graveyard' | 'once_per_person' | 'cooldown';
}

export interface Person {
  id: string;
  displayName: string;
  aliases: string[]; // 表記揺れやOCR誤認対策
  normalizedName: string; // OCR・検索用の表記正規化
  memo?: string;
  usedCardIds: string[]; // この人物に対して使用済みのカードID（人物墓地）
  lastSeenAt?: string; // 直近セッション参加時刻
}

export interface Session {
  isActive: boolean;
  startTime?: string;
  activePersonIds: string[]; // 現在のVC参加メンバーID
  usedCardIds: string[]; // セッション墓地（このセッションで消費したカードID）
}

export interface Deck {
  id: string;
  name: string;
  description?: string;
  cardIds: string[];
}
