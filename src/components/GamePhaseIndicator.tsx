import React from 'react';
import { GamePhase } from '../types/Element';
import { Car as Cards, DollarSign, Eye, Trophy } from 'lucide-react';

interface GamePhaseIndicatorProps {
  phase: GamePhase;
  pot: number;
  currentBet: number;
}

export const GamePhaseIndicator: React.FC<GamePhaseIndicatorProps> = ({ 
  phase, 
  pot, 
  currentBet 
}) => {
  const getPhaseInfo = () => {
    switch (phase) {
      case GamePhase.FIRST_BETTING:
        return {
          icon: <DollarSign className="w-6 h-6" />,
          title: '第1ベッティングラウンド',
          description: 'カード交換前のベッティング',
          color: 'from-blue-500 to-blue-600'
        };
      case GamePhase.DRAW:
        return {
          icon: <Cards className="w-6 h-6" />,
          title: 'カード交換フェーズ',
          description: '不要なカードを交換',
          color: 'from-green-500 to-green-600'
        };
      case GamePhase.SECOND_BETTING:
        return {
          icon: <DollarSign className="w-6 h-6" />,
          title: '第2ベッティングラウンド',
          description: 'カード交換後の最終ベッティング',
          color: 'from-orange-500 to-orange-600'
        };
      case GamePhase.SHOWDOWN:
        return {
          icon: <Eye className="w-6 h-6" />,
          title: 'ショーダウン',
          description: '手札を公開して勝負',
          color: 'from-purple-500 to-purple-600'
        };
      case GamePhase.GAME_OVER:
        return {
          icon: <Trophy className="w-6 h-6" />,
          title: 'ゲーム終了',
          description: '勝者決定',
          color: 'from-yellow-500 to-yellow-600'
        };
      default:
        return {
          icon: <Cards className="w-6 h-6" />,
          title: 'ゲーム準備中',
          description: '',
          color: 'from-gray-500 to-gray-600'
        };
    }
  };

  const phaseInfo = getPhaseInfo();

  return (
    <div className="text-center mb-6">
      <div className={`bg-gradient-to-r ${phaseInfo.color} rounded-xl p-4 shadow-lg inline-block min-w-80`}>
        <div className="flex items-center justify-center gap-3 mb-2">
          <div className="text-white">{phaseInfo.icon}</div>
          <h2 className="text-white text-xl font-bold">{phaseInfo.title}</h2>
        </div>
        <p className="text-white/90 text-sm mb-3">{phaseInfo.description}</p>
        
        <div className="flex justify-center gap-6 text-white">
          <div className="text-center">
            <div className="text-2xl font-bold">{pot.toLocaleString()}</div>
            <div className="text-xs opacity-90">ポット</div>
          </div>
          {currentBet > 0 && (
            <div className="text-center">
              <div className="text-2xl font-bold">{currentBet.toLocaleString()}</div>
              <div className="text-xs opacity-90">現在のベット</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};