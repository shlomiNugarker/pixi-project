import { Graphics, Text, TextStyle, Container } from "pixi.js";
import { Scene } from "./Scene";

/**
 * Main menu / start screen
 */
export class MenuScene extends Scene {
  public onStartGame?: () => void;

  async init(): Promise<void> {
    // Background
    const bg = new Graphics();
    bg.rect(0, 0, 800, 600);
    bg.fill({ color: 0xffdd44 }); // Yellow background
    this.container.addChild(bg);

    // Title
    const titleStyle = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 64,
      fontWeight: "bold",
      fill: "#8b4513",
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 4,
        color: "#000000",
        distance: 5,
      },
    });

    const title = new Text({
      text: "מלך הפלאפל",
      style: titleStyle,
    });
    title.anchor.set(0.5);
    title.position.set(400, 150);
    this.container.addChild(title);

    // Subtitle
    const subtitleStyle = new TextStyle({
      fontSize: 24,
      fill: "#8b4513",
    });

    const subtitle = new Text({
      text: "הכן פלאפל מושלם ללקוחות!",
      style: subtitleStyle,
    });
    subtitle.anchor.set(0.5);
    subtitle.position.set(400, 230);
    this.container.addChild(subtitle);

    // Instructions
    const instructionsStyle = new TextStyle({
      fontSize: 18,
      fill: "#000000",
      align: "center",
      lineHeight: 28,
    });

    const instructions = new Text({
      text:
        "איך לשחק:\n" +
        "לחץ על מרכיבים להוספה (או גרור)\n" +
        "הכן את הפלאפל לפי ההזמנה\n" +
        'לחץ על "הגש!" כשמוכן\n' +
        "\n" +
        "זמן: 2.5 דקות | 5 לקוחות",
      style: instructionsStyle,
    });
    instructions.anchor.set(0.5);
    instructions.position.set(400, 350);
    this.container.addChild(instructions);

    // Start button
    const startButton = this.createStartButton();
    startButton.position.set(300, 480);
    this.container.addChild(startButton);
  }

  /**
   * Create start button
   */
  private createStartButton(): Container {
    const button = new Container();

    // Button background
    const bg = new Graphics();
    bg.roundRect(0, 0, 200, 60, 10);
    bg.fill({ color: 0x4caf50 });
    bg.stroke({ color: 0x000000, width: 3 });
    button.addChild(bg);

    // Button text
    const style = new TextStyle({
      fontSize: 32,
      fontWeight: "bold",
      fill: "#ffffff",
    });

    const text = new Text({
      text: "!התחל משחק",
      style,
    });
    text.anchor.set(0.5);
    text.position.set(100, 30);
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

    button.on("pointerup", () => {
      bg.tint = 0xffffff;
      if (this.onStartGame) {
        this.onStartGame();
      }
    });

    return button;
  }

  update(_delta: number): void {
    // No updates needed for menu
  }
}
