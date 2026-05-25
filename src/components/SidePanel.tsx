'use client';

import React, { useState } from 'react';
import { 
  X, Users, UserPlus, Play, Square, Settings, 
  HelpCircle, Sparkles, Filter, Plus, Trash2, Check,
  Moon, Sun, Monitor, Maximize2
} from 'lucide-react';
import { Person, Session, AirSuitability } from '../types/deck';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  persons: Person[];
  session: Session;
  cardDisplayCount: number;
  shortcutEnabled: boolean;
  selectedAirSuitability: AirSuitability | 'All';
  theme: 'dark' | 'light';
  displaySize: 'small' | 'medium' | 'large';
  setCardDisplayCount: (count: number) => void;
  setShortcutEnabled: (enabled: boolean) => void;
  setSelectedAirSuitability: (suitability: AirSuitability | 'All') => void;
  setTheme: (theme: 'dark' | 'light') => void;
  setDisplaySize: (size: 'small' | 'medium' | 'large') => void;
  startSession: (personIds: string[]) => void;
  endSession: () => void;
  addPerson: (name: string, aliases: string[], memo?: string) => Person;
  updatePerson: (id: string, displayName: string, aliases: string[], memo?: string) => void;
  deletePerson: (id: string) => void;
}

export const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  persons,
  session,
  cardDisplayCount,
  shortcutEnabled,
  selectedAirSuitability,
  theme,
  displaySize,
  setCardDisplayCount,
  setShortcutEnabled,
  setSelectedAirSuitability,
  setTheme,
  setDisplaySize,
  startSession,
  endSession,
  addPerson,
  updatePerson,
  deletePerson
}) => {
  const [activeTab, setActiveTab] = useState<'session' | 'settings'>('session');
  
  // セッション開始用の参加者選択状態
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [isStartingSessionMode, setIsStartingSessionMode] = useState<boolean>(false);
  
  // 新規人物追加フォーム
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonMemo, setNewPersonMemo] = useState('');

  // インライン人物メモ編集用の一時状態
  const [editingPersonId, setEditingPersonId] = useState<string | null>(null);
  const [editingMemo, setEditingMemo] = useState('');

  if (!isOpen) return null;

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPersonName.trim()) return;
    
    const added = addPerson(newPersonName.trim(), [], newPersonMemo.trim());
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

  const airModes: (AirSuitability | 'All')[] = ['All', '初動', '普通', '静か', '盛り上がり', '深夜', '疲れ気味'];

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
                    setSelectedPersonIds([]);
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
                      {persons.map(p => {
                        const isSelected = selectedPersonIds.includes(p.id);
                        return (
                          <label
                            key={p.id}
                            className={`flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all border ${
                              isSelected 
                                ? 'bg-neon-green/10 border-neon-green/20 text-foreground' 
                                : 'bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10'
                            }`}
                          >
                            <span className="text-sm font-semibold">{p.displayName}</span>
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
                            {isSelected && <Check className="w-4 h-4 text-neon-green" />}
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

            {/* 空気感フィルター (手軽に変更可能) */}
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-xs text-foreground/50 font-bold uppercase tracking-widest font-mono">
                <Filter className="w-3.5 h-3.5" />
                <span>空気感フィルター</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {airModes.map(mode => (
                  <button
                    key={mode}
                    onClick={() => setSelectedAirSuitability(mode)}
                    className={`py-2 px-1 text-xs font-semibold rounded-lg border transition-all text-center ${
                      selectedAirSuitability === mode
                        ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                        : 'bg-foreground/5 border-foreground/5 text-foreground/60 hover:bg-foreground/10'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

            {/* 人物一覧 & インライン編集 */}
            <div className="space-y-3">
              <span className="text-xs text-foreground/50 font-bold uppercase tracking-widest font-mono">メンバーのロッカーメモ</span>
              
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {persons.length === 0 ? (
                  <p className="text-xs text-foreground/30 italic py-2">まだ誰も登録されていません。</p>
                ) : (
                  persons.map(p => {
                    const isSessionActiveParticipant = session.isActive && session.activePersonIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        className={`p-3 rounded-xl border transition-all ${
                          isSessionActiveParticipant
                            ? 'bg-slate-500/5 dark:bg-slate-900/80 border-neon-green/20'
                            : 'bg-slate-500/5 dark:bg-slate-900/40 border-foreground/5'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-sm text-foreground/90">{p.displayName}</span>
                            {isSessionActiveParticipant && (
                              <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                            )}
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
                        
                        <div className="flex justify-between items-center text-[10px] text-foreground/30 mt-1">
                          <span>聞かれたカード: {p.usedCardIds.length}枚</span>
                        </div>
                      </div>
                    );
                  })
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
            
            {/* ダーク/ライトテーマ切り替え */}
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
                  <Moon className="w-4 h-4" />
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
                  <Sun className="w-4 h-4" />
                  Light Theme
                </button>
              </div>
            </div>

            {/* 表示サイズ切替 (コンパクトモード) */}
            <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3">
              <label className="text-xs font-bold text-foreground/80 flex items-center gap-1.5">
                表示サイズ (コンパクトモード)
              </label>
              <div className="grid grid-cols-3 gap-1">
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => setDisplaySize(size)}
                    className={`py-2 text-[10px] uppercase font-bold rounded-lg border transition-all text-center ${
                      displaySize === size
                        ? 'bg-neon-green/10 border-neon-green/30 text-neon-green'
                        : 'bg-foreground/5 border-transparent text-foreground/60 hover:bg-foreground/10'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-foreground/40 leading-relaxed mt-1">
                Small/Medium (コンパクトモード) ではカードが中央の1枚のみになり、別アプリと横並びしやすくなります。
              </p>
            </div>

            {/* 表示枚数設定 (Largeモード時のみ有効) */}
            {displaySize === 'large' && (
              <div className="glass-panel-light rounded-2xl p-4 border border-foreground/5 space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold text-foreground/80">表示カード枚数 (Large専用)</label>
                  <span className="text-sm font-black text-neon-green">{cardDisplayCount}枚</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={cardDisplayCount}
                  onChange={(e) => setCardDisplayCount(Number(e.target.value))}
                  className="w-full h-1 bg-foreground/20 rounded-lg appearance-none cursor-pointer accent-neon-green"
                />
                <div className="flex justify-between text-[9px] text-foreground/30 font-mono">
                  <span>1枚</span>
                  <span>5枚</span>
                </div>
              </div>
            )}

            {/* キーボードショートカットトグル */}
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

              {/* ショートカット説明 (文言修正: 一般向けに丁寧に) */}
              <div className="space-y-2 pt-2 border-t border-foreground/5">
                <span className="text-[10px] text-foreground/50 uppercase tracking-widest font-mono flex items-center gap-1">
                  <HelpCircle className="w-3.5 h-3.5 text-neon-green" /> Key Bindings
                </span>
                
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
                </div>

                <div className="text-[10px] text-[#1D1D1F] dark:text-amber-300 bg-white dark:bg-amber-950/20 border border-gray-200 dark:border-amber-900/30 rounded-lg p-2.5 leading-relaxed mt-2 shadow-sm dark:shadow-none">
                  Discordや他アプリと並行して使用する場合は、ショートカットキーが意図せず入力されないようご注意ください。入力フォーム等にフォーカスがある時は自動的に機能が一時停止します。
                </div>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
