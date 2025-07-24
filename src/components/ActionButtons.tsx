import React, { useState } from 'react';
import { Player } from '../types/Element';
import { X, Check, TrendingUp, Timer } from 'lucide-react';

interface ActionButtonsProps {
  player: Player;
  currentBet: number;
  canAct: boolean;
  onAction: (action: 'fold' | 'call' | 'raise', raiseAmount?: number) => void;
}

export const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  player, 
  currentBet, 
  canAct, 
  onAction 
}) => {
  const [raiseAmount, setRaiseAmount] = useState(50);
  const [timeLeft, setTimeLeft] = useState(30);

  React.useEffect(() => {
    if (!canAct) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 時間切れで自動フォールド
          onAction('fold');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [canAct, onAction]);

  React.useEffect(() => {
    if (canAct) {
      setTimeLeft(30);
    }
  }, [canAct]);

  if (!canAct) {
    return (
      <div className="text-center py-4">
        <div className="text-gray-400 text-sm">他のプレイヤーのターンを待っています...</div>
      </div>
    );
  }

  const callAmount = currentBet - player.currentBet;
  const canRaise = player.chips >= raiseAmount;
  const canCall = player.chips >= callAmount;

  return (
    <div className="bg-white/5 rounded-xl p-4 border border-white/10">
      {/* タイマー */}
      <div className="mb-4 text-center">
        <div className="flex items-center justify-center gap-2 text-white mb-2">
          <Timer className="w-5 h-5" />
          <span className="font-semibold">残り時間: {timeLeft}秒</span>
        </div>
        <div className="bg-white/20 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full transition-all duration-1000 ease-linear ${
              timeLeft > 10 ? 'bg-green-400' : timeLeft > 5 ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            style={{ width: `${(timeLeft / 30) * 100}%` }}
          />
        </div>
      </div>

      {/* アクションボタン */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* フォールド */}
        <button
          onClick={() => onAction('fold')}
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <X size={18} />
          フォールド
        </button>

        {/* コール */}
        <button
          onClick={() => onAction('call')}
          disabled={!canCall}
          className={`py-3 px-4 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 ${
            canCall
              ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
              : 'bg-gray-500 text-gray-300 cursor-not-allowed'
          }`}
        >
          <Check size={18} />
          コール ({callAmount.toLocaleString()})
        </button>

        {/* レイズ */}
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              value={raiseAmount}
              onChange={(e) => setRaiseAmount(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max={player.chips}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <button
              onClick={() => onAction('raise', raiseAmount)}
              disabled={!canRaise}
              className={`px-4 py-2 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-1 text-sm ${
                canRaise
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
                  : 'bg-gray-500 text-gray-300 cursor-not-allowed'
              }`}
            >
              <TrendingUp size={16} />
              レイズ
            </button>
          </div>
          
          {/* クイックベットボタン */}
          <div className="flex gap-1">
            {[25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => setRaiseAmount(amount)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white text-xs py-1 px-2 rounded transition-colors"
              >
                {amount}
              </button>
            ))}
            <button
              onClick={() => setRaiseAmount(player.chips)}
              className="flex-1 bg-red-500/20 hover:bg-red-500/30 text-red-300 text-xs py-1 px-2 rounded transition-colors"
            >
              ALL-IN
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};