import React from 'react';
import { Player } from '../types/Element';
import { Crown, User, Bot, Coins } from 'lucide-react';

interface PlayerCardProps {
  player: Player;
  isCurrentTurn: boolean;
  isWinner?: boolean;
  position: 'top' | 'bottom' | 'left' | 'right';
}

export const PlayerCard: React.FC<PlayerCardProps> = ({ 
  player, 
  isCurrentTurn, 
  isWinner = false,
  position 
}) => {
  const getPositionClasses = () => {
    const base = "transition-all duration-500 transform";
    if (isCurrentTurn) {
      return `${base} scale-110 ring-4 ring-yellow-400 ring-opacity-75 shadow-2xl`;
    }
    return `${base} hover:scale-105`;
  };

  const getBackgroundClasses = () => {
    if (player.hasFolded) {
      return "bg-gray-600/50 opacity-60";
    }
    if (isCurrentTurn) {
      return "bg-gradient-to-br from-yellow-400/20 to-orange-500/20 backdrop-blur-lg border-yellow-400";
    }
    if (isWinner) {
      return "bg-gradient-to-br from-green-400/20 to-emerald-500/20 backdrop-blur-lg border-green-400";
    }
    return "bg-white/10 backdrop-blur-lg border-white/20";
  };

  return (
    <div className={`${getPositionClasses()} ${getBackgroundClasses()} rounded-xl p-4 border-2 relative overflow-hidden`}>
      {/* 現在のターンのアニメーション効果 */}
      {isCurrentTurn && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 animate-pulse" />
      )}
      
      {/* プレイヤー情報 */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {player.isComputer ? (
              <div className={`w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center ${isCurrentTurn ? 'animate-bounce' : ''}`}>
                <Bot className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className={`w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center ${isCurrentTurn ? 'animate-bounce' : ''}`}>
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div>
              <div className="text-white font-semibold flex items-center gap-1">
                {player.name}
                {isWinner && <Crown className="w-4 h-4 text-yellow-400" />}
              </div>
              {isCurrentTurn && (
                <div className="text-yellow-300 text-xs font-medium animate-pulse">
                  アクション中...
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* チップとベット情報 */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-1 text-gray-300">
              <Coins className="w-4 h-4" />
              <span>チップ</span>
            </div>
            <span className="text-white font-semibold">{player.chips.toLocaleString()}</span>
          </div>
          
          {player.currentBet > 0 && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">ベット</span>
              <span className="text-yellow-400 font-semibold">{player.currentBet.toLocaleString()}</span>
            </div>
          )}
        </div>

        {/* 手札の役 */}
        {player.handResult && (
          <div className="mt-3 text-center">
            <div className="bg-black/20 rounded-lg p-2">
              <div className="text-yellow-400 font-semibold text-sm">{player.handResult.rankName}</div>
              <div className="text-gray-300 text-xs">スコア: {player.handResult.score.toLocaleString()}</div>
            </div>
          </div>
        )}
        
        {/* ステータス表示 */}
        {player.hasFolded && (
          <div className="mt-2 text-center">
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
              フォールド
            </span>
          </div>
        )}
      </div>
    </div>
  );
};