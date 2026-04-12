import { BrowserRouter, Routes, Route } from "react-router-dom";

import { TooltipProvider } from "@/components/ui/tooltip";
import { AddToCartNotification } from "@/components/features/AddToCartNotification";
import { Sonner } from "@/components/ui/sonner";
import { useCartStore, selectNotification } from "@/store/cart";

import Index from "./pages/Index";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import OrderConfirmation from "./pages/OrderConfirmation";
import Orders from "./pages/Orders";
import Profile from "./pages/Profile";
import Rewards from "./pages/Rewards";
import Referrals from "./pages/Referrals";
import PunchCard from "./pages/PunchCard";
import StyleQuiz from "./pages/StyleQuiz";
import SharedWishlist from "./pages/SharedWishlist";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import Success from "./pages/Success";

// ✅ SAFE WRAPPER (prevents Zustand crash issues)
function CartNotificationWrapper() {
  try {
    const { show, itemName, quantity, itemImage } =
      useCartStore(selectNotification);
    const hideNotification = useCartStore((s) => s.hideNotification);

    return (
      <AddToCartNotification
        show={show}
        itemName={itemName}
        quantity={quantity}
        itemImage={itemImage}
        onHide={hideNotification}
      />
    );
  } catch (e) {
    console.error("CartNotification error:", e);
    return null;
  }
}

export default function App() {
  return (
    <BrowserRouter>
      <TooltipProvider>
        <CartNotificationWrapper />
        <Sonner />

        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/success" element={<Success />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/rewards" element={<Rewards />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/punchcard" element={<PunchCard />} />
          <Route path="/quiz" element={<StyleQuiz />} />
          <Route path="/wishlist/:id" element={<SharedWishlist />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </TooltipProvider>
    </BrowserRouter>
  );
}