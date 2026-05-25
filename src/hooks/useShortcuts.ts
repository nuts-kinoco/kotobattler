import { useEffect } from 'react';

interface ShortcutProps {
  enabled: boolean;
  activeCardIds: string[];
  activeCardIndex: number;
  setActiveCardIndex: (index: number | ((prev: number) => number)) => void;
  onUseCard: (cardId: string) => void;
  onSkipCard: (cardId: string) => void;
  onShuffleAll: () => void;
  onToggleFlip: () => void;
  showToast: (message: string) => void;
}

export const useShortcuts = ({
  enabled,
  activeCardIds,
  activeCardIndex,
  setActiveCardIndex,
  onUseCard,
  onSkipCard,
  onShuffleAll,
  onToggleFlip,
  showToast
}: ShortcutProps) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. ショートカット機能自体がOFFなら何もしない
      if (!enabled) return;

      // 2. 入力フィールドにフォーカスがある場合は誤作動防止のため無効化
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl instanceof HTMLElement && activeEl.isContentEditable) ||
          activeEl.tagName === 'SELECT')
      ) {
        return;
      }

      const currentCardId = activeCardIds[activeCardIndex];

      switch (e.key) {
        // Space: カードをめくる (Flip)
        case ' ':
          e.preventDefault(); // ブラウザのスクロールを防止
          if (currentCardId) {
            onToggleFlip();
            showToast('カードをめくりました 💫');
          }
          break;

        // ↑ (ArrowUp): 「使った！」(Used)
        case 'ArrowUp':
          e.preventDefault();
          if (currentCardId) {
            onUseCard(currentCardId);
            showToast('カードを使用済に登録しました 💚');
          }
          break;

        // ↓ (ArrowDown): シャッフル (Shuffle)
        case 'ArrowDown':
          e.preventDefault();
          onShuffleAll();
          showToast('デッキをシャッフルしました 🔄');
          break;

        // ← (ArrowLeft): 前のカードを選択
        case 'ArrowLeft':
          e.preventDefault();
          if (activeCardIds.length > 0) {
            setActiveCardIndex(prev => (prev > 0 ? prev - 1 : activeCardIds.length - 1));
          }
          break;

        // → (ArrowRight): 次のカードを選択 / スキップ
        case 'ArrowRight':
          e.preventDefault();
          if (activeCardIds.length > 0) {
            setActiveCardIndex(prev => (prev < activeCardIds.length - 1 ? prev + 1 : 0));
          }
          break;

        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    enabled,
    activeCardIds,
    activeCardIndex,
    setActiveCardIndex,
    onUseCard,
    onSkipCard,
    onShuffleAll,
    onToggleFlip,
    showToast
  ]);
};
