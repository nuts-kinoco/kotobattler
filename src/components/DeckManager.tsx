'use client';

import React, { useState, useMemo, useRef } from 'react';
import { 
  Plus, Search, Tag, Star, Download, Upload, Trash2, 
  Edit3, Folder, BookOpen, AlertCircle, ArrowLeft, Check, Lock
} from 'lucide-react';
import { Card, Deck, AirSuitability, CardState } from '../types/deck';

interface DeckManagerProps {
  cards: Card[];
  decks: Deck[];
  currentDeckId: string;
  setCurrentDeckId: (id: string) => void;
  onBackToApp: () => void;
  addCard: (card: Omit<Card, 'id' | 'state'>) => void;
  updateCard: (card: Card) => void;
  deleteCard: (id: string) => void;
  toggleCardSealed: (id: string) => void;
  importCSV: (csvText: string) => boolean;
  downloadCSV: () => void;
  importJSON: (jsonText: string) => boolean;
  exportJSON: () => void;
  showToast?: (msg: string) => void;
}

export const DeckManager: React.FC<DeckManagerProps> = ({
  cards,
  decks,
  currentDeckId,
  setCurrentDeckId,
  onBackToApp,
  addCard,
  updateCard,
  deleteCard,
  toggleCardSealed,
  importCSV,
  downloadCSV,
  importJSON,
  exportJSON,
  showToast
}) => {
  // 編集モード
  const [editingCardId, setEditingCardId] = useState<string | null>(null);

  // フォーム用ステート
  const [formTitle, setFormTitle] = useState('');
  const [formText, setFormText] = useState('');
  const [formStar, setFormStar] = useState<number>(3);
  const [formTagsString, setFormTagsString] = useState('');
  const [formMemo, setFormMemo] = useState('');
  const [formAir, setFormAir] = useState<AirSuitability>('普通');

  // 検索・フィルターステート
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // CSVインポート用の一時ファイルテキスト
  const [csvText, setCsvText] = useState('');
  const [showCsvBox, setShowCsvBox] = useState(false);

  // コピー・ダウンロード状態インジケータ
  const [downloading, setDownloading] = useState(false);
  const [exportingJSON, setExportingJSON] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 選択デッキのカードID
  const selectedDeckCardIds = useMemo(() => {
    const d = decks.find(dk => dk.id === currentDeckId);
    return d ? d.cardIds : [];
  }, [decks, currentDeckId]);

  // タグ一覧
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    cards.forEach(c => c.tags.forEach(t => tags.add(t)));
    return Array.from(tags);
  }, [cards]);

  // フィルターされたカード一覧
  const filteredCards = useMemo(() => {
    return cards
      .filter(c => selectedDeckCardIds.includes(c.id))
      .filter(c => {
        const matchesSearch = c.text.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (c.title && c.title.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTag = selectedTag === 'All' || c.tags.includes(selectedTag);
        return matchesSearch && matchesTag;
      });
  }, [cards, selectedDeckCardIds, searchQuery, selectedTag]);

  // フォームをリセットするヘルパー
  const resetForm = () => {
    setEditingCardId(null);
    setFormTitle('');
    setFormText('');
    setFormStar(3);
    setFormTagsString('');
    setFormMemo('');
    setFormAir('普通');
  };

  // カード編集開始
  const handleEditStart = (card: Card) => {
    setEditingCardId(card.id);
    setFormTitle(card.title || '');
    setFormText(card.text);
    setFormStar(card.star);
    setFormTagsString(card.tags.join(', '));
    setFormMemo(card.memo || '');
    setFormAir(card.airSuitability || '普通');
  };

  // 送信処理 (新規・更新)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;

    const parsedTags = formTagsString
      .split(',')
      .map(t => t.trim())
      .filter(t => t !== '');

    const cardData = {
      title: formTitle.trim() || undefined,
      text: formText.trim(),
      star: formStar,
      tags: parsedTags,
      memo: formMemo.trim() || undefined,
      airSuitability: formAir,
      reappearRule: (formTagsString.includes('はじめまして') || formTagsString.includes('自己紹介') || formStar === 5)
        ? ('once_per_person' as const)
        : ('session_graveyard' as const)
    };

    if (editingCardId) {
      const originalCard = cards.find(c => c.id === editingCardId);
      if (originalCard) {
        updateCard({
          ...originalCard,
          ...cardData
        });
      }
    } else {
      addCard(cardData);
    }
    
    resetForm();
  };

  // CSVのインポート実行
  const handleCsvImport = () => {
    if (!csvText.trim()) return;
    const success = importCSV(csvText);
    if (success) {
      alert('CSVからカードを正常にインポートしました！');
      setCsvText('');
      setShowCsvBox(false);
    } else {
      alert('インポートに失敗しました。ヘッダーに "text" カラムが含まれているかご確認ください。');
    }
  };

  // 実際のCSVファイルダウンロード処理のトリガー
  const handleCsvDownload = () => {
    setDownloading(true);
    downloadCSV();
    if (showToast) {
      showToast('CSVファイルをエクスポートしました 💾');
    }
    setTimeout(() => setDownloading(false), 600);
  };

  // 統合JSONのダウンロード処理のトリガー
  const handleJsonDownload = () => {
    setExportingJSON(true);
    exportJSON();
    if (showToast) {
      showToast('完全バックアップJSONをエクスポートしました 💾');
    }
    setTimeout(() => setExportingJSON(false), 600);
  };

  // 統合JSONファイルアップロード処理のトリガー
  const handleJsonUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleJsonFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const success = importJSON(text);
        if (success) {
          if (showToast) {
            showToast('データを完全復元しました 💫');
          } else {
            alert('データを完全復元しました！');
          }
        } else {
          alert('復元に失敗しました。Kotobattler の有効なバックアップJSONファイルかご確認ください。');
        }
      }
      // 同じファイルを連続選択できるようにリセット
      e.target.value = '';
    };
    reader.readAsText(file);
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col h-full space-y-6">
      
      {/* 上部ヘッダー */}
      <div className="flex justify-between items-center border-b border-foreground/5 pb-4 shrink-0">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBackToApp}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl glass-panel-light hover:bg-foreground/5 text-xs font-bold text-foreground/80 transition-all border border-foreground/5"
          >
            <ArrowLeft className="w-4 h-4" />
            VCカード画面に戻る
          </button>
          <div className="h-6 w-[1px] bg-foreground/10" />
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-neon-green to-neon-purple flex items-center gap-2">
              ⚙️ ロッカー整理 (カード管理)
            </h1>
            {/* ご主人様指定のプライバシー注意書きを配置 (極めて静かで落ち着いたデザイン) */}
            <div className="text-[10px] text-foreground/45 flex items-center gap-1 mt-0.5 font-medium select-none">
              <Lock className="w-3 h-3 text-neon-green/70" />
              <span>データはブラウザ内にローカル保存されます。外部サーバへ送信されません。</span>
            </div>
          </div>
        </div>
        
        {/* インポート・エクスポートアクション群 */}
        <div className="flex items-center gap-2">
          {/* CSV用 */}
          <div className="flex border border-foreground/5 rounded-xl overflow-hidden glass-panel-light shrink-0">
            <button
              onClick={() => setShowCsvBox(!showCsvBox)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-foreground/75 hover:bg-foreground/5 border-r border-foreground/5 transition-all"
              title="CSV形式でお題を一括追加します"
            >
              <Upload className="w-3.5 h-3.5 text-foreground/50" />
              CSVインポート
            </button>
            <button
              onClick={handleCsvDownload}
              disabled={downloading}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-foreground/75 hover:bg-foreground/5 transition-all"
              title="お題カード一覧をCSVとして書き出します"
            >
              <Download className="w-3.5 h-3.5 text-foreground/50" />
              CSV書き出し
            </button>
          </div>

          <div className="h-6 w-[1px] bg-foreground/10 mx-1" />

          {/* 完全統合JSONバックアップ用 (初心者にも極めて優しい1ファイル復元/保存) */}
          <div className="flex border border-neon-purple/20 rounded-xl overflow-hidden bg-neon-purple/5 shrink-0">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleJsonFileChange} 
              accept=".json" 
              className="hidden" 
            />
            <button
              onClick={handleJsonUploadClick}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/10 border-r border-neon-purple/20 transition-all"
              title="人物メモや設定なども含めた Kotobattler バックアップファイルを読み込み復元します"
            >
              <Upload className="w-3.5 h-3.5" />
              完全復元 (JSON)
            </button>
            <button
              onClick={handleJsonDownload}
              disabled={exportingJSON}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-neon-purple hover:bg-neon-purple/10 transition-all"
              title="カード、人物、履歴、設定をすべて含んだ完全なバックアップファイルを書き出します"
            >
              <Download className="w-3.5 h-3.5" />
              {exportingJSON ? '保存中...' : '完全保存 (JSON)'}
            </button>
          </div>
        </div>
      </div>

      {/* CSVインポートボックスのトグル表示 */}
      {showCsvBox && (
        <div className="glass-panel rounded-2xl p-5 border border-foreground/10 space-y-3 animate-fade-in shrink-0">
          <div className="flex justify-between items-center">
            <span className="text-sm font-bold text-foreground/80 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-neon-green" /> CSVデータを貼り付けてください
            </span>
            <span className="text-[10px] text-foreground/40">形式: `title,text,star,tags,air` (tagsはセミコロン区切り)</span>
          </div>
          <textarea
            value={csvText}
            onChange={(e) => setCsvText(e.target.value)}
            placeholder="title,text,star,tags,air&#13;「おすすめギア」,「お気に入りのギア構成教えて！」,4,スプラ;雑談,普通"
            rows={5}
            className="w-full text-xs font-mono bg-background border border-foreground/10 rounded-xl p-3 text-foreground focus:outline-none focus:border-neon-green resize-none"
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowCsvBox(false)}
              className="px-4 py-2 rounded-lg glass-panel-light hover:bg-foreground/5 text-xs font-bold"
            >
              閉じる
            </button>
            <button
              onClick={handleCsvImport}
              disabled={!csvText.trim()}
              className="px-4 py-2 rounded-lg bg-neon-green hover:bg-emerald-500 disabled:opacity-40 text-background dark:text-slate-950 text-xs font-bold transition-all shadow-md"
            >
              インポートを実行
            </button>
          </div>
        </div>
      )}

      {/* メインの3カラムレイアウト */}
      <div className="flex-1 flex gap-6 overflow-hidden min-h-0">
        
        {/* 左ペイン: デッキ一覧 */}
        <div className="w-64 glass-panel rounded-2xl border border-foreground/5 p-4 flex flex-col space-y-4 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-2 text-xs text-foreground/40 font-bold uppercase tracking-widest font-mono">
            <Folder className="w-3.5 h-3.5" />
            <span>デッキラック</span>
          </div>

          <div className="space-y-1.5">
            {decks.map(d => {
              const isSelected = d.id === currentDeckId;
              return (
                <button
                  key={d.id}
                  onClick={() => setCurrentDeckId(d.id)}
                  className={`w-full text-left px-3.5 py-3 rounded-xl transition-all border flex items-center justify-between group ${
                    isSelected
                      ? 'bg-gradient-to-r from-neon-purple/10 to-indigo-900/5 border-neon-purple/20 text-foreground font-bold'
                      : 'bg-white/0 border-transparent text-foreground/60 hover:bg-foreground/5 hover:text-foreground/90'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 truncate">
                    <BookOpen className={`w-4 h-4 shrink-0 ${isSelected ? 'text-neon-purple' : 'text-foreground/30 group-hover:text-foreground/50'}`} />
                    <span className="text-sm truncate">{d.name}</span>
                  </div>
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    isSelected ? 'bg-neon-purple/20 text-neon-purple' : 'bg-slate-950 dark:bg-slate-950 text-foreground/30'
                  }`}>
                    {d.cardIds.length}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 中央ペイン: カード一覧 */}
        <div className="flex-1 glass-panel rounded-2xl border border-foreground/5 p-5 flex flex-col space-y-4 min-w-0">
          
          {/* 検索・フィルターバー */}
          <div className="flex gap-3 shrink-0">
            <div className="flex-1 relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <input
                type="text"
                placeholder="本文やタイトルでロッカー内を検索..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full text-xs bg-background border border-foreground/10 rounded-xl pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-neon-green"
              />
            </div>
            
            <div className="w-48 relative">
              <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30" />
              <select
                value={selectedTag}
                onChange={(e) => setSelectedTag(e.target.value)}
                className="w-full text-xs bg-background border border-foreground/10 rounded-xl pl-10 pr-4 py-2.5 text-foreground focus:outline-none focus:border-neon-green appearance-none cursor-pointer"
              >
                <option value="All">すべてのタグ</option>
                {allTags.map(t => (
                  <option key={t} value={t}>#{t}</option>
                ))}
              </select>
            </div>
          </div>

          {/* カード一覧リスト */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {filteredCards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-foreground/30 space-y-2">
                <AlertCircle className="w-8 h-8" />
                <p className="text-xs">条件に合致するカードが見つかりません。</p>
              </div>
            ) : (
              filteredCards.map(c => {
                const isSealed = c.state === 'sealed';
                return (
                  <div
                    key={c.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isSealed
                        ? 'bg-[#0D1117]/30 border-foreground/5 opacity-40'
                        : editingCardId === c.id
                        ? 'bg-neon-green/5 border-neon-green/30'
                        : 'bg-[#0D1117]/10 dark:bg-slate-900/30 border-foreground/5 hover:border-foreground/10'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-1.5">
                          {c.title && (
                            <span className="text-xs font-black text-foreground/85 bg-foreground/5 border border-foreground/5 px-2 py-0.5 rounded">
                              {c.title}
                            </span>
                          )}
                          {c.tags.map((t, idx) => (
                            <span key={idx} className="text-[10px] text-foreground/45 font-mono">
                              #{t}
                            </span>
                          ))}
                          {c.airSuitability && (
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-neon-purple/10 text-neon-purple font-semibold">
                              {c.airSuitability}
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-foreground/90 leading-relaxed font-sans select-text">
                          {c.text}
                        </p>
                        {c.memo && (
                          <p className="text-[11px] text-foreground/50 bg-foreground/5 p-1.5 rounded leading-relaxed">
                            {c.memo}
                          </p>
                        )}
                      </div>

                      {/* アクションボタン */}
                      <div className="flex items-center gap-1 shrink-0 pt-0.5">
                        <button
                          onClick={() => toggleCardSealed(c.id)}
                          className={`px-2.5 py-1 rounded-lg border text-[10px] font-bold transition-all ${
                            isSealed
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500 hover:text-white'
                              : 'bg-foreground/5 border-foreground/5 text-foreground/50 hover:bg-foreground/10 hover:text-foreground'
                          }`}
                          title={isSealed ? '封印解除 (ドロー対象に戻します)' : 'カードを封印 (ドロー対象から外します)'}
                        >
                          {isSealed ? '封印中' : '封印'}
                        </button>
                        <button
                          onClick={() => handleEditStart(c)}
                          className="p-2 rounded-lg hover:bg-foreground/5 text-foreground/45 hover:text-foreground transition-all"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteCard(c.id)}
                          className="p-2 rounded-lg hover:bg-rose-500/5 text-foreground/30 hover:text-rose-500 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 右ペイン: 新規・編集フォーム */}
        <div className="w-80 glass-panel rounded-2xl border border-foreground/5 p-5 flex flex-col space-y-4 shrink-0 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-bold uppercase tracking-widest font-mono border-b border-foreground/5 pb-2">
            <Plus className="w-4 h-4 text-neon-green" />
            <span>{editingCardId ? 'カード情報を編集' : '新しいギアカードを追加'}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* タイトル */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/50">タイトル (任意)</label>
              <input
                type="text"
                placeholder="例: デス時の感想、好きなステージ"
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="w-full text-xs bg-background border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green"
              />
            </div>

            {/* 本文 */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/50">カード本文 (必須)</label>
              <textarea
                placeholder="例: 今のやられちゃったシーン、何が起きてました？(笑)"
                required
                value={formText}
                onChange={(e) => setFormText(e.target.value)}
                rows={3}
                className="w-full text-xs bg-background border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green resize-none"
              />
            </div>

            {/* タグ */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/50">タグ (カンマ区切り)</label>
              <input
                type="text"
                placeholder="例: スプラ, ネタ, はじめまして"
                value={formTagsString}
                onChange={(e) => setFormTagsString(e.target.value)}
                className="w-full text-xs bg-background border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green"
              />
            </div>

            {/* 空気感 */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/50">空気適性</label>
              <select
                value={formAir}
                onChange={(e) => setFormAir(e.target.value as AirSuitability)}
                className="w-full text-xs bg-background border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green cursor-pointer"
              >
                <option value="普通">普通</option>
                <option value="初動">初動</option>
                <option value="静か">静か</option>
                <option value="盛り上がり">盛り上がり</option>
                <option value="深夜">深夜</option>
                <option value="疲れ気味">疲れ気味</option>
              </select>
            </div>

            {/* ★評価 */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold text-foreground/50">★評価 (0〜5)</label>
              <div className="flex items-center space-x-1.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setFormStar(i + 1)}
                    className="p-1 rounded hover:bg-foreground/5 transition-all"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        i < formStar ? 'text-amber-400 fill-amber-400' : 'text-gray-700 dark:text-gray-600'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* 補足メモ */}
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-foreground/50">補足メモ (任意)</label>
              <textarea
                placeholder="例: 深夜帯に使うとより盛り上がります"
                value={formMemo}
                onChange={(e) => setFormMemo(e.target.value)}
                rows={2}
                className="w-full text-xs bg-background border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green resize-none"
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-2 pt-2">
              {editingCardId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-2.5 bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 text-foreground text-xs font-bold rounded-xl transition-all"
                >
                  キャンセル
                </button>
              )}
              <button
                type="submit"
                className="flex-1 py-2.5 bg-neon-green hover:bg-emerald-500 text-background dark:text-slate-950 text-xs font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {editingCardId ? 'カードを更新' : 'カードを保存'}
              </button>
            </div>
          </form>
        </div>

      </div>
    </div>
  );
};
