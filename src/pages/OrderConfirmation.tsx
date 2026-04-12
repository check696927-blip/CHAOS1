import { useNavigate } from "react-router-dom";
import { CheckCircle, Package, Truck } from "lucide-react";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const orderNumber = `CHAOS-${Date.now().toString().slice(-8)}`;

  return (
    <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="animate-in zoom-in duration-500">
          <CheckCircle className="w-24 h-24 text-chaos-cyan mx-auto mb-6 neon-box-glow" />
          <h1 className="font-chaos text-5xl neon-text-red mb-4">ORDER CONFIRMED!</h1>
          <p className="text-xl text-gray-300 mb-2">Thank you for your order</p>
          <p className="text-chaos-purple font-bold">Order #{orderNumber}</p>
        </div>

        <div className="bg-chaos-dark border-2 border-chaos-purple/30 rounded-lg p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-center gap-4">
              <Package className="w-12 h-12 text-chaos-purple" />
              <div className="text-left">
                <p className="font-bold">Processing</p>
                <p className="text-sm text-gray-400">Your order is being prepared</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Truck className="w-12 h-12 text-chaos-cyan" />
              <div className="text-left">
                <p className="font-bold">Ships within 24h</p>
                <p className="text-sm text-gray-400">Fast & secure delivery</p>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-700">
            <p className="text-gray-300 mb-4">
              A confirmation email has been sent to your inbox with tracking details.
            </p>
            <p className="text-sm text-gray-500">
              Questions? Contact us at support@chaosbrand.com
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink text-white font-bold py-4 px-8 rounded-lg transition-all neon-box-glow"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
