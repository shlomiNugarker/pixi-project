import { Container } from "pixi.js";
import type { Customer } from "../types";
import { SpriteFactory } from "../utils/SpriteFactory";

/**
 * Customer sprite with patience bar
 */
export class CustomerSprite extends Container {
  public customer: Customer;
  private patienceBar: Container;
  private sprite: Container;

  constructor(customer: Customer) {
    super();

    this.customer = customer;

    // Create customer visual
    const colors = [0xff6b6b, 0x6b8eff, 0xff6bff, 0x6bffd5, 0xffd56b];
    const color = colors[Math.floor(Math.random() * colors.length)];
    this.sprite = SpriteFactory.createCustomerSprite(customer.name, color);
    this.addChild(this.sprite);

    // Create patience bar
    this.patienceBar = SpriteFactory.createPatienceBar(60, 8);
    this.patienceBar.position.set(-30, 70);
    this.addChild(this.patienceBar);

    // Store reference
    customer.sprite = this;
  }

  /**
   * Update patience level
   */
  updatePatience(delta: number): void {
    // Decrease patience over time - made slower (was 0.5, now 0.15)
    this.customer.patience -= delta * 0.15;

    if (this.customer.patience < 0) {
      this.customer.patience = 0;
    }

    // Update patience bar
    const percentage =
      (this.customer.patience / this.customer.maxPatience) * 100;
    SpriteFactory.updatePatienceBar(this.patienceBar, percentage, 60, 8);
  }

  /**
   * Check if customer is out of patience
   */
  isOutOfPatience(): boolean {
    return this.customer.patience <= 0;
  }

  /**
   * Get customer data
   */
  getCustomer(): Customer {
    return this.customer;
  }
}
