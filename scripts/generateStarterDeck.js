const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../src/data/starter_cards.csv');
const tsOutputPath = path.join(__dirname, '../src/data/starterDeck.ts');

if (!fs.existsSync(csvPath)) {
  console.error("Error: starter_cards.csv not found at " + csvPath);
  process.exit(1);
}

// BOM（\uFEFF）を除去しつつUTF-8で読み込む
const csvContent = fs.readFileSync(csvPath, 'utf-8').replace(/^\uFEFF/, '');
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
  // textが空の行はスキップ（空行など）
  if (row.length === 0 || !row[textIdx] || !row[textIdx].trim()) continue;

  const text = row[textIdx].trim();
  const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx].trim() : '';
  const star = starIdx !== -1 && row[starIdx] ? parseInt(row[starIdx]) : 3;
  const tags = tagsIdx !== -1 && row[tagsIdx] ? row[tagsIdx].split(';').map(t => t.trim()).filter(Boolean) : [];
  const airSuitability = airIdx !== -1 && row[airIdx] && row[airIdx].trim() ? row[airIdx].trim() : '雑談';
  
  // CSVの「rule」カラムから再出現ルールを読み込む（空の場合はonce_per_personをデフォルト）
  let reappearRule = 'once_per_person';
  if (ruleIdx !== -1 && row[ruleIdx] && row[ruleIdx].trim()) {
    const r = row[ruleIdx].trim();
    if (['everytime', 'session_graveyard', 'once_per_person', 'cooldown'].includes(r)) {
      reappearRule = r;
    }
  }

  // 固有IDをairSuitabilityに基づいて割り当て
  const prefixMap = {
    'はじめまして': 'h',
    '深夜帯': 'n',
    '疲れ気味': 'x',
    '静か': 'q',
    '盛り上がり': 'k',
    '雑談': 'z',
    'メタ': 'm',
    '飲酒トゥーン': 'd',
    '連敗中': 'r',
    '無言時': 'u',
    '戦犯したとき': 'b',
  };
  const prefix = prefixMap[airSuitability] || 'z';
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

// デッキの自動生成（CSVのairSuitability値に対応）
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
    cardIds: cards.filter(c => c.airSuitability === "雑談" || c.tags.includes("雑談") || c.tags.includes("ギア")).map(c => c.id)
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
    cardIds: cards.filter(c => c.tags.includes("ネタ") || c.tags.includes("空気変え") || c.airSuitability === "盛り上がり" || c.airSuitability === "連敗中").map(c => c.id)
  },
  {
    id: "deck-meta",
    name: "🎮 メタ・リアル話",
    description: "ゲームを離れた日常やリアルな話題のカード。",
    cardIds: cards.filter(c => c.airSuitability === "メタ" || c.tags.includes("メタ")).map(c => c.id)
  },
  {
    id: "deck-drink",
    name: "🍺 飲酒トゥーン",
    description: "お酒を飲みながら盛り上がるためのカード集。",
    cardIds: cards.filter(c => c.airSuitability === "飲酒トゥーン" || c.tags.includes("飲酒")).map(c => c.id)
  },
  {
    id: "deck-silent",
    name: "🤐 無言いじり",
    description: "無言になってしまった時にそっと場を動かすカード。",
    cardIds: cards.filter(c => c.airSuitability === "無言時").map(c => c.id)
  },
  {
    id: "deck-loss",
    name: "💀 連敗・戦犯タイム",
    description: "連敗中や戦犯してしまった時の空気を変えるカード。",
    cardIds: cards.filter(c => c.airSuitability === "連敗中" || c.airSuitability === "戦犯したとき").map(c => c.id)
  }
];

// 空のcardIdsを持つデッキは除外
const filteredDecks = decks.filter(d => d.cardIds.length > 0);

// CSVから動的に空気感モード（MOOD）を抽出してSTARTER_AIR_MODESを生成
const uniqueAirs = Array.from(new Set(cards.map(c => c.airSuitability)));
const airPriority = ['はじめまして', '雑談', 'メタ', '飲酒トゥーン', '無言時', '連敗中', '戦犯したとき', '深夜帯', '疲れ気味', '静か', '盛り上がり', '普通'];
uniqueAirs.sort((a, b) => {
  let idxA = airPriority.indexOf(a);
  let idxB = airPriority.indexOf(b);
  if (idxA === -1) idxA = 999;
  if (idxB === -1) idxB = 999;
  return idxA - idxB;
});

const airModes = uniqueAirs.map((air, index) => {
  const prefixMap = {
    'はじめまして': 'intro',
    '深夜帯': 'midnight',
    '疲れ気味': 'tired',
    '静か': 'silent',
    '盛り上がり': 'hype',
    '雑談': 'chat',
    'メタ': 'meta',
    '飲酒トゥーン': 'drink',
    '連敗中': 'loss',
    '無言時': 'unspoken',
    '戦犯したとき': 'throw',
    '普通': 'normal'
  };
  const id = `air-${prefixMap[air] || `custom-${index}`}`;
  return { id, name: air };
});

const tsContent = `import { Card, Deck, AirMode } from '../types/deck';

export const STARTER_CARDS: Card[] = ${JSON.stringify(cards, null, 2)};

export const STARTER_DECKS: Deck[] = ${JSON.stringify(filteredDecks, null, 2)};

export const STARTER_AIR_MODES: AirMode[] = ${JSON.stringify(airModes, null, 2)};
`;

fs.writeFileSync(tsOutputPath, tsContent, 'utf-8');
console.log(`Successfully generated starterDeck.ts with ${cards.length} cards and ${filteredDecks.length} decks from CSV!`);
console.log('Air suitability breakdown:');
const airCounts = {};
cards.forEach(c => { airCounts[c.airSuitability] = (airCounts[c.airSuitability] || 0) + 1; });
Object.entries(airCounts).forEach(([air, count]) => console.log(`  ${air}: ${count}枚`));
