import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/store/cart";

export default function Success() {
  const clearCart = useCartStore((s) => s.clear);

  const [status, setStatus] = useState<
    "processing" | "success" | "duplicate" | "error"
  >("processing");

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

        // ✅ PROTECT SUPABASE
        if (!supabase) {
          setStatus("error");
          setMessage("Database not connected.");
          return;
        }

        const { data: existing } = await supabase
          .from("orders")
          .select("id")
          .eq("paypal_order_id", token)
          .maybeSingle();

        if (existing) {
          clearCart();
          setStatus("duplicate");
          setMessage("Order already processed.");
          return;
        }

        const res = await fetch("/api/paypal/capture-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ orderID: token }),
        });

        const data = await res.json();

        if (!data.success || !data.amount) {
          setStatus("error");
          setMessage(
            "Payment capture failed. Contact support with PayPal order ID: " +
              token
          );
          return;
        }

        const { error } = await supabase.from("orders").insert({
          paypal_order_id: token,
          amount: data.amount,
          currency: data.currency ?? "USD",
          status: "completed",
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Supabase insert error:", error);
          setStatus("error");
          setMessage(
            "Payment captured but order save failed. Contact support with: " +
              token
          );
          return;
        }

        clearCart();
        setStatus("success");
        setMessage("Payment successful! 🎉 Your order is confirmed.");
      } catch (err) {
        console.error(err);
        setStatus("error");
        setMessage("Unexpected error occurred.");
      }
    };

    run();
  }, []);

  const styles: Record<string, string> = {
    processing: "text-yellow-400",
    success: "text-green-400",
    duplicate: "text-blue-400",
    error: "text-red-400",
  };

  return (
    <div className="min-h-screen bg-chaos-darker flex items-center justify-center">
      <div className="text-center space-y-4 p-8">
        <h1 className={`text-3xl font-black ${styles[status]}`}>
          {message}
        </h1>

        {status === "success" && (
          <a href="/" className="block mt-6 text-chaos-purple underline">
            Continue Shopping
          </a>
        )}
      </div>
    </div>
  );
}