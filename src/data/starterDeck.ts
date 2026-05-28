import { Card, Deck } from '../types/deck';

export const STARTER_CARDS: Card[] = [
  {
    "id": "h-1",
    "title": "第一印象のブキ",
    "text": "第一印象で「この人、このブキ使ってそう！」って思ったのってありました？(笑)",
    "star": 2,
    "tags": [
      "初対面",
      "スプラ"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-2",
    "title": "普段の呼び方",
    "text": "普段のVCでは、なんて呼ばれることが多いですか？(あだ名とかも歓迎です！)",
    "star": 1,
    "tags": [
      "初対面",
      "VC"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-3",
    "title": "いつからのスプラ勢？",
    "text": "スプラって初代(Wii U)からやってます？それとも2や3からデビューですか？",
    "star": 2,
    "tags": [
      "スプラ",
      "初対面"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-4",
    "title": "今いちばんの相棒ブキ",
    "text": "今いちばん使ってて楽しい、または使用度が高い「相棒ブキ」って何ですか？",
    "star": 1,
    "tags": [
      "スプラ",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "h-5",
    "title": "いつもの立ち位置",
    "text": "対戦中って、ガンガン前出るタイプですか？それともカバー重視で後ろ寄りですか？",
    "star": 2,
    "tags": [
      "スプラ",
      "立ち回り"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "h-6",
    "title": "スプラ以外のゲーム",
    "text": "スプラ以外に最近ハマってるゲームとかあります？実は〇〇やってる、とか！",
    "star": 2,
    "tags": [
      "初対面",
      "雑談"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-7",
    "title": "今日の調子どう？",
    "text": "ぶっちゃけ今日って調子いい日ですか？(勝ち越せてる？エイム合ってる？笑)",
    "star": 1,
    "tags": [
      "雑談",
      "VC"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-8",
    "title": "お気に入りギア",
    "text": "最近「見た目も性能も最高！」って気に入ってるギア構成とかあります？",
    "star": 2,
    "tags": [
      "スプラ",
      "ギア"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-9",
    "title": "深夜の飯テロ誘惑",
    "text": "この時間帯って、急にお腹空きません？いま何が一番食べたい気分ですか？",
    "star": 1,
    "tags": [
      "雑談",
      "深夜"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-10",
    "title": "ステージの得意不得意",
    "text": "いまのローテーションのステージ、得意な方ですか？それとも鬼門ですか？(笑)",
    "star": 1,
    "tags": [
      "スプラ",
      "ステージ"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-11",
    "title": "エイムの浮き沈み",
    "text": "エイムが吸い付く神の日と、全然当たらないダメな日の差、すごくないですか？(笑)",
    "star": 2,
    "tags": [
      "スプラ",
      "共感"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-12",
    "title": "思い出のベストフェス",
    "text": "これまで遊んできた中で「一番楽しかった・テーマが熱かった」フェスって何ですか？",
    "star": 2,
    "tags": [
      "スプラ",
      "フェス"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-13",
    "title": "VC中のお供ドリンク",
    "text": "VCしながら遊ぶときって、手元に飲み物やお菓子とか準備しておく派ですか？",
    "star": 1,
    "tags": [
      "VC",
      "雑談"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-14",
    "title": "バンカラ派？バイト派？",
    "text": "普段はバンカラマッチ(ナワバリ)派ですか？それともサーモンランばっかりやる派ですか？",
    "star": 2,
    "tags": [
      "スプラ",
      "定番"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "z-15",
    "title": "デスした瞬間のクセ",
    "text": "デスした瞬間、ついついコントローラーぎゅって握りしめたり声出たりしちゃいません？(笑)",
    "star": 2,
    "tags": [
      "スプラ",
      "共感"
    ],
    "airSuitability": "普通",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-16",
    "title": "最近のプチハッピー",
    "text": "最近、ちょっとテンションが上がった出来事や、嬉しかったことってありました？",
    "star": 3,
    "tags": [
      "深夜",
      "雑談"
    ],
    "airSuitability": "深夜帯",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-17",
    "title": "エイムの寝落ち限界線",
    "text": "何時くらいになると「あ、もう頭働いてないしエイム崩壊してるな…」ってなります？(笑)",
    "star": 2,
    "tags": [
      "深夜",
      "VC"
    ],
    "airSuitability": "深夜帯",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-18",
    "title": "持ちブキ迷子の夜",
    "text": "たまに「私の持ちブキ、本当にこれで合ってるのかな…？」って迷子になる夜ありません？",
    "star": 2,
    "tags": [
      "スプラ",
      "共感"
    ],
    "airSuitability": "静か",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-19",
    "title": "プレイ中に流す音楽",
    "text": "いつもゲームプレイ中や、まったり遊んでる時って裏でどんな音楽聴いてます？",
    "star": 3,
    "tags": [
      "深夜",
      "日常"
    ],
    "airSuitability": "深夜帯",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-20",
    "title": "ラスト1試合の嘘",
    "text": "「次でラストにします！」って言いつつ、ついつい悔しくて伸びちゃうことありません？(笑)",
    "star": 2,
    "tags": [
      "深夜",
      "共感"
    ],
    "airSuitability": "疲れ気味",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "s-21",
    "title": "まったりお風呂事情",
    "text": "ゲームやりすぎて肩やバキバキな時、お風呂はシャワー派ですか？しっかり湯船浸かる派？",
    "star": 2,
    "tags": [
      "日常",
      "健康"
    ],
    "airSuitability": "疲れ気味",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-22",
    "title": "いまのデスをスロー解説",
    "text": "さっきの華麗なデスシーン！一体何が起きていたのかスローで教えてもらえます？(笑)",
    "star": 3,
    "tags": [
      "ネタ",
      "VC"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-23",
    "title": "ウルショの雄叫び",
    "text": "ウルトラショット撃つとき、実は心の中(またはミュート中)で何か叫んでたりします？",
    "star": 5,
    "tags": [
      "ネタ",
      "スプラ"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "k-24",
    "title": "隣の人を他告紹介！",
    "text": "今ここにいるメンバーの誰か1人を指名して、その人を一言で紹介するとしたらどんな感じ？",
    "star": 5,
    "tags": [
      "VC",
      "ネタ"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "k-25",
    "title": "夢のコラボ企画",
    "text": "もしスプラが他のアニメやゲームとコラボするとしたら、何とコラボしてほしいですか？",
    "star": 4,
    "tags": [
      "スプラ",
      "ネタ"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-26",
    "title": "伝説の編成事故",
    "text": "これまでマッチングして「これはマジで終わった…！」って思ったヤバい編成事故って？",
    "star": 3,
    "tags": [
      "スプラ",
      "共感"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-27",
    "title": "もしオカシラシャケが…",
    "text": "もし現実の街にオカシラシャケが現れたら、どのブキ担いで戦いに行きます？(笑)",
    "star": 4,
    "tags": [
      "ネタ",
      "スプラ"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-28",
    "title": "オリジナルステージ設計",
    "text": "自分がオリジナルの対戦ステージを作れるとしたら、どんな意地悪なギミック置きたいですか？",
    "star": 4,
    "tags": [
      "ネタ",
      "スプラ"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "k-29",
    "title": "もしイカになれたら",
    "text": "もし本当にイカ(タコ)になってインクの中を泳げるようになったら、最初どこ泳ぎたいですか？",
    "star": 5,
    "tags": [
      "ネタ",
      "ロマン"
    ],
    "airSuitability": "盛り上がり",
    "state": "unused",
    "reappearRule": "once_per_person"
  }
];

export const STARTER_DECKS: Deck[] = [
  {
    "id": "deck-all",
    "name": "🌟 すべてのカード",
    "description": "スターターカードのすべてを含んだ総合デッキです。",
    "cardIds": [
      "h-1",
      "h-2",
      "h-3",
      "h-4",
      "h-5",
      "h-6",
      "z-7",
      "z-8",
      "z-9",
      "z-10",
      "z-11",
      "z-12",
      "z-13",
      "z-14",
      "z-15",
      "s-16",
      "s-17",
      "s-18",
      "s-19",
      "s-20",
      "s-21",
      "k-22",
      "k-23",
      "k-24",
      "k-25",
      "k-26",
      "k-27",
      "k-28",
      "k-29"
    ]
  },
  {
    "id": "deck-intro",
    "name": "🦑 はじめまして",
    "description": "初対面や、VCの合流初期に距離を縮めるためのカード集。",
    "cardIds": [
      "h-1",
      "h-2",
      "h-3",
      "h-4",
      "h-5",
      "h-6"
    ]
  },
  {
    "id": "deck-chat",
    "name": "💬 雑談メイン",
    "description": "プレイスタイルやゲームの内外のことで自然に話が弾むカード。",
    "cardIds": [
      "h-6",
      "z-7",
      "z-8",
      "z-9",
      "z-10",
      "z-11",
      "z-12",
      "z-13",
      "z-14",
      "z-15",
      "s-16"
    ]
  },
  {
    "id": "deck-night",
    "name": "🌌 深夜のまったり",
    "description": "夜更けにじっくり、お互いのことを深く知るためのカード。",
    "cardIds": [
      "z-9",
      "s-16",
      "s-17",
      "s-19",
      "s-20"
    ]
  },
  {
    "id": "deck-fix",
    "name": "💥 沈黙打破・ネタ",
    "description": "静かになってしまった時や、ちょっと笑いが欲しい時のカード。",
    "cardIds": [
      "z-11",
      "z-15",
      "s-18",
      "s-20",
      "k-22",
      "k-23",
      "k-24",
      "k-25",
      "k-26",
      "k-27",
      "k-28",
      "k-29"
    ]
  }
];
