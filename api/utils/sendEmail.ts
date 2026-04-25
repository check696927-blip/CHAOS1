import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(email: string, amount: string) {
  try {
    await resend.emails.send({
      from: "CHAOS <onboarding@resend.dev>",
      to: email,
      subject: "Order Confirmed",
      html: `
        <h1>Payment Successful</h1>
        <p>Your order is confirmed.</p>
        <p><strong>Total:</strong> $${amount}</p>
      `,
    });
  } catch (err) {
    console.error("Email error:", err);
  }
}