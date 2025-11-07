import { Graphics, Container, Text, TextStyle } from "pixi.js";
import { IngredientType } from "../types";

/**
 * Factory for creating placeholder sprites
 */
export class SpriteFactory {
  /**
   * Create a colored circle sprite with label
   */
  static createIngredientSprite(
    type: IngredientType,
    size: number = 50,
  ): Container {
    const container = new Container();

    const colors: Record<IngredientType, number> = {
      [IngredientType.PITA]: 0xf5deb3, // Wheat
      [IngredientType.FALAFEL_BALL]: 0x8b4513, // Brown
      [IngredientType.HUMMUS]: 0xdaa520, // Goldenrod
      [IngredientType.TAHINI]: 0xf0e68c, // Khaki
      [IngredientType.SALAD]: 0x228b22, // Forest green
      [IngredientType.FRIES]: 0xffd700, // Gold
      [IngredientType.PICKLES]: 0x9acd32, // Yellow green
      [IngredientType.ONION]: 0xffb6c1, // Light pink
    };

    const graphic = new Graphics();

    if (type === IngredientType.PITA) {
      // Draw pita as oval
      graphic.ellipse(0, 0, size * 0.8, size * 0.6);
      graphic.fill({ color: colors[type] });
      graphic.stroke({ color: 0x000000, width: 2 });
    } else {
      // Draw other ingredients as circles
      graphic.circle(0, 0, size / 2);
      graphic.fill({ color: colors[type] });
      graphic.stroke({ color: 0x000000, width: 2 });
    }

    container.addChild(graphic);

    // Add label
    const style = new TextStyle({
      fontSize: 12,
      fill: "#000000",
      fontWeight: "bold",
    });

    const label = new Text({
      text: this.getIngredientShortName(type),
      style,
    });
    label.anchor.set(0.5);
    label.position.set(0, size * 0.7);
    container.addChild(label);

    return container;
  }

  /**
   * Create a customer sprite
   */
  static createCustomerSprite(
    name: string,
    color: number = 0xff6b6b,
  ): Container {
    const container = new Container();

    // Body
    const body = new Graphics();
    body.rect(-30, -20, 60, 80);
    body.fill({ color });
    body.stroke({ color: 0x000000, width: 2 });
    container.addChild(body);

    // Head
    const head = new Graphics();
    head.circle(0, -40, 20);
    head.fill({ color: 0xfdbcb4 }); // Skin color
    head.stroke({ color: 0x000000, width: 2 });
    container.addChild(head);

    // Name tag
    const style = new TextStyle({
      fontSize: 14,
      fill: "#ffffff",
      fontWeight: "bold",
    });

    const nameText = new Text({
      text: name,
      style,
    });
    nameText.anchor.set(0.5);
    nameText.position.set(0, 0);
    container.addChild(nameText);

    return container;
  }

  /**
   * Create a patience bar
   */
  static createPatienceBar(width: number = 60, height: number = 8): Container {
    const container = new Container();

    // Background
    const bg = new Graphics();
    bg.rect(0, 0, width, height);
    bg.fill({ color: 0x333333 });
    container.addChild(bg);

    // Foreground (will be updated)
    const fg = new Graphics();
    fg.rect(0, 0, width, height);
    fg.fill({ color: 0x00ff00 }); // Green
    container.addChild(fg);

    // Store reference to foreground for updates
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (container as any).foreground = fg;

    return container;
  }

  /**
   * Update patience bar
   */
  static updatePatienceBar(
    bar: Container,
    percentage: number,
    width: number = 60,
    height: number = 8,
  ): void {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const fg = (bar as any).foreground as Graphics;
    if (!fg) return;

    fg.clear();

    // Color based on percentage
    let color = 0x00ff00; // Green
    if (percentage < 30) {
      color = 0xff0000; // Red
    } else if (percentage < 60) {
      color = 0xffaa00; // Orange
    }

    fg.rect(0, 0, (width * percentage) / 100, height);
    fg.fill({ color });
  }

  /**
   * Get short name for ingredient
   */
  private static getIngredientShortName(type: IngredientType): string {
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
}
