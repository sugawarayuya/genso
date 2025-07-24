import React from 'react';
import { GameMode } from '../types/Element';
import { User, Users, Bot } from 'lucide-react';

interface GameModeSelectorProps {
  onSelectMode: (mode: GameMode) => void;
}

export const GameModeSelector: React.FC<GameModeSelectorProps> = ({ onSelectMode }) => {
  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-8">
        ゲームモードを選択
      </h2>
      
      <div className="grid gap-6">
        <button
          onClick={() => onSelectMode(GameMode.SINGLE_PLAYER)}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-4"
        >
          <User size={32} />
          <div className="text-left">
            <h3 className="text-xl font-bold">シングルプレイ</h3>
            <p className="text-blue-100">一人でポーカーを楽しむ</p>
          </div>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.VS_COMPUTER)}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-4"
        >
          <Bot size={32} />
          <div className="text-left">
            <h3 className="text-xl font-bold">コンピューター対戦</h3>
            <p className="text-purple-100">AIと戦略的な勝負</p>
          </div>
        </button>

        <button
          onClick={() => onSelectMode(GameMode.MULTIPLAYER)}
          className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white p-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-4"
        >
          <Users size={32} />
          <div className="text-left">
            <h3 className="text-xl font-bold">マルチプレイヤー</h3>
            <p className="text-green-100">友達と一緒にプレイ</p>
          </div>
        </button>
      </div>
    </div>
  );
};