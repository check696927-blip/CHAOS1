import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, CreditCard, Truck, MapPin } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { calculateCartTotals, calculateShipping } from "@/lib/cart";
import { PRODUCTS } from "@/constants/products";

import PayPalButton from "@/components/PayPalButton";
import PaddleButton from "@/components/PaddleButton";

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const { convertPrice, formatPrice } = useCurrency();

  const [step, setStep] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("standard");

  const { subtotal, discount, total } = calculateCartTotals(items);
  const shippingCost = calculateShipping(total, shippingMethod as any);
  const finalTotal = total + shippingCost;

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Cart is empty
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* STEP 3 ONLY (Payments) */}
      <div className="bg-[#12122a] p-6 rounded-lg">

        <h2 className="text-xl mb-4">Pay with PayPal</h2>
        <PayPalButton amount={finalTotal} />

        <div className="my-6 border-t border-gray-700"></div>

        <h2 className="text-xl mb-4">Or Pay with Card</h2>
        <PaddleButton priceId="pri_xxxxxxxx" />

      </div>

      {/* ORDER SUMMARY */}
      <div className="mt-6">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>{formatPrice(convertPrice(subtotal))}</span>
        </div>

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>{formatPrice(convertPrice(shippingCost))}</span>
        </div>

        <div className="flex justify-between font-bold mt-2">
          <span>Total</span>
          <span>{formatPrice(convertPrice(finalTotal))}</span>
        </div>
      </div>
    </div>
  );
};

export default Checkout;