'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Star, AlertCircle, Users } from 'lucide-react';
import { Card as CardType } from '../types/deck';

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  onToggleFlip: () => void;
  isActive: boolean;
  onClick: () => void;
}

export const Card: React.FC<CardProps> = ({
  card,
  isFlipped,
  onToggleFlip,
  isActive,
  onClick
}) => {
  const renderStars = (count: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < count ? 'text-amber-400 fill-amber-400' : 'text-gray-600/40 dark:text-gray-600'
        }`}
      />
    ));
  };

  return (
    <div
      onClick={isActive ? undefined : onClick}
      className={`relative w-80 h-112 cursor-pointer perspective-1000 ${
        isActive ? 'scale-100 z-10' : 'scale-85 opacity-35 hover:opacity-50 z-0'
      } transition-all duration-300`}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* === カード裏面 (ご主人様よりお預かりした極上切り抜き画像背景) === */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl backface-hidden border border-white/5 dark:border-white/5 shadow-2xl overflow-hidden"
          style={{ 
            transform: 'rotateY(0deg)',
            backgroundImage: "url('/card-back.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* 画像自身の美しさを100%引き出すため、ダミーテキスト等は一切描画せず静寂を保ちます */}
          <div className="w-full h-full bg-black/5 hover:bg-black/0 transition-all duration-300" />
        </div>

        {/* === カード表面 (ガラスモーフィズム＆静寂レイアウト) === */}
        <div
          onClick={isActive ? onToggleFlip : undefined}
          className="absolute inset-0 w-full h-full rounded-3xl backface-hidden glass-card border border-white/10 flex flex-col justify-between p-7 overflow-hidden ink-gradient-purple"
          style={{ transform: 'rotateY(180deg)' }}
        >
          {/* 装飾グラデーションも静かに */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/20 to-background/90 pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* 上部: タイトル・タグ・星評価 */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {card.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/5 text-foreground/60 font-medium"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                {card.airSuitability && (
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-neon-purple/10 border border-neon-purple/20 text-neon-purple font-semibold">
                    {card.airSuitability}
                  </span>
                )}
              </div>

              {card.title && (
                <h3 className="text-base font-bold text-foreground/90 tracking-tight line-clamp-1 border-l border-neon-green pl-2">
                  {card.title}
                </h3>
              )}
            </div>

            {/* 中央: 本文 (ここが主役) */}
            <div className="my-auto py-4 flex items-center justify-center">
              <p className="text-lg font-bold leading-relaxed text-foreground text-center tracking-wide font-sans select-text">
                {card.text}
              </p>
            </div>

            {/* 下部: 星評価・メモなどのサブ情報 */}
            <div className="space-y-4 border-t border-foreground/5 pt-4">
              {card.memo && (
                <p className="text-[10px] text-foreground/50 bg-foreground/5 p-2 rounded-lg leading-relaxed flex items-start gap-1">
                  <AlertCircle className="w-3 h-3 text-neon-green shrink-0 mt-0.5" />
                  <span>{card.memo}</span>
                </p>
              )}

              <div className="flex justify-between items-center text-xs text-foreground/40">
                <div className="flex items-center space-x-1">
                  {renderStars(card.star)}
                </div>
                
                {card.reappearRule === 'once_per_person' && (
                  <span className="flex items-center gap-1 text-[10px] text-neon-green">
                    <Users className="w-3 h-3" /> 人物墓地対象
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* perspective用の追加CSS */}
      <style jsx global>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .preserve-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>
    </div>
  );
};
