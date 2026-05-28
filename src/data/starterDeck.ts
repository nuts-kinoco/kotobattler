import { Card, Deck, AirMode } from '../types/deck';

export const STARTER_CARDS: Card[] = [
  {
    "id": "h-1",
    "title": "自己紹介",
    "text": "まずは簡単な挨拶",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-2",
    "title": "名前の由来",
    "text": "スプラネームの由来ってなんですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-3",
    "title": "スプラデビューの時期",
    "text": "スプラデビューは初代(Wii U)から？それとも2や3からデビューですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-4",
    "title": "持ちブキ",
    "text": "持ちブキはなんですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-5",
    "title": "好きな(得意な)ルール",
    "text": "好きな(得意な)ルールってなんですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-6",
    "title": "好きな(得意な)ステージ",
    "text": "好きな(得意な)ステージってなんですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-7",
    "title": "コーデ派？機能派？",
    "text": "ギアはコーデして作ってます？それとも機能重視？",
    "star": 3,
    "tags": [
      "雑談",
      "ギア"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-8",
    "title": "お気に入りギア",
    "text": "気に入ってるギアとかってあります？",
    "star": 3,
    "tags": [
      "雑談",
      "ギア"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-9",
    "title": "コントローラ感度",
    "text": "感度ってどのくらいに設定してますか？",
    "star": 3,
    "tags": [
      "雑談",
      "プレイスタイル"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-10",
    "title": "プロコン派？ジョイコン派？",
    "text": "プロコン派？ジョイコン派？サードパーティコン？とか？",
    "star": 3,
    "tags": [
      "雑談",
      "プレイスタイル"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-11",
    "title": "Switch2買えた？",
    "text": "Switch2買えました？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-12",
    "title": "思い出のベストフェス",
    "text": "今まで一番楽しかった・テーマが熱かったフェスって何ですか？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-13",
    "title": "プレイスタイル",
    "text": "塗りとキルどっちが好きですか？",
    "star": 3,
    "tags": [
      "雑談",
      "プレイスタイル"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-14",
    "title": "打開と抑え",
    "text": "打開と抑えどっちが好き(苦手)ですか？",
    "star": 3,
    "tags": [
      "雑談",
      "プレイスタイル"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-15",
    "title": "苦手なブキ",
    "text": "相手にすると苦手なブキ派ありますか？",
    "star": 3,
    "tags": [
      "雑談",
      "ブキ"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "m-16",
    "title": "休日の過ごし方",
    "text": "休みの日ってなにして過ごします？",
    "star": 3,
    "tags": [
      "雑談",
      "メタ"
    ],
    "airSuitability": "メタ",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "m-17",
    "title": "仕事は？",
    "text": "(差し支えなければ)何系のお仕事されてるとか聞いてもいいですか？",
    "star": 3,
    "tags": [
      "雑談",
      "メタ",
      "仕事"
    ],
    "airSuitability": "メタ",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "u-18",
    "title": "無言いじり",
    "text": "今みんな何喋ろうか探ってる時間笑",
    "star": 3,
    "tags": [
      "スプラ",
      "共感"
    ],
    "airSuitability": "無言時",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "m-19",
    "title": "定時上がり",
    "text": "今日定時で帰れました？",
    "star": 3,
    "tags": [
      "雑談",
      "メタ",
      "仕事"
    ],
    "airSuitability": "メタ",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-20",
    "title": "いったん別ルール",
    "text": "あかん、一旦ナワバリ(サモラン)挟みますか！笑",
    "star": 3,
    "tags": [
      "空気変え",
      "ネタ"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-21",
    "title": "いったんブキチェンジ",
    "text": "いったんブキ変えてこの流れ変えますわ！",
    "star": 3,
    "tags": [
      "空気変え",
      "ネタ"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "b-22",
    "title": "死にすぎた",
    "text": "生存重視ってモニタにマジックで書いときますわ",
    "star": 3,
    "tags": [
      "自虐",
      "ネタ"
    ],
    "airSuitability": "戦犯したとき",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "h-23",
    "title": "プレイ時間帯",
    "text": "普段は何時くらいにプレイしているんですか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-24",
    "title": "好きなスペシャル",
    "text": "好きなスペシャルってありますか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-25",
    "title": "苦手なルール",
    "text": "苦手なルールってありますか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "h-26",
    "title": "ハマってる他ゲー",
    "text": "スプラ以外にハマってるゲームってありますか？",
    "star": 3,
    "tags": [
      "初対面",
      "定番"
    ],
    "airSuitability": "はじめまして",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-27",
    "title": "好きなサブ",
    "text": "好きなサブってありますか？",
    "star": 3,
    "tags": [
      "雑談",
      "ブキ"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-28",
    "title": "一番使ってないブキ",
    "text": "今一番使ってないブキってなんですか？",
    "star": 3,
    "tags": [
      "雑談",
      "ブキ"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-29",
    "title": "TV派？モニタ派？",
    "text": "TVとモニタどっちでやってます？携帯モードとか？",
    "star": 3,
    "tags": [
      "雑談",
      "プレイスタイル"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-30",
    "title": "フェス好き？",
    "text": "フェスってえいえんまでプレイします？",
    "star": 3,
    "tags": [
      "雑談",
      "フェス"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-31",
    "title": "味方に来ると嬉しいブキ",
    "text": "味方に来ると嬉しいブキってありますか？",
    "star": 3,
    "tags": [
      "雑談",
      "ブキ"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-32",
    "title": "飲酒トゥーン",
    "text": "飲酒トゥーンとかってやります？",
    "star": 3,
    "tags": [
      "雑談",
      "飲酒"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-33",
    "title": "おすすめのギア",
    "text": "このブキ(今使ってるブキ)ってなんのギアがおすすめですか？",
    "star": 3,
    "tags": [
      "雑談",
      "ブキ"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-34",
    "title": "好きな配信者",
    "text": "好きな(おすすめの)配信者とかっています？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-35",
    "title": "好きなアーティスト",
    "text": "好きなアーティストとかっています？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-36",
    "title": "ロッカー",
    "text": "ロッカーってこだわったりしてます？見てもいい？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-37",
    "title": "スプラ夜ふかし選手権",
    "text": "スプラでMax何時までプレイしたことありますか？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-38",
    "title": "ジャイロ派？スティック派？",
    "text": "ジャイロ派？スティック派？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "z-39",
    "title": "サモラン派？バンカラ派？",
    "text": "オプマとかサモラン、Xマッチとか何をプレイするのが多いですか？",
    "star": 3,
    "tags": [
      "雑談"
    ],
    "airSuitability": "雑談",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "b-40",
    "title": "私の◯◯、弱すぎ…！？",
    "text": "うわっ…私の◯◯、弱すぎ…？",
    "star": 3,
    "tags": [
      "自虐",
      "ネタ"
    ],
    "airSuitability": "戦犯したとき",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-41",
    "title": "いったんブキ統一",
    "text": "え、いったん皆で◯◯持ってみます？笑",
    "star": 3,
    "tags": [
      "空気変え",
      "ネタ"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-42",
    "title": "逆に何連敗いける？",
    "text": "逆にどこまでいけるのか！？勝ったら負けまである笑",
    "star": 3,
    "tags": [
      "空気変え",
      "ネタ"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-43",
    "title": "負けても楽しい",
    "text": "負けまくってるのにすみません、ナカマとやると楽しい笑",
    "star": 3,
    "tags": [
      "空気変え"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "r-44",
    "title": "スプリンクラーでやられた",
    "text": "ヤバい、今ならスプリンクラーに負けるまである",
    "star": 3,
    "tags": [
      "空気変え",
      "ネタ"
    ],
    "airSuitability": "連敗中",
    "state": "unused",
    "reappearRule": "session_graveyard"
  },
  {
    "id": "d-45",
    "title": "好きなお酒",
    "text": "よく飲むとか好きなお酒とかってありますか？",
    "star": 3,
    "tags": [
      "雑談",
      "飲酒"
    ],
    "airSuitability": "飲酒トゥーン",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "d-46",
    "title": "おすすめのお酒",
    "text": "なにかおすすめのお酒とかってありますか？",
    "star": 3,
    "tags": [
      "雑談",
      "飲酒"
    ],
    "airSuitability": "飲酒トゥーン",
    "state": "unused",
    "reappearRule": "once_per_person"
  },
  {
    "id": "d-47",
    "title": "最近おいしかったお酒",
    "text": "最近おいしかったお酒ってなんですか？",
    "star": 3,
    "tags": [
      "雑談",
      "飲酒"
    ],
    "airSuitability": "飲酒トゥーン",
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
      "m-16",
      "m-17",
      "u-18",
      "m-19",
      "r-20",
      "r-21",
      "b-22",
      "h-23",
      "h-24",
      "h-25",
      "h-26",
      "z-27",
      "z-28",
      "z-29",
      "z-30",
      "z-31",
      "z-32",
      "z-33",
      "z-34",
      "z-35",
      "z-36",
      "z-37",
      "z-38",
      "z-39",
      "b-40",
      "r-41",
      "r-42",
      "r-43",
      "r-44",
      "d-45",
      "d-46",
      "d-47"
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
      "h-6",
      "h-23",
      "h-24",
      "h-25",
      "h-26"
    ]
  },
  {
    "id": "deck-chat",
    "name": "💬 雑談メイン",
    "description": "プレイスタイルやゲームの内外のことで自然に話が弾むカード。",
    "cardIds": [
      "z-7",
      "z-8",
      "z-9",
      "z-10",
      "z-11",
      "z-12",
      "z-13",
      "z-14",
      "z-15",
      "m-16",
      "m-17",
      "m-19",
      "z-27",
      "z-28",
      "z-29",
      "z-30",
      "z-31",
      "z-32",
      "z-33",
      "z-34",
      "z-35",
      "z-36",
      "z-37",
      "z-38",
      "z-39",
      "d-45",
      "d-46",
      "d-47"
    ]
  },
  {
    "id": "deck-fix",
    "name": "💥 沈黙打破・ネタ",
    "description": "静かになってしまった時や、ちょっと笑いが欲しい時のカード。",
    "cardIds": [
      "r-20",
      "r-21",
      "b-22",
      "b-40",
      "r-41",
      "r-42",
      "r-43",
      "r-44"
    ]
  },
  {
    "id": "deck-meta",
    "name": "🎮 メタ・リアル話",
    "description": "ゲームを離れた日常やリアルな話題のカード。",
    "cardIds": [
      "m-16",
      "m-17",
      "m-19"
    ]
  },
  {
    "id": "deck-drink",
    "name": "🍺 飲酒トゥーン",
    "description": "お酒を飲みながら盛り上がるためのカード集。",
    "cardIds": [
      "z-32",
      "d-45",
      "d-46",
      "d-47"
    ]
  },
  {
    "id": "deck-silent",
    "name": "🤐 無言いじり",
    "description": "無言になってしまった時にそっと場を動かすカード。",
    "cardIds": [
      "u-18"
    ]
  },
  {
    "id": "deck-loss",
    "name": "💀 連敗・戦犯タイム",
    "description": "連敗中や戦犯してしまった時の空気を変えるカード。",
    "cardIds": [
      "r-20",
      "r-21",
      "b-22",
      "b-40",
      "r-41",
      "r-42",
      "r-43",
      "r-44"
    ]
  }
];

export const STARTER_AIR_MODES: AirMode[] = [
  {
    "id": "air-intro",
    "name": "はじめまして"
  },
  {
    "id": "air-chat",
    "name": "雑談"
  },
  {
    "id": "air-meta",
    "name": "メタ"
  },
  {
    "id": "air-drink",
    "name": "飲酒トゥーン"
  },
  {
    "id": "air-unspoken",
    "name": "無言時"
  },
  {
    "id": "air-loss",
    "name": "連敗中"
  },
  {
    "id": "air-throw",
    "name": "戦犯したとき"
  }
];
