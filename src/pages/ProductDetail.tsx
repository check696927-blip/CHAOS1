import { useParams, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { ImageSlider } from "@/components/features/ImageSlider";
import { ReviewSection } from "@/components/features/ReviewSection";

import { useCartStore } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import {
  PRODUCTS,
  getAvailableVariantCount,
  hasAnyStock,
  getTotalStock,
} from "@/constants/products";

import {
  ShoppingCart,
  Heart,
  ArrowLeft,
  Check,
  Package,
  Shield,
  RefreshCw,
} from "lucide-react";

import { ProductVariant } from "@/types";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const addItem = useCartStore((s) => s.addItem);
  const { toggleItem, isInWishlist } = useWishlist();

  const product = PRODUCTS.find((p) => p.id === id);

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product?.variants?.[0] || null
  );
  const [selectedSize, setSelectedSize] = useState<string>("");

  const inWishlist = product ? isInWishlist(product.id) : false;

  // 🚫 PRODUCT NOT FOUND
  if (!product) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">
            Product Not Found
          </h1>
          <button
            onClick={() => navigate("/")}
            className="bg-chaos-red hover:bg-chaos-purple px-6 py-3 rounded-lg font-bold transition-all"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  // 💰 PRICING
  const currentPrice = selectedVariant?.price ?? product.price;
  const discountedPrice = currentPrice * 0.8;

  // 🖼️ IMAGES
  const currentImages = useMemo(() => {
    if (selectedVariant?.images?.length) return selectedVariant.images;
    if (product.images?.length) return product.images;
    return [product.image];
  }, [selectedVariant, product]);

  // 📦 STOCK LOGIC
  const currentStock = selectedVariant
    ? selectedVariant.stockCount
    : getTotalStock(product);

  const currentInStock = selectedVariant
    ? selectedVariant.inStock && selectedVariant.stockCount > 0
    : hasAnyStock(product);

  // 🛒 ADD TO CART
  const handleAddToCart = () => {
    if (!currentInStock) return;

    if (product.sizes?.length && !selectedSize) return;
    if (product.variants?.length && !selectedVariant) return;

    let itemName = product.name;

    if (selectedVariant) {
      itemName += ` - ${selectedVariant.name}`;
    }

    if (selectedSize) {
      itemName += ` (${selectedSize})`;
    }

    addItem({
      id: product.id,
      quantity: 1,
      selectedVariant: selectedVariant?.id,
      selectedSize: selectedSize || undefined,
      name: itemName,
      image: selectedVariant?.images?.[0] || product.image,
      price: currentPrice,
      stock: currentStock, // 🔥 CRITICAL
    });
  };

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header />

      {/* BACK BUTTON */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>
      </div>

      {/* MAIN */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* IMAGES */}
          <div>
            <ImageSlider images={currentImages} alt={product.name} />
          </div>

          {/* INFO */}
          <div className="space-y-6">
            {/* BADGE */}
            {product.badge && (
              <span className="inline-block bg-chaos-red text-white text-xs font-bold px-4 py-2 rounded-full neon-text-red">
                {product.badge}
              </span>
            )}

            {/* TITLE */}
            <h1 className="font-chaos text-4xl md:text-5xl neon-text-red leading-tight">
              {product.name}
            </h1>

            {/* PRICE */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 line-through text-2xl">
                ${currentPrice}
              </span>
              <span className="font-bold text-4xl neon-text-purple">
                ${discountedPrice.toFixed(0)}
              </span>
              <span className="bg-chaos-purple/20 text-chaos-purple px-3 py-1 rounded-full text-sm font-bold">
                20% OFF
              </span>
            </div>

            {/* STOCK */}
            <div className="flex items-center gap-4 text-sm">
              <span
                className={`font-medium ${
                  currentInStock ? "text-green-400" : "text-red-400"
                }`}
              >
                {currentInStock ? "✓ In Stock" : "✗ Sold Out"}
              </span>

              {currentStock > 0 && (
                <span className="text-chaos-purple">
                  {selectedVariant
                    ? `${currentStock} available`
                    : `Only ${currentStock} left`}
                </span>
              )}
            </div>

            {/* VARIANTS */}
            {product.variants?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-neon font-bold text-lg">
                  Select Style ({getAvailableVariantCount(product)} available)
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const disabled =
                      !variant.inStock ||
                      variant.stockCount === 0 ||
                      variant.disabled;

                    return (
                      <button
                        key={variant.id}
                        disabled={disabled}
                        onClick={() =>
                          !disabled && setSelectedVariant(variant)
                        }
                        className={`border-2 rounded-lg p-3 text-sm transition-all ${
                          selectedVariant?.id === variant.id
                            ? "border-chaos-red bg-chaos-red/10 neon-text-red"
                            : disabled
                            ? "border-gray-800 text-gray-600 cursor-not-allowed"
                            : "border-gray-700 hover:border-chaos-purple text-gray-300"
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span>{variant.name}</span>
                          <span className="text-xs">
                            {disabled
                              ? "Out of Stock"
                              : `${variant.stockCount} left`}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* SIZES */}
            {product.sizes?.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-neon font-bold text-lg">
                  Select Size
                </h3>

                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border-2 px-6 py-3 rounded-lg font-bold ${
                        selectedSize === size
                          ? "border-chaos-red bg-chaos-red/10 neon-text-red"
                          : "border-gray-700 hover:border-chaos-purple text-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={
                  !currentInStock ||
                  (product.sizes?.length && !selectedSize) ||
                  (product.variants?.length && !selectedVariant)
                }
                className="flex-1 bg-gradient-to-r from-chaos-red to-chaos-purple disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-4 px-6 rounded-lg transition-all"
              >
                <span className="flex items-center justify-center gap-2 font-neon">
                  <ShoppingCart className="w-5 h-5" />
                  {currentInStock ? "ADD TO CART" : "OUT OF STOCK"}
                </span>
              </button>

              <button
                onClick={() => toggleItem(product)}
                className="border-2 border-chaos-purple p-4 rounded-lg"
              >
                <Heart
                  className={`w-6 h-6 ${
                    inWishlist ? "fill-chaos-red text-chaos-red" : "text-white"
                  }`}
                />
              </button>
            </div>

            {/* TRUST */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-800">
              <div className="text-center">
                <Package className="w-8 h-8 mx-auto mb-2 text-chaos-purple" />
                <p className="text-xs text-gray-400">Fast shipping</p>
              </div>
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-2 text-chaos-purple" />
                <p className="text-xs text-gray-400">Secure Payment</p>
              </div>
              <div className="text-center">
                <RefreshCw className="w-8 h-8 mx-auto mb-2 text-chaos-purple" />
                <p className="text-xs text-gray-400">Easy Returns</p>
              </div>
            </div>

            {/* DESCRIPTION */}
            {product.description && (
              <div className="pt-6 border-t border-gray-800">
                <h3 className="font-neon font-bold text-xl mb-2">
                  Product Description
                </h3>
                <p className="text-gray-300">{product.description}</p>
              </div>
            )}

            {/* FEATURES */}
            {product.features?.length > 0 && (
              <div>
                <h3 className="font-neon font-bold text-xl mb-2">
                  Features
                </h3>
                <ul className="space-y-2">
                  {product.features.map((f, i) => (
                    <li key={i} className="flex gap-2 text-gray-300">
                      <Check className="w-5 h-5 text-chaos-purple" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <ReviewSection productId={product.id} />
      </div>

      {/* FOOTER */}
      <footer className="border-t border-chaos-red/30 bg-chaos-dark py-12 text-center">
        <h3 className="font-chaos text-xl neon-text-red">CHAOS</h3>
        <p className="text-gray-500 text-sm font-neon">
          BRACE THE WILD © 2026
        </p>
      </footer>
    </div>
  );
};

export default ProductDetail;