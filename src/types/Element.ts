export interface Element {
  symbol: string;
  name: string;
  atomicNumber: number;
  group: ElementGroup;
  period: number;
}

export enum ElementGroup {
  ALKALI = 'alkali',           // アルカリ金属
  ALKALINE_EARTH = 'alkaline', // アルカリ土類金属
  NONMETAL = 'nonmetal',       // 非金属
  NOBLE_GAS = 'noble'          // 貴ガス
}

export interface Card {
  element: Element;
  id: string;
}

export enum HandRank {
  HIGH_CARD = 0,
  ONE_PAIR = 1,
  TWO_PAIR = 2,
  THREE_OF_A_KIND = 3,
  STRAIGHT = 4,
  FLUSH = 5,
  FULL_HOUSE = 6,
  FOUR_OF_A_KIND = 7,
  STRAIGHT_FLUSH = 8
}

export interface HandResult {
  rank: HandRank;
  rankName: string;
  highCard: number;
  score: number;
}

export interface Player {
  id: string;
  name: string;
  hand: Card[];
  selectedCards: number[];
  handResult: HandResult | null;
  isComputer: boolean;
  chips: number;
  currentBet: number;
  hasFolded: boolean;
  hasActed: boolean;
}

export enum GamePhase {
  WAITING = 'waiting',
  DEALING = 'dealing',
  FIRST_BETTING = 'first_betting',
  DRAW = 'draw',
  SECOND_BETTING = 'second_betting',
  SHOWDOWN = 'showdown',
  GAME_OVER = 'game_over'
}

export enum GameMode {
  SINGLE_PLAYER = 'single',
  VS_COMPUTER = 'vs_computer',
  MULTIPLAYER = 'multiplayer'
}

export interface GameState {
  mode: GameMode;
  phase: GamePhase;
  players: Player[];
  currentPlayerIndex: number;
  pot: number;
  currentBet: number;
  deck: Card[];
  winner: Player | null;
}