import { Player, GameState, GameMode, GamePhase, Card } from '../types/Element';
import { createDeck, evaluateHand } from './pokerLogic';
import { ComputerAI } from './computerAI';

export class GameManager {
  private ai: ComputerAI;

  constructor() {
    this.ai = new ComputerAI('medium');
  }

  initializeGame(mode: GameMode, playerNames: string[]): GameState {
    const players: Player[] = [];
    
    // 人間プレイヤーを追加
    playerNames.forEach((name, index) => {
      players.push({
        id: `player-${index}`,
        name,
        hand: [],
        selectedCards: [],
        handResult: null,
        isComputer: false,
        chips: 1000,
        currentBet: 0,
        hasFolded: false,
        hasActed: false
      });
    });

    // コンピュータープレイヤーを追加
    if (mode === GameMode.VS_COMPUTER) {
      players.push({
        id: 'computer',
        name: 'コンピューター',
        hand: [],
        selectedCards: [],
        handResult: null,
        isComputer: true,
        chips: 1000,
        currentBet: 0,
        hasFolded: false,
        hasActed: false
      });
    }

    return {
      mode,
      phase: GamePhase.WAITING,
      players,
      currentPlayerIndex: 0,
      pot: 0,
      currentBet: 0,
      deck: createDeck(),
      winner: null
    };
  }

  dealCards(gameState: GameState): GameState {
    const newState = { ...gameState };
    let deckIndex = 0;

    newState.players.forEach(player => {
      player.hand = newState.deck.slice(deckIndex, deckIndex + 5);
      player.selectedCards = [];
      player.handResult = null;
      player.currentBet = 0;
      player.hasFolded = false;
      player.hasActed = false;
      deckIndex += 5;
    });

    newState.deck = newState.deck.slice(deckIndex);
    newState.phase = GamePhase.FIRST_BETTING;
    newState.currentPlayerIndex = 0;
    newState.pot = 0;
    newState.currentBet = 0;

    return newState;
  }

  processPlayerAction(
    gameState: GameState, 
    playerId: string, 
    action: 'fold' | 'call' | 'raise',
    raiseAmount?: number
  ): GameState {
    const newState = { ...gameState };
    const player = newState.players.find(p => p.id === playerId);
    
    if (!player || player.hasActed) return gameState;

    switch (action) {
      case 'fold':
        player.hasFolded = true;
        break;
      case 'call':
        const callAmount = Math.min(newState.currentBet - player.currentBet, player.chips);
        player.chips -= callAmount;
        player.currentBet += callAmount;
        newState.pot += callAmount;
        break;
      case 'raise':
        const totalRaise = raiseAmount || 50;
        const raiseAmountActual = Math.min(totalRaise, player.chips);
        player.chips -= raiseAmountActual;
        player.currentBet += raiseAmountActual;
        newState.pot += raiseAmountActual;
        newState.currentBet = Math.max(newState.currentBet, player.currentBet);
        break;
    }

    player.hasActed = true;
    return this.advanceToNextPlayer(newState);
  }

  processComputerTurn(gameState: GameState): GameState {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (!currentPlayer.isComputer || currentPlayer.hasActed) {
      return gameState;
    }

    // ベッティングフェーズでのAI判定
    if (gameState.phase === GamePhase.FIRST_BETTING || gameState.phase === GamePhase.SECOND_BETTING) {
      const decision = this.ai.decideBetting(currentPlayer, gameState.currentBet, gameState.pot);
      
      switch (decision) {
        case 'fold':
          return this.processPlayerAction(gameState, currentPlayer.id, 'fold');
        case 'call':
          return this.processPlayerAction(gameState, currentPlayer.id, 'call');
        case 'raise':
          return this.processPlayerAction(gameState, currentPlayer.id, 'raise', 50);
      }
    }

    return gameState;
  }

  processCardDraw(gameState: GameState, playerId: string, selectedCards: number[]): GameState {
    const newState = { ...gameState };
    const player = newState.players.find(p => p.id === playerId);
    
    if (!player || gameState.phase !== GamePhase.DRAW) return gameState;

    let deckIndex = 0;
    selectedCards.forEach(cardIndex => {
      if (deckIndex < newState.deck.length) {
        player.hand[cardIndex] = newState.deck[deckIndex];
        deckIndex++;
      }
    });

    newState.deck = newState.deck.slice(deckIndex);
    player.selectedCards = [];
    player.handResult = evaluateHand(player.hand);

    return newState;
  }

  processComputerDraw(gameState: GameState): GameState {
    const currentPlayer = gameState.players[gameState.currentPlayerIndex];
    
    if (!currentPlayer.isComputer) return gameState;

    const cardsToDiscard = this.ai.selectCardsToDiscard(currentPlayer.hand);
    return this.processCardDraw(gameState, currentPlayer.id, cardsToDiscard);
  }

  private advanceToNextPlayer(gameState: GameState): GameState {
    const newState = { ...gameState };
    
    // 全プレイヤーがアクションを完了したかチェック
    const activePlayers = newState.players.filter(p => !p.hasFolded);
    const allActed = activePlayers.every(p => p.hasActed);

    if (allActed || activePlayers.length <= 1) {
      return this.advancePhase(newState);
    }

    // 次のアクティブプレイヤーに移動
    do {
      newState.currentPlayerIndex = (newState.currentPlayerIndex + 1) % newState.players.length;
    } while (
      newState.players[newState.currentPlayerIndex].hasFolded ||
      newState.players[newState.currentPlayerIndex].hasActed
    );

    return newState;
  }

  private advancePhase(gameState: GameState): GameState {
    const newState = { ...gameState };
    
    switch (newState.phase) {
      case GamePhase.FIRST_BETTING:
        newState.phase = GamePhase.DRAW;
        break;
      case GamePhase.DRAW:
        newState.phase = GamePhase.SECOND_BETTING;
        break;
      case GamePhase.SECOND_BETTING:
        newState.phase = GamePhase.SHOWDOWN;
        newState.winner = this.determineWinner(newState);
        break;
    }

    // プレイヤーのアクション状態をリセット
    newState.players.forEach(player => {
      player.hasActed = false;
    });
    newState.currentPlayerIndex = 0;

    return newState;
  }

  private determineWinner(gameState: GameState): Player | null {
    const activePlayers = gameState.players.filter(p => !p.hasFolded);
    
    if (activePlayers.length === 1) {
      return activePlayers[0];
    }

    // 全プレイヤーの手札を評価
    activePlayers.forEach(player => {
      if (!player.handResult) {
        player.handResult = evaluateHand(player.hand);
      }
    });

    // 最高スコアのプレイヤーを見つける
    return activePlayers.reduce((winner, player) => {
      if (!winner.handResult || !player.handResult) return winner;
      return player.handResult.score > winner.handResult.score ? player : winner;
    });
  }

  canPlayerAct(gameState: GameState, playerId: string): boolean {
    const player = gameState.players.find(p => p.id === playerId);
    if (!player) return false;

    return (
      !player.hasFolded &&
      !player.hasActed &&
      gameState.players[gameState.currentPlayerIndex].id === playerId &&
      (gameState.phase === GamePhase.FIRST_BETTING || gameState.phase === GamePhase.SECOND_BETTING)
    );
  }
}