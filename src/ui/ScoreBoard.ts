import { Container, Text, TextStyle } from "pixi.js";

/**
 * Displays the player's current score
 */
export class ScoreBoard extends Container {
  private scoreText: Text;
  private score: number = 0;

  constructor(x: number, y: number) {
    super();

    this.position.set(x, y);

    // Create text style with drop shadow
    const style = new TextStyle({
      fontFamily: "Arial, sans-serif",
      fontSize: 32,
      fontWeight: "bold",
      fill: "#FFD700", // Gold color
      dropShadow: {
        alpha: 0.8,
        angle: Math.PI / 6,
        blur: 4,
        color: "#000000",
        distance: 3,
      },
    });

    this.scoreText = new Text({
      text: "ניקוד: 0",
      style,
    });

    this.addChild(this.scoreText);
  }

  /**
   * Update the displayed score
   */
  setScore(score: number): void {
    this.score = score;
    this.scoreText.text = `ניקוד: ${score}`;
  }

  /**
   * Add points to the score
   */
  addScore(points: number): void {
    this.setScore(this.score + points);
  }

  /**
   * Get current score
   */
  getScore(): number {
    return this.score;
  }
}
