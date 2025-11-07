import { Container } from "pixi.js";
import type { IScene } from "../types";

/**
 * Base Scene class that all game scenes extend
 */
export abstract class Scene implements IScene {
  public container: Container;

  constructor() {
    this.container = new Container();
  }

  /**
   * Initialize the scene - load assets, create sprites, etc.
   */
  abstract init(): Promise<void>;

  /**
   * Update loop called every frame
   * @param delta - Time elapsed since last frame
   */
  abstract update(delta: number): void;

  /**
   * Clean up scene - remove event listeners, destroy sprites, etc.
   */
  destroy(): void {
    this.container.destroy({ children: true });
  }

  /**
   * Show the scene
   */
  show(): void {
    this.container.visible = true;
  }

  /**
   * Hide the scene
   */
  hide(): void {
    this.container.visible = false;
  }
}
