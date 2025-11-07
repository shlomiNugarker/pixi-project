import { Application, Container } from "pixi.js";
import type { Scene } from "./Scene";

/**
 * Manages scene transitions and lifecycle
 */
export class SceneManager {
  private app: Application;
  private currentScene: Scene | null = null;
  private scenes: Map<string, Scene> = new Map();
  private sceneContainer: Container;

  constructor(app: Application) {
    this.app = app;
    this.sceneContainer = new Container();
    this.app.stage.addChild(this.sceneContainer);
  }

  /**
   * Register a scene with a name
   */
  registerScene(name: string, scene: Scene): void {
    this.scenes.set(name, scene);
  }

  /**
   * Switch to a different scene
   */
  async switchScene(name: string): Promise<void> {
    const newScene = this.scenes.get(name);

    if (!newScene) {
      console.error(`Scene "${name}" not found!`);
      return;
    }

    // Remove current scene
    if (this.currentScene) {
      this.currentScene.hide();
      this.sceneContainer.removeChild(this.currentScene.container);
    }

    // Add and initialize new scene
    this.currentScene = newScene;
    this.sceneContainer.addChild(newScene.container);

    await newScene.init();
    newScene.show();
  }

  /**
   * Update the current scene
   */
  update(delta: number): void {
    if (this.currentScene) {
      this.currentScene.update(delta);
    }
  }

  /**
   * Get the current scene
   */
  getCurrentScene(): Scene | null {
    return this.currentScene;
  }

  /**
   * Clean up all scenes
   */
  destroy(): void {
    this.scenes.forEach((scene) => scene.destroy());
    this.scenes.clear();
    this.currentScene = null;
  }
}
