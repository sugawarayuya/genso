import React, { useState, useEffect } from 'react';
import { GameState, GameMode, GamePhase, Player } from '../types/Element';
import { ElementCard } from './ElementCard';
import { GameResultModal } from './GameResultModal';
import { GameManager } from '../utils/gameLogic';
import { RotateCcw, Home } from 'lucide-react';
import { TurnIndicator } from './TurnIndicator';
import { PlayerCard } from './PlayerCard';
import { GamePhaseIndicator } from './GamePhaseIndicator';
import { ActionButtons } from './ActionButtons';

interface MultiplayerGameBoardProps {
  initialGameState: GameState;
  onBackToMenu: () => void;
}

export const MultiplayerGameBoard: React.FC<MultiplayerGameBoardProps> = ({ 
  initialGameState, 
  onBackToMenu 
}) => {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [gameManager] = useState(new GameManager());
  const [showResultModal, setShowResultModal] = useState(false);
  const [currentPlayerId, setCurrentPlayerId] = useState<string>(
    gameState.players.find(p => !p.isComputer)?.id || ''
  );

  useEffect(() => {
    if (gameState.phase === GamePhase.WAITING) {
      // ゲーム開始時にカードを配る
      const newState = gameManager.dealCards(gameState);
      setGameState(newState);
    }
  }, []);

  useEffect(() => {
    // ゲーム終了時にモーダルを表示
    if (gameState.phase === GamePhase.SHOWDOWN && gameState.winner) {
      const timer = setTimeout(() => {
        setShowResultModal(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [gameState.phase, gameState.winner]);

  useEffect(() => {
    // コンピューターのターンを自動処理
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    if (currentPlayer?.isComputer && !currentPlayer.hasActed) {
      const timer = setTimeout(() => {
        if (gameState.phase === GamePhase.DRAW) {
          const newState = gameManager.processComputerDraw(gameState);
          setGameState(newState);
        } else {
          const newState = gameManager.processComputerTurn(gameState);
          setGameState(newState);
        }
      }, 1500); // 1.5秒の思考時間

      return () => clearTimeout(timer);
    }
  }, [gameState.currentPlayerIndex, gameState.phase]);

  const handlePlayerAction = (action: 'fold' | 'call' | 'raise', raiseAmount?: number) => {
    const newState = gameManager.processPlayerAction(gameState, currentPlayerId, action, raiseAmount);
    setGameState(newState);
  };

  const handleCardSelection = (cardIndex: number) => {
    if (gameState.phase !== GamePhase.DRAW) return;
    
    const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
    if (!currentPlayer) return;

    const newState = { ...gameState };
    const player = newState.players.find(p => p.id === currentPlayerId);
    if (player) {
      if (player.selectedCards.includes(cardIndex)) {
        player.selectedCards = player.selectedCards.filter(i => i !== cardIndex);
      } else {
        player.selectedCards = [...player.selectedCards, cardIndex];
      }
    }
    setGameState(newState);
  };

  const handleDrawCards = () => {
    const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
    if (!currentPlayer) return;

    const newState = gameManager.processCardDraw(gameState, currentPlayerId, currentPlayer.selectedCards);
    setGameState(newState);
  };

  const startNewGame = () => {
    const playerNames = gameState.players.filter(p => !p.isComputer).map(p => p.name);
    const newState = gameManager.initializeGame(gameState.mode, playerNames);
    setGameState(newState);
    setShowResultModal(false);
  };

  const currentPlayer = gameState.players.find(p => p.id === currentPlayerId);
  const activePlayer = gameState.players[gameState.currentPlayerIndex];
  const canAct = gameManager.canPlayerAct(gameState, currentPlayerId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* ヘッダー */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-white mb-2 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            元素記号ポーカー - {gameState.mode === GameMode.VS_COMPUTER ? 'コンピューター対戦' : 'マルチプレイヤー'}
          </h1>
        </div>

        {/* ゲームフェーズインジケーター */}
        <GamePhaseIndicator 
          phase={gameState.phase}
          pot={gameState.pot}
          currentBet={gameState.currentBet}
        />

        {/* 現在のターン表示 */}
        {activePlayer && gameState.phase !== GamePhase.SHOWDOWN && (
          <div className="mb-6">
            <TurnIndicator 
              currentPlayer={activePlayer}
              phase={gameState.phase === GamePhase.FIRST_BETTING ? '第1ベッティング' : 
                     gameState.phase === GamePhase.DRAW ? 'カード交換' : 
                     gameState.phase === GamePhase.SECOND_BETTING ? '第2ベッティング' : ''}
            />
          </div>
        )}

        {/* プレイヤー情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {gameState.players.map((player, index) => (
            <PlayerCard
              key={player.id}
              player={player}
              isCurrentTurn={index === gameState.currentPlayerIndex}
              isWinner={gameState.winner?.id === player.id}
              position={index % 2 === 0 ? 'left' : 'right'}
            />
          ))}
        </div>

        {/* 現在のプレイヤーの手札 */}
        {currentPlayer && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
            <h3 className="text-white text-xl font-semibold mb-4 text-center">
              {currentPlayer.name}の手札
            </h3>
            
            <div className="flex justify-center gap-4 flex-wrap mb-6">
              {currentPlayer.hand.map((card, index) => (
                <ElementCard
                  key={card.id}
                  card={card}
                  isSelected={currentPlayer.selectedCards.includes(index)}
                  onClick={() => handleCardSelection(index)}
                  size="large"
                />
              ))}
            </div>

            {/* カード交換ボタン */}
            {gameState.phase === GamePhase.DRAW && (
              <div className="flex justify-center mb-4">
                <button
                  onClick={handleDrawCards}
                  disabled={currentPlayer.selectedCards.length === 0}
                  className={`px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    currentPlayer.selectedCards.length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  カード交換 ({currentPlayer.selectedCards.length}枚)
                </button>
              </div>
            )}

            {/* ベッティングアクション */}
            {canAct && (gameState.phase === GamePhase.FIRST_BETTING || gameState.phase === GamePhase.SECOND_BETTING) && (
              <ActionButtons
                player={currentPlayer}
                currentBet={gameState.currentBet}
                canAct={canAct}
                onAction={handlePlayerAction}
              />
            )}
          </div>
        )}

        {/* 待機中のメッセージ */}
        {!canAct && gameState.phase !== GamePhase.DRAW && gameState.phase !== GamePhase.SHOWDOWN && activePlayer && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 text-center border border-white/20">
            <p className="text-gray-300">
              <span className="text-yellow-400 font-semibold">{activePlayer.name}</span>
              {activePlayer.isComputer ? ' が思考中です...' : ' のアクションを待っています'}
            </p>
            {activePlayer.isComputer && (
              <div className="mt-2 flex justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 全プレイヤーの手札表示（ショーダウン時） */}
        {gameState.phase === GamePhase.SHOWDOWN && (
          <div className="mb-6">
            <h3 className="text-white text-xl font-semibold mb-4 text-center">全プレイヤーの手札</h3>
            <div className="grid gap-6">
              {gameState.players.filter(p => !p.hasFolded).map(player => (
                <div key={player.id} className="bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20">
                  <div className="flex items-center gap-2 mb-3">
                    {player.isComputer ? (
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">AI</span>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-bold">{player.name[0]}</span>
                      </div>
                    )}
                    <span className="text-white font-semibold">{player.name}</span>
                    {gameState.winner?.id === player.id && (
                      <div className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-bold">勝者</div>
                    )}
                  </div>
                  
                  <div className="flex justify-center gap-2 mb-3">
                    {player.hand.map((card, index) => (
                      <ElementCard
                        key={card.id}
                        card={card}
                        size="small"
                      />
                    ))}
                  </div>
                  
                  {player.handResult && (
                    <div className="text-center">
                      <div className="text-yellow-400 font-semibold">{player.handResult.rankName}</div>
                      <div className="text-gray-300 text-sm">スコア: {player.handResult.score.toLocaleString()}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 従来のアクションボタン（カード交換用） */}
        {currentPlayer && gameState.phase === GamePhase.DRAW && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-4 mb-6 text-center border border-white/20">
            <div className="flex justify-center gap-4 flex-wrap">
              {gameState.phase === GamePhase.DRAW && (
                <button
                  onClick={handleDrawCards}
                  disabled={currentPlayer.selectedCards.length === 0}
                  className={`px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 ${
                    currentPlayer.selectedCards.length > 0
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white'
                      : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  }`}
                >
                  カード交換 ({currentPlayer.selectedCards.length}枚)
                </button>
              )}
            </div>
          </div>
        )}

        {/* ゲーム終了時の結果 */}
        {gameState.phase === GamePhase.SHOWDOWN && gameState.winner && !showResultModal && (
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl p-6 text-center mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              🎉 {gameState.winner.name} の勝利！
            </h2>
            <p className="text-white/90 text-lg">
              {gameState.winner.handResult?.rankName} - ポット獲得: {gameState.pot}
            </p>
            <p className="text-white/80 text-sm mt-2">
              詳細な結果を表示中...
            </p>
          </div>
        )}

        {/* コントロールボタン */}
        <div className="flex justify-center gap-4">
          <button
            onClick={startNewGame}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <RotateCcw size={20} />
            新しいゲーム
          </button>
          <button
            onClick={onBackToMenu}
            className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
          >
            <Home size={20} />
            メニューに戻る
          </button>
        </div>

        {/* 結果モーダル */}
        {gameState.winner && (
          <GameResultModal
            winner={gameState.winner}
            allPlayers={gameState.players}
            pot={gameState.pot}
            isOpen={showResultModal}
            onClose={() => setShowResultModal(false)}
            onNewGame={startNewGame}
            onBackToMenu={onBackToMenu}
          />
        )}
      </div>
    </div>
  );
};