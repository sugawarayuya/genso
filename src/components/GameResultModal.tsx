import React, { useState, useEffect } from 'react';
import { Player } from '../types/Element';
import { WinnerAnnouncement } from './WinnerAnnouncement';
import { HandComparison } from './HandComparison';
import { X, RotateCcw, Home } from 'lucide-react';

interface GameResultModalProps {
  winner: Player;
  allPlayers: Player[];
  pot: number;
  isOpen: boolean;
  onClose: () => void;
  onNewGame: () => void;
  onBackToMenu: () => void;
}

export const GameResultModal: React.FC<GameResultModalProps> = ({
  winner,
  allPlayers,
  pot,
  isOpen,
  onClose,
  onNewGame,
  onBackToMenu
}) => {
  const [showComparison, setShowComparison] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // 3秒後に詳細比較を表示
      const timer = setTimeout(() => {
        setShowComparison(true);
      }, 3000);
      
      return () => clearTimeout(timer);
    } else {
      setShowComparison(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* 勝者発表（最初の3秒） */}
      {!showComparison && (
        <WinnerAnnouncement 
          winner={winner}
          allPlayers={allPlayers}
          pot={pot}
        />
      )}

      {/* 詳細比較画面 */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-white/20 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* ヘッダー */}
            <div className="sticky top-0 bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-b border-white/20 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-white">ゲーム結果詳細</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* 詳細比較 */}
            <div className="p-6">
              <HandComparison players={allPlayers} winner={winner} />
            </div>

            {/* アクションボタン */}
            <div className="sticky bottom-0 bg-gradient-to-r from-slate-800 to-slate-900 p-6 border-t border-white/20 rounded-b-2xl">
              <div className="flex gap-4 justify-center">
                <button
                  onClick={onNewGame}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <RotateCcw size={20} />
                  新しいゲーム
                </button>
                <button
                  onClick={onBackToMenu}
                  className="bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white px-8 py-3 rounded-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center gap-2"
                >
                  <Home size={20} />
                  メニューに戻る
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};