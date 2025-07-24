import React from 'react';
import { Player } from '../types/Element';
import { Clock, User, Bot } from 'lucide-react';

interface TurnIndicatorProps {
  currentPlayer: Player;
  phase: string;
  timeRemaining?: number;
}

export const TurnIndicator: React.FC<TurnIndicatorProps> = ({ 
  currentPlayer, 
  phase, 
  timeRemaining 
}) => {
  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 shadow-lg border-2 border-yellow-300 animate-pulse">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          {currentPlayer.isComputer ? (
            <Bot className="w-6 h-6 text-white animate-spin" />
          ) : (
            <User className="w-6 h-6 text-white" />
          )}
          <span className="text-white font-bold text-lg">
            {currentPlayer.name}のターン
          </span>
        </div>
        
        <div className="flex items-center gap-2 text-white/90">
          <Clock className="w-5 h-5" />
          <span className="text-sm">{phase}</span>
        </div>
      </div>
      
      {timeRemaining && (
        <div className="mt-2">
          <div className="bg-white/20 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-white h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(timeRemaining / 30) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};