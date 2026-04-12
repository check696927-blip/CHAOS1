export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { total } = req.body;

    if (!total) {
      return res.status(400).json({ error: "Missing total" });
    }

    const auth = Buffer.from(
      process.env.PAYPAL_CLIENT_ID + ":" + process.env.PAYPAL_SECRET
    ).toString("base64");

    const baseUrl =
      process.env.PAYPAL_MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

    // 🔥 GET TOKEN
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      console.error("TOKEN ERROR:", tokenData);
      return res.status(500).json({ error: "Token failed" });
    }

    const access_token = tokenData.access_token;

    // 🔥 CREATE ORDER
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: Number(total).toFixed(2),
            },
          },
        ],
        application_context: {
          return_url: `${process.env.BASE_URL}/success`,
          cancel_url: `${process.env.BASE_URL}/checkout`,
        },
      }),
    });

    const orderData = await orderRes.json();

    if (!orderRes.ok) {
      console.error("ORDER ERROR:", orderData);
      return res.status(500).json({ error: "Order creation failed" });
    }

    const approveLink = orderData.links.find((l) => l.rel === "approve");

    res.status(200).json({ url: approveLink?.href });

  } catch (err) {
    console.error("PAYPAL ERROR:", err);
    res.status(500).json({ error: "Server error" });
  }
}