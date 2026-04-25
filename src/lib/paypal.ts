export const loadPayPalScript = () => {
  return new Promise((resolve) => {
    if (document.getElementById("paypal-script")) return resolve(true);

    const script = document.createElement("script");
    script.id = "paypal-script";
    script.src = `https://www.paypal.com/sdk/js?client-id=${import.meta.env.VITE_PAYPAL_CLIENT_ID}&currency=USD`;
    script.onload = () => resolve(true);

    document.body.appendChild(script);
  });
};