export const initPaddle = async () => {
  if ((window as any).Paddle) return;

  const script = document.createElement("script");
  script.src = "https://cdn.paddle.com/paddle/v2/paddle.js";
  script.async = true;

  document.body.appendChild(script);

  script.onload = () => {
    (window as any).Paddle.Initialize({
      token: import.meta.env.VITE_PADDLE_CLIENT_TOKEN,
      environment: import.meta.env.VITE_PADDLE_ENV,
    });
  };
};