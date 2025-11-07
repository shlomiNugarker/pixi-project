import { Graphics, Text, TextStyle, Container } from "pixi.js";
import { Scene } from "./Scene";

/**
 * Game over screen
 */
export class GameOverScene extends Scene {
  private finalScore: number = 0;
  public onRestart?: () => void;
  public onMainMenu?: () => void;

  async init(): Promise<void> {
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 800, 600);
    bg.fill({ color: 0x333333 }); // Dark background
    this.container.addChild(bg);

    // Game Over title
    const titleStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 72,
      fontWeight: "bold",
      fill: "#ff4444",
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 4,
        color: "#000000",
        distance: 5,
      },
    });

    const title = new Text({
      text: "!המשחק הסתיים",
      style: titleStyle,
    });
    title.anchor.set(0.5);
    title.position.set(400, 120);
    this.container.addChild(title);

    // Score display
    const scoreStyle = new TextStyle({
      fontSize: 48,
      fontWeight: "bold",
      fill: "#ffd700",
    });

    const scoreText = new Text({
      text: `ניקוד סופי: ${this.finalScore}`,
      style: scoreStyle,
    });
    scoreText.anchor.set(0.5);
    scoreText.position.set(400, 220);
    this.container.addChild(scoreText);

    // Performance message
    const messageStyle = new TextStyle({
      fontSize: 28,
      fill: "#ffffff",
    });

    const message = this.getPerformanceMessage(this.finalScore);
    const messageText = new Text({
      text: message,
      style: messageStyle,
    });
    messageText.anchor.set(0.5);
    messageText.position.set(400, 300);
    this.container.addChild(messageText);

    // Buttons
    const restartButton = this.createButton("!שחק שוב", 0x4caf50);
    restartButton.position.set(250, 400);
    restartButton.on("pointerup", () => {
      if (this.onRestart) {
        this.onRestart();
      }
    });
    this.container.addChild(restartButton);

    const menuButton = this.createButton("תפריט ראשי", 0x2196f3);
    menuButton.position.set(250, 490);
    menuButton.on("pointerup", () => {
      if (this.onMainMenu) {
        this.onMainMenu();
      }
    });
    this.container.addChild(menuButton);
  }

  /**
   * Set the final score
   */
  setScore(score: number): void {
    this.finalScore = score;
  }

  /**
   * Get performance message based on score
   */
  private getPerformanceMessage(score: number): string {
    if (score >= 400) {
      return "!מלך הפלאפל האמיתי";
    } else if (score >= 300) {
      return "!עבודה מצוינת";
    } else if (score >= 200) {
      return "!לא רע בכלל";
    } else if (score >= 100) {
      return "צריך עוד תרגול";
    } else {
      return "...נסה שוב";
    }
  }

  /**
   * Create a button
   */
  private createButton(label: string, color: number): Container {
    const button = new Container();

    // Button background
    const bg = new Graphics();
    bg.roundRect(0, 0, 300, 60, 10);
    bg.fill({ color });
    bg.stroke({ color: 0x000000, width: 3 });
    button.addChild(bg);

    // Button text
    const style = new TextStyle({
      fontSize: 28,
      fontWeight: "bold",
      fill: "#ffffff",
    });

    const text = new Text({
      text: label,
      style,
    });
    text.anchor.set(0.5);
    text.position.set(150, 30);
    button.addChild(text);

    // Make interactive
    button.eventMode = "static";
    button.cursor = "pointer";

    button.on("pointerover", () => {
      bg.tint = 0xcccccc;
      button.scale.set(1.05);
    });

    button.on("pointerout", () => {
      bg.tint = 0xffffff;
      button.scale.set(1);
    });

    button.on("pointerdown", () => {
      bg.tint = 0x888888;
    });

    return button;
  }

  update(_delta: number): void {
    // No updates needed for game over screen
  }
}
