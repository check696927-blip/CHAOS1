export default async function handler(req, res) {
  const event = req.body;

  try {
    if (event.event_type === "CHECKOUT.ORDER.APPROVED") {
      const orderID = event.resource.id;

      // Capture payment (server-side)
      const captureRes = await fetch(
        `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`,
        {
          method: "POST",
          headers: {
            Authorization:
              "Basic " +
              Buffer.from(
                process.env.PAYPAL_CLIENT_ID +
                  ":" +
                  process.env.PAYPAL_SECRET
              ).toString("base64"),
          },
        }
      );

      const captureData = await captureRes.json();

      // TODO: Save to database here (Supabase)
      console.log("Captured:", captureData);
    }

    res.status(200).json({ received: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook failed" });
  }
}