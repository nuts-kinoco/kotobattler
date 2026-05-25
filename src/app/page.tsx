'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useDeckState } from '../hooks/useDeckState';
import { useShortcuts } from '../hooks/useShortcuts';
import { CardDeck } from '../components/CardDeck';
import { SidePanel } from '../components/SidePanel';
import { DeckManager } from '../components/DeckManager';
import { 
  Sparkles, Sliders, Keyboard, BookOpen, 
  Flame, Library, RefreshCw, CheckCircle2, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const state = useDeckState();
  
  // アプリモード: 'main' (VCカード画面), 'manage' (カードロッカー管理)
  const [appMode, setAppMode] = useState<'main' | 'manage'>('main');

  // サイドパネルの開閉
  const [isSidePanelOpen, setIsSidePanelOpen] = useState(false);

  // 各カードのめくり状態 (cardId => isFlipped)
  const [flippedStates, setFlippedStates] = useState<Record<string, boolean>>({});

  // トースト通知メッセージ
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // トースト表示用のタイマー管理
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // showToast の定義 (他の関数で使われるため上部に配置)
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
  }, []);

  // ポップアップウィンドウ判定
  const [isPopup, setIsPopup] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsPopup(window.name === 'KotobattlerPopup' || window.opener !== null);
    }
  }, []);

  // 物理リサイズの自動引き戻し固定化ロジック (別窓起動時のみ動作し、手動リサイズを磁石のように弾く)
  useEffect(() => {
    if (!isPopup) return;

    let resizeTimeout: NodeJS.Timeout;

    const handleWindowResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        let targetWidth = 1024;
        let targetHeight = 768;

        if (state.displaySize === 'small') {
          targetWidth = 360;
          targetHeight = 520;
        } else if (state.displaySize === 'medium') {
          targetWidth = 540;
          targetHeight = 700;
        }

        // 手動で境界を動かされて規定サイズとズレた場合、強制的に引き戻す
        if (window.innerWidth !== targetWidth || window.innerHeight !== targetHeight) {
          try {
            window.resizeTo(targetWidth, targetHeight);
          } catch (e) {
            // エラー抑止
          }
        }
      }, 50);
    };

    window.addEventListener('resize', handleWindowResize);
    return () => {
      window.removeEventListener('resize', handleWindowResize);
      clearTimeout(resizeTimeout);
    };
  }, [isPopup, state.displaySize]);

  // 別窓（ポップアップ）で開く (手動サイズ変更を禁止するため resizable=no を指定)
  const openAsPopup = useCallback(() => {
    if (typeof window !== 'undefined') {
      const width = 1024;
      const height = 768;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;
      window.open(
        window.location.href, 
        'KotobattlerPopup', 
        `width=${width},height=${height},left=${left},top=${top},menubar=no,toolbar=no,location=no,status=no,resizable=no`
      );
      showToast('別ウィンドウで起動しました 📐');
    }
  }, [showToast]);

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

  // 物理ウィンドウ変更時のトーストバインド
  const handleSetDisplaySizeWithToast = useCallback((size: 'small' | 'medium' | 'large') => {
    state.setDisplaySize(size);
    const sizeName = size === 'small' ? 'Small (360x520)' : size === 'medium' ? 'Medium (540x700)' : 'Large (1024x768)';
    showToast(`サイズを ${sizeName} に変更しました 📐`);
  }, [state, showToast]);

  const isCompact = state.displaySize === 'small' || state.displaySize === 'medium';
  const isSmall = state.displaySize === 'small';

  return (
    <div className="flex-1 w-full flex flex-col min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
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
                  <h1 className="font-black text-foreground tracking-wide text-xs sm:text-sm">Kotobattler</h1>
                  {!isSmall && (
                    <span className="text-[9px] bg-neon-green/10 text-neon-green font-bold px-1.5 py-0.5 rounded border border-neon-green/20">v0.3</span>
                  )}
                </div>
                {!isSmall && (
                  <div className="flex items-center space-x-1.5 text-[10px] text-foreground/45">
                    <span className="font-semibold text-foreground/75 flex items-center gap-1">
                      <BookOpen className="w-3 h-3 text-neon-purple" /> {state.currentDeck?.name}
                    </span>
                    <span>•</span>
                    <span>残り: {state.drawPool.length}枚</span>
                    {!isPopup && (
                      <>
                        <span>•</span>
                        <span className="text-neon-purple font-semibold">💡 別窓起動で物理サイズ固定が可能</span>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* 中央上部: S / M / L セグメントボタン (別窓起動時のみ表示) */}
            {isPopup ? (
              <div className={`flex items-center rounded-xl bg-foreground/5 p-1 border border-foreground/5 shadow-inner transition-all ${
                isSmall ? 'scale-90' : 'scale-100'
              }`}>
                {(['small', 'medium', 'large'] as const).map(size => (
                  <button
                    key={size}
                    onClick={() => handleSetDisplaySizeWithToast(size)}
                    className={`px-3 py-1 text-[9px] font-black rounded-lg transition-all uppercase ${
                      state.displaySize === size
                        ? 'bg-neon-green text-background dark:text-slate-950 shadow font-extrabold'
                        : 'text-foreground/55 hover:text-foreground hover:bg-foreground/5'
                    }`}
                    title={`${size}サイズに切り替えます`}
                  >
                    {size.charAt(0)}
                  </button>
                ))}
              </div>
            ) : (
              // 全画面タブ時は非表示にしてヘッダーをスッキリ見せる
              <div className="hidden md:flex items-center space-x-1.5 opacity-0 pointer-events-none" />
            )}

            {/* 右側操作ボタン */}
            <div className="flex items-center space-x-1.5">
              {/* 別窓で開くボタン (通常タブ時のみ表示) */}
              {!isPopup && !isSmall && (
                <button
                  onClick={openAsPopup}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-neon-purple/10 hover:bg-neon-purple/20 border border-neon-purple/20 text-neon-purple transition-all shadow-sm"
                  title="物理リサイズが有効な別ウィンドウで開きます"
                >
                  <span className="hidden sm:inline">別窓で起動</span>
                  <span className="inline sm:hidden">別窓</span>
                </button>
              )}

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
                className={`rounded-2xl glass-panel-light hover:bg-foreground/5 border border-foreground/10 disabled:opacity-40 text-foreground/85 hover:text-foreground font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  isCompact ? 'py-3 px-3.5 flex-1' : 'py-3.5 px-4 flex-1 text-sm'
                }`}
                title="すべてのカードを引き直します [↓ キー]"
              >
                <RefreshCw className="w-4 h-4 text-neon-purple shrink-0" />
                {!isCompact && <span>引き直し</span>}
              </button>

              {/* 使った！ (Used) ボタン */}
              <button
                onClick={() => {
                  const activeId = state.activeCardIds[state.activeCardIndex];
                  if (activeId) handleUseCardWrapper(activeId);
                }}
                disabled={state.activeCardIds.length === 0}
                className={`rounded-2xl bg-foreground/5 hover:bg-neon-green/10 border border-foreground/10 hover:border-neon-green/20 disabled:opacity-40 disabled:bg-slate-800 disabled:text-white/20 text-foreground hover:text-neon-green font-black tracking-widest transition-all flex items-center justify-center gap-2 shadow-md ${
                  isCompact ? 'py-3 px-5 flex-[1.2]' : 'py-4 px-6 flex-[1.5] text-sm'
                }`}
                title="会話で使用したカードを消費します [↑ キー]"
              >
                <CheckCircle2 className="w-4 h-4 fill-current shrink-0" />
                {!isCompact ? <span>話した！</span> : <span>話した</span>}
              </button>

              {/* パス (Skip) ボタン */}
              <button
                onClick={() => {
                  const activeId = state.activeCardIds[state.activeCardIndex];
                  if (activeId) handleSkipCardWrapper(activeId);
                }}
                disabled={state.activeCardIds.length === 0}
                className={`rounded-2xl glass-panel-light hover:bg-foreground/5 border border-foreground/10 disabled:opacity-40 text-foreground/85 hover:text-foreground font-bold tracking-wider transition-all flex items-center justify-center gap-2 shadow-md ${
                  isCompact ? 'py-3 px-3.5 flex-1' : 'py-3.5 px-4 flex-1 text-sm'
                }`}
                title="消費せず、このカードをパスします"
              >
                <ChevronRight className="w-4 h-4 text-neon-green shrink-0" />
                {!isCompact && <span>パス</span>}
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
                  {!isCompact && (
                    <>
                      <span className="text-foreground/10">|</span>
                      <span>Space: めくる / ↑: 話した / ↓: 引き直し / ← →: 切り替え</span>
                    </>
                  )}
                </div>
                
                <div className="flex items-center space-x-2">
                  {state.selectedAirSuitability !== 'All' && (
                    <span className="bg-neon-purple/10 border border-neon-purple/20 text-neon-purple text-[9px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                      空気感: {state.selectedAirSuitability}
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
            persons={state.persons}
            session={state.session}
            cardDisplayCount={state.cardDisplayCount}
            shortcutEnabled={state.shortcutEnabled}
            selectedAirSuitability={state.selectedAirSuitability}
            theme={state.theme}
            displaySize={state.displaySize}
            setCardDisplayCount={state.setCardDisplayCount}
            setShortcutEnabled={state.setShortcutEnabled}
            setSelectedAirSuitability={state.setSelectedAirSuitability}
            setTheme={state.setTheme}
            setDisplaySize={handleSetDisplaySizeWithToast}
            startSession={state.startSession}
            endSession={state.endSession}
            addPerson={state.addPerson}
            updatePerson={state.updatePerson}
            deletePerson={state.deletePerson}
          />
        </div>
      ) : (
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
            importJSON={state.importJSON}
            exportJSON={state.exportJSON}
            showToast={showToast}
          />
        </div>
      )}

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
