import React, { useState, useEffect } from 'react';
import { Card, GameMode, GameState } from '../types/Element';
import { ElementCard } from './ElementCard';
import { GameModeSelector } from './GameModeSelector';
import { PlayerSetup } from './PlayerSetup';
import { MultiplayerGameBoard } from './MultiplayerGameBoard';
import { createDeck, evaluateHand } from '../utils/pokerLogic';
import { GameManager } from '../utils/gameLogic';
import { HandResult } from '../types/Element';
import { Shuffle, RotateCcw } from 'lucide-react';

export const GameBoard: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode | null>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [gameManager] = useState(new GameManager());
  const [showPlayerSetup, setShowPlayerSetup] = useState(false);
  const [deck, setDeck] = useState<Card[]>([]);
  const [hand, setHand] = useState<Card[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [handResult, setHandResult] = useState<HandResult | null>(null);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [canDraw, setCanDraw] = useState(true);

  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const handleModeSelect = (mode: GameMode) => {
    setGameMode(mode);
    if (mode === GameMode.SINGLE_PLAYER) {
      // シングルプレイは従来のゲームロジックを使用
      return;
    }
    setShowPlayerSetup(true);
  };

  const handleStartMultiplayerGame = (playerNames: string[]) => {
    if (!gameMode) return;
    
    const newGameState = gameManager.initializeGame(gameMode, playerNames);
    setGameState(newGameState);
    setShowPlayerSetup(false);
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setGameState(null);
    setShowPlayerSetup(false);
    setIsGameStarted(false);
    setHand([]);
    setSelectedCards([]);
    setHandResult(null);
    setCanDraw(true);
  };

  const handleBackToModeSelect = () => {
    setShowPlayerSetup(false);
    setGameMode(null);
  };

  const dealNewHand = () => {
    const newDeck = createDeck();
    const newHand = newDeck.slice(0, 5);
    setDeck(newDeck);
    setHand(newHand);
    setSelectedCards([]);
    setHandResult(null);
    setIsGameStarted(true);
    setCanDraw(true);
  };

  const drawCards = () => {
    if (!canDraw || selectedCards.length === 0) return;

    const newHand = [...hand];
    let deckIndex = 5; // 最初の5枚の後から

    selectedCards.forEach(index => {
      if (deckIndex < deck.length) {
        newHand[index] = deck[deckIndex];
        deckIndex++;
      }
    });

    setHand(newHand);
    setSelectedCards([]);
    setCanDraw(false);
    
    // 手札を評価
    const result = evaluateHand(newHand);
    setHandResult(result);
  };

  const toggleCardSelection = (index: number) => {
    if (!canDraw) return;
    
    setSelectedCards(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const resetGame = () => {
    setHand([]);
    setSelectedCards([]);
    setHandResult(null);
    setIsGameStarted(false);
    setCanDraw(true);
    setDeck(createDeck());
  };

  // マルチプレイヤーゲームの場合
  if (gameState) {
    return (
      <MultiplayerGameBoard 
        initialGameState={gameState} 
        onBackToMenu={handleBackToMenu}
      />
    );
  }

  // プレイヤー設定画面
  if (showPlayerSetup && gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
        <PlayerSetup 
          mode={gameMode}
          onStartGame={handleStartMultiplayerGame}
          onBack={handleBackToModeSelect}
        />
      </div>
    );
  }

  // ゲームモード選択画面
  if (!gameMode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            元素記号ポーカー
          </h1>
          <p className="text-gray-300">原子番号1-20の元素を使ったポーカーゲーム</p>
        </div>
        <GameModeSelector onSelectMode={handleModeSelect} />
      </div>
    );
  }

  // シングルプレイヤーゲーム（従来のロジック）
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* ヘッダー */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            元素記号ポーカー - シングルプレイ
          </h1>
          <p className="text-gray-300">原子番号1-20の元素を使ったポーカーゲーム</p>
        </div>

        {/* ゲームエリア */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20">
          {/* 手札エリア */}
          {isGameStarted && (
            <div className="mb-6">
              <h3 className="text-white text-lg font-semibold mb-3">あなたの手札</h3>
              <div className="flex justify-center gap-4 flex-wrap">
                {hand.map((card, index) => (
                  <ElementCard
                    key={card.id}
                    card={card}
                    isSelected={selectedCards.includes(index)}
                    onClick={() => toggleCardSelection(index)}
                    size="large"
                  />
                ))}
              </div>
              
              {canDraw && selectedCards.length > 0 && (
                <div className="text-center mt-4">
                  <p className="text-gray-300 text-sm mb-2">
                    {selectedCards.length}枚のカードを交換します
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 役判定結果 */}
          {handResult && (
            <div className="mb-6 text-center">
              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg p-4 inline-block">
                <h3 className="text-2xl font-bold text-white">{handResult.rankName}</h3>
                <p className="text-white/90">スコア: {handResult.score.toLocaleString()}</p>
              </div>
            </div>
          )}

          {/* ボタンエリア */}
          <div className="flex justify-center gap-4 flex-wrap">
            {!isGameStarted ? (
              <button
                onClick={dealNewHand}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
              >
                <Shuffle size={20} />
                カードを配る
              </button>
            ) : (
              <>
                {canDraw && (
                  <button
                    onClick={drawCards}
                    disabled={selectedCards.length === 0}
                    className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2 ${
                      selectedCards.length > 0
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                        : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                    }`}
                  >
                    <Shuffle size={20} />
                    カード交換 ({selectedCards.length}枚)
                  </button>
                )}
                
                <button
                  onClick={resetGame}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <RotateCcw size={20} />
                  新しいゲーム
                </button>
                
                <button
                  onClick={handleBackToMenu}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105"
                >
                  メニューに戻る
                </button>
              </>
            )}
          </div>

          {/* ルール説明 */}
          <div className="mt-8 bg-white/5 rounded-xl p-4">
            <h4 className="text-white font-semibold mb-2">ゲームルール</h4>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• 原子番号が大きいほど強いカードです</li>
              <li>• 同じ元素グループ（色）が揃うとフラッシュになります</li>
              <li>• 原子番号が連続するとストレートになります</li>
              <li>• 最初に5枚配られ、不要なカードを選んで交換できます</li>
              <li>• より強い役を作って高得点を目指しましょう！</li>
            </ul>
          </div>
        </div>

        {/* 元素グループ説明 */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-lg p-3 text-center">
            <div className="text-white font-semibold text-sm">アルカリ金属</div>
            <div className="text-white/80 text-xs">Li, Na, K</div>
          </div>
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 rounded-lg p-3 text-center">
            <div className="text-white font-semibold text-sm">アルカリ土類</div>
            <div className="text-white/80 text-xs">Be, Mg, Ca</div>
          </div>
          <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg p-3 text-center">
            <div className="text-white font-semibold text-sm">非金属</div>
            <div className="text-white/80 text-xs">H, B, C, N, O, F, Al, Si, P, S, Cl</div>
          </div>
          <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-lg p-3 text-center">
            <div className="text-white font-semibold text-sm">貴ガス</div>
            <div className="text-white/80 text-xs">He, Ne, Ar</div>
          </div>
        </div>
      </div>
    </div>
  );
};