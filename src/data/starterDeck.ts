import { Card, Deck } from '../types/deck';

export const STARTER_CARDS: Card[] = [
  // --- はじめましてデッキ (初対面・合流初期) ---
  {
    id: 'h-1',
    title: '第一印象のブキ',
    text: '最初に私のことを「このブキ使ってそう！」って思ったのって何ですか？当たってます？',
    star: 3,
    tags: ['スプラ', 'はじめまして'],
    airSuitability: '初動',
    state: 'unused',
    reappearRule: 'once_per_person'
  },
  {
    id: 'h-2',
    title: 'なんて呼べばいい？',
    text: 'お名前の呼び方、なんて呼ぶのが一番しっくりきますか？(あだ名とかも歓迎です！)',
    star: 2,
    tags: ['はじめまして', '自己紹介'],
    airSuitability: '初動',
    state: 'unused',
    reappearRule: 'everytime'
  },
  {
    id: 'h-3',
    title: 'スプラ歴はどのくらい？',
    text: 'スプラトゥーンは初代(Wii U)からやってる派ですか？それとも2や3から？',
    star: 3,
    tags: ['スプラ', 'はじめまして'],
    airSuitability: '初動',
    state: 'unused',
    reappearRule: 'once_per_person'
  },
  {
    id: 'h-4',
    title: '普段のプレイ時間帯',
    text: '普段はどのくらいの時間帯に遊んでることが多いですか？深夜勢だったりします？',
    star: 1,
    tags: ['はじめまして', '生活'],
    airSuitability: '初動',
    state: 'unused',
    reappearRule: 'once_per_person'
  },

  // --- 雑談デッキ (オールマイティ) ---
  {
    id: 'z-1',
    title: '今イチオシのブキ',
    text: '最近マイブームになってるブキや、練習中のブキって何かあります？',
    star: 3,
    tags: ['スプラ', '雑談'],
    airSuitability: '普通',
    state: 'unused',
    reappearRule: 'session_graveyard'
  },
  {
    id: 'z-2',
    title: 'ギア構成のこだわり',
    text: '今着てるギア、見た目重視ですか？それともギアパワーガチガチ派ですか？こだわり教えて！',
    star: 4,
    tags: ['スプラ', '雑談'],
    airSuitability: '普通',
    state: 'unused',
    reappearRule: 'session_graveyard'
  },
  {
    id: 'z-3',
    title: '最近美味しかったもの',
    text: '最近食べた中で「これマジで美味かったな！」ってもの、飯テロ覚悟で教えてください！',
    star: 2,
    tags: ['雑談', '日常'],
    airSuitability: '普通',
    state: 'unused',
    reappearRule: 'session_graveyard'
  },
  {
    id: 'z-4',
    title: '今のステージの感想',
    text: '今の時間帯のステージ、ぶっちゃけ得意ですか？苦手ですか？立ち回りどうしてます？',
    star: 3,
    tags: ['スプラ', '雑談'],
    airSuitability: '普通',
    state: 'unused',
    reappearRule: 'session_graveyard'
  },
  {
    id: 'z-5',
    title: 'エイムの調子どう？',
    text: 'ぶっちゃけ、今日のエイムの調子はどうですか？絶好調？それともおねむ？',
    star: 2,
    tags: ['雑談', '体調'],
    airSuitability: '普通',
    state: 'unused',
    reappearRule: 'everytime'
  },

  // --- 深夜デッキ (まったり・深い話) ---
  {
    id: 's-1',
    title: 'スプラで一番嬉しかったこと',
    text: 'これまでスプラやってきて、一番テンション上がった瞬間や、嬉しかった思い出は？',
    star: 5,
    tags: ['スプラ', 'エモい', '深夜'],
    airSuitability: '深夜',
    state: 'unused',
    reappearRule: 'once_per_person'
  },
  {
    id: 's-2',
    title: '夜食の誘惑',
    text: 'こんな時間ですけど、今一番食べたい夜食・飲みたいものって何ですか？我慢してます？',
    star: 3,
    tags: ['深夜', '日常'],
    airSuitability: '深夜',
    state: 'unused',
    reappearRule: 'everytime'
  },
  {
    id: 's-3',
    title: 'ゲーム以外の趣味',
    text: 'スプラ以外で、実は密かにハマっている趣味や、時間忘れてやっちゃうことって？',
    star: 4,
    tags: ['深夜', '日常'],
    airSuitability: '深夜',
    state: 'unused',
    reappearRule: 'once_per_person'
  },
  {
    id: 's-4',
    title: '最近聴いてる音楽',
    text: '作業中やVCしてない時、どんな音楽聴いてます？おすすめのアーティストとか！',
    star: 3,
    tags: ['深夜', '日常'],
    airSuitability: '深夜',
    state: 'unused',
    reappearRule: 'once_per_person'
  },

  // --- 空気改善デッキ (沈黙打破・ネタ系) ---
  {
    id: 'k-1',
    title: '今のデス、何が起きた？',
    text: '今のデス、何が起きたかスローモーションで解説してください！(笑)',
    star: 4,
    tags: ['ネタ', '空気改善'],
    airSuitability: '静か',
    state: 'unused',
    reappearRule: 'everytime'
  },
  {
    id: 'k-2',
    title: 'ウルトラの叫び',
    text: '次の試合でスペシャル使うとき、心の中で(あるいは声に出して)叫ぶセリフを教えて！',
    star: 5,
    tags: ['スプラ', 'ネタ', '空気改善'],
    airSuitability: '静か',
    state: 'unused',
    reappearRule: 'session_graveyard'
  },
  {
    id: 'k-3',
    title: '他己紹介タイム',
    text: '今ここにいる誰か1人を指名して、その人の「実はここがすごい！」を発表してください！',
    star: 5,
    tags: ['空気改善', '褒め合い'],
    airSuitability: '疲れ気味',
    state: 'unused',
    reappearRule: 'once_per_person'
  },
  {
    id: 'k-4',
    title: 'もしも100万円あったら',
    text: 'もし明日、スプラ公式から100万円振り込まれたら何に使いますか？(ブキのリアル模型？)',
    star: 3,
    tags: ['ネタ', '雑談'],
    airSuitability: '静か',
    state: 'unused',
    reappearRule: 'session_graveyard'
  }
];

