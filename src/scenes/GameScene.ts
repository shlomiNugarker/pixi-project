import { Graphics, Text, TextStyle } from "pixi.js";
import { Scene } from "./Scene";
import type { GameState } from "../types";
import { IngredientType } from "../types";
import { ScoreBoard } from "../ui/ScoreBoard";
import { Timer } from "../ui/Timer";
import { OrderDisplay } from "../ui/OrderDisplay";
import { PitaAssembly } from "../sprites/PitaAssembly";
import { DraggableIngredient } from "../sprites/DraggableIngredient";
import { CustomerSprite } from "../sprites/CustomerSprite";
import { OrderGenerator } from "../utils/OrderGenerator";
import { OrderValidator } from "../utils/OrderValidator";

/**
 * Main gameplay scene
 */
export class GameScene extends Scene {
  private gameState!: GameState;
  private scoreBoard!: ScoreBoard;
  private timer!: Timer;
  private orderDisplay!: OrderDisplay;
  private pitaAssembly!: PitaAssembly;
  private ingredients: DraggableIngredient[] = [];
  private customerSprites: CustomerSprite[] = [];
  private currentCustomerIndex: number = 0;
  private feedbackText!: Text;
  public onGameOver?: (finalScore: number) => void;

  async init(): Promise<void> {
    // Initialize game state
    this.gameState = {
      score: 0,
      timeLeft: 150,
      maxTime: 150,
      currentOrder: null,
      customers: [],
      completedOrders: 0,
      failedOrders: 0,
    };

    // Create background
    const bg = new Graphics();
    bg.rect(0, 0, 800, 600);
    bg.fill({ color: 0xf4e4c1 }); // Beige background
    this.container.addChild(bg);

    // Create UI
    this.scoreBoard = new ScoreBoard(20, 20);
    this.container.addChild(this.scoreBoard);

    this.timer = new Timer(650, 20, 150, () => this.handleGameOver());
    this.container.addChild(this.timer);

    this.orderDisplay = new OrderDisplay(20, 80);
    this.container.addChild(this.orderDisplay);

    // Create pita assembly area
    this.pitaAssembly = new PitaAssembly(550, 300);
    this.pitaAssembly.onServe = () => this.handleServe();
    this.container.addChild(this.pitaAssembly);

    // Create feedback text (hidden initially)
    this.feedbackText = new Text({
      text: "",
      style: new TextStyle({
        fontSize: 32,
        fontWeight: "bold",
        fill: "#ffffff",
        stroke: { color: "#000000", width: 4 },
      }),
    });
    this.feedbackText.anchor.set(0.5);
    this.feedbackText.position.set(400, 300);
    this.feedbackText.visible = false;
    this.container.addChild(this.feedbackText);

    // Create ingredient palette
    this.createIngredientPalette();

    // Generate customers
    this.generateCustomers(5);

    // Show first customer
    this.showNextCustomer();
  }

  /**
   * Create ingredient selection palette
   */
  private createIngredientPalette(): void {
    const ingredients = [
      IngredientType.PITA,
      IngredientType.FALAFEL_BALL,
      IngredientType.HUMMUS,
      IngredientType.TAHINI,
      IngredientType.SALAD,
      IngredientType.FRIES,
      IngredientType.PICKLES,
      IngredientType.ONION,
    ];

    let x = 50;
    let y = 350;

    ingredients.forEach((type, index) => {
      const ingredient = new DraggableIngredient(type, x, y);
      ingredient.onDragEnd = (ing) => this.handleIngredientDrop(ing);
      ingredient.onClick = (ing) => this.handleIngredientClick(ing);
      this.ingredients.push(ingredient);
      this.container.addChild(ingredient);

      x += 60;
      if ((index + 1) % 4 === 0) {
        x = 50;
        y += 80;
      }
    });
  }

  /**
   * Handle ingredient click (simple add without dragging)
   */
  private handleIngredientClick(ingredient: DraggableIngredient): void {
    this.pitaAssembly.addIngredient(ingredient.getType());
    ingredient.animateAdd();
  }

  /**
   * Generate customers for this round
   */
  private generateCustomers(count: number): void {
    for (let i = 0; i < count; i++) {
      const customer = OrderGenerator.generateCustomer();
      this.gameState.customers.push(customer);
    }
  }

  /**
   * Show next customer in queue
   */
  private showNextCustomer(): void {
    if (this.currentCustomerIndex >= this.gameState.customers.length) {
      // All customers served
      this.handleGameOver();
      return;
    }

    const customer = this.gameState.customers[this.currentCustomerIndex];
    this.gameState.currentOrder = customer.order;

    // Create customer sprite
    const customerSprite = new CustomerSprite(customer);
    customerSprite.position.set(350, 100);
    this.customerSprites.push(customerSprite);
    this.container.addChild(customerSprite);

    // Update order display
    this.orderDisplay.setOrder(customer.order);
  }

  /**
   * Handle ingredient drop
   */
  private handleIngredientDrop(ingredient: DraggableIngredient): void {
    this.pitaAssembly.checkIngredientDrop(ingredient);

    // Reset ingredient position
    ingredient.resetPosition();
  }

  /**
   * Handle serving the pita
   */
  private handleServe(): void {
    if (!this.gameState.currentOrder) return;

    const pitaContent = this.pitaAssembly.getContent();
    const result = OrderValidator.validate(
      pitaContent,
      this.gameState.currentOrder,
    );

    // Update score
    this.scoreBoard.addScore(result.score);

    // Show feedback
    this.showFeedback(result.message, result.isCorrect);

    // Update stats
    if (result.isCorrect) {
      this.gameState.completedOrders++;
    } else {
      this.gameState.failedOrders++;
    }

    // Remove current customer
    const currentCustomer = this.customerSprites[this.currentCustomerIndex];
    if (currentCustomer) {
      this.container.removeChild(currentCustomer);
    }

    // Clear pita
    this.pitaAssembly.clear();

    // Next customer
    this.currentCustomerIndex++;
    setTimeout(() => {
      this.showNextCustomer();
    }, 1500);
  }

  /**
   * Show feedback message
   */
  private showFeedback(message: string, isSuccess: boolean): void {
    this.feedbackText.text = message;
    (this.feedbackText.style as TextStyle).fill = isSuccess
      ? "#00ff00"
      : "#ff0000";
    this.feedbackText.visible = true;

    setTimeout(() => {
      this.feedbackText.visible = false;
    }, 1500);
  }

  /**
   * Handle game over
   */
  private handleGameOver(): void {
    if (this.onGameOver) {
      this.onGameOver(this.scoreBoard.getScore());
    }
  }

  /**
   * Update loop
   */
  update(delta: number): void {
    // Update timer
    this.timer.update(delta);

    // Update customer patience
    if (this.currentCustomerIndex < this.customerSprites.length) {
      const currentCustomer = this.customerSprites[this.currentCustomerIndex];
      if (currentCustomer) {
        currentCustomer.updatePatience(delta);

        // Check if customer ran out of patience
        if (currentCustomer.isOutOfPatience()) {
          this.showFeedback("!הלקוח איבד סבלנות", false);
          this.gameState.failedOrders++;
          this.scoreBoard.addScore(-20);

          this.container.removeChild(currentCustomer);
          this.pitaAssembly.clear();
          this.currentCustomerIndex++;

          setTimeout(() => {
            this.showNextCustomer();
          }, 1500);
        }
      }
    }
  }
}
