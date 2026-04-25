import { useEffect } from "react";
import { initPaddle } from "../lib/paddle";

export default function PaddleButton({ priceId }: { priceId: string }) {
  useEffect(() => {
    initPaddle();
  }, []);

  const handleCheckout = () => {
    // @ts-ignore
    window.Paddle.Checkout.open({
      items: [{ priceId, quantity: 1 }],
    });
  };

  return (
    <button onClick={handleCheckout}>
      Pay with Card (Paddle)
    </button>
  );
}