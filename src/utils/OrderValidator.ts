import type { Order, PitaContent } from "../types";
import { IngredientType } from "../types";

export interface ValidationResult {
  isCorrect: boolean;
  score: number;
  message: string;
}

/**
 * Validates player's pita against customer order
 */
export class OrderValidator {
  /**
   * Validate the assembled pita against the order
   */
  static validate(pitaContent: PitaContent, order: Order): ValidationResult {
    const requiredIngredients = new Map<IngredientType, number>();

    // Build required ingredients map
    order.ingredients.forEach((ingredient) => {
      requiredIngredients.set(ingredient.type, ingredient.quantity);
    });

    // Check each required ingredient
    let correctCount = 0;
    let totalRequired = 0;
    const missing: string[] = [];
    const extra: string[] = [];

    // Check what's required
    requiredIngredients.forEach((required, type) => {
      totalRequired += required;
      const actual = pitaContent.ingredients.get(type) || 0;

      if (actual === required) {
        correctCount += required;
      } else if (actual < required) {
        missing.push(
          `${this.getIngredientName(type)} (צריך ${required}, יש ${actual})`,
        );
      } else {
        extra.push(
          `${this.getIngredientName(type)} (יותר מדי: ${actual - required})`,
        );
      }
    });

    // Check for completely extra ingredients
    pitaContent.ingredients.forEach((count, type) => {
      if (!requiredIngredients.has(type)) {
        extra.push(`${this.getIngredientName(type)} (לא היה בהזמנה)`);
      }
    });

    // Calculate accuracy
    const accuracy = totalRequired > 0 ? correctCount / totalRequired : 0;

    // Determine result
    if (accuracy === 1 && extra.length === 0) {
      return {
        isCorrect: true,
        score: 100,
        message: "!מושלם! הזמנה נכונה",
      };
    } else if (accuracy >= 0.8) {
      return {
        isCorrect: true,
        score: Math.floor(accuracy * 80),
        message: `טוב! ${Math.floor(accuracy * 100)}% נכון`,
      };
    } else if (accuracy >= 0.5) {
      return {
        isCorrect: false,
        score: Math.floor(accuracy * 40),
        message: `לא רע, אבל...\n${this.buildErrorMessage(missing, extra)}`,
      };
    } else {
      return {
        isCorrect: false,
        score: 0,
        message: `!הזמנה שגויה\n${this.buildErrorMessage(missing, extra)}`,
      };
    }
  }

  /**
   * Build error message
   */
  private static buildErrorMessage(missing: string[], extra: string[]): string {
    const messages: string[] = [];

    if (missing.length > 0) {
      messages.push("חסר: " + missing.join(", "));
    }

    if (extra.length > 0) {
      messages.push("עודף: " + extra.join(", "));
    }

    return messages.join("\n");
  }

  /**
   * Get ingredient name in Hebrew
   */
  private static getIngredientName(type: IngredientType): string {
    const names: Record<IngredientType, string> = {
      [IngredientType.PITA]: "פיתה",
      [IngredientType.FALAFEL_BALL]: "פלאפל",
      [IngredientType.HUMMUS]: "חומוס",
      [IngredientType.TAHINI]: "טחינה",
      [IngredientType.SALAD]: "סלט",
      [IngredientType.FRIES]: "צ'יפס",
      [IngredientType.PICKLES]: "חמוצים",
      [IngredientType.ONION]: "בצל",
    };
    return names[type] || type;
  }
}
