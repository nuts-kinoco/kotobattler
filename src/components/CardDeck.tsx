'use client';

import React from 'react';
import { Card as CardType } from '../types/deck';
import { Card } from './Card';
import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

interface CardDeckProps {
  cards: CardType[];
  activeCardIds: string[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number | ((prev: number) => number)) => void;
  flippedStates: Record<string, boolean>;
  onToggleFlip: (cardId: string) => void;
  displaySize?: 'small' | 'medium' | 'large';
}

export const CardDeck: React.FC<CardDeckProps> = ({
  cards,
  activeCardIds,
  activeCardIndex,
  setActiveCardIndex,
  flippedStates,
  onToggleFlip,
  displaySize = 'large'
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
      <div className={`flex flex-col items-center justify-center glass-panel rounded-3xl p-8 border border-white/5 space-y-4 ${
        isCompact ? 'h-72 w-72' : 'h-96 w-full'
      }`}>
        <Inbox className="w-8 h-8 text-foreground/30" />
        <div className="text-center space-y-1">
          <h3 className="font-bold text-sm text-foreground/80">対象カードがありません</h3>
          {!isCompact && (
            <p className="text-[11px] text-foreground/40 leading-relaxed">
              他のデッキを選択するか、空気感フィルターを解除、<br />
              またはセッションを開始（再開始）してください。
            </p>
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
        <Card
          card={card}
          isFlipped={isFlipped}
          onToggleFlip={() => onToggleFlip(card.id)}
          isActive={true}
          onClick={() => {}}
        />
      </div>
    );
  }

  // Medium モード (2枚表示 - 左右スクロールボタン無しで横並び)
  if (displaySize === 'medium') {
    return (
      <div className="flex flex-row items-center justify-center space-x-4 w-full scale-80 sm:scale-85 md:scale-90 transition-all duration-300 py-2">
        {displayCards.slice(0, 2).map((card, index) => {
          const isFlipped = !!flippedStates[card.id];
          const isActive = index === activeCardIndex;
          
          return (
            <div key={card.id} className="transition-all duration-300 shrink-0">
              <Card
                card={card}
                isFlipped={isFlipped}
                onToggleFlip={() => onToggleFlip(card.id)}
                isActive={isActive}
                onClick={() => setActiveCardIndex(index)}
              />
            </div>
          );
        })}
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
              transformClass = '-translate-x-8 -translate-y-4 scale-90 rotate-[-1.5deg]';
            } else {
              zIndex = 10 - (index - activeCardIndex);
              transformClass = 'translate-x-8 -translate-y-4 scale-90 rotate-[1.5deg]';
            }

            return (
              <div
                key={card.id}
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
              </div>
            );
          })}
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
