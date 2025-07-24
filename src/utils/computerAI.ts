import { Player, Card, HandRank } from '../types/Element';
import { evaluateHand } from './pokerLogic';

export class ComputerAI {
  private difficulty: 'easy' | 'medium' | 'hard';

  constructor(difficulty: 'easy' | 'medium' | 'hard' = 'medium') {
    this.difficulty = difficulty;
  }

  // カード交換の決定
  selectCardsToDiscard(hand: Card[]): number[] {
    const handResult = evaluateHand(hand);
    const cardsToDiscard: number[] = [];

    // 既に強い役がある場合は交換しない
    if (handResult.rank >= HandRank.TWO_PAIR) {
      return [];
    }

    // ペアがある場合の戦略
    if (handResult.rank === HandRank.ONE_PAIR) {
      const numbers = hand.map(card => card.element.atomicNumber);
      const numberCounts = numbers.reduce((acc, num) => {
        acc[num] = (acc[num] || 0) + 1;
        return acc;
      }, {} as Record<number, number>);

      const pairNumber = Object.keys(numberCounts).find(
        key => numberCounts[parseInt(key)] === 2
      );

      if (pairNumber) {
        // ペア以外のカードを交換
        hand.forEach((card, index) => {
          if (card.element.atomicNumber !== parseInt(pairNumber)) {
            cardsToDiscard.push(index);
          }
        });
      }
      return cardsToDiscard;
    }

    // ストレートドローの判定
    const straightDraw = this.checkStraightDraw(hand);
    if (straightDraw.length > 0) {
      return straightDraw;
    }

    // フラッシュドローの判定
    const flushDraw = this.checkFlushDraw(hand);
    if (flushDraw.length > 0) {
      return flushDraw;
    }

    // 高いカードを残す戦略
    return this.selectHighCardStrategy(hand);
  }

  // ベッティングの決定
  decideBetting(player: Player, currentBet: number, pot: number): 'fold' | 'call' | 'raise' {
    const handStrength = this.evaluateHandStrength(player.hand, player.handResult);
    const potOdds = currentBet / (pot + currentBet);
    
    // 難易度による調整
    let aggressiveness = 0.5;
    switch (this.difficulty) {
      case 'easy':
        aggressiveness = 0.3;
        break;
      case 'hard':
        aggressiveness = 0.7;
        break;
    }

    // チップ不足の場合
    if (player.chips < currentBet) {
      return handStrength > 0.6 ? 'call' : 'fold';
    }

    // 手札の強さに基づく判定
    if (handStrength > 0.8) {
      return Math.random() < aggressiveness ? 'raise' : 'call';
    } else if (handStrength > 0.5) {
      return 'call';
    } else if (handStrength > 0.3 && potOdds < 0.3) {
      return 'call';
    } else {
      return 'fold';
    }
  }

  private evaluateHandStrength(hand: Card[], handResult: HandResult | null): number {
    if (!handResult) return 0;

    // 役の強さを0-1の範囲で評価
    const baseStrength = handResult.rank / 8; // HandRank.STRAIGHT_FLUSH = 8
    const highCardBonus = handResult.highCard / 20; // 最大原子番号20
    
    return Math.min(baseStrength + highCardBonus * 0.1, 1);
  }

  private checkStraightDraw(hand: Card[]): number[] {
    const numbers = hand.map(card => card.element.atomicNumber).sort((a, b) => a - b);
    
    // 4枚ストレートドローを探す
    for (let i = 0; i <= numbers.length - 4; i++) {
      let consecutive = 1;
      for (let j = i + 1; j < numbers.length; j++) {
        if (numbers[j] === numbers[j - 1] + 1) {
          consecutive++;
        } else {
          break;
        }
      }
      
      if (consecutive >= 4) {
        // ストレートドローでない1枚を見つけて交換
        const straightCards = numbers.slice(i, i + consecutive);
        const discardIndices: number[] = [];
        
        hand.forEach((card, index) => {
          if (!straightCards.includes(card.element.atomicNumber)) {
            discardIndices.push(index);
          }
        });
        
        return discardIndices.slice(0, 1); // 1枚だけ交換
      }
    }
    
    return [];
  }

  private checkFlushDraw(hand: Card[]): number[] {
    const groups = hand.map(card => card.element.group);
    const groupCounts = groups.reduce((acc, group) => {
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 4枚フラッシュドローを探す
    const majorityGroup = Object.keys(groupCounts).find(
      group => groupCounts[group] >= 4
    );

    if (majorityGroup) {
      const discardIndices: number[] = [];
      hand.forEach((card, index) => {
        if (card.element.group !== majorityGroup) {
          discardIndices.push(index);
        }
      });
      return discardIndices.slice(0, 1); // 1枚だけ交換
    }

    return [];
  }

  private selectHighCardStrategy(hand: Card[]): number[] {
    // 原子番号の低いカードから交換
    const sortedWithIndex = hand
      .map((card, index) => ({ card, index }))
      .sort((a, b) => a.card.element.atomicNumber - b.card.element.atomicNumber);

    return sortedWithIndex.slice(0, 3).map(item => item.index);
  }
}