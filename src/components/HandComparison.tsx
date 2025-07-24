import React from 'react';
import { Player } from '../types/Element';
import { ElementCard } from './ElementCard';
import { Crown, TrendingUp, TrendingDown } from 'lucide-react';

interface HandComparisonProps {
  players: Player[];
  winner: Player;
}

export const HandComparison: React.FC<HandComparisonProps> = ({ players, winner }) => {
  const activePlayers = players.filter(p => !p.hasFolded);
  const sortedPlayers = activePlayers.sort((a, b) => {
    if (!a.handResult || !b.handResult) return 0;
    return b.handResult.score - a.handResult.score;
  });

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 shadow-2xl border border-white/20 mb-6">
      <h3 className="text-white text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
        <Crown className="w-8 h-8 text-yellow-400" />
        手札比較 - 勝負結果
      </h3>
      
      <div className="grid gap-6">
        {sortedPlayers.map((player, index) => (
          <div 
            key={player.id}
            className={`relative overflow-hidden rounded-xl transition-all duration-700 ${
              player.id === winner.id
                ? 'bg-gradient-to-r from-yellow-400/20 to-orange-500/20 border-2 border-yellow-400 shadow-2xl transform scale-105'
                : 'bg-white/5 border border-white/10'
            }`}
            style={{ animationDelay: `${index * 0.2}s` }}
          >
            {/* 勝者の光る効果 */}
            {player.id === winner.id && (
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-500/10 animate-pulse" />
            )}
            
            <div className="relative z-10 p-6">
              {/* プレイヤー情報ヘッダー */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-400 text-black animate-bounce' :
                    index === 1 ? 'bg-gray-300 text-black' :
                    index === 2 ? 'bg-orange-400 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="text-white font-bold text-xl flex items-center gap-2">
                      {player.name}
                      {player.id === winner.id && (
                        <Crown className="w-6 h-6 text-yellow-400 animate-pulse" />
                      )}
                      {player.isComputer && (
                        <span className="bg-purple-500 text-white text-xs px-2 py-1 rounded-full">AI</span>
                      )}
                    </div>
                    <div className="text-gray-300">
                      {player.id === winner.id ? '🏆 勝者' : `第${index + 1}位`}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    player.id === winner.id ? 'text-yellow-400' : 'text-white'
                  }`}>
                    {player.handResult?.score.toLocaleString() || '0'}
                  </div>
                  <div className="text-gray-300 text-sm">スコア</div>
                </div>
              </div>

              {/* 役の表示 */}
              <div className="mb-4">
                <div className={`inline-block px-4 py-2 rounded-full font-bold text-lg ${
                  player.id === winner.id
                    ? 'bg-yellow-400 text-black'
                    : 'bg-white/20 text-white'
                }`}>
                  {player.handResult?.rankName || 'フォールド'}
                </div>
                
                {/* スコア差の表示 */}
                {index > 0 && player.handResult && sortedPlayers[0].handResult && (
                  <div className="ml-4 inline-flex items-center gap-1 text-gray-400 text-sm">
                    <TrendingDown className="w-4 h-4" />
                    -{(sortedPlayers[0].handResult.score - player.handResult.score).toLocaleString()}
                  </div>
                )}
              </div>

              {/* 手札表示 */}
              <div className="flex justify-center gap-2 mb-4">
                {player.hand.map((card, cardIndex) => (
                  <div 
                    key={card.id}
                    className="transform transition-all duration-500"
                    style={{ 
                      animationDelay: `${index * 0.2 + cardIndex * 0.1}s`,
                      transform: player.id === winner.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  >
                    <ElementCard
                      card={card}
                      size="medium"
                    />
                  </div>
                ))}
              </div>

              {/* 詳細情報 */}
              {player.handResult && (
                <div className="text-center text-gray-300 text-sm">
                  最高カード: {player.handResult.highCard} 
                  {player.id === winner.id && (
                    <span className="ml-2 text-yellow-400 font-semibold animate-pulse">
                      ✨ 勝利！
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 勝利条件の説明 */}
      <div className="mt-6 bg-white/5 rounded-xl p-4 border border-white/10">
        <h4 className="text-white font-semibold mb-2 text-center">勝利条件</h4>
        <div className="text-gray-300 text-sm text-center">
          <p>最も高いスコアを持つプレイヤーが勝者となります</p>
          <p className="mt-1">役の強さ &gt; 最高カードの原子番号の順で判定</p>
        </div>
      </div>
    </div>
  );
};