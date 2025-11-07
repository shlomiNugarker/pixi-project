import type { Order, Customer, Ingredient } from "../types";
import { IngredientType } from "../types";

/**
 * Generates random customer orders
 */
export class OrderGenerator {
  private static customerNames = [
    "משה",
    "שרה",
    "דוד",
    "רחל",
    "יוסי",
    "מרים",
    "אבי",
    "דינה",
    "ישי",
    "תמר",
  ];

  private static orderCounter = 0;

  /**
   * Generate a random order
   */
  static generateOrder(): Order {
    const ingredients: Ingredient[] = [];

    // Always start with pita
    ingredients.push({
      type: IngredientType.PITA,
      quantity: 1,
    });

    // Random number of falafel balls (2-5)
    ingredients.push({
      type: IngredientType.FALAFEL_BALL,
      quantity: Math.floor(Math.random() * 4) + 2,
    });

    // Random toppings (50% chance each)
    if (Math.random() > 0.5) {
      ingredients.push({
        type: IngredientType.HUMMUS,
        quantity: 1,
      });
    }

    if (Math.random() > 0.5) {
      ingredients.push({
        type: IngredientType.TAHINI,
        quantity: 1,
      });
    }

    if (Math.random() > 0.5) {
      ingredients.push({
        type: IngredientType.SALAD,
        quantity: 1,
      });
    }

    if (Math.random() > 0.3) {
      ingredients.push({
        type: IngredientType.PICKLES,
        quantity: 1,
      });
    }

    if (Math.random() > 0.7) {
      ingredients.push({
        type: IngredientType.FRIES,
        quantity: 1,
      });
    }

    if (Math.random() > 0.7) {
      ingredients.push({
        type: IngredientType.ONION,
        quantity: 1,
      });
    }

    const customerName =
      this.customerNames[Math.floor(Math.random() * this.customerNames.length)];

    const orderId = `order-${++this.orderCounter}`;

    return {
      id: orderId,
      ingredients,
      customerName,
      patience: 100,
      maxPatience: 100,
    };
  }

  /**
   * Generate a customer with an order
   */
  static generateCustomer(): Customer {
    const order = this.generateOrder();

    return {
      id: order.id,
      name: order.customerName,
      order,
      patience: 100,
      maxPatience: 100,
    };
  }
}
