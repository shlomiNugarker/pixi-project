/**
 * Core game types for Falafel King
 */

export enum IngredientType {
  PITA = "pita",
  FALAFEL_BALL = "falafel_ball",
  HUMMUS = "hummus",
  TAHINI = "tahini",
  SALAD = "salad",
  FRIES = "fries",
  PICKLES = "pickles",
  ONION = "onion",
}

export interface Ingredient {
  type: IngredientType;
  quantity: number;
}

export interface Order {
  id: string;
  ingredients: Ingredient[];
  customerName: string;
  patience: number; // 0-100
  maxPatience: number;
}

export interface Customer {
  id: string;
  name: string;
  order: Order;
  patience: number; // Current patience level (0-100)
  maxPatience: number; // Starting patience
  sprite?: unknown; // Pixi sprite reference
}

export interface GameState {
  score: number;
  timeLeft: number; // seconds
  maxTime: number; // 90 seconds
  currentOrder: Order | null;
  customers: Customer[];
  completedOrders: number;
  failedOrders: number;
}

export interface PitaContent {
  ingredients: Map<IngredientType, number>;
}

// Scene interface
export interface IScene {
  container: unknown; // Pixi Container
  init(): Promise<void>;
  update(delta: number): void;
  destroy(): void;
}
