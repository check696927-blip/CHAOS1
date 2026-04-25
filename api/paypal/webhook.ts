import type { VercelRequest, VercelResponse } from "@vercel/node";
import { supabaseAdmin } from "../utils/supabaseAdmin";
import { sendOrderEmail } from "../utils/sendEmail";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const event = req.body;

    // ⚠️ PayPal: you should verify signature in production
    if (event.event_type === "PAYMENT.CAPTURE.COMPLETED") {
      const data = event.resource;

      const email = data.payer?.email_address;
      const amount = data.amount?.value;
      const orderId = data.id;

      // 1. Save order
      const { error } = await supabaseAdmin.from("orders").insert({
        provider: "paypal",
        provider_order_id: orderId,
        email,
        amount
      });

      if (error) throw error;

      // 2. Send email
      await sendOrderEmail(email, amount);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook failed" });
  }
}