import { Element, ElementGroup } from '../types/Element';

export const ELEMENTS: Element[] = [
  { symbol: 'H', name: '水素', atomicNumber: 1, group: ElementGroup.NONMETAL, period: 1 },
  { symbol: 'He', name: 'ヘリウム', atomicNumber: 2, group: ElementGroup.NOBLE_GAS, period: 1 },
  { symbol: 'Li', name: 'リチウム', atomicNumber: 3, group: ElementGroup.ALKALI, period: 2 },
  { symbol: 'Be', name: 'ベリリウム', atomicNumber: 4, group: ElementGroup.ALKALINE_EARTH, period: 2 },
  { symbol: 'B', name: 'ホウ素', atomicNumber: 5, group: ElementGroup.NONMETAL, period: 2 },
  { symbol: 'C', name: '炭素', atomicNumber: 6, group: ElementGroup.NONMETAL, period: 2 },
  { symbol: 'N', name: '窒素', atomicNumber: 7, group: ElementGroup.NONMETAL, period: 2 },
  { symbol: 'O', name: '酸素', atomicNumber: 8, group: ElementGroup.NONMETAL, period: 2 },
  { symbol: 'F', name: 'フッ素', atomicNumber: 9, group: ElementGroup.NONMETAL, period: 2 },
  { symbol: 'Ne', name: 'ネオン', atomicNumber: 10, group: ElementGroup.NOBLE_GAS, period: 2 },
  { symbol: 'Na', name: 'ナトリウム', atomicNumber: 11, group: ElementGroup.ALKALI, period: 3 },
  { symbol: 'Mg', name: 'マグネシウム', atomicNumber: 12, group: ElementGroup.ALKALINE_EARTH, period: 3 },
  { symbol: 'Al', name: 'アルミニウム', atomicNumber: 13, group: ElementGroup.NONMETAL, period: 3 },
  { symbol: 'Si', name: 'ケイ素', atomicNumber: 14, group: ElementGroup.NONMETAL, period: 3 },
  { symbol: 'P', name: 'リン', atomicNumber: 15, group: ElementGroup.NONMETAL, period: 3 },
  { symbol: 'S', name: '硫黄', atomicNumber: 16, group: ElementGroup.NONMETAL, period: 3 },
  { symbol: 'Cl', name: '塩素', atomicNumber: 17, group: ElementGroup.NONMETAL, period: 3 },
  { symbol: 'Ar', name: 'アルゴン', atomicNumber: 18, group: ElementGroup.NOBLE_GAS, period: 3 },
  { symbol: 'K', name: 'カリウム', atomicNumber: 19, group: ElementGroup.ALKALI, period: 4 },
  { symbol: 'Ca', name: 'カルシウム', atomicNumber: 20, group: ElementGroup.ALKALINE_EARTH, period: 4 },
];

export const GROUP_COLORS = {
  [ElementGroup.ALKALI]: 'from-red-400 to-red-600',
  [ElementGroup.ALKALINE_EARTH]: 'from-orange-400 to-orange-600',
  [ElementGroup.NONMETAL]: 'from-blue-400 to-blue-600',
  [ElementGroup.NOBLE_GAS]: 'from-purple-400 to-purple-600',
};

export const GROUP_NAMES = {
  [ElementGroup.ALKALI]: 'アルカリ金属',
  [ElementGroup.ALKALINE_EARTH]: 'アルカリ土類金属',
  [ElementGroup.NONMETAL]: '非金属',
  [ElementGroup.NOBLE_GAS]: '貴ガス',
};