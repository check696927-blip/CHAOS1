export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { orderID } = req.body;

  if (!orderID) {
    return res.status(400).json({ error: "Missing orderID" });
  }

  try {
    const auth = Buffer.from(
      `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_SECRET}`
    ).toString("base64");

    const baseUrl =
      process.env.PAYPAL_MODE === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";

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
      console.error("CAPTURE TOKEN ERROR:", tokenData);
      return res.status(500).json({ error: "Token fetch failed" });
    }

    const captureRes = await fetch(
      `${baseUrl}/v2/checkout/orders/${orderID}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const captureData = await captureRes.json();

    if (captureData.status !== "COMPLETED") {
      console.error("CAPTURE FAILED:", captureData);
      return res.json({ success: false, status: captureData.status });
    }

    const purchase =
      captureData.purchase_units?.[0]?.payments?.captures?.[0];

    return res.json({
      success: true,
      amount: purchase?.amount?.value,
      currency: purchase?.amount?.currency_code,
      paypalOrderId: orderID,
    });
  } catch (err) {
    console.error("CAPTURE ERROR:", err);
    return res.status(500).json({ error: "Server error during capture" });
  }
}
