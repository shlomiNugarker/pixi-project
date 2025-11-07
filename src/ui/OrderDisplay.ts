import { Container, Text, TextStyle, Graphics } from "pixi.js";
import type { Order } from "../types";
import { IngredientType } from "../types";

/**
 * Displays the current customer's order
 */
export class OrderDisplay extends Container {
  private orderText: Text;
  private background: Graphics;
  private titleText: Text;

  constructor(x: number, y: number) {
    super();

    this.position.set(x, y);

    // Create background panel
    this.background = new Graphics();
    this.background.rect(0, 0, 250, 200);
    this.background.fill({ color: 0xf5deb3, alpha: 0.9 }); // Wheat color
    this.background.stroke({ color: 0x8b4513, width: 3 }); // Brown border
    this.addChild(this.background);

    // Title
    const titleStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 24,
      fontWeight: "bold",
      fill: "#8B4513",
    });

    this.titleText = new Text({
      text: "הזמנה:",
      style: titleStyle,
    });
    this.titleText.position.set(10, 10);
    this.addChild(this.titleText);

    // Order details
    const orderStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 18,
      fill: "#000000",
      lineHeight: 24,
    });

    this.orderText = new Text({
      text: "אין הזמנה",
      style: orderStyle,
    });
    this.orderText.position.set(10, 45);
    this.addChild(this.orderText);
  }

  /**
   * Display an order
   */
  setOrder(order: Order | null): void {
    if (!order) {
      this.orderText.text = "אין הזמנה";
      return;
    }

    // Build order text
    const lines: string[] = [`לקוח: ${order.customerName}`, "---"];

    order.ingredients.forEach((ingredient) => {
      const name = this.getIngredientName(ingredient.type);
      lines.push(`${name}: ${ingredient.quantity}`);
    });

    this.orderText.text = lines.join("\n");
  }

  /**
   * Get Hebrew name for ingredient
   */
  private getIngredientName(type: IngredientType): string {
    const names: Record<IngredientType, string> = {
      [IngredientType.PITA]: "פיתה",
      [IngredientType.FALAFEL_BALL]: "כדורי פלאפל",
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
   * Clear the order display
   */
  clear(): void {
    this.orderText.text = "אין הזמנה";
  }
}
