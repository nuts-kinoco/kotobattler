'use client';

import React from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { Star, AlertCircle, Users } from 'lucide-react';
import { Card as CardType } from '../types/deck';

interface CardProps {
  card: CardType;
  isFlipped: boolean;
  onToggleFlip: () => void;
  isActive: boolean;
  onClick: () => void;
  opMode?: 'desktop' | 'touch';
  onUse?: () => void;
  onSkip?: () => void;
  onPrev?: () => void;
  onNext?: () => void;
}

// お題の空気感（AirSuitability）に基づいたダイナミックなカラースキーム定義
const getAirSuitabilityStyles = (suitability?: string) => {
  switch (suitability) {
    case 'はじめまして':
      return {
        gradientColor: 'rgba(6, 182, 212, 0.05)',
        hoverBorder: 'group-hover:border-cyan-400/40 focus-within:border-cyan-400/40',
        borderLeft: 'border-l-2 border-cyan-400 dark:border-cyan-300',
        badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-600 dark:text-cyan-300',
        glowColor: 'rgba(6, 182, 212, 0.15)'
      };
    case '静か':
      return {
        gradientColor: 'rgba(16, 185, 129, 0.05)',
        hoverBorder: 'group-hover:border-emerald-400/40 focus-within:border-emerald-400/40',
        borderLeft: 'border-l-2 border-emerald-400 dark:border-emerald-300',
        badgeBg: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-300',
        glowColor: 'rgba(16, 185, 129, 0.15)'
      };
    case '盛り上がり':
      return {
        gradientColor: 'rgba(245, 158, 11, 0.06)',
        hoverBorder: 'group-hover:border-amber-400/40 focus-within:border-amber-400/40',
        borderLeft: 'border-l-2 border-amber-400 dark:border-amber-300',
        badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-300',
        glowColor: 'rgba(245, 158, 11, 0.15)'
      };
    case '深夜帯':
      return {
        gradientColor: 'rgba(139, 92, 246, 0.06)',
        hoverBorder: 'group-hover:border-violet-400/40 focus-within:border-violet-400/40',
        borderLeft: 'border-l-2 border-violet-400 dark:border-violet-300',
        badgeBg: 'bg-violet-500/10 border-violet-500/20 text-violet-600 dark:text-violet-300',
        glowColor: 'rgba(139, 92, 246, 0.15)'
      };
    case '疲れ気味':
      return {
        gradientColor: 'rgba(244, 63, 94, 0.06)',
        hoverBorder: 'group-hover:border-rose-400/40 focus-within:border-rose-400/40',
        borderLeft: 'border-l-2 border-rose-400 dark:border-rose-300',
        badgeBg: 'bg-rose-500/10 border-rose-500/20 text-rose-600 dark:text-rose-300',
        glowColor: 'rgba(244, 63, 94, 0.15)'
      };
    default:
      return {
        gradientColor: 'rgba(148, 163, 184, 0.04)',
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
  onClick,
  opMode = 'desktop',
  onUse,
  onSkip,
  onPrev,
  onNext
}) => {
  const styles = getAirSuitabilityStyles(card.airSuitability);
  const isTouch = opMode === 'touch';

  // ── useMotionValue でカード本体のY座標を直接制御（Reactステート不使用でガタつきゼロ） ──
  const cardY = useMotionValue(0);

  // 終了アニメーション制御
  const [isExiting, setIsExiting] = React.useState(false);
  const [isLeaving, setIsLeaving] = React.useState(false);

  // ドラッグ判定用フラグ（Reactステート避けてrefで管理）
  const isDraggingRef = React.useRef(false);
  const hasDraggedRef = React.useRef(false);
  const startYRef = React.useRef(0);
  const startXRef = React.useRef(0);
  const currentYRef = React.useRef(0);
  const currentXRef = React.useRef(0);

  // インジケーター表示制御（こちらはUIに関わるのでstate）
  const [isDragging, setIsDragging] = React.useState(false);
  const [pullRatio, setPullRatio] = React.useState(0);   // 0〜1 (1=閾値到達)
  const [isPullingEnough, setIsPullingEnough] = React.useState(false);
  const [xOffset, setXOffset] = React.useState(0);

  const PULL_THRESHOLD = 120; // 上方向の引き閾値(px)
  const SIDE_THRESHOLD = 100; // 左右スワイプ閾値(px)
  const TOP_LIMIT = -150;     // ドラッグできる最大上方向距離(px)

  // カードが切り替わった瞬間に全状態をリセット
  React.useEffect(() => {
    cardY.set(0);
    setIsExiting(false);
    setIsLeaving(false);
    setIsDragging(false);
    setPullRatio(0);
    setIsPullingEnough(false);
    setXOffset(0);
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
  }, [card.id]);

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

  // ── タッチ開始 ──
  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isActive || !isTouch || isExiting || isLeaving) return;

    const touch = e.touches[0];
    startYRef.current = touch.clientY;
    startXRef.current = touch.clientX;
    currentYRef.current = touch.clientY;
    currentXRef.current = touch.clientX;
    isDraggingRef.current = true;
    hasDraggedRef.current = false;
    setIsDragging(true);
  };

  // ── タッチ移動（requestAnimationFrame で間引いてスムース化） ──
  const rafRef = React.useRef<number | null>(null);

  const handleTouchMove = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isDraggingRef.current) return;

    const touch = e.touches[0];
    currentYRef.current = touch.clientY;
    currentXRef.current = touch.clientX;

    const rawDy = touch.clientY - startYRef.current;
    const rawDx = touch.clientX - startXRef.current;

    // 一定距離動いたらドラッグと認定
    if (Math.abs(rawDy) > 10 || Math.abs(rawDx) > 10) {
      hasDraggedRef.current = true;
    }

    if (rafRef.current !== null) return; // 既にRAFが予約済みならスキップ

    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;

      const dy = currentYRef.current - startYRef.current;
      const dx = currentXRef.current - startXRef.current;

      // Y軸のみ制御（X軸はカード本体を動かさない）
      // 上方向: TOP_LIMIT でハードクランプ、下方向: 0 より下には動かさない
      const clampedY = Math.max(TOP_LIMIT, Math.min(0, dy));

      // MotionValueを直接更新 → Reactレンダリングをバイパスしてガタつきゼロ
      cardY.set(clampedY);

      // インジケーター用の値（Reactステートで管理するが描画コストは最小）
      const ratio = Math.min(1, Math.max(0, -dy / PULL_THRESHOLD));
      const enough = dy < -PULL_THRESHOLD;

      setPullRatio(ratio);
      setIsPullingEnough(enough);
      setXOffset(dx);
    });
  };

  // ── タッチ終了 ──
  const handleTouchEnd = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (!isDraggingRef.current) return;

    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    isDraggingRef.current = false;
    setIsDragging(false);
    setPullRatio(0);
    setIsPullingEnough(false);
    setXOffset(0);

    const dy = currentYRef.current - startYRef.current;
    const dx = currentXRef.current - startXRef.current;

    // 1. 上に引っ張り確定 → 使用済み
    if (dy < -PULL_THRESHOLD && onUse) {
      setIsExiting(true);
      animate(cardY, -1000, { duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] });
      // 状態更新のタイミング制御は useDeckState.useCard() 内の setTimeout(250ms) に完全委譲。
      // ここでは即座に呼び出すのみでよい。
      onUse();
      return;
    }

    // 2. 右スワイプ → 次へ
    if (dx > SIDE_THRESHOLD && onNext) {
      setIsLeaving(true);
      animate(cardY, 0, { type: 'spring', stiffness: 300, damping: 25 });
      onNext();
      return;
    }

    // 3. 左スワイプ → 前へ
    if (dx < -SIDE_THRESHOLD && onPrev) {
      setIsLeaving(true);
      animate(cardY, 0, { type: 'spring', stiffness: 300, damping: 25 });
      onPrev();
      return;
    }

    // 4. どこにも達しなかった → 元の位置へスプリングで戻す（スプリングはここだけ）
    animate(cardY, 0, { type: 'spring', stiffness: 350, damping: 30 });

    // タップ判定クリア
    setTimeout(() => {
      hasDraggedRef.current = false;
    }, 100);
  };

  // インジケーターの透明度（useOpacity）
  const useOpacity = isDragging && xOffset === 0 || isDragging ? Math.min(1, pullRatio) : 0;
  const skipOpacity = isDragging && xOffset > 0 ? Math.min(1, xOffset / 100) : 0;

  // インジケーターのY座標（カード本体はMotionValueで動き、インジケーターはカードの子要素なので自動追従）
  // ただし threshold 越えで静止させたい場合は補正値を計算
  const indicatorOffsetY = isPullingEnough ? 0 : 0;

  return (
    <motion.div
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      onTap={() => {
        // ドラッグ履歴があるまたはドラッグ中の場合はタップ無効
        if (hasDraggedRef.current || isDraggingRef.current) return;

        if (isActive) {
          onToggleFlip();
        } else {
          onClick();
        }
      }}
      // MotionValueを直接styleに渡す（Reactレンダリングをバイパス）
      style={{
        y: cardY,
        touchAction: 'none',
        userSelect: 'none',
        WebkitUserSelect: 'none',
        rotate: 0,
      }}
      animate={
        isExiting
          ? { opacity: 0, scale: 0.8 }
          : { opacity: 1, scale: isActive ? 1 : 0.85 }
      }
      transition={
        isExiting
          ? { duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }
          : { type: 'spring', stiffness: 300, damping: 25 }
      }
      className={`relative w-80 h-112 cursor-pointer perspective-1000 group select-none touch-none ${
        isActive ? 'scale-100 z-10' : 'scale-85 opacity-35 hover:opacity-50 z-0'
      } transition-all duration-300`}
    >
      {/* === 極小スワイプガイドインジケーター === */}
      {isActive && isTouch && (
        <>
          {/* 上部: 話した！インジケーター */}
          <div
            className={`absolute -top-12 left-1/2 -translate-x-1/2 font-black text-[10px] px-3.5 py-1.5 rounded-full shadow-lg z-40 pointer-events-none flex items-center gap-1.5 ${
              isPullingEnough
                ? 'bg-neon-green text-background border border-neon-green shadow-neon-green/30 scale-105 animate-pulse'
                : 'bg-neon-green/20 border border-neon-green/30 text-neon-green'
            }`}
            style={{
              opacity: useOpacity,
              transform: `translateX(-50%) scale(${0.8 + useOpacity * 0.2})`,
            }}
          >
            <span>{isPullingEnough ? '✨ 離して使用済みにする ✨' : '↑ 引っ張って使用済み'}</span>
          </div>

          {/* 右側: パスインジケーター */}
          <div
            className="absolute top-1/2 -translate-y-1/2 -right-10 bg-neon-purple/20 border border-neon-purple/45 text-neon-purple font-black text-[11px] px-3.5 py-1.5 rounded-full shadow-lg shadow-neon-purple/10 flex items-center gap-1 z-40 pointer-events-none"
            style={{
              opacity: skipOpacity,
              transform: `translateY(-50%) translateX(${Math.max(0, xOffset * 0.15)}px) scale(${0.8 + skipOpacity * 0.2})`,
            }}
          >
            <span>パス →</span>
          </div>
        </>
      )}

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
          <div className="w-full h-full bg-black/5 hover:bg-black/0 transition-all duration-300" />
        </div>

        {/* === カード表面 (ガラスモーフィズム ＆ 空気感連動グラデーション) === */}
        <div
          className={`absolute inset-0 w-full h-full rounded-3xl backface-hidden glass-card border border-white/10 dark:border-white/5 flex flex-col justify-between p-7 overflow-hidden transition-all duration-300 ${
            isActive ? styles.hoverBorder : 'border-white/5'
          }`}
          style={{ 
            transform: 'rotateY(180deg)',
            background: `radial-gradient(circle at top right, ${styles.gradientColor}, transparent 75%), var(--card-bg)`,
            boxShadow: isActive ? `0 15px 45px -10px ${styles.glowColor}` : undefined
          }}
        >
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
                    card.airSuitability === 'はじめまして' ? 'text-cyan-400' :
                    card.airSuitability === '静か' ? 'text-emerald-400' :
                    card.airSuitability === '深夜帯' ? 'text-violet-400' :
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
    </motion.div>
  );
};
