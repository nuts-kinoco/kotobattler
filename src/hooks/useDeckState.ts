import { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, Deck, Person, Session, AirSuitability, CardState } from '../types/deck';
import { STARTER_CARDS, STARTER_DECKS } from '../data/starterDeck';
import { storage } from '../services/storage';
import { backupService } from '../services/backup';

export const useDeckState = () => {
  // ==========================================
  // 1. 状態の定義 (将来の stores/ 分割を見据えた整理)
  // ==========================================

  // --- Cards & Decks Store 担当領域 ---
  const [cards, setCards] = useState<Card[]>([]);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [currentDeckId, setCurrentDeckId] = useState<string>('deck-all');
  const [activeCardIds, setActiveCardIds] = useState<string[]>([]);
  const [activeCardIndex, setActiveCardIndex] = useState<number>(0);

  // --- Persons Store 担当領域 ---
  const [persons, setPersons] = useState<Person[]>([]);

  // --- Sessions Store 担当領域 ---
  const [session, setSession] = useState<Session>({
    isActive: false,
    activePersonIds: [],
    usedCardIds: []
  });

  // --- UI & Settings Store 担当領域 ---
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [displaySize, setDisplaySize] = useState<'small' | 'medium' | 'large'>('large');
  const [cardDisplayCount, setCardDisplayCount] = useState<number>(3);
  const [shortcutEnabled, setShortcutEnabled] = useState<boolean>(true);
  const [selectedAirSuitability, setSelectedAirSuitability] = useState<AirSuitability | 'All'>('All');
  
  // データ破損（パースエラー等）を検知してユーザーに通知・復元を促すためのフラグ
  const [isDataCorrupted, setIsDataCorrupted] = useState<boolean>(false);

  // ==========================================
  // 2. ウィンドウ幅の自動監視（ウルトラ・レスポンシブ）
  // ==========================================
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 600) {
        setDisplaySize('small');
        setCardDisplayCount(1);
      } else if (width < 960) {
        setDisplaySize('medium');
        setCardDisplayCount(2);
      } else {
        setDisplaySize('large');
        // Large時はご主人様の設定した枚数（デフォルト3）にする
        const storedCount = storage.loadDisplayCount(3);
        setCardDisplayCount(storedCount);
      }
    };

    // 初期化時とリサイズ時に実行
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ==========================================
  // 3. マウント時の初期化ロード (storageサービス経由)
  // ==========================================
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. 各種データを例外安全なstorageサービスから復元
      const loadedCards = storage.loadCards(STARTER_CARDS);
      const loadedDecks = storage.loadDecks(STARTER_DECKS);
      const loadedPersons = storage.loadPersons([]);
      const loadedSession = storage.loadSession({ isActive: false, activePersonIds: [], usedCardIds: [] });
      const loadedDeckId = storage.loadCurrentDeckId('deck-all');
      const loadedDisplayCount = storage.loadDisplayCount(3);
      const loadedShortcut = storage.loadShortcutEnabled(true);
      const loadedTheme = storage.loadTheme('dark');

      // 2. 状態へのセット
      setCards(loadedCards);
      setDecks(loadedDecks);
      setPersons(loadedPersons);
      setSession(loadedSession);
      setCurrentDeckId(loadedDeckId);
      setShortcutEnabled(loadedShortcut);
      setTheme(loadedTheme);

      // 初回テーマのCSSクラス適用
      applyTheme(loadedTheme);

      // 3. ロード中にデータのパースエラー等、不整合が検出されたか確認
      if (storage.hasLoadError()) {
        setIsDataCorrupted(true);
        storage.clearLoadError(); // 検知フラグをクリア
      }
    }
  }, []);

  // HTMLのクラス属性を切り替えるヘルパー
  const applyTheme = (t: 'dark' | 'light') => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (t === 'light') {
        root.classList.add('light');
        root.classList.remove('dark');
      } else {
        root.classList.add('dark');
        root.classList.remove('light');
      }
    }
  };

  // ==========================================
  // 4. データ保存のアクション (storageサービスを排他利用)
  // ==========================================
  const saveCards = (newCards: Card[]) => {
    setCards(newCards);
    storage.saveCards(newCards);
  };

  const saveDecks = (newDecks: Deck[]) => {
    setDecks(newDecks);
    storage.saveDecks(newDecks);
  };

  const savePersons = (newPersons: Person[]) => {
    setPersons(newPersons);
    storage.savePersons(newPersons);
  };

  const saveSession = (newSession: Session) => {
    setSession(newSession);
    storage.saveSession(newSession);
  };

  // --- 設定値の保存 ---
  const handleSetCardDisplayCount = (count: number) => {
    setCardDisplayCount(count);
    storage.saveDisplayCount(count);
  };

  const handleSetShortcutEnabled = (enabled: boolean) => {
    setShortcutEnabled(enabled);
    storage.saveShortcutEnabled(enabled);
  };

  const handleSetCurrentDeckId = (deckId: string) => {
    setCurrentDeckId(deckId);
    storage.saveCurrentDeckId(deckId);
    setActiveCardIndex(0);
  };

  const handleSetTheme = (newTheme: 'dark' | 'light') => {
    setTheme(newTheme);
    storage.saveTheme(newTheme);
    applyTheme(newTheme);
  };

  // --- アプリの完全な初期化・リセットアクション (フォールバック安全策) ---
  const resetAllData = () => {
    storage.clearAll();
    
    // すべて初期状態へリセット
    setCards(STARTER_CARDS);
    setDecks(STARTER_DECKS);
    setPersons([]);
    setSession({ isActive: false, activePersonIds: [], usedCardIds: [] });
    setCurrentDeckId('deck-all');
    setCardDisplayCount(3);
    setShortcutEnabled(true);
    setTheme('dark');
    applyTheme('dark');
    setIsDataCorrupted(false);
    
    setTimeout(() => {
      drawCards(3);
    }, 50);
  };

  // ==========================================
  // 5. デッキ内カードの抽出・フィルタリング
  // ==========================================
  const currentDeck = useMemo(() => {
    return decks.find(d => d.id === currentDeckId) || decks[0];
  }, [decks, currentDeckId]);

  const drawPool = useMemo(() => {
    if (!currentDeck) return [];
    
    const deckCards = cards.filter(c => currentDeck.cardIds.includes(c.id));
    
    return deckCards.filter(card => {
      if (card.state === 'sealed') return false;

      if (selectedAirSuitability !== 'All' && card.airSuitability !== selectedAirSuitability) {
        return false;
      }

      if (session.isActive && session.usedCardIds.includes(card.id)) {
        if (card.reappearRule !== 'everytime') {
          return false;
        }
      }

      if (session.isActive && card.reappearRule !== 'everytime') {
        const activePersons = persons.filter(p => session.activePersonIds.includes(p.id));
        const isUsedByAnyActivePerson = activePersons.some(person => 
          person.usedCardIds.includes(card.id)
        );
        if (isUsedByAnyActivePerson) return false;
      }

      return true;
    });
  }, [cards, currentDeck, selectedAirSuitability, session, persons]);

  // ==========================================
  // 6. ドローロジック
  // ==========================================
  const drawCards = useCallback((count: number = cardDisplayCount, keepCardIds: string[] = []) => {
    let pool = [...drawPool];
    pool = pool.filter(c => !keepCardIds.includes(c.id));

    const shuffled = pool.sort(() => 0.5 - Math.random());
    const needed = count - keepCardIds.length;
    const drawn = shuffled.slice(0, Math.max(0, needed));

    const result = [...keepCardIds];
    
    for (let i = 0; i < drawn.length && result.length < count; i++) {
      result.push(drawn[i].id);
    }

    setActiveCardIds(result);
    setActiveCardIndex(prev => Math.min(prev, Math.max(0, result.length - 1)));
  }, [drawPool, cardDisplayCount]);

  useEffect(() => {
    if (cards.length > 0 && decks.length > 0) {
      drawCards(cardDisplayCount);
    }
  }, [currentDeckId, selectedAirSuitability, cardDisplayCount, cards.length, decks.length]);

  // ==========================================
  // 7. アクション系関数 (Card用)
  // ==========================================
  const useCard = useCallback((cardId: string) => {
    const newUsedIds = session.isActive && !session.usedCardIds.includes(cardId)
      ? [...session.usedCardIds, cardId]
      : session.usedCardIds;

    const targetCard = cards.find(c => c.id === cardId);
    let updatedPersons = [...persons];
    
    if (session.isActive && targetCard && targetCard.reappearRule !== 'everytime') {
      updatedPersons = persons.map(person => {
        if (session.activePersonIds.includes(person.id)) {
          if (!person.usedCardIds.includes(cardId)) {
            return {
              ...person,
              usedCardIds: [...person.usedCardIds, cardId]
            };
          }
        }
        return person;
      });
      savePersons(updatedPersons);
    }

    const updatedCards = cards.map(c => 
      c.id === cardId ? { ...c, state: 'used' as CardState } : c
    );
    saveCards(updatedCards);

    saveSession({
      ...session,
      usedCardIds: newUsedIds
    });

    const remainingActiveIds = activeCardIds.filter(id => id !== cardId);
    drawCards(cardDisplayCount, remainingActiveIds);

  }, [cards, persons, session, activeCardIds, cardDisplayCount, drawCards]);

  const skipCard = useCallback((cardId: string) => {
    const remainingActiveIds = activeCardIds.filter(id => id !== cardId);
    drawCards(cardDisplayCount, remainingActiveIds);
  }, [activeCardIds, cardDisplayCount, drawCards]);

  const shuffleAll = useCallback(() => {
    drawCards(cardDisplayCount);
  }, [cardDisplayCount, drawCards]);

  // ==========================================
  // 8. セッション管理
  // ==========================================
  const startSession = (personIds: string[]) => {
    const newSession: Session = {
      isActive: true,
      startTime: new Date().toISOString(),
      activePersonIds: personIds,
      usedCardIds: []
    };
    saveSession(newSession);
    setTimeout(() => drawCards(cardDisplayCount), 50);
  };

  const endSession = () => {
    const newSession: Session = {
      isActive: false,
      activePersonIds: [],
      usedCardIds: []
    };
    saveSession(newSession);
    setTimeout(() => drawCards(cardDisplayCount), 50);
  };

  // ==========================================
  // 9. 人物プロフィール管理 (拡張性を確保)
  // ==========================================
  const addPerson = (displayName: string, aliases: string[], memo?: string) => {
    const newPerson: Person = {
      id: `p-${Date.now()}`,
      displayName,
      aliases: aliases.filter(a => a.trim() !== ''),
      memo,
      usedCardIds: []
    };
    const newPersons = [...persons, newPerson];
    savePersons(newPersons);

    if (session.isActive) {
      saveSession({
        ...session,
        activePersonIds: [...session.activePersonIds, newPerson.id]
      });
    }
    return newPerson;
  };

  const updatePerson = (id: string, displayName: string, aliases: string[], memo?: string) => {
    const newPersons = persons.map(p => 
      p.id === id ? { ...p, displayName, aliases: aliases.filter(a => a.trim() !== ''), memo } : p
    );
    savePersons(newPersons);
  };

  const deletePerson = (id: string) => {
    const newPersons = persons.filter(p => p.id !== id);
    savePersons(newPersons);

    if (session.activePersonIds.includes(id)) {
      saveSession({
        ...session,
        activePersonIds: session.activePersonIds.filter(pid => pid !== id)
      });
    }
  };

  // ==========================================
  // 10. カード＆デッキ編集
  // ==========================================
  const addCard = (cardData: Omit<Card, 'id' | 'state'>) => {
    const newCard: Card = {
      ...cardData,
      id: `c-${Date.now()}`,
      state: 'unused'
    };
    const newCards = [...cards, newCard];
    saveCards(newCards);

    const updatedDecks = decks.map(d => {
      if (d.id === currentDeckId || d.id === 'deck-all') {
        return {
          ...d,
          cardIds: [...d.cardIds, newCard.id]
        };
      }
      return d;
    });
    saveDecks(updatedDecks);
  };

  const updateCard = (updatedCard: Card) => {
    const newCards = cards.map(c => c.id === updatedCard.id ? updatedCard : c);
    saveCards(newCards);
  };

  const deleteCard = (cardId: string) => {
    const newCards = cards.filter(c => c.id !== cardId);
    saveCards(newCards);

    const newDecks = decks.map(d => ({
      ...d,
      cardIds: d.cardIds.filter(id => id !== cardId)
    }));
    saveDecks(newDecks);

    if (activeCardIds.includes(cardId)) {
      const remaining = activeCardIds.filter(id => id !== cardId);
      drawCards(cardDisplayCount, remaining);
    }
  };

  const toggleCardSealed = (cardId: string) => {
    const newCards = cards.map(c => {
      if (c.id === cardId) {
        const nextState = c.state === 'sealed' ? 'unused' as CardState : 'sealed' as CardState;
        return { ...c, state: nextState };
      }
      return c;
    });
    saveCards(newCards);
  };

  // ==========================================
  // 11. バックアップ＆インポート (backupServiceへの委譲)
  // ==========================================
  const importCSV = (csvText: string): boolean => {
    try {
      const lines = csvText.split('\n');
      if (lines.length <= 1) return false;

      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const textIdx = header.indexOf('text');
      if (textIdx === -1) {
        alert('CSVには最低限 "text" カラムが必要です。');
        return false;
      }

      const titleIdx = header.indexOf('title');
      const starIdx = header.indexOf('star');
      const tagsIdx = header.indexOf('tags');
      const airIdx = header.indexOf('air');

      const newCards: Card[] = [];
      
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        
        const row = backupService.parseCSVLine(lines[i]);
        if (row.length === 0 || !row[textIdx]) continue;

        const text = row[textIdx].trim();
        const title = titleIdx !== -1 && row[titleIdx] ? row[titleIdx].trim() : undefined;
        
        let star = 3;
        if (starIdx !== -1 && row[starIdx]) {
          const s = parseInt(row[starIdx]);
          if (!isNaN(s)) star = Math.max(0, Math.min(5, s));
        }

        let tags: string[] = [];
        if (tagsIdx !== -1 && row[tagsIdx]) {
          tags = row[tagsIdx].split(';').map(t => t.trim()).filter(t => t !== '');
        }

        let airSuitability: AirSuitability = '普通';
        if (airIdx !== -1 && row[airIdx]) {
          const a = row[airIdx].trim() as AirSuitability;
          if (['初動', '静か', '盛り上がり', '深夜', '疲れ気味', '普通'].includes(a)) {
            airSuitability = a;
          }
        }

        newCards.push({
          id: `c-csv-${Date.now()}-${i}`,
          title,
          text,
          star,
          tags,
          airSuitability,
          state: 'unused',
          reappearRule: 'session_graveyard'
        });
      }

      if (newCards.length > 0) {
        const mergedCards = [...cards, ...newCards];
        saveCards(mergedCards);
        
        const updatedDecks = decks.map(d => {
          if (d.id === currentDeckId || d.id === 'deck-all') {
            return {
              ...d,
              cardIds: [...d.cardIds, ...newCards.map(c => c.id)]
            };
          }
          return d;
        });
        saveDecks(updatedDecks);
        
        drawCards(cardDisplayCount);
        return true;
      }
      return false;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  const handleExportCSV = (): string => {
    return backupService.exportCSV(cards);
  };

  const handleDownloadCSV = () => {
    backupService.downloadCSV(cards);
  };

  const handleExportJSON = () => {
    backupService.exportToJSON();
  };

  const handleImportJSON = (jsonText: string): boolean => {
    const success = backupService.importFromJSON(jsonText);
    if (success) {
      // 読み込み完了後に各ステートを再リロード
      setCards(storage.loadCards(STARTER_CARDS));
      setDecks(storage.loadDecks(STARTER_DECKS));
      setPersons(storage.loadPersons([]));
      setSession(storage.loadSession({ isActive: false, activePersonIds: [], usedCardIds: [] }));
      
      const loadedDeckId = storage.loadCurrentDeckId('deck-all');
      const loadedTheme = storage.loadTheme('dark');

      setCurrentDeckId(loadedDeckId);
      setTheme(loadedTheme);
      applyTheme(loadedTheme);
      setIsDataCorrupted(false);

      // 自動リサイズで表示枚数がリセットされる
      const width = window.innerWidth;
      if (width < 600) {
        setCardDisplayCount(1);
        setDisplaySize('small');
      } else if (width < 960) {
        setCardDisplayCount(2);
        setDisplaySize('medium');
      } else {
        setCardDisplayCount(storage.loadDisplayCount(3));
        setDisplaySize('large');
      }

      setTimeout(() => {
        drawCards(cardDisplayCount);
      }, 50);
    }
    return success;
  };

  return {
    // 状態
    cards,
    decks,
    persons,
    session,
    currentDeckId,
    currentDeck,
    activeCardIds,
    activeCardIndex,
    cardDisplayCount,
    shortcutEnabled,
    selectedAirSuitability,
    drawPool,
    theme,
    displaySize,
    isDataCorrupted,
    
    // 状態設定
    setActiveCardIndex,
    setCardDisplayCount: handleSetCardDisplayCount,
    setShortcutEnabled: handleSetShortcutEnabled,
    setCurrentDeckId: handleSetCurrentDeckId,
    setSelectedAirSuitability,
    setTheme: handleSetTheme,
    setIsDataCorrupted,
    
    // アクション
    drawCards,
    useCard,
    skipCard,
    shuffleAll,
    resetAllData,
    
    // セッション
    startSession,
    endSession,
    
    // 人物
    addPerson,
    updatePerson,
    deletePerson,
    
    // カード
    addCard,
    updateCard,
    deleteCard,
    toggleCardSealed,
    
    // インポート・エクスポート (CSV & JSON)
    importCSV,
    exportCSV: handleExportCSV,
    downloadCSV: handleDownloadCSV,
    exportJSON: handleExportJSON,
    importJSON: handleImportJSON
  };
};
