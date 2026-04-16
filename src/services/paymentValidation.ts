/**
 * Payment Validation Service
 *
 * Pre-flight checks for each payment method to ensure the flow
 * can complete before the user attempts checkout.
 */

export interface PaymentValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validate that a payment method is correctly configured and operational.
 */
export function validatePaymentFlow(
  method: "card" | "paypal" | "google"
): PaymentValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  switch (method) {
    case "card": {
      const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
      if (
        !stripeKey ||
        stripeKey === "pk_test_or_live_key_here" ||
        stripeKey.length < 10
      ) {
        errors.push("Stripe is not configured. Card payments are unavailable.");
      } else if (stripeKey.startsWith("pk_test_")) {
        warnings.push("Stripe is in test mode.");
      }
      break;
    }

    case "paypal": {
      const paypalId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
      const paypalEnv = import.meta.env.VITE_PAYPAL_ENV;

      if (
        !paypalId ||
        paypalId === "YOUR_PAYPAL_CLIENT_ID" ||
        paypalId.length < 10
      ) {
        errors.push(
          "PayPal is not configured. PayPal payments are unavailable."
        );
      }
      if (paypalEnv === "sandbox") {
        warnings.push("PayPal is in sandbox mode.");
      }
      break;
    }

    case "google": {
      const gpayEnabled = import.meta.env.VITE_GOOGLE_PAY_ENABLED;
      const merchantId = import.meta.env.VITE_GOOGLE_PAY_MERCHANT_ID;

      if (gpayEnabled !== "true") {
        errors.push("Google Pay is not enabled.");
      }
      if (
        !merchantId ||
        merchantId === "YOUR_MERCHANT_ID" ||
        merchantId.length < 5
      ) {
        errors.push("Google Pay merchant ID is not configured.");
      }
      break;
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate all payment methods at once.
 */
export function validateAllPaymentMethods(): Record<
  string,
  PaymentValidationResult
> {
  return {
    card: validatePaymentFlow("card"),
    paypal: validatePaymentFlow("paypal"),
    google: validatePaymentFlow("google"),
  };
}
