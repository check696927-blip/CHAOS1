/**
 * usePaymentValidation Hook
 *
 * Provides real-time validation status for each payment method.
 */
import { useMemo } from "react";
import {
  validatePaymentFlow,
  type PaymentValidationResult,
} from "@/services/paymentValidation";

export function usePaymentValidation(
  method: "card" | "paypal" | "google"
): PaymentValidationResult {
  return useMemo(() => validatePaymentFlow(method), [method]);
}
