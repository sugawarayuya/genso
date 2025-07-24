import React from 'react';
import { Player } from '../types/Element';
import { Crown, Trophy, Star, Sparkles } from 'lucide-react';

interface WinnerAnnouncementProps {
  winner: Player;
  allPlayers: Player[];
  pot: number;
}

export const WinnerAnnouncement: React.FC<WinnerAnnouncementProps> = ({ 
  winner, 
  allPlayers, 
  pot 
}) => {
  const activePlayers = allPlayers.filter(p => !p.hasFolded);
  const sortedPlayers = activePlayers.sort((a, b) => {
    if (!a.handResult || !b.handResult) return 0;
    return b.handResult.score - a.handResult.score;
  });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 rounded-3xl p-8 shadow-2xl border-4 border-yellow-300 max-w-2xl w-full mx-4 animate-scaleIn">
        {/* 勝者発表ヘッダー */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-3 mb-4">
            <Trophy className="w-12 h-12 text-white animate-bounce" />
            <h1 className="text-4xl font-bold text-white">勝者決定！</h1>
            <Trophy className="w-12 h-12 text-white animate-bounce" style={{ animationDelay: '0.2s' }} />
          </div>
          
          {/* 勝者情報 */}
          <div className="bg-white/20 rounded-2xl p-6 mb-6 backdrop-blur-lg border border-white/30">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="relative">
                <Crown className="w-16 h-16 text-yellow-300 animate-pulse" />
                <Sparkles className="w-6 h-6 text-yellow-200 absolute -top-2 -right-2 animate-spin" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white mb-2">{winner.name}</h2>
                <div className="bg-yellow-300 text-black px-4 py-2 rounded-full font-bold text-lg">
                  {winner.handResult?.rankName}
                </div>
              </div>
            </div>
            
            <div className="text-white text-xl font-semibold">
              ポット獲得: <span className="text-yellow-300 text-2xl">{pot.toLocaleString()}</span> チップ
            </div>
          </div>
        </div>

        {/* 順位表 */}
        <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
          <h3 className="text-white text-xl font-bold mb-4 text-center flex items-center justify-center gap-2">
            <Star className="w-6 h-6 text-yellow-300" />
            最終順位
          </h3>
          
          <div className="space-y-3">
            {sortedPlayers.map((player, index) => (
              <div 
                key={player.id}
                className={`flex items-center justify-between p-4 rounded-xl transition-all duration-500 ${
                  index === 0 
                    ? 'bg-gradient-to-r from-yellow-400/30 to-orange-500/30 border-2 border-yellow-300 animate-pulse' 
                    : 'bg-white/10 border border-white/20'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${
                    index === 0 ? 'bg-yellow-400 text-black' :
                    index === 1 ? 'bg-gray-300 text-black' :
                    index === 2 ? 'bg-orange-400 text-black' :
                    'bg-gray-600 text-white'
                  }`}>
                    {index + 1}
                  </div>
                  
                  <div>
                    <div className="text-white font-semibold flex items-center gap-2">
                      {player.name}
                      {index === 0 && <Crown className="w-5 h-5 text-yellow-300" />}
                    </div>
                    <div className="text-gray-300 text-sm">
                      {player.handResult?.rankName || 'フォールド'}
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-white font-bold">
                    {player.handResult?.score.toLocaleString() || '0'}
                  </div>
                  <div className="text-gray-300 text-sm">スコア</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 手札比較 */}
        <div className="mt-6 bg-white/10 rounded-2xl p-6 backdrop-blur-lg border border-white/20">
          <h3 className="text-white text-lg font-bold mb-4 text-center">手札比較</h3>
          <div className="grid gap-4">
            {sortedPlayers.slice(0, 3).map((player, index) => (
              <div key={player.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">{player.name}:</span>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    index === 0 ? 'bg-yellow-400 text-black' : 'bg-white/20 text-white'
                  }`}>
                    {player.handResult?.rankName}
                  </span>
                </div>
                <div className="text-white font-mono">
                  {player.handResult?.score.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 装飾的な要素 */}
        <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-300 rounded-full animate-ping opacity-75"></div>
        <div className="absolute -top-2 -right-6 w-6 h-6 bg-orange-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '0.5s' }}></div>
        <div className="absolute -bottom-4 -left-6 w-10 h-10 bg-red-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-2 -right-4 w-7 h-7 bg-yellow-400 rounded-full animate-ping opacity-75" style={{ animationDelay: '1.5s' }}></div>
      </div>
    </div>
  );
};