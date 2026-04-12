import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { ImageSlider } from "@/components/features/ImageSlider";
import { ReviewSection } from "@/components/features/ReviewSection";

import { useCartStore } from "@/store/cart";
import { useWishlist } from "@/hooks/useWishlist";
import { PRODUCTS, getAvailableVariantCount, hasAnyStock, getTotalStock } from "@/constants/products";

import { ShoppingCart, Heart, ArrowLeft, Check, Package, Shield, RefreshCw } from "lucide-react";
import { Product, ProductVariant } from "@/types";

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




  if (!product) {
    return (
      <div className="min-h-screen bg-chaos-darker text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-chaos text-4xl neon-text-red mb-4">Product Not Found</h1>
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

  // Get variant-specific or base price
  const currentPrice = selectedVariant?.price ?? product.price;
  const discountedPrice = currentPrice * 0.8; // 20% off
  
  // Get variant-specific images or fallback
  const currentImages = selectedVariant?.images && selectedVariant.images.length > 0 
    ? selectedVariant.images 
    : product.images.length > 0 
    ? product.images 
    : [product.image];
  
  // Get variant-specific stock
  const currentStock = selectedVariant?.stockCount ?? getTotalStock(product);
  const currentInStock = selectedVariant ? selectedVariant.inStock && selectedVariant.stockCount > 0 : hasAnyStock(product);
  
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    // Get the product name with variant and size info
    let itemName = product.name;
    if (selectedVariant) {
      itemName = `${product.name} - ${selectedVariant.name}`;
    }
    if (selectedSize) {
      itemName += ` (${selectedSize})`;
    }

    // Get the current product image
    const itemImage = selectedVariant?.images?.[0] || product.image;

    // Add to cart with notification
    addItem({
      id: product.id,
      quantity: 1,
      selectedVariant: selectedVariant?.id,
      selectedSize: selectedSize || undefined,
      name: itemName,
      image: itemImage,
      price: selectedVariant?.price ?? product.price,
    });
  };

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      <AnnouncementBar />
      <Header />

      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-chaos-purple hover:text-chaos-red transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-neon">Back to Shop</span>
        </button>
      </div>

      {/* Product Detail Section */}
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div>
            <ImageSlider images={currentImages} alt={product.name} />
          </div>

          {/* Right: Product Info */}
          <div className="space-y-6">
            {/* Badge */}
            {product.badge && (
              <span className="inline-block bg-chaos-red text-white text-xs font-bold px-4 py-2 rounded-full neon-text-red">
                {product.badge}
              </span>
            )}

            {/* Title */}
            <h1 className="font-chaos text-4xl md:text-5xl neon-text-red leading-tight">
              {product.name}
            </h1>

            {/* Price */}
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

            {/* Stock Info - Variant-Aware */}
            <div className="flex items-center gap-4 text-sm">
              <span className={`font-medium ${currentInStock ? 'text-green-400' : 'text-red-400'}`}>
                {currentInStock ? '✓ In Stock' : '✗ Sold Out'}
              </span>
              {currentStock > 0 && (
                <span className="text-chaos-purple">
                  {selectedVariant ? `${currentStock} available` : `Only ${currentStock} pieces left`}
                </span>
              )}
            </div>

            {/* Variants - Stock-Aware */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-neon font-bold text-lg">Select Style ({getAvailableVariantCount(product)} available)</h3>
                <div className="grid grid-cols-2 gap-3">
                  {product.variants.map((variant) => {
                    const isDisabled = !variant.inStock || variant.stockCount === 0 || variant.disabled;
                    return (
                      <button
                        key={variant.id}
                        onClick={() => !isDisabled && setSelectedVariant(variant)}
                        disabled={isDisabled}
                        className={`border-2 rounded-lg p-3 text-sm font-medium transition-all ${
                          selectedVariant?.id === variant.id
                            ? 'border-chaos-red bg-chaos-red/10 neon-text-red'
                            : isDisabled
                            ? 'border-gray-800 bg-gray-900/50 text-gray-600 cursor-not-allowed'
                            : 'border-gray-700 hover:border-chaos-purple text-gray-300'
                        }`}
                      >
                        <div className="flex flex-col gap-1">
                          <span>{variant.name}</span>
                          {isDisabled ? (
                            <span className="text-xs text-red-400">Out of Stock</span>
                          ) : (
                            <span className="text-xs text-chaos-cyan">{variant.stockCount} left</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-neon font-bold text-lg">Select Size</h3>
                <div className="flex flex-wrap gap-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`border-2 rounded-lg px-6 py-3 font-bold transition-all ${
                        selectedSize === size
                          ? 'border-chaos-red bg-chaos-red/10 neon-text-red'
                          : 'border-gray-700 hover:border-chaos-purple text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons - Stock Validation */}
            <div className="flex gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={!currentInStock || (product.sizes && !selectedSize) || (product.variants && !selectedVariant)}
                className="flex-1 bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink disabled:from-gray-700 disabled:to-gray-800 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all relative overflow-hidden group holographic-button disabled:animate-none"
              >
                <span className="relative z-10 flex items-center justify-center gap-2 font-neon tracking-wider">
                  <ShoppingCart className="w-5 h-5" />
                  ADDED TO CART
                </span>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 group-hover:animate-drip"></div>
              </button>

              <button
                onClick={() => toggleItem(product)}
                className="bg-chaos-dark border-2 border-chaos-purple hover:bg-chaos-purple/20 p-4 rounded-lg transition-all holographic-button"
              >
                <Heart
                  className={`w-6 h-6 ${
                    inWishlist ? 'fill-chaos-red text-chaos-red' : 'text-white'
                  }`}
                />
              </button>
            </div>

            {/* Trust Badges */}
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

            {/* Description */}
            {product.description && (
              <div className="space-y-3 pt-6 border-t border-gray-800">
                <h3 className="font-neon font-bold text-xl">Product Description</h3>
                <p className="text-gray-300 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Features */}
            {product.features && product.features.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-neon font-bold text-xl">Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-gray-300">
                      <Check className="w-5 h-5 text-chaos-purple flex-shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Reviews */}
        <ReviewSection productId={product.id} />
      </div>

      {/* Footer */}
      <footer className="border-t border-chaos-red/30 bg-chaos-dark py-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <h3 className="font-chaos text-xl neon-text-red">CHAOS</h3>
          <p className="text-gray-500 text-sm font-neon tracking-wider">
            BRACE THE WILD © 2026
          </p>
        </div>
      </footer>
    </div>
  );
};

export default ProductDetail;
