'use client';

import React, { useState, useMemo } from 'react';
import { 
  ArrowLeft, UserPlus, Trash2, RotateCcw, Plus, X, Edit2, Check, FileText, Calendar, Search, User, AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, Person } from '../types/deck';

interface MemberManagerProps {
  cards: Card[];
  persons: Person[];
  onBackToApp: () => void;
  addPerson: (displayName: string, aliases: string[], memo?: string) => Person;
  updatePerson: (id: string, displayName: string, aliases: string[], memo?: string) => void;
  deletePerson: (id: string) => void;
  resetPersonUsedCards: (personId: string) => void;
  removePersonUsedCard: (personId: string, cardId: string) => void;
  showToast: (msg: string) => void;
}

export const MemberManager: React.FC<MemberManagerProps> = ({
  cards,
  persons,
  onBackToApp,
  addPerson,
  updatePerson,
  deletePerson,
  resetPersonUsedCards,
  removePersonUsedCard,
  showToast
}) => {
  // 検索クエリ
  const [searchQuery, setSearchQuery] = useState('');
  
  // 新規メンバー追加フォーム用
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newAliasesText, setNewAliasesText] = useState('');
  const [newMemo, setNewMemo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  // 編集中のメンバーID
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editDisplayName, setEditDisplayName] = useState('');
  const [editAliasesText, setEditAliasesText] = useState('');
  const [editMemo, setEditMemo] = useState('');

  // 検索＆フィルタリングされたメンバーリスト
  const filteredPersons = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return persons;
    return persons.filter(p => {
      const matchName = p.displayName.toLowerCase().includes(query);
      const matchAlias = p.aliases.some(a => a.toLowerCase().includes(query));
      const matchMemo = p.memo?.toLowerCase().includes(query) || false;
      return matchName || matchAlias || matchMemo;
    });
  }, [persons, searchQuery]);

  // 新規メンバーの作成処理
  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisplayName.trim()) {
      showToast('名前を入力してください 🐙');
      return;
    }

    const aliases = newAliasesText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    addPerson(newDisplayName.trim(), aliases, newMemo.trim());
    showToast(`${newDisplayName} さんをロッカーに登録しました！🦑`);

    // フォームリセット
    setNewDisplayName('');
    setNewAliasesText('');
    setNewMemo('');
    setIsAdding(false);
  };

  // 編集開始処理
  const startEditing = (p: Person) => {
    setEditingPersonId(p.id);
    setEditDisplayName(p.displayName);
    setEditAliasesText(p.aliases.join(', '));
    setEditMemo(p.memo || '');
  };

  // 編集保存処理
  const handleSaveEdit = (id: string) => {
    if (!editDisplayName.trim()) {
      showToast('名前を入力してください 🐙');
      return;
    }

    const aliases = editAliasesText
      .split(',')
      .map(a => a.trim())
      .filter(Boolean);

    updatePerson(id, editDisplayName.trim(), aliases, editMemo.trim());
    setEditingPersonId(null);
    showToast('メンバー情報を更新しました ✨');
  };

  // お題履歴から個別にお題を削除する処理
  const handleRemoveSingleCardFromHistory = (personId: string, cardId: string) => {
    removePersonUsedCard(personId, cardId);
    showToast('履歴からお題を削除しました 🗑️');
  };

  // アバターの色を名前に基づいてハッシュ生成するスタイリッシュな関数
  const getAvatarGradient = (name: string) => {
    const colors = [
      'from-neon-purple to-indigo-600',
      'from-neon-green to-emerald-600',
      'from-pink-500 to-rose-600',
      'from-amber-400 to-orange-500',
      'from-cyan-400 to-blue-600',
      'from-fuchsia-500 to-purple-700'
    ];
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % colors.length;
    return colors[index];
  };

  // 最終活動時間のスタイリッシュなフォーマット化
  const formatLastSeen = (isoString?: string) => {
    if (!isoString) return '活動履歴なし';
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffMins < 1) return '今まさに活動中 🦑';
    if (diffMins < 60) return `${diffMins}分前`;
    if (diffHours < 24) return `${diffHours}時間前`;
    
    // 日付フォーマット
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="flex-1 w-full h-full flex flex-col bg-background text-foreground overflow-y-auto p-4 sm:p-6 transition-all duration-300 relative select-none">
      {/* ネオン背景装飾 */}
      <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-neon-green/2 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[400px] h-[400px] rounded-full bg-neon-purple/2 blur-[120px] pointer-events-none" />

      {/* ヘッダーエリア */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 shrink-0 glass-panel p-4 sm:p-6 rounded-2xl border border-foreground/5 shadow-md relative z-10">
        <div className="flex items-center space-x-3.5">
          <button
            onClick={onBackToApp}
            className="p-2.5 rounded-xl glass-panel-light hover:bg-foreground/5 text-foreground/80 hover:text-foreground transition-all border border-foreground/5"
            title="メイン画面に戻る"
          >
            <ArrowLeft className="w-4 h-4 text-neon-green" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">👤</span>
              <h1 className="font-black text-lg sm:text-xl tracking-wide text-foreground/90 dark:text-foreground">
                メンバー整理ロッカー
              </h1>
            </div>
            <p className="text-[10px] sm:text-xs text-foreground/45 mt-0.5 font-medium">
              よく一緒に遊ぶフレンドの情報をメモしたり、話したお題の履歴を整理できます 🦑
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          {/* 検索入力欄 */}
          <div className="relative flex-1 sm:w-60">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="メンバーを検索..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-background/50 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/30 focus:outline-none focus:border-neon-green focus:ring-1 focus:ring-neon-green/20 transition-all font-semibold"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 text-foreground/35 hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* 新規登録ボタン */}
          <button
            onClick={() => setIsAdding(!isAdding)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all border shadow ${
              isAdding 
                ? 'bg-neon-purple text-white border-neon-purple' 
                : 'glass-panel-light hover:bg-foreground/5 text-foreground/80 border-foreground/5'
            }`}
          >
            {isAdding ? <X className="w-3.5 h-3.5" /> : <UserPlus className="w-3.5 h-3.5 text-neon-purple" />}
            <span>{isAdding ? '閉じる' : '新規登録'}</span>
          </button>
        </div>
      </header>

      {/* 新規追加フォーム (アコーディオン) */}
      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden shrink-0 relative z-10"
          >
            <form onSubmit={handleCreate} className="glass-panel p-5 rounded-2xl border border-neon-purple/20 shadow-lg space-y-4 max-w-2xl">
              <div className="flex items-center gap-2 border-b border-foreground/5 pb-2.5">
                <span className="text-base">✨</span>
                <h2 className="text-xs font-black tracking-widest text-neon-purple uppercase">新規メンバープロフィール作成</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] text-foreground/45 font-black uppercase tracking-wider block">ハンドルネーム *</label>
                  <input
                    type="text"
                    value={newDisplayName}
                    onChange={(e) => setNewDisplayName(e.target.value)}
                    placeholder="例: たろう"
                    required
                    className="w-full px-3 py-2 text-xs bg-background/50 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:border-neon-purple transition-all font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] text-foreground/45 font-black uppercase tracking-wider block">別名・表記揺れ (カンマ区切り)</label>
                  <input
                    type="text"
                    value={newAliasesText}
                    onChange={(e) => setNewAliasesText(e.target.value)}
                    placeholder="例: tarou, タロウ, T"
                    className="w-full px-3 py-2 text-xs bg-background/50 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:border-neon-purple transition-all font-semibold"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] text-foreground/45 font-black uppercase tracking-wider block">ロッカーメモ（特徴・プレイスタイル）</label>
                <input
                  type="text"
                  value={newMemo}
                  onChange={(e) => setNewMemo(e.target.value)}
                  placeholder="例: チャージャー使い、夜間によくVCに入る、盛り上げ上手"
                  className="w-full px-3 py-2 text-xs bg-background/50 border border-foreground/10 rounded-xl text-foreground placeholder-foreground/20 focus:outline-none focus:border-neon-purple transition-all font-semibold"
                />
              </div>

              <div className="flex justify-end gap-2 border-t border-foreground/5 pt-3.5">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold glass-panel-light hover:bg-foreground/5 text-foreground/75 border border-foreground/5 transition-all"
                >
                  キャンセル
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl text-xs font-black bg-neon-purple hover:bg-neon-purple/90 text-white shadow-md transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>登録する</span>
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* メイングリッドエリア */}
      {filteredPersons.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-16 text-center glass-panel rounded-2xl border border-dashed border-foreground/10 p-8">
          <div className="w-12 h-12 rounded-2xl bg-foreground/5 flex items-center justify-center mb-3">
            <Search className="w-6 h-6 text-foreground/25" />
          </div>
          <h3 className="font-bold text-sm text-foreground/70">メンバーが見つかりません</h3>
          <p className="text-xs text-foreground/40 mt-1 max-w-xs leading-relaxed">
            {searchQuery 
              ? '検索ワードに一致するメンバーはいません。別の言葉で試すか、新しく登録してください 🦑' 
              : 'まだメンバーが登録されていません。「新規登録」ボタンからフレンドを登録しましょう！'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 relative z-10 pb-8">
          <AnimatePresence>
            {filteredPersons.map((p) => {
              const isEditing = editingPersonId === p.id;
              
              // このメンバーが話したお題カードをマッピング
              const usedCards = p.usedCardIds
                .map(id => cards.find(c => c.id === id))
                .filter((c): c is Card => !!c);

              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  className="glass-panel p-5 rounded-2xl border border-foreground/5 hover:border-foreground/10 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* カード上部: アバター ＆ 名前 ＆ アクション */}
                    <div className="flex items-start justify-between gap-3 border-b border-foreground/5 pb-3.5 mb-3.5">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        {/* スタイリッシュアバター */}
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${getAvatarGradient(p.displayName)} flex items-center justify-center font-black text-white text-sm tracking-wider shadow select-none shrink-0`}>
                          {p.displayName.charAt(0).toUpperCase()}
                        </div>
                        
                        {/* 名前・別名 */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <input
                              type="text"
                              value={editDisplayName}
                              onChange={(e) => setEditDisplayName(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs bg-background/80 border border-neon-green/30 rounded-lg text-foreground focus:outline-none transition-all font-black"
                              placeholder="名前"
                              autoFocus
                            />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <h3 className="font-black text-sm tracking-wide text-foreground truncate">
                                {p.displayName}
                              </h3>
                              {p.aliases.length > 0 && (
                                <span className="text-[9px] text-foreground/35 font-bold truncate">
                                  ({p.aliases.join(', ')})
                                </span>
                              )}
                            </div>
                          )}

                          {/* 最終活動時刻 */}
                          <div className="flex items-center gap-1 text-[9px] text-foreground/35 font-semibold mt-0.5">
                            <Calendar className="w-2.5 h-2.5" />
                            <span>{formatLastSeen(p.lastSeenAt)}</span>
                          </div>
                        </div>
                      </div>

                      {/* アクションボタン */}
                      <div className="flex items-center space-x-1 shrink-0">
                        {isEditing ? (
                          <>
                            <button
                              onClick={() => handleSaveEdit(p.id)}
                              className="p-1.5 rounded-lg bg-neon-green/10 hover:bg-neon-green/20 text-neon-green border border-neon-green/20 transition-all"
                              title="変更を保存"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEditingPersonId(null)}
                              className="p-1.5 rounded-lg glass-panel-light hover:bg-foreground/5 text-foreground/50 hover:text-foreground border border-foreground/5 transition-all"
                              title="キャンセル"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEditing(p)}
                              className="p-1.5 rounded-lg glass-panel-light hover:bg-foreground/5 text-foreground/45 hover:text-neon-purple border border-foreground/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="プロフィールを編集"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`${p.displayName} さんを本当に削除しますか？`)) {
                                  deletePerson(p.id);
                                  showToast(`${p.displayName} さんを削除しました`);
                                }
                              }}
                              className="p-1.5 rounded-lg glass-panel-light hover:bg-red-500/10 text-foreground/45 hover:text-red-400 border border-foreground/5 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100"
                              title="メンバーを削除"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* ロッカーメモ */}
                    <div className="space-y-1 mb-3.5">
                      <span className="text-[9px] text-foreground/35 font-bold uppercase tracking-wider block">ロッカーメモ</span>
                      {isEditing ? (
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={editMemo}
                            onChange={(e) => setEditMemo(e.target.value)}
                            placeholder="プレイスタイルや特徴メモ..."
                            className="w-full px-2.5 py-1.5 text-xs bg-background/80 border border-neon-green/30 rounded-lg text-foreground focus:outline-none transition-all font-semibold"
                          />
                          <div className="space-y-1">
                            <label className="text-[8px] text-foreground/45 font-bold block">別名タグ (カンマ区切り)</label>
                            <input
                              type="text"
                              value={editAliasesText}
                              onChange={(e) => setEditAliasesText(e.target.value)}
                              placeholder="別名を入力..."
                              className="w-full px-2.5 py-1 text-[10px] bg-background/80 border border-neon-green/30 rounded-lg text-foreground focus:outline-none transition-all font-semibold"
                            />
                          </div>
                        </div>
                      ) : (
                        <p className={`text-xs px-2.5 py-1.5 rounded-xl border border-foreground/5 font-semibold ${
                          p.memo ? 'text-foreground/80 bg-foreground/2' : 'text-foreground/30 bg-foreground/1 italic'
                        }`}>
                          {p.memo || 'メモは未入力です。編集からメモを入力できます 📌'}
                        </p>
                      )}
                    </div>

                    {/* 話したお題の履歴（人物墓地） */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] text-foreground/35 font-bold uppercase tracking-wider block">話したお題の履歴 ({usedCards.length})</span>
                        {usedCards.length > 0 && (
                          <button
                            onClick={() => {
                              if (confirm(`${p.displayName} さんの会話履歴（お題消費履歴）をすべてリセットしますか？\n（これにより、このメンバーに対して一度話したお題が再登場するようになります）`)) {
                                resetPersonUsedCards(p.id);
                                showToast(`${p.displayName} さんの履歴をリセットしました 🔄`);
                              }
                            }}
                            className="flex items-center gap-1 text-[9px] font-black text-neon-green hover:underline cursor-pointer hover:opacity-85 transition-all"
                            title="会話履歴を全消去して再登場させます"
                          >
                            <RotateCcw className="w-2.5 h-2.5" />
                            <span>履歴クリア</span>
                          </button>
                        )}
                      </div>

                      {usedCards.length === 0 ? (
                        <div className="text-[10px] text-foreground/25 font-bold italic px-2.5 py-2 border border-dashed border-foreground/5 rounded-xl bg-foreground/1 select-none">
                          まだこのセッションでお話ししたお題はありません 😴
                        </div>
                      ) : (
                        <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto p-1.5 border border-foreground/5 rounded-xl bg-foreground/2">
                          {usedCards.map((c) => (
                            <div 
                              key={c.id} 
                              className="text-[10px] pl-2 pr-1 py-0.5 bg-background border border-foreground/5 text-foreground/70 rounded-lg flex items-center gap-1 font-semibold group/tag shadow-sm hover:border-red-500/20 transition-colors"
                              title={c.text}
                            >
                              <FileText className="w-2.5 h-2.5 text-neon-purple shrink-0" />
                              <span className="max-w-[120px] truncate">{c.title || c.text}</span>
                              <button
                                onClick={() => handleRemoveSingleCardFromHistory(p.id, c.id)}
                                className="p-0.5 rounded text-foreground/30 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                                title="このお題の履歴を削除"
                              >
                                <X className="w-2.5 h-2.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
