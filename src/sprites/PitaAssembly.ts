import { Container, Graphics, Text, TextStyle } from "pixi.js";
import type { PitaContent } from "../types";
import { IngredientType } from "../types";
import { DraggableIngredient } from "./DraggableIngredient";

/**
 * Pita assembly area where ingredients are placed
 */
export class PitaAssembly extends Container {
  private background: Graphics;
  private content: Map<IngredientType, number> = new Map();
  private ingredientDisplay: Container;
  private serveButton: Container;
  public onServe?: () => void;

  constructor(x: number, y: number, width: number = 200, height: number = 250) {
    super();

    this.position.set(x, y);

    // Background (pita plate)
    this.background = new Graphics();
    this.background.rect(0, 0, width, height);
    this.background.fill({ color: 0xffffff, alpha: 0.8 });
    this.background.stroke({ color: 0x8b4513, width: 3 });
    this.addChild(this.background);

    // Title
    const titleStyle = new TextStyle({
      fontSize: 20,
      fontWeight: "bold",
      fill: "#8b4513",
    });

    const title = new Text({
      text: "הרכב פלאפל",
      style: titleStyle,
    });
    title.position.set(10, 10);
    this.addChild(title);

    // Ingredient display area
    this.ingredientDisplay = new Container();
    this.ingredientDisplay.position.set(10, 45);
    this.addChild(this.ingredientDisplay);

    // Clear button
    const clearButton = this.createClearButton();
    clearButton.position.set(10, height - 50);
    this.addChild(clearButton);

    // Serve button
    this.serveButton = this.createServeButton();
    this.serveButton.position.set(width - 110, height - 50);
    this.addChild(this.serveButton);
  }

  /**
   * Create serve button
   */
  private createServeButton(): Container {
    const button = new Container();

    // Button background
    const bg = new Graphics();
    bg.roundRect(0, 0, 100, 40, 5);
    bg.fill({ color: 0x4caf50 });
    bg.stroke({ color: 0x000000, width: 2 });
    button.addChild(bg);

    // Button text
    const style = new TextStyle({
      fontSize: 18,
      fontWeight: "bold",
      fill: "#ffffff",
    });

    const text = new Text({
      text: "הגש!",
      style,
    });
    text.anchor.set(0.5);
    text.position.set(50, 20);
    button.addChild(text);

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";

    button.on("pointerdown", () => {
      bg.tint = 0xcccccc;
    });

    button.on("pointerup", () => {
      bg.tint = 0xffffff;
      if (this.onServe) {
        this.onServe();
      }
    });

    button.on("pointerupoutside", () => {
      bg.tint = 0xffffff;
    });

    return button;
  }

  /**
   * Create clear button
   */
  private createClearButton(): Container {
    const button = new Container();

    // Button background
    const bg = new Graphics();
    bg.roundRect(0, 0, 80, 40, 5);
    bg.fill({ color: 0xff6b6b }); // Red
    bg.stroke({ color: 0x000000, width: 2 });
    button.addChild(bg);

    // Button text
    const style = new TextStyle({
      fontSize: 16,
      fontWeight: "bold",
      fill: "#ffffff",
    });

    const text = new Text({
      text: "נקה",
      style,
    });
    text.anchor.set(0.5);
    text.position.set(40, 20);
    button.addChild(text);

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";

    button.on("pointerdown", () => {
      bg.tint = 0xcccccc;
    });

    button.on("pointerup", () => {
      bg.tint = 0xffffff;
      this.clear();
    });

    button.on("pointerupoutside", () => {
      bg.tint = 0xffffff;
    });

    return button;
  }

  /**
   * Add an ingredient to the pita
   */
  addIngredient(type: IngredientType): void {
    const currentCount = this.content.get(type) || 0;
    this.content.set(type, currentCount + 1);
    this.updateDisplay();
  }

  /**
   * Check if a dragged ingredient should be added
   */
  checkIngredientDrop(ingredient: DraggableIngredient): boolean {
    // Check if ingredient is dropped in the assembly area
    // Using center point for more lenient detection
    const bounds = this.getBounds();
    const ingredientPos = ingredient.getGlobalPosition();

    // Make the drop zone more forgiving by expanding the bounds
    const padding = 50; // pixels of extra margin
    const isInside =
      ingredientPos.x >= bounds.x - padding &&
      ingredientPos.x <= bounds.x + bounds.width + padding &&
      ingredientPos.y >= bounds.y - padding &&
      ingredientPos.y <= bounds.y + bounds.height + padding;

    if (isInside) {
      this.addIngredient(ingredient.getType());
      ingredient.animateAdd();
      return true;
    }

    return false;
  }

  /**
   * Update the display of current ingredients
   */
  private updateDisplay(): void {
    this.ingredientDisplay.removeChildren();

    const style = new TextStyle({
      fontSize: 16,
      fill: "#000000",
    });

    let yOffset = 0;
    this.content.forEach((count, type) => {
      const text = new Text({
        text: `${this.getIngredientName(type)}: ${count}`,
        style,
      });
      text.position.set(0, yOffset);
      this.ingredientDisplay.addChild(text);
      yOffset += 22;
    });
  }

  /**
   * Get ingredient name in Hebrew
   */
  private getIngredientName(type: IngredientType): string {
    const names: Record<IngredientType, string> = {
      [IngredientType.PITA]: "פיתה",
      [IngredientType.FALAFEL_BALL]: "פלאפל",
      [IngredientType.HUMMUS]: "חומוס",
      [IngredientType.TAHINI]: "טחינה",
      [IngredientType.SALAD]: "סלט",
      [IngredientType.FRIES]: "צ'יפס",
      [IngredientType.PICKLES]: "חמוצים",
      [IngredientType.ONION]: "בצל",
    };
    return names[type] || type;
  }

  /**
   * Get current pita content
   */
  getContent(): PitaContent {
    return {
      ingredients: new Map(this.content),
    };
  }

  /**
   * Clear the pita
   */
  clear(): void {
    this.content.clear();
    this.updateDisplay();
  }
}
