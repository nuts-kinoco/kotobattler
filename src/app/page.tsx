'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDeckState } from '../hooks/useDeckState';
import { useShortcuts } from '../hooks/useShortcuts';
import { CardDeck } from '../components/CardDeck';
import { SidePanel } from '../components/SidePanel';
import { DeckManager } from '../components/DeckManager';
import { MemberManager } from '../components/MemberManager';
import { 
  Keyboard, BookOpen, Library, RefreshCw, CheckCircle2, ChevronRight, Sliders, Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const state = useDeckState();

  // トースト通知メッセージ
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // showToast の定義
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // トースト表示用のタイマー管理
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);
  
  // ダブルタップでのシャッフル判定ロジック（デスクトップ/マウス環境専用として安全に調律）
  const lastTapRef = React.useRef(0);
  const handleBackgroundDoubleTap = useCallback((e: React.MouseEvent) => {
    // タッチデバイス（Touchモード）の時は誤動作防止のため背景ダブルタップをバイパス
    if (state.activeOpMode === 'touch') {
      return;
    }

    const target = e.target as HTMLElement;
    if (
      target.tagName === 'BUTTON' || 
      target.tagName === 'INPUT' || 
      target.tagName === 'SELECT' ||
      target.tagName === 'A' ||
      target.closest('.glass-card') || 
      target.closest('header') || 
      target.closest('footer') ||
      target.closest('.glass-panel')
    ) {
      return;
    }

    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (now - lastTapRef.current < DOUBLE_PRESS_DELAY) {
      if (state.activeCardIds.length > 0) {
        state.shuffleAll();
        showToast('カードを引き直しました 🦑🔁');
      }
    }
    lastTapRef.current = now;
  }, [state, showToast]);

  // 初回ジェスチャーヒントを自動消去
  useEffect(() => {
    if (state.activeOpMode === 'touch' && !state.hasSeenGestureHint) {
      const timer = setTimeout(() => {
        state.setHasSeenGestureHint(true);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [state.activeOpMode, state.hasSeenGestureHint, state.setHasSeenGestureHint]);

  // アプリモード: 'main' (VCカード画面), 'manage' (カード管理画面), 'members' (メンバー整理画面)
  const [appMode, setAppMode] = useState<'main' | 'manage' | 'members'>('main');

  // サイドパネルの開閉
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // 各カードのめくり状態 (cardId => isFlipped)
  const [flippedStates, setFlippedStates] = useState<Record<string, boolean>>({});

  const [activeMemoPersonId, setActiveMemoPersonId] = useState<string | null>(null);
  const [quickMemoText, setQuickMemoText] = useState<string>('');

  const handleSaveQuickMemo = useCallback((personId: string, person: any) => {
    state.updatePerson(personId, person.displayName, person.aliases || [], quickMemoText.trim());
    setActiveMemoPersonId(null);
    showToast(`${person.displayName} さんのメモを更新しました 🦑`);
  }, [state, quickMemoText, showToast]);

  // カードのフリップ切り替え
  const handleToggleFlip = useCallback((cardId: string) => {
    setFlippedStates(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  }, []);

  // 現在アクティブなカードをめくる (ショートカット用)
  const handleToggleActiveCardFlip = useCallback(() => {
    const activeId = state.activeCardIds[state.activeCardIndex];
    if (activeId) {
      handleToggleFlip(activeId);
    }
  }, [state.activeCardIds, state.activeCardIndex, handleToggleFlip]);

  // カード「使用(Used)」処理のラップ
  const handleUseCardWrapper = useCallback((cardId: string) => {
    setFlippedStates(prev => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    state.useCard(cardId);
  }, [state]);

  // カード「スキップ(Skip)」処理のラップ
  const handleSkipCardWrapper = useCallback((cardId: string) => {
    setFlippedStates(prev => {
      const next = { ...prev };
      delete next[cardId];
      return next;
    });
    state.skipCard(cardId);
  }, [state]);

  // 山札リセットとシャッフル通知のラッパー
  const handleResetUsedCards = useCallback(() => {
    state.resetUsedCards();
    showToast('山札を戻して、カードをシャッフルしました！🦑🔁');
  }, [state, showToast]);

  // キーボードショートカットのバインド
  useShortcuts({
    enabled: state.shortcutEnabled && appMode === 'main',
    activeCardIds: state.activeCardIds,
    activeCardIndex: state.activeCardIndex,
    setActiveCardIndex: state.setActiveCardIndex,
    onUseCard: handleUseCardWrapper,
    onSkipCard: handleSkipCardWrapper,
    onShuffleAll: state.shuffleAll,
    onToggleFlip: handleToggleActiveCardFlip,
    showToast
  });

  // アクティブカードが変わったらフリップ状態を自動リセット
  useEffect(() => {
    setFlippedStates({});
  }, [state.activeCardIds, state.currentDeckId]);

  const isCompact = state.displaySize === 'small' || state.displaySize === 'medium';
  const isSmall = state.displaySize === 'small';

  return (
    <div 
      onMouseDown={handleBackgroundDoubleTap}
      className="flex-1 w-full flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300"
    >
      {/* 背景装飾ネオンの光 (パステル調の超低不透明度) */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-neon-purple/2 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-neon-green/1 blur-[130px] pointer-events-none" />

      {appMode === 'main' ? (
        // ==================== VC中メインカード表示画面 ====================
        <div className={`flex-1 flex flex-col justify-between transition-all duration-300 ${
          isSmall ? 'p-3' : isCompact ? 'p-4' : 'p-6'
        }`}>
          
          {/* 上部: 情報バー */}
          <header className={`flex justify-between items-center glass-panel rounded-2xl shadow-md shrink-0 transition-all duration-300 ${
            isSmall ? 'px-3 py-2.5 rounded-xl' : 'px-6 py-4'
          }`}>
            <div className="flex items-center space-x-3">
              <div className={`rounded-xl bg-gradient-to-tr from-neon-purple/20 to-indigo-900/30 border border-foreground/5 flex items-center justify-center shadow select-none transition-all duration-300 ${
                isSmall ? 'w-7 h-7 text-xs' : 'w-9 h-9 text-base'
              }`}>
                <span>🦑</span>
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h1 className="font-black text-foreground tracking-wide text-xs sm:text-sm text-neon-green">Kotobattler</h1>
                  {!isSmall && (
                    <span className="text-[9px] bg-neon-green/10 text-neon-green font-bold px-1.5 py-0.5 rounded border border-neon-green/20">v0.1</span>
                  )}
                </div>
                {!isSmall && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-foreground/45">
                    <span className="font-semibold text-foreground/75 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-neon-purple" /> {state.currentDeck?.name}
                    </span>
                    <span>•</span>
                    <span>残り: {state.drawPool.length}枚</span>
                  </div>
                )}
              </div>
            </div>

            {/* 右側操作ボタン */}
            <div className="flex items-center space-x-1.5">
              {!isSmall && (
                <button
                  onClick={() => setAppMode('manage')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl glass-panel-light hover:bg-foreground/5 text-foreground/80 border border-foreground/5 transition-all"
                  title="カード管理画面を開きます"
                >
                  <Library className="w-3.5 h-3.5 text-neon-purple" />
                  <span className="hidden sm:inline">ロッカー</span>
                </button>
              )}
              
              {!isSmall && (
                <button
                  onClick={() => setAppMode('members')}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl glass-panel-light hover:bg-foreground/5 text-foreground/80 border border-foreground/5 transition-all"
                  title="メンバー整理ロッカーを開きます"
                >
                  <Users className="w-3.5 h-3.5 text-neon-green" />
                  <span className="hidden sm:inline">メンバー</span>
                </button>
              )}
              
              <button
                onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  isSidePanelOpen 
                    ? 'bg-neon-green text-background dark:text-slate-950 border-neon-green font-extrabold shadow-md' 
                    : 'glass-panel-light hover:bg-foreground/5 text-foreground/80 border-foreground/5'
                }`}
              >
                <Sliders className="w-3.5 h-3.5" />
                {!isCompact && <span>設定</span>}
              </button>
            </div>
          </header>

          {/* === 露出UI: 空気感クイックトグルバー === */}
          <div className="mt-3 px-4 py-2.5 bg-foreground/5 border border-foreground/5 rounded-2xl flex flex-wrap items-center gap-2 shrink-0 select-none animate-fade-in">
            <span className="text-[10px] text-foreground/35 font-bold uppercase tracking-widest font-mono mr-1.5 flex items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-neon-purple shrink-0" />
              Mood:
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              {state.airModes.map(mode => {
                const isActive = state.selectedAirSuitabilities.includes(mode.name);
                return (
                  <button
                    key={mode.id}
                    onClick={() => state.toggleAirSuitability(mode.name)}
                    className={`px-3 py-1 text-xs font-bold rounded-xl transition-all border shrink-0 cursor-pointer ${
                      isActive
                        ? 'bg-neon-purple/10 border-neon-purple/35 text-neon-purple font-extrabold shadow-sm shadow-neon-purple/5'
                        : 'glass-panel-light hover:bg-foreground/5 text-foreground/60 hover:text-foreground border-foreground/5'
                    }`}
                  >
                    <span>{mode.name}</span>
                  </button>
                );
              })}
              {state.selectedAirSuitabilities.length > 0 && (
                <button
                  onClick={() => state.setSelectedAirSuitabilities([])}
                  className="px-2 py-1 text-[10px] font-bold text-foreground/45 hover:text-foreground hover:underline transition-all cursor-pointer"
                >
                  クリア
                </button>
              )}
            </div>
          </div>

          {/* === アクティブなVC参加メンバー ＆ 空気メモポップオーバー === */}
          {state.session.isActive && state.session.activePersonIds.length > 0 && (
            <div className="mt-3 px-4 py-2 bg-foreground/5 border border-foreground/5 rounded-2xl flex flex-wrap items-center gap-2 shrink-0 select-none animate-fade-in">
              <span className="text-[10px] text-foreground/35 font-bold uppercase tracking-widest font-mono mr-1.5 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-neon-green animate-pulse" />
                Active VC:
              </span>
              <div className="flex flex-wrap items-center gap-1.5">
                {state.persons
                  .filter(p => state.session.activePersonIds.includes(p.id))
                  .map(p => {
                    const isEditing = activeMemoPersonId === p.id;
                    return (
                      <div key={p.id} className="relative">
                        {/* メンバー名バッジ */}
                        <button
                          onClick={() => {
                            if (activeMemoPersonId === p.id) {
                              setActiveMemoPersonId(null);
                            } else {
                              setActiveMemoPersonId(p.id);
                              setQuickMemoText(p.memo || '');
                            }
                          }}
                          className={`px-2.5 py-1 text-xs font-bold rounded-xl transition-all border flex items-center gap-1.5 ${
                            isEditing
                              ? 'bg-neon-green/10 border-neon-green/35 text-neon-green font-extrabold shadow-sm'
                              : 'glass-panel-light hover:bg-foreground/5 text-foreground/75 hover:text-foreground border-foreground/5'
                          }`}
                          title={`${p.displayName} さんのロッカーメモを編集`}
                        >
                          <span className="text-xs">👤</span>
                          <span>{p.displayName}</span>
                          {p.memo && (
                            <span className="w-1.5 h-1.5 rounded-full bg-neon-green" />
                          )}
                        </button>

                        {/* 空気メモポップオーバー (極小フローティング) */}
                        {isEditing && (
                          <div className="absolute top-8 left-0 z-40 w-52 p-2.5 rounded-xl glass-panel border border-neon-green/30 shadow-xl space-y-1.5 animate-fade-in">
                            <div className="flex justify-between items-center text-[9px] text-foreground/45 font-bold">
                              <span>✍️ {p.displayName} さんの空気メモ</span>
                            </div>
                            <input
                              type="text"
                              value={quickMemoText}
                              onChange={(e) => setQuickMemoText(e.target.value)}
                              onBlur={() => handleSaveQuickMemo(p.id, p)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleSaveQuickMemo(p.id, p);
                                } else if (e.key === 'Escape') {
                                  setActiveMemoPersonId(null);
                                }
                              }}
                              placeholder="スシ使い、夜型、など..."
                              autoFocus
                              className="w-full text-xs bg-background/80 border border-foreground/10 rounded-lg p-2 text-foreground focus:outline-none focus:border-neon-green"
                            />
                            <div className="flex justify-between items-center text-[8px] text-foreground/30 leading-none">
                              <span>[Enter] / 枠外クリックで保存</span>
                              <button
                                onMouseDown={() => handleSaveQuickMemo(p.id, p)}
                                className="text-[9px] font-black text-neon-green hover:underline"
                              >
                                保存
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* === データ破損・不整合検知時の安全な復元バナー === */}
          {state.isDataCorrupted && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 shrink-0"
            >
              <div className="flex items-start gap-2.5 text-xs text-amber-200 leading-relaxed font-semibold">
                <span className="text-xl shrink-0 mt-0.5 select-none">⚠️</span>
                <div>
                  <p className="font-bold text-sm text-amber-300">保存データ読み込みの不整合を検出しました</p>
                  <p className="text-[11px] text-foreground/60 mt-0.5 leading-relaxed">
                    ブラウザに保存されていたデータに不整合（パースの失敗等）を検出したため、安全のために初期のスターターデータを読み込みました。バックアップファイル（JSON）をお持ちの場合は、ロッカー画面からデータを完全に復元できます。
                  </p>
                </div>
              </div>
              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                <button
                  onClick={() => {
                    if (confirm('ロッカーの全データを完全に初期状態（スターターデッキ）に戻します。よろしいですか？')) {
                      state.resetAllData();
                      showToast('データを初期スターター状態にリセットしました 🦑');
                    }
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-background dark:text-slate-950 text-[10px] font-black transition-all shadow-md"
                >
                  初期状態にリセット
                </button>
                <button
                  onClick={() => {
                    setAppMode('manage');
                    state.setIsDataCorrupted(false);
                  }}
                  className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-950 hover:bg-slate-900 border border-amber-500/35 text-amber-400 text-[10px] font-extrabold transition-all"
                >
                  ロッカーで完全復元
                </button>
              </div>
            </motion.div>
          )}

          {/* 中央: カードデッキ (主役) */}
          <main className="flex-1 flex items-center justify-center my-auto min-h-0">
            <CardDeck
              cards={state.cards}
              activeCardIds={state.activeCardIds}
              activeCardIndex={state.activeCardIndex}
              setActiveCardIndex={state.setActiveCardIndex}
              flippedStates={flippedStates}
              onToggleFlip={handleToggleFlip}
              displaySize={state.displaySize}
              onResetUsedCards={handleResetUsedCards}
              opMode={state.activeOpMode}
              onUseCard={handleUseCardWrapper}
              onSkipCard={handleSkipCardWrapper}
            />
          </main>

          {/* 下部: 操作パネル & ショートカットステータス */}
          <footer className="flex flex-col items-center space-y-4 shrink-0">
            
            {/* メインアクションボタン */}
            <div className={`flex items-center justify-center space-x-3.5 w-full ${
              isCompact ? 'max-w-xs' : 'max-w-lg'
            }`}>
              
              {/* シャッフル (引き直し) ボタン */}
              <button
                onClick={state.shuffleAll}
                disabled={state.activeCardIds.length === 0}
                className={`rounded-2xl glass-panel-light hover:bg-foreground/5 border border-foreground/10 disabled:opacity-40 text-foreground/85 hover:text-foreground font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md whitespace-nowrap ${
                  isCompact ? 'py-3 px-3.5 flex-1' : 'py-3.5 px-4 flex-1 text-sm'
                }`}
                title="すべてのカードを引き直します [↓ キー]"
              >
                <RefreshCw className="w-4 h-4 text-neon-purple shrink-0" />
                {!isCompact && <span className="whitespace-nowrap">引き直し</span>}
              </button>

              {/* 使った！ (Used) ボタン */}
              <button
                onClick={() => {
                  const activeId = state.activeCardIds[state.activeCardIndex];
                  if (activeId) handleUseCardWrapper(activeId);
                }}
                disabled={state.activeCardIds.length === 0}
                className={`rounded-2xl bg-foreground/5 hover:bg-neon-green/10 border border-foreground/10 hover:border-neon-green/20 disabled:opacity-40 disabled:bg-slate-800 disabled:text-white/20 text-foreground hover:text-neon-green font-black tracking-widest transition-all flex items-center justify-center gap-2 shadow-md whitespace-nowrap ${
                  isCompact ? 'py-3 px-5 flex-[1.2]' : 'py-4 px-6 flex-[1.5] text-sm'
                }`}
                title="会話で使用したカードを消費します [↑ キー]"
              >
                <CheckCircle2 className="w-4 h-4 fill-current shrink-0" />
                {!isCompact && <span className="whitespace-nowrap">話した！</span>}
              </button>

              {/* パス (Skip) ボタン */}
              <button
                onClick={() => {
                  const activeId = state.activeCardIds[state.activeCardIndex];
                  if (activeId) handleSkipCardWrapper(activeId);
                }}
                disabled={state.activeCardIds.length === 0}
                className={`rounded-2xl glass-panel-light hover:bg-foreground/5 border border-foreground/10 disabled:opacity-40 text-foreground/85 hover:text-foreground font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md whitespace-nowrap ${
                  isCompact ? 'py-3 px-3.5 flex-1' : 'py-3.5 px-4 flex-1 text-sm'
                }`}
                title="消費せず、このカードをパスします"
              >
                <ChevronRight className="w-4 h-4 text-neon-green shrink-0" />
                {!isCompact && <span className="whitespace-nowrap">パス</span>}
              </button>
              
            </div>

            {/* ボトムバー: 操作ガイド・トグル */}
            <div className={`flex flex-col items-center gap-2.5 w-full max-w-4xl border-t border-foreground/5 pt-3.5 px-4 ${
              isSmall ? 'hidden' : ''
            }`}>
              <div className="flex items-center justify-between w-full text-xs text-foreground/30">
                <div className="flex items-center space-x-2">
                  <Keyboard className={`w-3.5 h-3.5 ${state.shortcutEnabled ? 'text-neon-green' : 'text-foreground/20'}`} />
                  <span className="font-semibold text-foreground/50">
                    {state.shortcutEnabled ? '片手操作ON' : '操作OFF'}
                  </span>
                  {state.shortcutEnabled && (
                    <>
                      <span className="text-foreground/10">|</span>
                      <span className="text-[10px] text-foreground/45 whitespace-nowrap">
                        {isCompact ? 'Space:めくる / ↑:話す / ↓:シャッフル' : 'Space: めくる / ↑: 話した / ↓: 引き直し / ← →: 切り替え'}
                      </span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {state.selectedAirSuitabilities.length > 0 && (
                    <span className="bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      空気感: {state.selectedAirSuitabilities.join(', ')}
                    </span>
                  )}
                  <span>表示: {state.cardDisplayCount}枚</span>
                </div>
              </div>

              {/* クレジット表示 */}
              <div className="text-[9px] text-foreground/20 select-text tracking-wider">
                Powered by なつきのこ(<a href="https://x.com/natsukino_co" target="_blank" rel="noopener noreferrer" className="hover:text-neon-green hover:underline text-foreground/45 transition-all font-bold">@natsukino_co</a>)
              </div>
            </div>
          </footer>

          {/* スライドインサイドパネル */}
          <SidePanel
            isOpen={isSidePanelOpen}
            onClose={() => setIsSidePanelOpen(false)}
            cards={state.cards}
            persons={state.persons}
            session={state.session}
            cardDisplayCount={state.cardDisplayCount}
            shortcutEnabled={state.shortcutEnabled}
            airModes={state.airModes}
            selectedAirSuitabilities={state.selectedAirSuitabilities}
            theme={state.theme}
            displaySize={state.displaySize}
            keepPreviousMembers={state.keepPreviousMembers}
            operationMode={state.operationMode}
            setCardDisplayCount={state.setCardDisplayCount}
            setShortcutEnabled={state.setShortcutEnabled}
            setSelectedAirSuitabilities={state.setSelectedAirSuitabilities}
            setOperationMode={state.setOperationMode}
            setTheme={state.setTheme}
            setKeepPreviousMembers={state.setKeepPreviousMembers}
            startSession={state.startSession}
            endSession={state.endSession}
            addPerson={state.addPerson}
            updatePerson={state.updatePerson}
            deletePerson={state.deletePerson}
            resetPersonUsedCards={state.resetPersonUsedCards}
            importJSON={state.importJSON}
            exportJSON={state.exportJSON}
          />
        </div>
      ) : appMode === 'manage' ? (
        // ==================== カードロッカー管理画面 ====================
        <div className="flex-1 flex overflow-hidden">
          <DeckManager
            cards={state.cards}
            decks={state.decks}
            currentDeckId={state.currentDeckId}
            setCurrentDeckId={state.setCurrentDeckId}
            onBackToApp={() => setAppMode('main')}
            addCard={state.addCard}
            updateCard={state.updateCard}
            deleteCard={state.deleteCard}
            toggleCardSealed={state.toggleCardSealed}
            importCSV={state.importCSV}
            downloadCSV={state.downloadCSV}
            airModes={state.airModes}
            showToast={showToast}
          />
        </div>
      ) : (
        // ==================== メンバー整理ロッカー画面 ====================
        <div className="flex-1 flex overflow-hidden">
          <MemberManager
            cards={state.cards}
            persons={state.persons}
            onBackToApp={() => setAppMode('main')}
            addPerson={state.addPerson}
            updatePerson={state.updatePerson}
            deletePerson={state.deletePerson}
            resetPersonUsedCards={state.resetPersonUsedCards}
            removePersonUsedCard={state.removePersonUsedCard}
            showToast={showToast}
          />
        </div>
      )}

      {/* === 初回ジェスチャー操作ガイド (Touchモードかつ未確認時) === */}
      <AnimatePresence>
        {!state.hasSeenGestureHint && state.activeOpMode === 'touch' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 pointer-events-none select-none"
          >
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="glass-panel p-6 rounded-3xl border border-neon-purple/35 text-center space-y-4 max-w-xs shadow-2xl"
            >
              <div className="w-12 h-12 rounded-2xl bg-neon-purple/20 border border-neon-purple/30 flex items-center justify-center mx-auto text-xl animate-bounce">
                <span>👆</span>
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-sm text-neon-purple tracking-wide">Touch Gesture Active</h4>
                <p className="text-[11px] text-foreground/80 leading-relaxed font-semibold">
                  カードを直接指でドラッグして仕分けられます
                </p>
                <div className="text-[10px] text-foreground/50 bg-slate-950/10 p-2.5 rounded-xl border border-white/5 space-y-1 text-left font-mono">
                  <p>↑ フリック : 話した！</p>
                  <p>→ フリック : パス</p>
                  <p>背景ダブルタップ : 引き直し</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* === トースト通知 === */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-2xl glass-panel border border-neon-green/20 text-[10px] font-black text-foreground/90 shadow-xl flex items-center gap-2 select-none"
          >
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
