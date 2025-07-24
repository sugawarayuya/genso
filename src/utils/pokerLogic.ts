import { Card, HandRank, HandResult, ElementGroup } from '../types/Element';

export function createDeck(): Card[] {
  const deck: Card[] = [];
  const elements = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
  
  // 各元素を4枚ずつ作成（異なるID）
  elements.forEach(atomicNumber => {
    for (let i = 0; i < 4; i++) {
      const element = getElementByAtomicNumber(atomicNumber);
      if (element) {
        deck.push({
          element,
          id: `${element.symbol}-${i + 1}`
        });
      }
    }
  });
  
  return shuffleDeck(deck);
}

export function shuffleDeck(deck: Card[]): Card[] {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function getElementByAtomicNumber(atomicNumber: number) {
  const elements = [
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
  
  return elements.find(e => e.atomicNumber === atomicNumber);
}

export function evaluateHand(cards: Card[]): HandResult {
  if (cards.length !== 5) {
    return { rank: HandRank.HIGH_CARD, rankName: 'ハイカード', highCard: 0, score: 0 };
  }

  const sortedCards = [...cards].sort((a, b) => a.element.atomicNumber - b.element.atomicNumber);
  const numbers = sortedCards.map(card => card.element.atomicNumber);
  const groups = sortedCards.map(card => card.element.group);
  
  // グループ（スート）の統計
  const groupCounts = groups.reduce((acc, group) => {
    acc[group] = (acc[group] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  // 数字の統計
  const numberCounts = numbers.reduce((acc, num) => {
    acc[num] = (acc[num] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);
  
  const counts = Object.values(numberCounts).sort((a, b) => b - a);
  const highCard = Math.max(...numbers);
  const isFlush = Object.keys(groupCounts).length === 1;
  const isStraight = checkStraight(numbers);
  
  // 役判定
  if (isStraight && isFlush) {
    return { rank: HandRank.STRAIGHT_FLUSH, rankName: 'ストレートフラッシュ', highCard, score: 8000 + highCard };
  }
  
  if (counts[0] === 4) {
    return { rank: HandRank.FOUR_OF_A_KIND, rankName: 'フォーカード', highCard, score: 7000 + highCard };
  }
  
  if (counts[0] === 3 && counts[1] === 2) {
    return { rank: HandRank.FULL_HOUSE, rankName: 'フルハウス', highCard, score: 6000 + highCard };
  }
  
  if (isFlush) {
    return { rank: HandRank.FLUSH, rankName: 'フラッシュ', highCard, score: 5000 + highCard };
  }
  
  if (isStraight) {
    return { rank: HandRank.STRAIGHT, rankName: 'ストレート', highCard, score: 4000 + highCard };
  }
  
  if (counts[0] === 3) {
    return { rank: HandRank.THREE_OF_A_KIND, rankName: 'スリーカード', highCard, score: 3000 + highCard };
  }
  
  if (counts[0] === 2 && counts[1] === 2) {
    return { rank: HandRank.TWO_PAIR, rankName: 'ツーペア', highCard, score: 2000 + highCard };
  }
  
  if (counts[0] === 2) {
    return { rank: HandRank.ONE_PAIR, rankName: 'ワンペア', highCard, score: 1000 + highCard };
  }
  
  return { rank: HandRank.HIGH_CARD, rankName: 'ハイカード', highCard, score: highCard };
}

function checkStraight(numbers: number[]): boolean {
  const sorted = [...numbers].sort((a, b) => a - b);
  for (let i = 1; i < sorted.length; i++) {
    if (sorted[i] !== sorted[i - 1] + 1) {
      return false;
    }
  }
  return true;
}