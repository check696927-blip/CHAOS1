import { useState } from "react";
import { Product } from "@/types";
import { ShoppingCart, Heart, Eye, Ruler } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ImageSlider } from "./ImageSlider";
import { SizeGuideModal } from "./SizeGuideModal";

import {
  getAvailableVariantCount,
  hasAnyStock,
  getTotalStock,
} from "@/constants/products";

import { useCartStore } from "@/store/cart";
import { validateInventory } from "@/utils/inventory";

import { flyToCart } from "@/utils/flyToCart";
import { CART_EMOJIS } from "@/constants/cartEmojis";

interface ProductCardProps {
  product: Product;
  isInWishlist: boolean;
  onToggleWishlist: (product: Product) => void;
}

export const ProductCard = ({
  product,
  isInWishlist,
  onToggleWishlist,
}: ProductCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const discountedPrice = product.price * 0.8;

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();

    const valid = validateInventory(product.id, 1);

    if (!valid) {
      alert("Out of stock");
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();

    const emoji =
      CART_EMOJIS[Math.floor(Math.random() * CART_EMOJIS.length)];

    flyToCart(emoji, rect.left, rect.top);

    addItem({
      id: product.id,
      quantity: 1,
      name: product.name,
      image: product.image,
      price: product.price,
    });

    window.dispatchEvent(new Event("cart:add"));
  };

  return (
    <>
      <div
        className="group relative bg-chaos-dark border border-chaos-red/30 rounded-lg overflow-hidden hover:border-chaos-red transition-all hover:scale-[1.02] neon-box-glow"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {product.badge && (
          <div className="absolute top-3 left-3 z-10 bg-chaos-red text-white text-xs font-bold px-3 py-1 rounded-full">
            {product.badge}
          </div>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className="absolute top-3 right-3 z-10 p-2 bg-chaos-dark/80 backdrop-blur-sm rounded-full"
        >
          <Heart
            className={`w-5 h-5 ${
              isInWishlist ? "fill-chaos-red text-chaos-red" : "text-white"
            }`}
          />
        </button>

        <div className="p-3">
          <ImageSlider
            images={
              product.images.length > 0
                ? product.images
                : [product.image]
            }
            alt={product.name}
          />
        </div>

        <div className="p-5 space-y-3">
          <h3 className="font-neon font-bold text-lg tracking-wider line-clamp-2">
            {product.name}
          </h3>

          <div className="flex items-center gap-2">
            <span className="text-gray-500 line-through text-sm">
              ${product.price}
            </span>

            <span className="font-bold text-xl text-chaos-purple">
              ${discountedPrice.toFixed(0)}
            </span>
          </div>

          <div className="flex justify-between text-xs">
            <span className="text-chaos-purple">
              {getTotalStock(product) > 0
                ? `Only ${getTotalStock(product)} left`
                : hasAnyStock(product)
                ? "Few pieces left"
                : "Sold out"}
            </span>

            {hasAnyStock(product) && (
              <span className="text-gray-500">Ships today</span>
            )}
          </div>

          {product.variants && product.variants.length > 0 && (
            <span className="text-xs text-gray-400">
              {getAvailableVariantCount(product)} styles available
            </span>
          )}

          {product.sizeGuide && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowSizeGuide(true);
              }}
              className="w-full text-xs text-chaos-cyan hover:text-chaos-purple flex justify-center gap-1 py-2"
            >
              <Ruler className="w-3 h-3" />
              Size Guide
            </button>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleViewDetails}
              className="flex-1 border-2 border-chaos-purple py-3 rounded-lg text-sm font-bold"
            >
              <Eye className="w-4 h-4 inline mr-2" />
              VIEW
            </button>

            <button
              onClick={handleAddToCart}
              disabled={!hasAnyStock(product)}
              className="flex-1 bg-gradient-to-r from-chaos-red to-chaos-purple disabled:bg-gray-700 text-sm font-bold py-3 rounded-lg"
            >
              <ShoppingCart className="w-4 h-4 inline mr-2" />
              CART
            </button>
          </div>
        </div>
      </div>

      {product.sizeGuide && (
        <SizeGuideModal
          open={showSizeGuide}
          onClose={() => setShowSizeGuide(false)}
          sizeGuide={product.sizeGuide}
          productName={product.name}
        />
      )}
    </>
  );
};