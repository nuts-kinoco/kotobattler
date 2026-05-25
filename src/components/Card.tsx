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

// お題の空気感（AirSuitability）に基づいたダイナミックなカラースキーム定義
const getAirSuitabilityStyles = (suitability?: string) => {
  switch (suitability) {
    case '初動':
      return {
        gradientColor: 'rgba(6, 182, 212, 0.05)', // シアン
        hoverBorder: 'group-hover:border-cyan-400/40 focus-within:border-cyan-400/40',
        borderLeft: 'border-l-2 border-cyan-400 dark:border-cyan-300',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-300',
        glowColor: 'rgba(6, 182, 212, 0.15)'
      };
    case '静か':
      return {
        gradientColor: 'rgba(16, 185, 129, 0.05)', // エメラルド
        hoverBorder: 'group-hover:border-emerald-400/40 focus-within:border-emerald-400/40',
        borderLeft: 'border-l-2 border-emerald-400 dark:border-emerald-300',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300',
        glowColor: 'rgba(16, 185, 129, 0.15)'
      };
    case '盛り上がり':
      return {
        gradientColor: 'rgba(245, 158, 11, 0.06)', // アンバー
        hoverBorder: 'group-hover:border-amber-400/40 focus-within:border-amber-400/40',
        borderLeft: 'border-l-2 border-amber-400 dark:border-amber-300',
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300',
        glowColor: 'rgba(245, 158, 11, 0.15)'
      };
    case '深夜':
      return {
        gradientColor: 'rgba(139, 92, 246, 0.06)', // バイオレット
        hoverBorder: 'group-hover:border-violet-400/40 focus-within:border-violet-400/40',
        borderLeft: 'border-l-2 border-violet-400 dark:border-violet-300',
        badgeBg: 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-300',
        glowColor: 'rgba(139, 92, 246, 0.15)'
      };
    case '疲れ気味':
      return {
        gradientColor: 'rgba(244, 63, 94, 0.06)', // ローズ
        hoverBorder: 'group-hover:border-rose-400/40 focus-within:border-rose-400/40',
        borderLeft: 'border-l-2 border-rose-400 dark:border-rose-300',
        badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300',
        glowColor: 'rgba(244, 63, 94, 0.15)'
      };
    default:
      return {
        gradientColor: 'rgba(148, 163, 184, 0.04)', // スレートグレー
        hoverBorder: 'group-hover:border-slate-400/30 focus-within:border-slate-400/30',
        borderLeft: 'border-l-2 border-slate-400 dark:border-slate-300',
        badgeBg: 'bg-slate-500/10 border-slate-500/20 text-slate-600 dark:text-slate-300',
        glowColor: 'rgba(148, 163, 184, 0.1)'
      };
  }
};

export const Card: React.FC<CardProps> = ({
  card,
  isFlipped,
  onToggleFlip,
  isActive,
  onClick
}) => {
  const styles = getAirSuitabilityStyles(card.airSuitability);

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
      className={`relative w-80 h-112 cursor-pointer perspective-1000 group ${
        isActive ? 'scale-100 z-10' : 'scale-85 opacity-35 hover:opacity-50 z-0'
      } transition-all duration-300`}
    >
      <motion.div
        className="w-full h-full relative preserve-3d"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* === カード裏面 (カード用画像背景) === */}
        <div
          className="absolute inset-0 w-full h-full rounded-3xl backface-hidden border border-white/5 dark:border-white/5 shadow-2xl overflow-hidden animate-ink-wave"
          style={{ 
            transform: 'rotateY(0deg)',
            backgroundImage: "url('/card-back.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }}
        >
          {/* 画像自身の美しさを引き出すための極小フィルタ */}
          <div className="w-full h-full bg-black/5 hover:bg-black/0 transition-all duration-300" />
        </div>

        {/* === カード表面 (ガラスモーフィズム ＆ 空気感連動グラデーション) === */}
        <div
          onClick={isActive ? onToggleFlip : undefined}
          className={`absolute inset-0 w-full h-full rounded-3xl backface-hidden glass-card border border-white/10 dark:border-white/5 flex flex-col justify-between p-7 overflow-hidden transition-all duration-300 ${
            isActive ? styles.hoverBorder : 'border-white/5'
          }`}
          style={{ 
            transform: 'rotateY(180deg)',
            // 動的インク滲みグラデーションを背景に注入
            background: `radial-gradient(circle at top right, ${styles.gradientColor}, transparent 75%), var(--card-bg)`,
            boxShadow: isActive ? `0 15px 45px -10px ${styles.glowColor}` : undefined
          }}
        >
          {/* 装飾グラデーションも空気感に調和 */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/10 to-background/90 pointer-events-none z-0" />
          
          <div className="relative z-10 flex flex-col h-full justify-between">
            {/* 上部: タイトル・タグ・星評価 */}
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div className="flex flex-wrap gap-1.5 max-w-[70%]">
                  {card.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-foreground/5 border border-foreground/5 text-foreground/60 font-semibold"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
                
                {card.airSuitability && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-md border font-black tracking-wider shadow-sm transition-all duration-300 ${styles.badgeBg}`}>
                    {card.airSuitability}
                  </span>
                )}
              </div>

              {card.title && (
                <h3 className={`text-base font-black text-foreground/90 tracking-tight line-clamp-1 pl-2 transition-all duration-300 ${styles.borderLeft}`}>
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
                  <AlertCircle className={`w-3.5 h-3.5 shrink-0 mt-0.5 ${
                    card.airSuitability === '盛り上がり' ? 'text-amber-400' :
                    card.airSuitability === '初動' ? 'text-cyan-400' :
                    card.airSuitability === '静か' ? 'text-emerald-400' :
                    card.airSuitability === '深夜' ? 'text-violet-400' :
                    card.airSuitability === '疲れ気味' ? 'text-rose-400' : 'text-slate-400'
                  }`} />
                  <span>{card.memo}</span>
                </p>
              )}

              <div className="flex justify-between items-center text-xs text-foreground/40">
                <div className="flex items-center space-x-1">
                  {renderStars(card.star)}
                </div>
                
                {card.reappearRule === 'once_per_person' && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-neon-green">
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
