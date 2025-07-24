import React, { useState } from 'react';
import { GameMode } from '../types/Element';
import { UserPlus, Play } from 'lucide-react';

interface PlayerSetupProps {
  mode: GameMode;
  onStartGame: (playerNames: string[]) => void;
  onBack: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ mode, onStartGame, onBack }) => {
  const [playerNames, setPlayerNames] = useState<string[]>(['プレイヤー1']);

  const addPlayer = () => {
    if (playerNames.length < 4) {
      setPlayerNames([...playerNames, `プレイヤー${playerNames.length + 1}`]);
    }
  };

  const removePlayer = (index: number) => {
    if (playerNames.length > 1) {
      setPlayerNames(playerNames.filter((_, i) => i !== index));
    }
  };

  const updatePlayerName = (index: number, name: string) => {
    const newNames = [...playerNames];
    newNames[index] = name;
    setPlayerNames(newNames);
  };

  const handleStartGame = () => {
    const validNames = playerNames.filter(name => name.trim() !== '');
    if (validNames.length > 0) {
      onStartGame(validNames);
    }
  };

  const getTitle = () => {
    switch (mode) {
      case GameMode.VS_COMPUTER:
        return 'コンピューター対戦設定';
      case GameMode.MULTIPLAYER:
        return 'マルチプレイヤー設定';
      default:
        return 'シングルプレイ設定';
    }
  };

  const getDescription = () => {
    switch (mode) {
      case GameMode.VS_COMPUTER:
        return 'あなたの名前を入力してください';
      case GameMode.MULTIPLAYER:
        return 'プレイヤー名を入力してください（最大4人）';
      default:
        return 'あなたの名前を入力してください';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl border border-white/20 max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-2">
        {getTitle()}
      </h2>
      <p className="text-gray-300 text-center mb-8">
        {getDescription()}
      </p>

      <div className="space-y-4 mb-8">
        {playerNames.map((name, index) => (
          <div key={index} className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => updatePlayerName(index, e.target.value)}
              className="flex-1 bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`プレイヤー${index + 1}の名前`}
              maxLength={20}
            />
            {mode === GameMode.MULTIPLAYER && playerNames.length > 1 && (
              <button
                onClick={() => removePlayer(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg transition-colors"
              >
                削除
              </button>
            )}
          </div>
        ))}
      </div>

      {mode === GameMode.MULTIPLAYER && playerNames.length < 4 && (
        <button
          onClick={addPlayer}
          className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 mb-6"
        >
          <UserPlus size={20} />
          プレイヤーを追加
        </button>
      )}

      <div className="flex gap-4">
        <button
          onClick={onBack}
          className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-semibold transition-colors"
        >
          戻る
        </button>
        <button
          onClick={handleStartGame}
          className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2"
        >
          <Play size={20} />
          ゲーム開始
        </button>
      </div>
    </div>
  );
};