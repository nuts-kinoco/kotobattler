'use client';

import React from 'react';
import { Card as CardType } from '../types/deck';
import { Card } from './Card';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CardDeckProps {
  cards: CardType[];
  activeCardIds: string[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number | ((prev: number) => number)) => void;
  flippedStates: Record<string, boolean>;
  onToggleFlip: (cardId: string) => void;
  displaySize?: 'small' | 'medium' | 'large';
  onResetUsedCards?: () => void;
  opMode?: 'desktop' | 'touch';
  onUseCard?: (cardId: string) => void;
  onSkipCard?: (cardId: string) => void;
  selectedAirSuitabilities?: string[]; // アクティブな空気感フィルターリストを受け取る
  onClearAirFilters?: () => void;      // 空気感フィルターをその場でクリアするアクション
}

export const CardDeck: React.FC<CardDeckProps> = ({
  cards,
  activeCardIds,
  activeCardIndex,
  setActiveCardIndex,
  flippedStates,
  onToggleFlip,
  displaySize = 'large',
  onResetUsedCards,
  opMode = 'desktop',
  onUseCard,
  onSkipCard,
  selectedAirSuitabilities = [],
  onClearAirFilters
}) => {
  const isCompact = displaySize === 'small' || displaySize === 'medium';

  // ── 使用済みexit追跡 ──────────────────────────────────────────────────────
  // AnimatePresence の exit 時に card.state を参照すると React 18 のバッチ処理により
  // 「古い state（unused）」が渡されてしまい exit 方向が横（x:500）になる問題を防ぐ。
  // onUse が呼ばれた瞬間に cardId を記録し、exit 判定に使用する。
  const exitingAsUsedIds = React.useRef<Set<string>>(new Set());

  // アプリに表示する対象 of カードオブジェクトを順番に取得
  const displayCards = activeCardIds
    .map(id => cards.find(c => c.id === id))
    .filter((c): c is CardType => !!c);

  const handlePrev = () => {
    if (displayCards.length === 0) return;
    setActiveCardIndex(prev => (prev > 0 ? prev - 1 : displayCards.length - 1));
  };

  const handleNext = () => {
    if (displayCards.length === 0) return;
    setActiveCardIndex(prev => (prev < displayCards.length - 1 ? prev + 1 : 0));
  };

  // 使用済みexit判定ヘルパー
  const isExitingAsUsed = (cardId: string) => exitingAsUsedIds.current.has(cardId);

  // onUse ラッパー：cardId を使用済みとして記録してから親のコールバックを呼ぶ
  const handleUseCard = (cardId: string) => {
    exitingAsUsedIds.current.add(cardId);
    // exit 完了後にクリーンアップ（メモリリーク防止）
    setTimeout(() => exitingAsUsedIds.current.delete(cardId), 2000);
    onUseCard && onUseCard(cardId);
  };

  if (displayCards.length === 0) {
    // 現在空気感フィルターで絞り込まれている（All以外が指定されている）かを厳密に判定
    const hasActiveAirFilters = selectedAirSuitabilities && 
      selectedAirSuitabilities.length > 0 && 
      !selectedAirSuitabilities.includes('All');

    return (
      <div className={`flex flex-col items-center justify-center glass-panel rounded-3xl p-8 border border-white/5 space-y-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-indigo-950/20 to-background/90 ${
        isCompact ? 'h-80 w-80 rounded-2xl' : 'h-[400px] w-full max-w-md'
      }`}>
        {/* 背景装飾 */}
        <div className="absolute top-[-30%] right-[-30%] w-60 h-60 rounded-full bg-neon-green/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-30%] w-60 h-60 rounded-full bg-neon-purple/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-green/20 to-emerald-500/10 border border-neon-green/30 flex items-center justify-center shadow-lg transform rotate-6 animate-pulse select-none">
            <span className="text-3xl">{hasActiveAirFilters ? '🔍🦑' : '🦑🎉'}</span>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-black text-base sm:text-lg text-neon-green tracking-wider uppercase">
              {hasActiveAirFilters ? 'No Cards Found' : 'Wipeout！'}
            </h3>
            <p className="text-sm font-bold text-foreground/90">
              {hasActiveAirFilters 
                ? '該当する空気感のお題がありません' 
                : 'すべてのカードを使い切りました。イカす！'}
            </p>
            <p className="text-[11px] text-foreground/50 leading-relaxed max-w-xs px-2">
              {hasActiveAirFilters 
                ? `選択中の空気感「${selectedAirSuitabilities.join(', ')}」に一致する未使用カードがありません。フィルターをクリアするか、山札を戻してください。`
                : '山札を戻して、カードをシャッフルします。'}
            </p>
          </div>

          <div className="flex flex-col gap-2.5 w-full max-w-[240px] mt-2">
            {hasActiveAirFilters && onClearAirFilters && (
              <button
                onClick={onClearAirFilters}
                className="px-5 py-3 rounded-2xl bg-neon-purple hover:bg-violet-500 text-foreground text-xs font-black tracking-wider transition-all duration-300 shadow-lg hover:shadow-neon-purple/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-neon-purple/35 cursor-pointer"
              >
                <span>✨</span> 空気感フィルターをクリア
              </button>
            )}

            {onResetUsedCards && (
              <button
                onClick={onResetUsedCards}
                className="px-5 py-3 rounded-2xl bg-neon-green hover:bg-emerald-400 text-background dark:text-slate-950 text-xs font-black tracking-wider transition-all duration-300 shadow-lg hover:shadow-neon-green/20 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 border border-neon-green/35 cursor-pointer"
              >
                <span>🔄</span> 山札を戻してシャッフル！
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Small モード (スマホ幅縦画面) - 1枚表示だけでなく、複数枚を極小スケールダウンで並べる
  if (displaySize === 'small') {
    const count = displayCards.length;
    
    // 表示枚数に応じたスケール値と重なり（ネガティブマージン）の設定
    const scale = count === 1 ? 0.9 : count === 2 ? 0.62 : 0.45;
    const spacingClass = count === 2 ? 'space-x-[-45px]' : 'space-x-[-125px]';

    return (
      <div 
        className={`flex flex-row items-center justify-center ${spacingClass} w-full transition-all duration-300 py-4`}
        style={{ transform: `scale(${scale})`, transformOrigin: 'center' }}
      >
        <AnimatePresence mode="sync">
          {displayCards.map((card, index) => {
            const isFlipped = !!flippedStates[card.id];
            const isActive = index === activeCardIndex;
            
            // 重なり順の制御
            const zIndex = isActive ? 30 : 10 + (index === 0 || index === 2 ? 0 : 5);

            return (
              <motion.div
                key={card.id}
                layout
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ 
                  opacity: 1, 
                  scale: isActive ? 1.05 : 0.95,
                  y: isActive ? -5 : 5,
                  transition: { duration: 0.25 }
                }}
                exit={
                  isExitingAsUsed(card.id)
                    // 使用済みexit: Card.tsx が既にアニメーション済みなので即時消去
                    ? { opacity: 0, transition: { duration: 0 } }
                    // パスexit: 横にスライドアウト
                    : { opacity: 0, x: 500, scale: 0.85, transition: { duration: 0.35 } }
                }
                style={{ zIndex }}
                className="transition-all duration-300 shrink-0"
              >
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onToggleFlip={() => onToggleFlip(card.id)}
                  isActive={isActive}
                  onClick={() => setActiveCardIndex(index)}
                  opMode={opMode}
                  onUse={() => handleUseCard(card.id)}
                  onSkip={() => onSkipCard && onSkipCard(card.id)}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // Medium モード (2枚表示 - 左右スクロールボタン無しで横並び)
  if (displaySize === 'medium') {
    return (
      <div className="flex flex-row items-center justify-center space-x-4 w-full scale-80 sm:scale-85 md:scale-90 transition-all duration-300 py-2">
        <AnimatePresence mode="sync">
          {displayCards.slice(0, 2).map((card, index) => {
            const isFlipped = !!flippedStates[card.id];
            const isActive = index === activeCardIndex;
            
            return (
              <motion.div
                key={card.id}
                layout
                initial={{ 
                  opacity: 0, 
                  scale: 0.95, 
                  y: 20 
                }}
                animate={{ 
                  opacity: 1, 
                  scale: 1,
                  y: 0,
                  transition: {
                    duration: 0.25,
                    ease: "easeOut"
                  }
                }}
                exit={
                  isExitingAsUsed(card.id)
                    ? { opacity: 0, transition: { duration: 0 } }
                    : { opacity: 0, x: 500, scale: 0.85, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } }
                }
                className="transition-all duration-300 shrink-0"
              >
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onToggleFlip={() => onToggleFlip(card.id)}
                  isActive={isActive}
                  onClick={() => setActiveCardIndex(index)}
                  opMode={opMode}
                  onUse={() => handleUseCard(card.id)}
                  onSkip={() => onSkipCard && onSkipCard(card.id)}
                  onPrev={handlePrev}
                  onNext={handleNext}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    );
  }

  // 通常モード (Large) のカルーセル表示
  return (
    <div className="relative w-full flex flex-col items-center justify-center py-6">
      {/* カード並び表示コンテナ */}
      <div className="relative flex items-center justify-center w-full min-h-[500px] overflow-hidden px-12">
        {/* 左ナビゲーションボタン */}
        {displayCards.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 z-20 w-11 h-11 rounded-full glass-panel-light hover:bg-foreground/5 border border-foreground/5 flex items-center justify-center transition-all text-foreground/50 hover:text-foreground"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* カルーセル配置エリア */}
        <div className="flex items-center justify-center space-x-[-80px] w-full max-w-5xl">
          <AnimatePresence mode="sync">
            {displayCards.map((card, index) => {
              const isActive = index === activeCardIndex;
              const isFlipped = !!flippedStates[card.id];

              // 3枚以上の場合のフォーカス効果
              let zIndex = 0;
              let transformClass = '';
              
              if (isActive) {
                zIndex = 20;
                transformClass = 'translate-y-0 scale-100 z-20';
              } else if (index < activeCardIndex) {
                zIndex = 10 - (activeCardIndex - index);
                transformClass = '-translate-x-8 -translate-y-1 scale-95 rotate-[-0.5deg]';
              } else {
                zIndex = 10 - (index - activeCardIndex);
                transformClass = 'translate-x-8 -translate-y-1 scale-95 rotate-[0.5deg]';
              }

              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ 
                    opacity: 0, 
                    scale: 0.95, 
                    y: 20 
                  }}
                  animate={{ 
                    opacity: 1, 
                    scale: isActive ? 1 : 0.95,
                    transition: {
                      duration: 0.25,
                      ease: "easeOut"
                    }
                  }}
                  exit={
                    isExitingAsUsed(card.id)
                      // 使用済みexit: Card.tsx が既にアニメーション済みなので即時消去
                      ? { opacity: 0, transition: { duration: 0 } }
                      // パスexit: 横にスライドアウト
                      : { opacity: 0, x: 500, scale: 0.85, transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] } }
                  }
                  className={`transition-all duration-500 ease-out transform ${transformClass}`}
                  style={{ zIndex }}
                >
                  <Card
                    card={card}
                    isFlipped={isFlipped}
                    onToggleFlip={() => onToggleFlip(card.id)}
                    isActive={isActive}
                    onClick={() => setActiveCardIndex(index)}
                    opMode={opMode}
                    onUse={() => handleUseCard(card.id)}
                    onSkip={() => onSkipCard && onSkipCard(card.id)}
                    onPrev={handlePrev}
                    onNext={handleNext}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 右ナビゲーションボタン */}
        {displayCards.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 z-20 w-11 h-11 rounded-full glass-panel-light hover:bg-foreground/5 border border-foreground/5 flex items-center justify-center transition-all text-foreground/50 hover:text-foreground"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* ドットインジケータ */}
      {displayCards.length > 1 && (
        <div className="flex justify-center space-x-1.5 mt-2">
          {displayCards.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveCardIndex(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeCardIndex
                  ? 'w-5 bg-neon-green'
                  : 'w-1 bg-foreground/20 hover:bg-foreground/45'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};
