import { Card, Deck } from '../types/deck';

export const STARTER_CARDS: Card[] = [
  // ==========================================
  // 1. はじめましてデッキ (初対面・合流初期 / airSuitability: '初動')
  // ==========================================
  {
    id: "h-1",
    title: "第一印象のブキ",
    text: "第一印象で「この人、このブキ使ってそう！」って思ったのってありました？(笑)",
    star: 2,
    tags: ["初対面", "スプラ"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "h-2",
    title: "普段の呼び方",
    text: "普段のVCでは、なんて呼ばれることが多いですか？(あだ名とかも歓迎です！)",
    star: 1,
    tags: ["初対面", "VC"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "h-3",
    title: "いつからのスプラ勢？",
    text: "スプラって初代(Wii U)からやってます？それとも2や3からデビューですか？",
    star: 2,
    tags: ["スプラ", "初対面"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "h-4",
    title: "今いちばんの相棒ブキ",
    text: "今いちばん使ってて楽しい、または使用度が高い「相棒ブキ」って何ですか？",
    star: 1,
    tags: ["スプラ", "定番"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "h-5",
    title: "いつもの立ち位置",
    text: "対戦中って、ガンガン前出るタイプですか？それともカバー重視で後ろ寄りですか？",
    star: 2,
    tags: ["スプラ", "立ち回り"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "h-6",
    title: "スプラ以外のゲーム",
    text: "スプラ以外に最近ハマってるゲームとかあります？実は〇〇やってる、とか！",
    star: 2,
    tags: ["初対面", "雑談"],
    airSuitability: "初動",
    state: "unused",
    reappearRule: "once_per_person"
  },

  // ==========================================
  // 2. 雑談デッキ (オールマイティ・共感 / airSuitability: '普通')
  // ==========================================
  {
    id: "z-1",
    title: "今日の調子どう？",
    text: "ぶっちゃけ今日って調子いい日ですか？(勝ち越せてる？エイム合ってる？笑)",
    star: 1,
    tags: ["雑談", "VC"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "z-2",
    title: "お気に入りギア",
    text: "最近「見た目も性能も最高！」って気に入ってるギア構成とかあります？",
    star: 2,
    tags: ["スプラ", "ギア"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-3",
    title: "深夜の飯テロ誘惑",
    text: "この時間帯って、急にお腹空きません？いま何が一番食べたい気分ですか？",
    star: 1,
    tags: ["雑談", "深夜"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "z-4",
    title: "ステージの得意不得意",
    text: "いまのローテーションのステージ、得意な方ですか？それとも鬼門ですか？(笑)",
    star: 1,
    tags: ["スプラ", "ステージ"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-5",
    title: "エイムの浮き沈み",
    text: "エイムが吸い付く神の日と、全然当たらないダメな日の差、すごくないですか？(笑)",
    star: 2,
    tags: ["スプラ", "共感"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-6",
    title: "思い出のベストフェス",
    text: "これまで遊んできた中で「一番楽しかった・テーマが熱かった」フェスって何ですか？",
    star: 2,
    tags: ["スプラ", "フェス"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-7",
    title: "VC中のお供ドリンク",
    text: "VCしながら遊ぶときって、手元に飲み物やお菓子とか準備しておく派ですか？",
    star: 1,
    tags: ["VC", "雑談"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-8",
    title: "バンカラ派？バイト派？",
    text: "普段はバンカラマッチ(ナワバリ)派ですか？それともサーモンランばっかりやる派ですか？",
    star: 2,
    tags: ["スプラ", "定番"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "z-9",
    title: "デスした瞬間のクセ",
    text: "デスした瞬間、ついついコントローラーぎゅって握りしめたり声出たりしちゃいません？(笑)",
    star: 2,
    tags: ["スプラ", "共感"],
    airSuitability: "普通",
    state: "unused",
    reappearRule: "session_graveyard"
  },

  // ==========================================
  // 3. まったりデッキ (深夜・まったり・疲れ気味 / airSuitability: '深夜' または '疲れ気味' または '静か')
  // ==========================================
  {
    id: "s-1",
    title: "最近のプチハッピー",
    text: "最近、ちょっとテンションが上がった出来事や、嬉しかったことってありました？",
    star: 3,
    tags: ["深夜", "雑談"],
    airSuitability: "深夜",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "s-2",
    title: "エイムの寝落ち限界線",
    text: "何時くらいになると「あ、もう頭働いてないしエイム崩壊してるな…」ってなります？(笑)",
    star: 2,
    tags: ["深夜", "VC"],
    airSuitability: "深夜",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "s-3",
    title: "持ちブキ迷子の夜",
    text: "たまに「私の持ちブキ、本当にこれで合ってるのかな…？」って迷子になる夜ありません？",
    star: 2,
    tags: ["スプラ", "共感"],
    airSuitability: "静か",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "s-4",
    title: "プレイ中に流す音楽",
    text: "いつもゲームプレイ中や、まったり遊んでる時って裏でどんな音楽聴いてます？",
    star: 3,
    tags: ["深夜", "日常"],
    airSuitability: "深夜",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "s-5",
    title: "ラスト1試合の嘘",
    text: "「次でラストにします！」って言いつつ、ついつい悔しくて伸びちゃうことありません？(笑)",
    star: 2,
    tags: ["深夜", "共感"],
    airSuitability: "疲れ気味",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "s-6",
    title: "まったりお風呂事情",
    text: "ゲームやりすぎて肩やバキバキな時、お風呂はシャワー派ですか？しっかり湯船浸かる派？",
    star: 2,
    tags: ["日常", "健康"],
    airSuitability: "疲れ気味",
    state: "unused",
    reappearRule: "once_per_person"
  },

  // ==========================================
  // 4. ネタデッキ (空気改善・盛り上がり / airSuitability: '盛り上がり')
  // ==========================================
  {
    id: "k-1",
    title: "いまのデスをスロー解説",
    text: "さっきの華麗なデスシーン！一体何が起きていたのかスローで教えてもらえます？(笑)",
    star: 3,
    tags: ["ネタ", "VC"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "everytime"
  },
  {
    id: "k-2",
    title: "ウルショの雄叫び",
    text: "ウルトラショット撃つとき、実は心の中(またはミュート中)で何か叫んでたりします？",
    star: 5,
    tags: ["ネタ", "スプラ"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "k-3",
    title: "隣の人を他己紹介！",
    text: "今ここにいるメンバーの誰か1人を指名して、その人を一言で紹介するとしたらどんな感じ？",
    star: 5,
    tags: ["VC", "ネタ"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "once_per_person"
  },
  {
    id: "k-4",
    title: "夢のコラボ企画",
    text: "もしスプラが他のアニメやゲームとコラボするとしたら、何とコラボしてほしいですか？",
    star: 4,
    tags: ["スプラ", "ネタ"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "k-5",
    title: "伝説の編成事故",
    text: "これまでマッチングして「これはマジで終わった…！」って思ったヤバい編成事故って？",
    star: 3,
    tags: ["スプラ", "共感"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "k-6",
    title: "もしオカシラシャケが…",
    text: "もし現実の街にオカシラシャケが現れたら、どのブキ担いで戦いに行きます？(笑)",
    star: 4,
    tags: ["ネタ", "スプラ"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "k-7",
    title: "オリジナルステージ設計",
    text: "自分がオリジナルの対戦ステージを作れるとしたら、どんな意地悪なギミック置きたいですか？",
    star: 4,
    tags: ["ネタ", "スプラ"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "session_graveyard"
  },
  {
    id: "k-8",
    title: "もしイカになれたら",
    text: "もし本当にイカ(タコ)になってインクの中を泳げるようになったら、最初どこ泳ぎたいですか？",
    star: 5,
    tags: ["ネタ", "ロマン"],
    airSuitability: "盛り上がり",
    state: "unused",
    reappearRule: "once_per_person"
  }
];

export const STARTER_DECKS: Deck[] = [
  {
    id: "deck-all",
    name: "🌟 すべてのカード",
    description: "スターターカードのすべてを含んだ総合デッキです。",
    cardIds: STARTER_CARDS.map(c => c.id)
  },
  {
    id: "deck-intro",
    name: "🦑 はじめまして",
    description: "初対面や、VCの合流初期に距離を縮めるためのカード集。",
    cardIds: STARTER_CARDS.filter(c => c.tags.includes("初対面")).map(c => c.id)
  },
  {
    id: "deck-chat",
    name: "💬 雑談メイン",
    description: "プレイスタイルやゲームの内外のことで自然に話が弾むカード。",
    cardIds: STARTER_CARDS.filter(c => c.tags.includes("雑談") || c.tags.includes("ギア")).map(c => c.id)
  },
  {
    id: "deck-night",
    name: "🌌 深夜のまったり",
    description: "夜更けにじっくり、お互いのことを深く知るためのカード。",
    cardIds: STARTER_CARDS.filter(c => c.tags.includes("深夜")).map(c => c.id)
  },
  {
    id: "deck-fix",
    name: "💥 沈黙打破・ネタ",
    description: "静かになってしまった時や、ちょっと笑いが欲しい時のカード。",
    cardIds: STARTER_CARDS.filter(c => c.tags.includes("ネタ") || c.tags.includes("共感")).map(c => c.id)
  }
];
