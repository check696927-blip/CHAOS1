import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore } from "@/store/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChevronLeft, ChevronRight, CreditCard, Truck, MapPin } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import { calculateCartTotals, calculateShipping, validateCartStock } from "@/lib/cart";
import { PRODUCTS } from "@/constants/products";

const Checkout = () => {
  const navigate = useNavigate();
  const items = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clear);
  const { convertPrice, formatPrice } = useCurrency();
  const [step, setStep] = useState(1);

  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  const [shippingMethod, setShippingMethod] = useState("standard");
  const [paymentMethod, setPaymentMethod] = useState("card");

  const { subtotal, discount, total } = calculateCartTotals(items);
  const selectedShippingCost = calculateShipping(total, shippingMethod as 'standard' | 'express' | 'overnight');
  const finalTotal = total + selectedShippingCost;

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  // ✅ REPLACED HANDLEPLACEORDER WITH FULL PAYPAL SAFE VERSION
  const handlePlaceOrder = async () => {
    // 1️⃣ Validate stock
    const stockValidation = validateCartStock(items);
    if (!stockValidation.valid) {
      alert(`Stock issues:\n${stockValidation.errors.join('\n')}`);
      return;
    }

    try {
      if (paymentMethod === "paypal") {
        // 2️⃣ Create PayPal order via API
        const res = await fetch("/api/paypal/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ total: finalTotal }),
        });
        const data = await res.json();

        if (data.url) {
          // Redirect user to PayPal approval
          window.location.href = data.url;
          return; // Stop further execution
        } else {
          alert("PayPal payment failed");
          return;
        }
      } else if (paymentMethod === "google") {
        // Placeholder: Google Pay integration
        alert("Google Pay integration not implemented yet");
        return;
      } else {
        // Default: card (or any other manual flow)
        alert("Processing card payment...");
        // Here you would normally integrate Stripe or other card processor
      }

      // 3️⃣ Clear cart & navigate to success
      clearCart();
      navigate("/success");
    } catch (err) {
      console.error(err);
      alert("Error processing payment");
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Your cart is empty</h2>
          <Button
            onClick={() => navigate("/")}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Checkout</h1>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-cyan-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-600'}`}>
                1
              </div>
              <span className="text-sm font-medium">Shipping</span>
            </div>
            <div className="h-px flex-1 bg-gray-700" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-cyan-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-600'}`}>
                2
              </div>
              <span className="text-sm font-medium">Delivery</span>
            </div>
            <div className="h-px flex-1 bg-gray-700" />
            <div className={`flex items-center gap-2 ${step >= 3 ? 'text-cyan-400' : 'text-gray-600'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? 'border-cyan-400 bg-cyan-400/20' : 'border-gray-600'}`}>
                3
              </div>
              <span className="text-sm font-medium">Payment</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping Information */}
            {step === 1 && (
              <div className="bg-[#12122a] border border-cyan-500/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <MapPin className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-white">Shipping Information</h2>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName" className="text-gray-300">First Name</Label>
                    <Input
                      id="firstName"
                      value={shippingInfo.firstName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, firstName: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName" className="text-gray-300">Last Name</Label>
                    <Input
                      id="lastName"
                      value={shippingInfo.lastName}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, lastName: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="email" className="text-gray-300">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={shippingInfo.email}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, email: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="address" className="text-gray-300">Address</Label>
                    <Input
                      id="address"
                      value={shippingInfo.address}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, address: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="text-gray-300">City</Label>
                    <Input
                      id="city"
                      value={shippingInfo.city}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, city: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="text-gray-300">State</Label>
                    <Input
                      id="state"
                      value={shippingInfo.state}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, state: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="text-gray-300">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      value={shippingInfo.zipCode}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, zipCode: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="country" className="text-gray-300">Country</Label>
                    <Input
                      id="country"
                      value={shippingInfo.country}
                      onChange={(e) => setShippingInfo({ ...shippingInfo, country: e.target.value })}
                      className="bg-gray-900 border-gray-700 text-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-[#12122a] border border-cyan-500/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <Truck className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-white">Delivery Method</h2>
                </div>
                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="text-white font-medium cursor-pointer">
                          Standard Shipping (5-7 days)
                        </Label>
                      </div>
                      <span className="text-cyan-400 font-medium">{formatPrice(convertPrice(5.99))}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="express" id="express" />
                        <Label htmlFor="express" className="text-white font-medium cursor-pointer">
                          Express Shipping (2-3 days)
                        </Label>
                      </div>
                      <span className="text-cyan-400 font-medium">{formatPrice(convertPrice(14.99))}</span>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <RadioGroupItem value="overnight" id="overnight" />
                        <Label htmlFor="overnight" className="text-white font-medium cursor-pointer">
                          Overnight Shipping (1 day)
                        </Label>
                      </div>
                      <span className="text-cyan-400 font-medium">{formatPrice(convertPrice(24.99))}</span>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-[#12122a] border border-cyan-500/20 rounded-lg p-6">
                <div className="flex items-center gap-2 mb-6">
                  <CreditCard className="w-5 h-5 text-cyan-400" />
                  <h2 className="text-xl font-semibold text-white">Payment Method</h2>
                </div>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-3">
                    <div className="p-4 border border-gray-700 rounded-lg">
                      <div className="flex items-center gap-3 mb-3">
                        <RadioGroupItem value="card" id="card" />
                        <Label htmlFor="card" className="text-white font-medium cursor-pointer">
                          Credit/Debit Card
                        </Label>
                      </div>
                      {paymentMethod === "card" && (
                        <div className="ml-7 space-y-3">
                          <Input placeholder="Card Number" className="bg-gray-900 border-gray-700 text-white" />
                          <div className="grid grid-cols-2 gap-3">
                            <Input placeholder="MM/YY" className="bg-gray-900 border-gray-700 text-white" />
                            <Input placeholder="CVV" className="bg-gray-900 border-gray-700 text-white" />
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="text-white font-medium cursor-pointer">
                        PayPal
                      </Label>
                    </div>
                    <div className="flex items-center gap-3 p-4 border border-gray-700 rounded-lg hover:border-cyan-500/50 transition-colors">
                      <RadioGroupItem value="google" id="google" />
                      <Label htmlFor="google" className="text-white font-medium cursor-pointer">
                        Google Pay
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              <Button
                onClick={handleBack}
                variant="outline"
                disabled={step === 1}
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-cyan-600 hover:bg-cyan-700 text-white"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handlePlaceOrder}
                  className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-8"
                >
                  Place Order
                </Button>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-[#12122a] border border-cyan-500/20 rounded-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => {
                  const product = PRODUCTS.find(p => p.id === item.id);
                  if (!product) return null;

                  const variant = item.selectedVariant
                    ? product.variants?.find(v => v.id === item.selectedVariant)
                    : null;

                  const displayName = variant?.name || product.name;
                  const image = variant?.images?.[0] || product.image;

                  return (
                    <div key={`${item.id}-${item.selectedVariant || 'default'}`} className="flex gap-3">
                      <div className="w-16 h-16 bg-gray-900 rounded-md overflow-hidden flex-shrink-0">
                        <img src={image} alt={displayName} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm line-clamp-2">{displayName}</p>
                        <p className="text-gray-400 text-xs">Qty: {item.quantity}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Subtotal</span>
                  <span className="text-white">{formatPrice(convertPrice(subtotal))}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Discount</span>
                    <span className="text-green-400">-{formatPrice(convertPrice(discount))}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Shipping</span>
                  <span className={selectedShippingCost === 0 ? "text-green-400 font-semibold" : "text-white"}>
                    {selectedShippingCost === 0 ? "FREE" : formatPrice(convertPrice(selectedShippingCost))}
                  </span>
                </div>
                <div className="border-t border-gray-700 pt-2 flex justify-between font-semibold">
                  <span className="text-white">Total</span>
                  <span className="text-cyan-400 text-lg">{formatPrice(convertPrice(finalTotal))}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;