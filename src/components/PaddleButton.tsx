import { useEffect } from "react";

export default function PaddleButton({ priceId }: { priceId: string }) {
  useEffect(() => {
    if (!(window as any).Paddle) {
      const script = document.createElement("script");
      script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
      script.async = true;

      script.onload = () => {
        (window as any).Paddle.Initialize({
          token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
          environment: import.meta.env.VITE_PADDLE_ENV,
        });
      };

      document.body.appendChild(script);
    }
  }, []);

  const openCheckout = () => {
    (window as any).Paddle.Checkout.open({
      items: [
        {
          priceId,
          quantity: 1,
        },
      ],
    });
  };

  return (
    <button
      onClick={openCheckout}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
    >
      Pay with Card
    </button>
  );
}