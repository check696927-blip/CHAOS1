export default async function handler(req, res) {
  const event = req.body;

  try {
    if (event.event_type === "transaction.completed") {
      const transaction = event.data;

      console.log("Paddle payment:", transaction);

      // Save order to database
      // Example:
      // await supabase.from("orders").insert({...})
    }

    res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Webhook error" });
  }
}