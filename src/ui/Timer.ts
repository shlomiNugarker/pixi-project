import { Container, Text, TextStyle, Graphics } from "pixi.js";

/**
 * Displays countdown timer for the game round
 */
export class Timer extends Container {
  private timeText: Text;
  private timeLeft: number;
  private maxTime: number;
  private background: Graphics;
  private onTimeUp?: () => void;

  constructor(
    x: number,
    y: number,
    maxTime: number = 90,
    onTimeUp?: () => void,
  ) {
    super();

    this.position.set(x, y);
    this.timeLeft = maxTime;
    this.maxTime = maxTime;
    this.onTimeUp = onTimeUp;

    // Create background
    this.background = new Graphics();
    this.background.rect(-5, -5, 150, 50);
    this.background.fill({ color: 0x333333, alpha: 0.7 });
    this.addChild(this.background);

    // Create text style
    const style = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 28,
      fontWeight: "bold",
      fill: "#FFFFFF",
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 3,
        color: "#000000",
        distance: 2,
      },
    });

    this.timeText = new Text({
      text: this.formatTime(this.timeLeft),
      style,
    });

    this.addChild(this.timeText);
  }

  /**
   * Format seconds to MM:SS
   */
  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  /**
   * Update timer (call every frame with delta time)
   */
  update(delta: number): void {
    this.timeLeft -= delta / 60; // Convert delta to seconds (assuming 60 FPS)

    if (this.timeLeft <= 0) {
      this.timeLeft = 0;
      if (this.onTimeUp) {
        this.onTimeUp();
      }
    }

    this.timeText.text = this.formatTime(this.timeLeft);

    // Change color when time is running out
    if (this.timeLeft <= 10) {
      (this.timeText.style as TextStyle).fill = "#FF4444"; // Red
    } else if (this.timeLeft <= 30) {
      (this.timeText.style as TextStyle).fill = "#FFAA00"; // Orange
    }
  }

  /**
   * Get remaining time
   */
  getTimeLeft(): number {
    return this.timeLeft;
  }

  /**
   * Check if time is up
   */
  isTimeUp(): boolean {
    return this.timeLeft <= 0;
  }

  /**
   * Reset timer
   */
  reset(): void {
    this.timeLeft = this.maxTime;
    (this.timeText.style as TextStyle).fill = "#FFFFFF";
  }
}