export const STARTER_DECKS: Deck[] = [
  {
    id: 'deck-all',
    name: '🌟 すべてのカード',
    description: 'スターターカードのすべてを含んだ総合デッキです。',
    cardIds: STARTER_CARDS.map(c => c.id)
  },
  {
    id: 'deck-intro',
    name: '🦑 はじめまして',
    description: '初対面や、VCの合流初期に距離を縮めるためのカード集。',
    cardIds: STARTER_CARDS.filter(c => c.tags.includes('はじめまして')).map(c => c.id)
  },
  {
    id: 'deck-chat',
    name: '💬 雑談メイン',
    description: 'プレイスタイルやゲーム内外のことで自然に話が弾むカード。',
    cardIds: STARTER_CARDS.filter(c => c.tags.includes('雑談')).map(c => c.id)
  },
  {
    id: 'deck-night',
    name: '🌌 深夜のまったり',
    description: '夜更けにじっくり、お互いのことを深く知るためのカード。',
    cardIds: STARTER_CARDS.filter(c => c.tags.includes('深夜')).map(c => c.id)
  },
  {
    id: 'deck-fix',
    name: '💥 沈黙打破・空気改善',
    description: '静かになってしまった時や、ちょっと笑いが欲しい時のカード。',
    cardIds: STARTER_CARDS.filter(c => c.tags.includes('空気改善') || c.tags.includes('ネタ')).map(c => c.id)
  }
];
