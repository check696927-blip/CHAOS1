import { useEffect, useRef } from "react";

export default function PayPalButton({ amount }: { amount: number }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadScript = () => {
      return new Promise<void>((resolve) => {
        if (document.getElementById("paypal-script")) {
          resolve();
          return;
        }

        const script = document.createElement("script");
        script.id = "paypal-script";
        script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
        script.onload = () => resolve();

        document.body.appendChild(script);
      });
    };

    const renderButtons = async () => {
      await loadScript();

      // @ts-ignore
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch("/api/paypal/create-order", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ amount }),
          });

          const data = await res.json();
          return data.id;
        },

        onApprove: (data: any) => {
          window.location.href = `/success?token=${data.orderID}`;
        },

        onError: (err: any) => {
          console.error(err);
          alert("PayPal payment failed.");
        },
      }).render(ref.current);
    };

    renderButtons();
  }, [amount]);

  return <div ref={ref}></div>;
}