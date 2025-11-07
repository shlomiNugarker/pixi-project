import { Application } from "pixi.js";
import { SceneManager } from "./scenes/SceneManager";
import { MenuScene } from "./scenes/MenuScene";
import { GameScene } from "./scenes/GameScene";
import { GameOverScene } from "./scenes/GameOverScene";

/**
 * Falafel King - מלך הפלאפל
 * A fun browser-based falafel making game
 */
(async () => {
  // Create a new application
  const app = new Application();

  // Initialize the application with fixed size
  await app.init({
    background: "#f4e4c1",
    width: 800,
    height: 600,
    antialias: true,
  });

  // Append the application canvas to the document body
  const container = document.getElementById("pixi-container");
  if (container) {
    container.appendChild(app.canvas);
  }

  // Create scene manager
  const sceneManager = new SceneManager(app);

  // Create all scenes
  const menuScene = new MenuScene();
  const gameScene = new GameScene();
  const gameOverScene = new GameOverScene();

  // Register scenes
  sceneManager.registerScene("menu", menuScene);
  sceneManager.registerScene("game", gameScene);
  sceneManager.registerScene("gameOver", gameOverScene);

  // Set up scene transitions
  menuScene.onStartGame = () => {
    sceneManager.switchScene("game");
  };

  gameScene.onGameOver = (finalScore: number) => {
    gameOverScene.setScore(finalScore);
    sceneManager.switchScene("gameOver");
  };

  gameOverScene.onRestart = () => {
    // Need to recreate game scene for a fresh start
    const newGameScene = new GameScene();
    sceneManager.registerScene("game", newGameScene);
    newGameScene.onGameOver = (finalScore: number) => {
      gameOverScene.setScore(finalScore);
      sceneManager.switchScene("gameOver");
    };
    sceneManager.switchScene("game");
  };

  gameOverScene.onMainMenu = () => {
    sceneManager.switchScene("menu");
  };

  // Start with menu scene
  await sceneManager.switchScene("menu");

  // Main game loop
  app.ticker.add((time) => {
    sceneManager.update(time.deltaTime);
  });

  console.log("🥙 מלך הפלאפל - Game started!");
})();
