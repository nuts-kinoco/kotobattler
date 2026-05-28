'use client';

import React, { useState, useRef } from 'react';
import { 
  X, Users, UserPlus, Play, Square, Settings, 
  HelpCircle, Sparkles, Filter, Plus, Trash2, Check,
  Moon, Sun, ChevronDown, ChevronUp, RotateCcw, Download, Upload
} from 'lucide-react';
import { Card as CardType, Person, Session, AirSuitability, AirMode } from '../types/deck';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  cards: CardType[];
  persons: Person[];
  session: Session;
  cardDisplayCount: number;
  shortcutEnabled: boolean;
  airModes: AirMode[];
  selectedAirSuitabilities: string[];
  theme: 'dark' | 'light';
  displaySize: 'small' | 'medium' | 'large';
  keepPreviousMembers: boolean;
  operationMode: 'auto' | 'desktop' | 'touch';
  alwaysOpen: boolean;
  setCardDisplayCount: (count: number) => void;
  setShortcutEnabled: (enabled: boolean) => void;
  setSelectedAirSuitabilities: (suitabilities: string[]) => void;
  setOperationMode: (mode: 'auto' | 'desktop' | 'touch') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setKeepPreviousMembers: (keep: boolean) => void;
  setAlwaysOpen: (open: boolean) => void;
  startSession: (personIds: string[]) => void;
  endSession: () => void;
  addPerson: (name: string, aliases: string[], memo?: string) => Person;
  updatePerson: (id: string, displayName: string, aliases: string[], memo?: string) => void;
  deletePerson: (id: string) => void;
  resetPersonUsedCards: (id: string) => void;
  importJSON: (jsonText: string) => boolean;
  exportJSON: () => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  cards,
  persons,
  session,
  cardDisplayCount,
  shortcutEnabled,
  airModes,
  selectedAirSuitabilities,
  theme,
  displaySize,
  keepPreviousMembers,
  operationMode,
  alwaysOpen,
  setCardDisplayCount,
  setShortcutEnabled,
  setSelectedAirSuitabilities,
  setOperationMode,
  setTheme,
  setKeepPreviousMembers,
  setAlwaysOpen,
  startSession,
  endSession,
  addPerson,
  updatePerson,
  deletePerson,
  resetPersonUsedCards,
  importJSON,
  exportJSON
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'settings'>('session');
  
  // JSONバックアップ用ファイルインプット参照
  const fileInputRef = useRef<HTMLInputElement>(null);

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
          alert('すべてのデータを完全復元しました！🦑');
        } else {
          alert('復元に失敗しました。有効なバックアップJSONファイルかご確認ください。');
        }
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  };
  
  // セッション開始用の参加者選択状態
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [isStartingSessionMode, setIsStartingSessionMode] = useState<boolean>(false);

  // 前回のメンバーを自動選択するための同期
  React.useEffect(() => {
    if (keepPreviousMembers && session.activePersonIds.length > 0) {
      setSelectedPersonIds(session.activePersonIds);
    }
  }, [keepPreviousMembers, session.activePersonIds, isStartingSessionMode]);

  // 一時的に候補から非表示にされたメンバーのIDリスト
  const [excludedPersonIds, setExcludedPersonIds] = useState<string[]>([]);

  // セッション開始・終了や画面の切り替え時に非表示リストを自動リセット
  React.useEffect(() => {
    if (session.isActive || !isStartingSessionMode) {
      setExcludedPersonIds([]);
    }
  }, [session.isActive, isStartingSessionMode]);
  
  // 新規人物追加フォーム
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonMemo, setNewPersonMemo] = useState('');

  // インライン人物メモ編集用の一時状態
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');

  // 各メンバーの履歴アコーディオン開閉ステート
  const [expandedPersonIds, setExpandedPersonIds] = useState<Record<string, boolean>>({});

  if (!isOpen) return null;

  const togglePersonExpand = (personId: string) => {
    setExpandedPersonIds(prev => ({
      ...prev,
      [personId]: !prev[personId]
    }));
  };

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const targetName = newPersonName.trim();
    if (!targetName) return;
    
    // 重複チェック: 入力された名前がすでに登録されているか確認
    const existing = persons.find(p => 
      p.displayName.toLowerCase() === targetName.toLowerCase() ||
      p.aliases.some(a => a.toLowerCase() === targetName.toLowerCase())
    );

    if (existing) {
      // すでに登録されている場合は二重作成せず、既存メンバーをセッションへ追加（またはメモ更新）
      if (isStartingSessionMode) {
        if (!selectedPersonIds.includes(existing.id)) {
          setSelectedPersonIds(prev => [...prev, existing.id]);
        }
      }
      
      // 特徴メモが入力されている場合は、既存のロッカーメモをアップデートして人間に優しく
      if (newPersonMemo.trim()) {
        updatePerson(existing.id, existing.displayName, existing.aliases, newPersonMemo.trim());
      }
      
      setNewPersonName('');
      setNewPersonMemo('');
      return;
    }
    
    const added = addPerson(targetName, [], newPersonMemo.trim());
    if (isStartingSessionMode) {
      setSelectedPersonIds(prev => [...prev, added.id]);
    }
    
    setNewPersonName('');
    setNewPersonMemo('');
  };

  const handleStartSession = () => {
    startSession(selectedPersonIds);
    setIsStartingSessionMode(false);
  };

  const startEditingMemo = (person: Person) => {
    setEditingPersonId(person.id);
    setEditingMemo(person.memo || '');
  };

  const saveEditingMemo = (id: string, person: Person) => {
    updatePerson(id, person.displayName, person.aliases, editingMemo.trim());
    setEditingPersonId(null);
  };

  // 空気感の選択肢（マスタデータ）
  const airSuitabilityOptions: (AirSuitability | 'All')[] = ['All', '初動', '普通', '静か', '盛り上がり', '深夜', '疲れ気味'];

  // 複数選択用のハンドラ
  const handleAirSuitabilityToggle = (mode: AirSuitability | 'All') => {
    if (mode === 'All') {
      setSelectedAirSuitabilities(['All']);
    } else {
      let next = [...selectedAirSuitabilities];
      next = next.filter(x => x !== 'All');
      
      if (next.includes(mode)) {
        next = next.filter(x => x !== mode);
      } else {
        next.push(mode);
      }
      
      if (next.length === 0) {
        next = ['All'];
      }
      setSelectedAirSuitabilities(next);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 glass-panel border-l border-foreground/5 shadow-2xl flex flex-col transition-all duration-300">
      {/* ヘッダー */}
      <div className="flex justify-between items-center px-6 py-4 border-b border-foreground/5 bg-slate-900/10">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-neon-green" />
          <h2 className="font-bold text-foreground tracking-wide">コントロールパネル</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-foreground/5 text-foreground/50 hover:text-foreground transition-all"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* タブ選択 */}
      <div className="flex border-b border-foreground/5">
        <button
          onClick={() => setActiveTab('session')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'session'
              ? 'border-neon-green text-neon-green bg-foreground/5'
              : 'border-transparent text-foreground/45 hover:text-foreground/75'
          }`}
        >
          <Users className="w-4 h-4" />
          セッション & メンバー
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-3 text-sm font-semibold tracking-wider transition-all border-b-2 flex items-center justify-center gap-2 ${
            activeTab === 'settings'
              ? 'border-neon-green text-neon-green bg-foreground/5'
              : 'border-transparent text-foreground/45 hover:text-foreground/75'
          }`}
        >
          <Settings className="w-4 h-4" />
          設定 & ショートカット
        </button>
      </div>

      {/* コンテンツエリア */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* === タブ1: セッション & メンバー === */}
        {activeTab === 'session' && (
          <div className="space-y-6">
            
            {/* セッション状況表示 / 開始終了ボタン */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-foreground/40 uppercase tracking-widest font-mono">Session Status</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  session.isActive 
                    ? 'bg-neon-green/10 text-neon-green border border-neon-green/20' 
                    : 'bg-foreground/5 text-foreground/40 border border-foreground/5'
                }`}>
                  {session.isActive ? 'ACTIVE' : 'INACTIVE'}
                </span>
              </div>

              {!session.isActive && !isStartingSessionMode && (
                <button
                  onClick={() => {
                    setIsStartingSessionMode(true);
                    setSelectedPersonIds(keepPreviousMembers ? session.activePersonIds : []);
                  }}
                  className="w-full py-3 bg-neon-green hover:bg-emerald-500 text-background dark:text-slate-950 font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  セッションを開始する
                </button>
              )}

              {isStartingSessionMode && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-foreground/70">参加メンバーを選択 (3〜8名推奨)</h4>
                  {persons.length === 0 ? (
                    <p className="text-xs text-foreground/40 italic">登録されている人物がいません。下のフォームから追加してください。</p>
                  ) : (
                    <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                      {persons
                        .filter(p => !excludedPersonIds.includes(p.id))
                        .map(p => {
                          const isSelected = selectedPersonIds.includes(p.id);
                          return (
                            <label
                              key={p.id}
                              className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border group relative ${
                                isSelected 
                                  ? 'bg-neon-green/10 border-neon-green/20 text-foreground' 
                                  : 'bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10'
                              }`}
                            >
                              <span className="text-sm font-semibold pr-8 truncate">{p.displayName}</span>
                              <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => {
                                    setSelectedPersonIds(prev => 
                                      isSelected ? prev.filter(id => id !== p.id) : [...prev, p.id]
                                    );
                                }}
                                className="hidden"
                              />
                              
                              <div className="flex items-center gap-1.5 shrink-0">
                                {/* 候補からサクッと消すための×ボタン */}
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    // 候補リスト（表示）から一時的に非表示にする
                                    setExcludedPersonIds(prev => [...prev, p.id]);
                                    // 選択状態からも解除する
                                    setSelectedPersonIds(prev => prev.filter(id => id !== p.id));
                                  }}
                                  className="p-1 rounded hover:bg-rose-500/20 text-foreground/20 hover:text-rose-400 opacity-0 group-hover:opacity-100 focus:opacity-100 transition-all z-10"
                                  title="候補リストから一時的に除外"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>

                                {isSelected && <Check className="w-4 h-4 text-neon-green" />}
                              </div>
                            </label>
                          );
                      })}
                    </div>
                  )}

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => setIsStartingSessionMode(false)}
                      className="flex-1 py-2 bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 text-foreground/80 text-xs font-bold rounded-lg transition-all"
                    >
                      キャンセル
                    </button>
                    <button
                      onClick={handleStartSession}
                      className="flex-1 py-2 bg-neon-green hover:bg-emerald-500 text-background dark:text-slate-950 text-xs font-bold rounded-lg transition-all"
                    >
                      セッション開始
                    </button>
                  </div>
                </div>
              )}

              {session.isActive && (
                <div className="space-y-3">
                  <div className="text-xs text-foreground/60 flex flex-col gap-1">
                    <span>👥 参加人数: {session.activePersonIds.length}名</span>
                    <span>🪦 セッション内消費カード: {session.usedCardIds.length}枚</span>
                  </div>
                  <button
                    onClick={endSession}
                    className="w-full py-2.5 bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 text-rose-400 hover:text-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                    セッションを終了する
                  </button>
                </div>
              )}
            </div>

            {/* 空気感フィルター (手軽に変更可能 - 複数選択可) */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-xs text-foreground/50 font-bold uppercase tracking-widest font-mono">
                <Filter className="w-3.5 h-3.5" />
                <span>空気感フィルター (複数選択可)</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {airSuitabilityOptions.map(mode => {
                  const isActive = mode === 'All' 
                    ? (selectedAirSuitabilities.includes('All') || selectedAirSuitabilities.length === 0)
                    : selectedAirSuitabilities.includes(mode);
                  return (
                    <button
                      key={mode}
                      onClick={() => handleAirSuitabilityToggle(mode)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center cursor-pointer ${
                        isActive
                          ? 'bg-neon-green/10 border-neon-green/30 text-neon-green font-bold shadow-sm'
                          : 'bg-foreground/5 border-foreground/5 text-foreground/60 hover:bg-foreground/10'
                      }`}
                    >
                      {mode}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 人物一覧 & インライン編集 */}
            <div className="space-y-3">
              <span className="text-xs text-foreground/50 font-bold uppercase tracking-widest font-mono">メンバーのロッカーメモ</span>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {!session.isActive ? (
                  // セッション外のときは表示を消してすっきり
                  <div className="text-[11px] text-foreground/45 bg-foreground/5 border border-foreground/5 rounded-xl p-3 leading-relaxed text-center font-medium select-none">
                    セッション開始後に、参加メンバーのロッカーメモがここにそっと表示されます。
                  </div>
                ) : (
                  // セッション中のときは参加メンバーだけを表示
                  (() => {
                    const activePersons = persons.filter(p => session.activePersonIds.includes(p.id));
                    if (activePersons.length === 0) {
                      return <p className="text-xs text-foreground/30 italic py-2 text-center">参加メンバーが選択されていません。</p>;
                    }
                    return activePersons.map(p => {
                      return (
                        <div
                          key={p.id}
                          className="p-3 rounded-xl border bg-slate-500/5 dark:bg-slate-900/80 border-neon-green/20 transition-all"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm text-foreground/90">{p.displayName}</span>
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                            </div>
                            <button
                              onClick={() => deletePerson(p.id)}
                              className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-rose-400 transition-all"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          {editingPersonId === p.id ? (
                            <div className="mt-2 space-y-1.5">
                              <textarea
                                value={editingMemo}
                                onChange={(e) => setEditingMemo(e.target.value)}
                                placeholder="メモを入力..."
                                rows={2}
                                className="w-full text-xs bg-background/50 border border-foreground/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-neon-green resize-none"
                              />
                              <div className="flex justify-end gap-1.5">
                                <button
                                  onClick={() => setEditingPersonId(null)}
                                  className="px-2.5 py-1 bg-foreground/5 hover:bg-foreground/10 border border-foreground/5 rounded-md text-[10px] font-bold"
                                >
                                  取消
                                </button>
                                <button
                                  onClick={() => saveEditingMemo(p.id, p)}
                                  className="px-2.5 py-1 bg-neon-green hover:bg-emerald-500 text-background dark:text-slate-950 rounded-md text-[10px] font-bold"
                                >
                                  保存
                                </button>
                              </div>
                            </div>
                          ) : (
                            <p
                              onClick={() => startEditingMemo(p)}
                              className="text-xs text-foreground/50 mt-1.5 cursor-pointer hover:bg-foreground/5 p-1.5 rounded-lg border border-dashed border-transparent hover:border-foreground/10 min-h-[28px] break-all leading-relaxed"
                            >
                              {p.memo ? p.memo : <span className="text-foreground/20 italic">クリックしてメモを追加...</span>}
                            </p>
                          )}
                          
                          <div className="flex justify-between items-center text-[10px] text-foreground/30 mt-2.5 pt-2 border-t border-foreground/5">
                            <span className="flex items-center gap-1">
                              <span>聞かれたお題:</span>
                              <span className="font-bold text-foreground/50">{p.usedCardIds.length}枚</span>
                            </span>

                            <div className="flex items-center gap-1.5">
                              {/* 個別リセットボタン */}
                              {p.usedCardIds.length > 0 && (
                                <button
                                  onClick={() => {
                                    if (confirm(`${p.displayName} さんの会話履歴（人物墓地）のみをリセットします。よろしいですか？`)) {
                                      resetPersonUsedCards(p.id);
                                    }
                                  }}
                                  className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-neon-green transition-all"
                                  title="この人の使用履歴をリセット"
                                >
                                  <RotateCcw className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* アコーディオン開閉ボタン */}
                              {p.usedCardIds.length > 0 && (
                                <button
                                  onClick={() => togglePersonExpand(p.id)}
                                  className="p-1 rounded hover:bg-foreground/5 text-foreground/30 hover:text-foreground transition-all flex items-center gap-0.5"
                                  title={expandedPersonIds[p.id] ? "履歴を閉じる" : "履歴を展開"}
                                >
                                  <span className="text-[9px] font-mono">履歴</span>
                                  {expandedPersonIds[p.id] ? (
                                    <ChevronUp className="w-3.5 h-3.5" />
                                  ) : (
                                    <ChevronDown className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              )}
                            </div>
                          </div>

                          {/* 会話履歴バッジリスト（アコーディオン） */}
                          {expandedPersonIds[p.id] && p.usedCardIds.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-dashed border-foreground/5 flex flex-wrap gap-1 max-h-24 overflow-y-auto animate-fade-in">
                              {p.usedCardIds.map(cardId => {
                                const cardObj = cards.find(c => c.id === cardId);
                                if (!cardObj) return null;
                                const displayTagText = cardObj.title || (cardObj.text.length > 8 ? cardObj.text.substring(0, 7) + '…' : cardObj.text);
                                return (
                                  <span
                                    key={cardId}
                                    className="text-[9px] px-1.5 py-0.5 rounded bg-foreground/5 border border-foreground/5 text-foreground/60 font-medium cursor-help transition-all hover:bg-foreground/10 hover:text-foreground"
                                    title={cardObj.text}
                                  >
                                    {displayTagText}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    });
                  })()
                )}
              </div>
            </div>

            {/* 新規人物追加フォーム */}
            <form onSubmit={handleAddPerson} className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3">
              <div className="flex items-center gap-1.5 text-xs text-foreground/75 font-bold">
                <UserPlus className="w-3.5 h-3.5 text-neon-green" />
                <span>新規メンバーのロッカーを作成</span>
              </div>
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="表示名 (例: ななみ, nanami)"
                  value={newPersonName}
                  onChange={(e) => setNewPersonName(e.target.value)}
                  className="w-full text-xs bg-background/50 border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green"
                />

                {/* すでに登録済みの類似人物の入力サジェスト */}
                {newPersonName.trim() && (() => {
                  const query = newPersonName.trim().toLowerCase();
                  const suggestion = persons.find(p => 
                    p.displayName.toLowerCase().includes(query) || 
                    p.aliases.some(a => a.toLowerCase().includes(query))
                  );
                  if (suggestion) {
                    return (
                      <div className="text-[10px] text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/20 px-2.5 py-2 rounded-lg flex flex-col gap-1.5 animate-fade-in font-semibold">
                        <div className="flex items-center justify-between">
                          <span>💡 すでに「{suggestion.displayName}」さんが登録済みです</span>
                        </div>
                        <div className="flex gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setNewPersonName(suggestion.displayName);
                              setNewPersonMemo(suggestion.memo || '');
                            }}
                            className="px-2 py-1 bg-amber-500/20 hover:bg-amber-500/30 text-amber-800 dark:text-amber-200 text-[9px] font-black rounded transition-all cursor-pointer"
                            title="この登録済みメンバーの情報をフォームに自動適用します"
                          >
                            サジェストを選択 ✍️
                          </button>
                          {isStartingSessionMode && !selectedPersonIds.includes(suggestion.id) && (
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedPersonIds(prev => [...prev, suggestion.id]);
                                setNewPersonName('');
                                setNewPersonMemo('');
                              }}
                              className="px-2 py-1 bg-neon-green/20 hover:bg-neon-green/30 text-neon-green text-[9px] font-black rounded transition-all cursor-pointer"
                              title="このメンバーをアクティブセッションに追加します"
                            >
                              参加に追加 🦑
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}

                <input
                  type="text"
                  placeholder="特徴メモ (例: スシ使い、キレキャリオン好き)"
                  value={newPersonMemo}
                  onChange={(e) => setNewPersonMemo(e.target.value)}
                  className="w-full text-xs bg-background/50 border border-foreground/10 rounded-lg p-2.5 text-foreground focus:outline-none focus:border-neon-green"
                />
                <button
                  type="submit"
                  disabled={!newPersonName.trim()}
                  className="w-full py-2 bg-foreground/5 hover:bg-foreground/10 disabled:opacity-40 disabled:hover:bg-foreground/5 border border-foreground/10 text-foreground text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  メンバーを追加
                </button>
              </div>
            </form>

          </div>
        )}

        {/* === タブ2: 設定 & ショートカット === */}
        {activeTab === 'settings' && (
          <div className="space-y-6">
            
            {/* テーマ切り替え */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3">
              <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                テーマ切り替え
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setTheme('dark')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'dark'
                      ? 'bg-neon-purple/10 border-neon-purple/30 text-neon-purple'
                      : 'bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10'
                  }`}
                >
                  Dark Theme
                </button>
                <button
                  onClick={() => setTheme('light')}
                  className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    theme === 'light'
                      ? 'bg-neon-purple/15 border-neon-purple/35 text-neon-purple'
                      : 'bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10'
                  }`}
                >
                  Light Theme
                </button>
              </div>
            </div>

            {/* 表示枚数設定 */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-foreground/80">
                  {displaySize === 'small' ? '表示カード枚数 (スマホ最大3枚)' : '表示カード枚数'}
                </label>
                <span className="text-sm font-black text-neon-green">{cardDisplayCount}枚</span>
              </div>
              <input
                type="range"
                min="1"
                max={displaySize === 'small' ? 3 : 5}
                step="1"
                value={cardDisplayCount}
                onChange={(e) => setCardDisplayCount(Number(e.target.value))}
                className="w-full h-1 bg-foreground/20 rounded-lg appearance-none cursor-pointer accent-neon-green"
              />
              <div className="flex justify-between text-[9px] text-foreground/30 font-mono">
                <span>1枚</span>
                <span>{displaySize === 'small' ? '3枚' : '5枚'}</span>
              </div>
            </div>

            {/* 前回のメンバーを記憶するトグル */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/90">前回のメンバーを記憶</label>
                  <p className="text-[10px] text-foreground/45">セッション開始時に前回のVC参加者を自動引き継ぎ</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={keepPreviousMembers}
                    onChange={(e) => setKeepPreviousMembers(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-400/20 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 dark:after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green peer-checked:after:bg-background"></div>
                </label>
              </div>
            </div>

            {/* 常時オープンモードトグル */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/90">常時オープンモード (常時表面)</label>
                  <p className="text-[10px] text-foreground/45">山札のカードを常に表向きにして表示します</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={alwaysOpen}
                    onChange={(e) => setAlwaysOpen(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-400/20 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 dark:after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green peer-checked:after:bg-background"></div>
                </label>
              </div>
            </div>

            {/* 操作モード切り替え */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3.5">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/90">操作モード</label>
                <p className="text-[10px] text-foreground/45">ご利用 of 端末や好みに合わせた操作方式</p>
              </div>
              
              <div className="grid grid-cols-3 gap-1 bg-background/50 border border-foreground/5 rounded-xl p-1">
                {(['auto', 'desktop', 'touch'] as const).map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setOperationMode(mode)}
                    className={`py-1.5 px-2 text-[10px] font-black rounded-lg transition-all border uppercase tracking-wider cursor-pointer ${
                      operationMode === mode
                        ? 'bg-neon-purple/10 border-neon-purple/35 text-neon-purple shadow-sm font-bold'
                        : 'bg-transparent border-transparent text-foreground/45 hover:text-foreground/80'
                    }`}
                  >
                    {mode === 'auto' ? 'Auto' : mode === 'desktop' ? 'Key' : 'Touch'}
                  </button>
                ))}
              </div>
            </div>

            {/* キーボード操作トグル & ガイド */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-foreground/90">キーボード操作の有効化</label>
                  <p className="text-[10px] text-foreground/40">VC中の即座の片手ドロー操作</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shortcutEnabled}
                    onChange={(e) => setShortcutEnabled(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-400/20 dark:bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 dark:after:bg-slate-300 after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-neon-green peer-checked:after:bg-background"></div>
                </label>
              </div>

              {/* 操作説明ガイド (モードに応じて動的切り替え) */}
              <div className="space-y-2 pt-2 border-t border-foreground/5">
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono flex items-center gap-1 font-bold">
                  <HelpCircle className="w-3.5 h-3.5 text-neon-green" /> 
                  {operationMode === 'touch' || (operationMode === 'auto' && typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) 
                    ? 'Touch Gesture Guide' 
                    : 'Key Bindings Guide'}
                </span>
                
                {(operationMode === 'touch' || (operationMode === 'auto' && typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches)) ? (
                  // ジェスチャー操作ガイド
                  <div className="space-y-1.5 text-xs text-foreground/60 font-medium">
                    <div className="flex justify-between items-center py-1">
                      <span>カードをめくる / 戻す</span>
                      <span className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-purple font-mono font-bold text-[10px]">タップ</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>「話した！」 (使用済にして交代)</span>
                      <span className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-purple font-mono font-bold text-[10px]">↑ フリック</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>カードをパス</span>
                      <span className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-purple font-mono font-bold text-[10px]">→ フリック</span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>全カードをシャッフルドロー</span>
                      <span className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-purple font-mono font-bold text-[10px]">背景ダブルタップ</span>
                    </div>
                    <div className="text-[10px] text-slate-800 dark:text-neon-purple bg-slate-100 dark:bg-neon-purple/5 border border-slate-200 dark:border-neon-purple/20 rounded-lg p-2.5 leading-relaxed mt-2 shadow-sm dark:shadow-none font-semibold">
                      Touch（フリック）操作モードは、スマートフォンやiPadなどのタブレット、2in1タッチPCで極めて快適に動作しますわ。
                    </div>
                  </div>
                ) : (
                  // キーボード操作ガイド
                  <div className="space-y-1.5 text-xs text-foreground/60 font-medium">
                    <div className="flex justify-between items-center py-1">
                      <span>カードをめくる / 戻す</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-green font-mono">Space</kbd>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>「話した！」 (使用済にして交代)</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-green font-mono">↑ キー</kbd>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>全カードをシャッフルドロー</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-green font-mono">↓ キー</kbd>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span>カードの切り替え (カルーセル)</span>
                      <kbd className="px-2 py-0.5 rounded bg-background border border-foreground/10 text-neon-green font-mono">← / → キー</kbd>
                    </div>
                    <div className="text-[10px] text-slate-800 dark:text-amber-200 bg-slate-100 dark:bg-amber-950/20 border border-slate-200 dark:border-amber-900/30 rounded-lg p-2.5 leading-relaxed mt-2 shadow-sm dark:shadow-none font-semibold">
                      Discordや他アプリと並行して使用する場合は、ショートカットキーが意図せず入力されないようご注意ください。入力フォーム等にフォーカスがある時は自動的に機能が一時停止します。
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* データ消失に関する重要な警告カード */}
            <div className="rounded-2xl p-4 bg-amber-500/10 dark:bg-amber-950/20 border border-amber-500/20 dark:border-amber-900/30 space-y-2">
              <label className="text-xs font-black text-amber-700 dark:text-amber-400 flex items-center gap-1.5 select-none">
                ⚠️ ローカルデータに関する重要なお願い
              </label>
              <p className="text-[10px] text-foreground/80 dark:text-foreground/75 leading-relaxed font-medium">
                本アプリはプライバシー保護のため、すべてのデータがブラウザのローカル（LocalStorage）のみに安全に保存されますわ。
              </p>
              <p className="text-[10px] text-amber-900 dark:text-amber-200 leading-relaxed font-bold">
                そのため、ブラウザの「キャッシュ履歴・Cookieの消去」をおこなわれますと、お題カードやメンバーのメモがすべて完全に消去されてしまいますの。
              </p>
              <p className="text-[10px] text-foreground/70 dark:text-foreground/50 leading-relaxed font-medium">
                大切なおデータを守るため、定期的に「完全保存 (JSON)」からバックアップファイルをPCにダウンロード保存することを強く推奨いたしますわ。
              </p>
            </div>

            {/* 完全フルバックアップ (JSON) エリア */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-foreground/90 flex items-center gap-1.5 select-none">
                  📁 完全フルバックアップ (JSON)
                </label>
                <p className="text-[10px] text-foreground/45 leading-relaxed font-semibold">
                  お題カード、メンバーメモ、会話履歴、現在のセッション、およびUIテーマや操作設定を含む、コトバトラーでの全ての体験情報を一括して完全パック保存・復元できますわ。
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2">
                {/* 完全保存 */}
                <button
                  type="button"
                  onClick={exportJSON}
                  className="py-2.5 px-3 bg-neon-green/10 hover:bg-neon-green/20 border border-neon-green/20 text-neon-green rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="すべての体験情報を一つのJSONファイルとしてPCに保存しますわ"
                >
                  <Download className="w-3.5 h-3.5" />
                  完全保存(JSON)
                </button>

                {/* 完全復元 */}
                <button
                  type="button"
                  onClick={handleJsonUploadClick}
                  className="py-2.5 px-3 bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/20 text-neon-purple rounded-xl text-xs font-black transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                  title="バックアップJSONファイルからすべての状態を完全に復元いたしますわ"
                >
                  <Upload className="w-3.5 h-3.5" />
                  完全復元(JSON)
                </button>
              </div>

              {/* 隠しファイルインプット */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleJsonFileChange}
                accept=".json"
                className="hidden"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
