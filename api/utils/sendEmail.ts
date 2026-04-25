import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendOrderEmail(email: string, amount: string) {
  try {
    await resend.emails.send({
      from: "CHAOS <onboarding@resend.dev>",
      to: email,
      subject: "Payment Confirmed ✅",
      html: `
        <h1>Thank you for your purchase</h1>
        <p>Your payment was successful.</p>
        <p><strong>Amount:</strong> $${amount}</p>
      `,
    });
  } catch (err) {
    console.error("Email failed:", err);
  }
}