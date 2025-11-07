import { Container, FederatedPointerEvent } from "pixi.js";
import { IngredientType } from "../types";
import { SpriteFactory } from "../utils/SpriteFactory";

/**
 * Draggable ingredient sprite
 */
export class DraggableIngredient extends Container {
  public ingredientType: IngredientType;
  private dragging: boolean = false;
  private startX: number = 0;
  private startY: number = 0;
  private sprite: Container;
  public onDragEnd?: (ingredient: DraggableIngredient) => void;
  public onClick?: (ingredient: DraggableIngredient) => void;
  private dragStartTime: number = 0;

  constructor(type: IngredientType, x: number, y: number) {
    super();

    this.ingredientType = type;
    this.position.set(x, y);
    this.startX = x;
    this.startY = y;

    // Create sprite
    this.sprite = SpriteFactory.createIngredientSprite(type, 50);
    this.addChild(this.sprite);

    // Make interactive
    this.eventMode = "static";
    this.cursor = "pointer";

    // Add drag events
    this.on("pointerdown", this.onDragStart, this);
    this.on("pointerup", this.onDragStop, this);
    this.on("pointerupoutside", this.onDragStop, this);
    this.on("pointermove", this.onDragMove, this);
  }

  /**
   * Start dragging
   */
  private onDragStart(_event: FederatedPointerEvent): void {
    this.dragStartTime = Date.now();
    this.dragging = true;
    this.alpha = 0.7;

    // Bring to front
    if (this.parent) {
      this.parent.setChildIndex(this, this.parent.children.length - 1);
    }
  }

  /**
   * Stop dragging
   */
  private onDragStop(_event: FederatedPointerEvent): void {
    if (!this.dragging) return;

    const dragDuration = Date.now() - this.dragStartTime;
    this.dragging = false;
    this.alpha = 1;

    // If it was a quick click (less than 200ms), treat as click
    if (dragDuration < 200 && this.onClick) {
      this.onClick(this);
    } else if (this.onDragEnd) {
      // Otherwise treat as drag
      this.onDragEnd(this);
    }
  }

  /**
   * Move while dragging
   */
  private onDragMove(event: FederatedPointerEvent): void {
    if (this.dragging) {
      const newPosition = event.global;

      // Convert global position to parent's local coordinates
      if (this.parent) {
        const localPos = this.parent.toLocal(newPosition);
        this.position.set(localPos.x, localPos.y);
      }
    }
  }

  /**
   * Reset to original position
   */
  resetPosition(): void {
    this.position.set(this.startX, this.startY);
    this.alpha = 1;
  }

  /**
   * Animate adding to pita (bounce effect)
   */
  animateAdd(): void {
    // Simple scale animation
    this.scale.set(1.2);
    setTimeout(() => {
      this.scale.set(1);
    }, 100);
  }

  /**
   * Get ingredient type
   */
  getType(): IngredientType {
    return this.ingredientType;
  }
}
