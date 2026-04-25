import { useEffect, useRef } from "react";
import { loadPayPalScript } from "../lib/paypal";

export default function PayPalButton({ amount }: { amount: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadPayPalScript().then(() => {
      // @ts-ignore
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            body: JSON.stringify({ amount }),
          });
          const data = await res.json();
          return data.id;
        },

        onApprove: async (data: any) => {
          await fetch("/api/paypal/capture-order", {
            method: "POST",
            body: JSON.stringify({ orderID: data.orderID }),
          });

          window.location.href = "/success";
        },
      }).render(ref.current);
    });
  }, [amount]);

  return <div ref={ref}></div>;
}