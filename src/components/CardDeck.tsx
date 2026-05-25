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
}

export const CardDeck: React.FC<CardDeckProps> = ({
  cards,
  activeCardIds,
  activeCardIndex,
  setActiveCardIndex,
  flippedStates,
  onToggleFlip,
  displaySize = 'large',
  onResetUsedCards
}) => {
  const isCompact = displaySize === 'small' || displaySize === 'medium';

  // アプリに表示する対象のカードオブジェクトを順番に取得
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

  if (displayCards.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center glass-panel rounded-3xl p-8 border border-white/5 space-y-5 shadow-2xl relative overflow-hidden bg-gradient-to-b from-indigo-950/20 to-background/90 ${
        isCompact ? 'h-80 w-80 rounded-2xl' : 'h-[400px] w-full max-w-md'
      }`}>
        {/* 背景装飾 */}
        <div className="absolute top-[-30%] right-[-30%] w-60 h-60 rounded-full bg-neon-green/10 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-30%] left-[-30%] w-60 h-60 rounded-full bg-neon-purple/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-neon-green/20 to-emerald-500/10 border border-neon-green/30 flex items-center justify-center shadow-lg transform rotate-6 animate-pulse select-none">
            <span className="text-3xl">🦑🎉</span>
          </div>
          
          <div className="space-y-1.5">
            <h3 className="font-black text-base sm:text-lg text-neon-green tracking-wider uppercase">
              Mission Accomplished!
            </h3>
            <p className="text-sm font-bold text-foreground/90">
              すべてのカードを使い切りました！
            </p>
            <p className="text-[11px] text-foreground/50 leading-relaxed max-w-xs px-2">
              お見事です！お題カードをすべて話し尽くしました。山札を戻して、もう一度楽しい会話を続けましょう！✨
            </p>
          </div>

          {onResetUsedCards && (
            <button
              onClick={onResetUsedCards}
              className="mt-2 px-5 py-3 rounded-2xl bg-neon-green hover:bg-emerald-400 text-background dark:text-slate-950 text-xs font-black tracking-wider transition-all duration-300 shadow-lg hover:shadow-neon-green/20 hover:scale-105 active:scale-95 flex items-center gap-2 border border-neon-green/35"
            >
              <span className="text-sm">🔄</span> 山札を戻してもう一度話す
            </button>
          )}
        </div>
      </div>
    );
  }


  // Small モード (1枚表示)
  if (displaySize === 'small') {
    const card = displayCards[0];
    if (!card) return null;
    const isFlipped = !!flippedStates[card.id];

    return (
      <div className="flex items-center justify-center w-full scale-85 sm:scale-90 transition-all duration-300">
        <AnimatePresence mode="popLayout">
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
            exit={{
              opacity: 0,
              y: card.state === 'used' ? -800 : 0, // 話したなら上、パスなら右へ
              x: card.state === 'used' ? 0 : 500,    // パスなら右へフェードアウト
              scale: 0.85,
              transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }
            }}
          >
            <Card
              card={card}
              isFlipped={isFlipped}
              onToggleFlip={() => onToggleFlip(card.id)}
              isActive={true}
              onClick={() => {}}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Medium モード (2枚表示 - 左右スクロールボタン無しで横並び)
  if (displaySize === 'medium') {
    return (
      <div className="flex flex-row items-center justify-center space-x-4 w-full scale-80 sm:scale-85 md:scale-90 transition-all duration-300 py-2">
        <AnimatePresence mode="popLayout">
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
                exit={{
                  opacity: 0,
                  y: card.state === 'used' ? -800 : 0,
                  x: card.state === 'used' ? 0 : 500,
                  scale: 0.85,
                  transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }
                }}
                className="transition-all duration-300 shrink-0"
              >
                <Card
                  card={card}
                  isFlipped={isFlipped}
                  onToggleFlip={() => onToggleFlip(card.id)}
                  isActive={isActive}
                  onClick={() => setActiveCardIndex(index)}
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
          <AnimatePresence mode="popLayout">
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

              // シャッフル用のアングルゆらぎ
              const shuffleAngle = (index % 2 === 0 ? 1.5 : -1.5) * (1 + (index % 2));

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
                  exit={{
                    opacity: 0,
                    y: card.state === 'used' ? -800 : 0, // 話したなら真上、パスなら右へ
                    x: card.state === 'used' ? 0 : 500,    // パスなら右へスライド
                    scale: 0.85,
                    transition: { duration: 0.35, ease: [0.25, 0.8, 0.25, 1] }
                  }}
                  className={`transition-all duration-500 ease-out transform ${transformClass}`}
                  style={{ zIndex }}
                >
                  <Card
                    card={card}
                    isFlipped={isFlipped}
                    onToggleFlip={() => onToggleFlip(card.id)}
                    isActive={isActive}
                    onClick={() => setActiveCardIndex(index)}
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
