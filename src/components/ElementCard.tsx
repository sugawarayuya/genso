import React from 'react';
import { Card } from '../types/Element';
import { GROUP_COLORS, GROUP_NAMES } from '../data/elements';

interface ElementCardProps {
  card: Card;
  isSelected?: boolean;
  onClick?: () => void;
  size?: 'small' | 'medium' | 'large';
}

export const ElementCard: React.FC<ElementCardProps> = ({ 
  card, 
  isSelected = false, 
  onClick,
  size = 'medium' 
}) => {
  const sizeClasses = {
    small: 'w-16 h-20 text-xs',
    medium: 'w-20 h-28 text-sm',
    large: 'w-24 h-32 text-base'
  };

  const gradientClass = GROUP_COLORS[card.element.group];

  return (
    <div
      className={`
        ${sizeClasses[size]}
        bg-gradient-to-br ${gradientClass}
        rounded-xl shadow-lg cursor-pointer transform transition-all duration-300
        hover:scale-105 hover:shadow-xl
        ${isSelected ? 'ring-4 ring-yellow-400 scale-105' : ''}
        relative overflow-hidden
        ${onClick ? 'hover:brightness-110' : ''}
      `}
      onClick={onClick}
    >
      {/* 発光効果 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-xl" />
      
      {/* メインコンテンツ */}
      <div className="relative h-full flex flex-col justify-between p-2 text-white">
        <div className="text-center">
          <div className="font-bold text-lg leading-none">{card.element.symbol}</div>
          <div className="text-xs opacity-90">{card.element.atomicNumber}</div>
        </div>
        
        <div className="text-center">
          <div className="text-xs font-medium opacity-90 leading-tight">
            {card.element.name}
          </div>
        </div>
      </div>
      
      {/* 選択インジケーター */}
      {isSelected && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-white flex items-center justify-center">
          <div className="w-2 h-2 bg-yellow-600 rounded-full" />
        </div>
      )}
    </div>
  );
};