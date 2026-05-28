const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/starter_cards.csv');
const tsOutputPath = path.join(__dirname, '../src/data/starterDeck.ts');

if (!fs.existsSync(csvPath)) {
  console.error("Error: starter_cards.csv not found at " + csvPath);
  process.exit(1);
}

const csvContent = fs.readFileSync(csvPath, 'utf-8');
// 改行コード（CRLF, LF）に対応して行分割
const lines = csvContent.split(/\r?\n/).map(line => line.trim()).filter(Boolean);

if (lines.length <= 1) {
  console.error("Error: CSV is empty!");
  process.exit(1);
}

// 簡易CSVパース関数（ダブルクォーテーションで囲まれたカンマに対応）
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

const header = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
const titleIdx = header.indexOf('title');
const textIdx = header.indexOf('text');
const starIdx = header.indexOf('star');
const tagsIdx = header.indexOf('tags');
const airIdx = header.indexOf('air');
const ruleIdx = header.indexOf('rule');

const cards = [];

for (let i = 1; i < lines.length; i++) {
  const row = parseCSVLine(lines[i]);
  if (row.length === 0 || !row[textIdx]) continue;

  const text = row[textIdx].trim();
  const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx].trim() : '';
  const star = starIdx !== -1 && row[starIdx] ? parseInt(row[starIdx]) : 3;
  const tags = tagsIdx !== -1 && row[tagsIdx] ? row[tagsIdx].split(';').map(t => t.trim()).filter(Boolean) : [];
  const airSuitability = airIdx !== -1 && row[airIdx] ? row[airIdx].trim() : '普通';
  
  // CSVの「rule」カラムから再出現ルール（人物墓地設定など）を読み込む
  let reappearRule = 'session_graveyard';
  if (ruleIdx !== -1 && row[ruleIdx]) {
    const r = row[ruleIdx].trim();
    if (['everytime', 'session_graveyard', 'once_per_person', 'cooldown'].includes(r)) {
      reappearRule = r;
    }
  }

  // 固有IDを割り当て
  const prefix = airSuitability === 'はじめまして' ? 'h' : 
                 airSuitability === '深夜帯' ? 's' : 
                 airSuitability === '疲れ気味' || airSuitability === '静か' ? 's' : 
                 airSuitability === '盛り上がり' ? 'k' : 'z';
  const id = `${prefix}-${i}`;

  cards.push({
    id,
    title: title || undefined,
    text,
    star: isNaN(star) ? 3 : star,
    tags,
    airSuitability,
    state: 'unused',
    reappearRule
  });
}

// デッキの自動生成
const decks = [
  {
    id: "deck-all",
    name: "🌟 すべてのカード",
    description: "スターターカードのすべてを含んだ総合デッキです。",
    cardIds: cards.map(c => c.id)
  },
  {
    id: "deck-intro",
    name: "🦑 はじめまして",
    description: "初対面や、VCの合流初期に距離を縮めるためのカード集。",
    cardIds: cards.filter(c => c.tags.includes("初対面") || c.airSuitability === "はじめまして").map(c => c.id)
  },
  {
    id: "deck-chat",
    name: "💬 雑談メイン",
    description: "プレイスタイルやゲームの内外のことで自然に話が弾むカード。",
    cardIds: cards.filter(c => c.tags.includes("雑談") || c.tags.includes("ギア") || c.airSuitability === "普通").map(c => c.id)
  },
  {
    id: "deck-night",
    name: "🌌 深夜のまったり",
    description: "夜更けにじっくり、お互いのことを深く知るためのカード。",
    cardIds: cards.filter(c => c.tags.includes("深夜") || c.airSuitability === "深夜帯").map(c => c.id)
  },
  {
    id: "deck-fix",
    name: "💥 沈黙打破・ネタ",
    description: "静かになってしまった時や、ちょっと笑いが欲しい時のカード。",
    cardIds: cards.filter(c => c.tags.includes("ネタ") || c.tags.includes("共感") || c.airSuitability === "盛り上がり").map(c => c.id)
  }
];

const tsContent = `import { Card, Deck } from '../types/deck';

export const STARTER_CARDS: Card[] = ${JSON.stringify(cards, null, 2)};

export const STARTER_DECKS: Deck[] = ${JSON.stringify(decks, null, 2)};
`;

fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
console.log(`Successfully generated starterDeck.ts with ${cards.length} cards from CSV!`);
