import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore, selectCartCount } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { getOrders, simulateOrderTracking } from "@/lib/orders";
import { Order } from "@/types/orders";
import { 
  Package, 
  Truck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  ExternalLink, 
  ArrowLeft,
  AlertCircle
} from "lucide-react";

const Orders = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const itemCount = useCartStore(selectCartCount);
  const { itemCount: wishlistCount } = useWishlist();
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (user) {
      const userOrders = getOrders(user.id);
      setOrders(userOrders);
    }
  }, [user]);

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white">
        <AnnouncementBar />
        <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">Please Sign In</h1>
          <button
            onClick={() => navigate("/")}
            className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 px-8 rounded-lg"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'processing':
      case 'confirmed':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'shipped':
      case 'out_for_delivery':
        return <Truck className="w-5 h-5 text-blue-400" />;
      case 'delivered':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'cancelled':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'processing':
      case 'confirmed':
        return 'text-yellow-400';
      case 'shipped':
      case 'out_for_delivery':
        return 'text-blue-400';
      case 'delivered':
        return 'text-green-400';
      case 'cancelled':
        return 'text-red-400';
    }
  };

  const handleViewTracking = (order: Order) => {
    if (!order.tracking) {
      // Simulate tracking if not exists
      simulateOrderTracking(user.id, order.id);
      const updatedOrders = getOrders(user.id);
      setOrders(updatedOrders);
      const updated = updatedOrders.find(o => o.id === order.id);
      if (updated) {
        setSelectedOrder(updated);
      }
    } else {
      setSelectedOrder(order);
    }
  };

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header cartItemCount={itemCount} wishlistItemCount={wishlistCount} onOpenWishlist={() => {}} />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>

        <h1 className="font-chaos text-4xl neon-text-red mb-8">MY ORDERS</h1>

        {orders.length === 0 ? (
          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-16 text-center">
            <Package className="w-20 h-20 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-6">No orders yet</p>
            <button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-chaos-red to-chaos-purple text-white font-bold py-3 px-8 rounded-lg hover:scale-105 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Orders List */}
            <div className="lg:col-span-2 space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-lg mb-1">Order #{order.orderNumber}</h3>
                      <p className="text-sm text-gray-400">
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`font-bold capitalize ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3 mb-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex gap-3">
                        <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded" />
                        <div className="flex-1">
                          <p className="text-sm font-bold line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          {item.variant && <p className="text-xs text-gray-400">{item.variant}</p>}
                          {item.size && <p className="text-xs text-gray-400">Size: {item.size}</p>}
                        </div>
                        <p className="font-bold">${item.price.toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Total */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <span className="font-bold">Total:</span>
                    <span className="text-xl font-bold neon-text-purple">${order.total.toFixed(2)}</span>
                  </div>

                  {/* Points */}
                  {order.pointsEarned && order.pointsAwarded && (
                    <div className="mt-3 bg-gradient-to-r from-chaos-purple/20 to-chaos-cyan/20 border border-chaos-cyan/30 rounded-lg p-3 text-center">
                      <p className="text-chaos-cyan font-bold text-sm">
                        ✨ Earned {order.pointsAwarded} points!
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="mt-4 flex gap-3">
                    {(order.status === 'shipped' || order.status === 'out_for_delivery' || order.status === 'delivered') && (
                      <button
                        onClick={() => handleViewTracking(order)}
                        className="flex-1 bg-chaos-purple hover:bg-chaos-red px-4 py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                      >
                        <Truck className="w-4 h-4" />
                        Track Package
                      </button>
                    )}
                    <button
                      onClick={() => navigate(`/product/${order.items[0].productId}`)}
                      className="flex-1 border-2 border-chaos-purple hover:bg-chaos-purple/20 px-4 py-2 rounded-lg font-bold transition-all"
                    >
                      Buy Again
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Tracking Details */}
            <div className="lg:col-span-1">
              {selectedOrder?.tracking ? (
                <div className="bg-chaos-dark border border-chaos-purple/50 rounded-lg p-6 sticky top-4">
                  <h3 className="font-chaos text-xl neon-text-purple mb-4">Tracking Details</h3>

                  {/* Tracking Number */}
                  <div className="bg-chaos-darker border border-gray-800 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Tracking Number</p>
                    <div className="flex items-center justify-between">
                      <p className="font-mono font-bold">{selectedOrder.tracking.trackingNumber}</p>
                      <a
                        href={selectedOrder.tracking.trackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-chaos-cyan hover:text-chaos-purple transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                    <p className="text-xs text-gray-400 mt-2 capitalize">
                      Carrier: {selectedOrder.tracking.carrier}
                    </p>
                  </div>

                  {/* Estimated Delivery */}
                  <div className="bg-gradient-to-r from-chaos-cyan/20 to-chaos-purple/20 border border-chaos-cyan/30 rounded-lg p-4 mb-4">
                    <p className="text-xs text-gray-400 mb-1">Estimated Delivery</p>
                    <p className="font-bold text-chaos-cyan">
                      {new Date(selectedOrder.tracking.estimatedDelivery).toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>

                  {/* Tracking Updates */}
                  <div>
                    <h4 className="font-neon font-bold mb-3">Shipment Updates</h4>
                    <div className="space-y-4">
                      {selectedOrder.tracking.updates.map((update, idx) => (
                        <div key={idx} className="relative pl-6 pb-4 border-l-2 border-chaos-purple/30 last:border-0 last:pb-0">
                          <div className="absolute left-0 top-0 -translate-x-1/2 w-3 h-3 bg-chaos-purple rounded-full border-2 border-chaos-darker"></div>
                          <p className="text-sm font-bold mb-1">{update.status}</p>
                          <p className="text-xs text-gray-400 mb-1">{update.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            <span>{update.location}</span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(update.timestamp).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <a
                    href={selectedOrder.tracking.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 w-full bg-chaos-purple hover:bg-chaos-red px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" />
                    View on {selectedOrder.tracking.carrier.toUpperCase()}
                  </a>
                </div>
              ) : (
                <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6 text-center">
                  <Package className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400">Select an order to view tracking</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
