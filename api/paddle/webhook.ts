import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../utils/supabaseAdmin";
import { sendOrderEmail } from "../utils/sendEmail";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const event = req.body;

    // Paddle event example
    if (event.event_type === "transaction.completed") {
      const data = event.data;

      const email = data.customer.email;
      const amount = data.details.totals.total;
      const orderId = data.id;

      await supabaseAdmin.from("orders").insert({
        provider: "paddle",
        provider_order_id: orderId,
        email,
        amount
      });

      await sendOrderEmail(email, amount);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook failed" });
  }
}