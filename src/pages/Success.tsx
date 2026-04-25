import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cart";

export default function Success() {
  const clearCart = useCartStore((s) => s.clear);

  const [status, setStatus] = useState("processing");
  const [message, setMessage] = useState("Processing your order...");
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const run = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (!token) {
          setStatus("error");
          setMessage("Missing payment token.");
          return;
        }

        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: token }),
        });

        const data = await res.json();

        if (!data || data.status !== "COMPLETED") {
          setStatus("error");
          setMessage("Payment failed.");
          return;
        }

        if (supabase) {
          await supabase.from("orders").insert({
            paypal_order_id: token,
            amount: data.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value,
            currency: "USD",
            status: "completed",
            created_at: new Date().toISOString(),
          });
        }

        clearCart();
        setStatus("success");
        setMessage("Payment successful 🎉");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Unexpected error.");
      }
    };

    run();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center text-white">
      <h1 className="text-2xl">{message}</h1>
    </div>
  );
}