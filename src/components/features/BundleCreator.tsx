import { useState } from "react";
import { Package, Plus, Minus, Trash2, Tag, Save, X } from "lucide-react";
import { Product, ProductBundle } from "@/types";
import { PRODUCTS } from "@/constants/products";

interface BundleCreatorProps {
  onSave?: (bundle: ProductBundle) => void;
}

export const BundleCreator = ({ onSave }: BundleCreatorProps) => {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [bundleName, setBundleName] = useState("");
  const [bundleDescription, setBundleDescription] = useState("");
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState(15);
  const [showProductSelector, setShowProductSelector] = useState(false);

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const removeProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((id) => id !== productId));
  };

  const getBundlePrice = () => {
    const total = selectedProducts.reduce((sum, id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product?.price || 0);
    }, 0);

    if (discountType === 'percentage') {
      return total * (1 - discountValue / 100);
    } else {
      return total - discountValue;
    }
  };

  const getSavings = () => {
    const total = selectedProducts.reduce((sum, id) => {
      const product = PRODUCTS.find((p) => p.id === id);
      return sum + (product?.price || 0);
    }, 0);
    return total - getBundlePrice();
  };

  const handleSave = () => {
    if (selectedProducts.length < 2 || !bundleName) {
      alert("Please add at least 2 products and enter a bundle name");
      return;
    }

    const bundle: ProductBundle = {
      id: `bundle-${Date.now()}`,
      name: bundleName,
      description: bundleDescription,
      products: selectedProducts,
      discountType,
      discountValue,
      image: PRODUCTS.find((p) => p.id === selectedProducts[0])?.image || '',
      active: true,
      createdAt: new Date()
    };

    onSave?.(bundle);
    alert(`Bundle "${bundleName}" created successfully!`);
    
    // Reset form
    setSelectedProducts([]);
    setBundleName("");
    setBundleDescription("");
    setDiscountValue(15);
  };

  const selectedProductDetails = selectedProducts.map(id => 
    PRODUCTS.find(p => p.id === id)
  ).filter(Boolean) as Product[];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="font-neon text-2xl font-bold mb-2">Create Product Bundle</h2>
        <p className="text-sm text-gray-400">Combine products to increase average order value</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bundle Configuration */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2">
              <Tag className="w-5 h-5 text-chaos-purple" />
              Bundle Details
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Bundle Name</label>
                <input
                  type="text"
                  value={bundleName}
                  onChange={(e) => setBundleName(e.target.value)}
                  placeholder="e.g., Ultimate Streetwear Set"
                  className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-chaos-purple outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 mb-2 block">Description</label>
                <textarea
                  value={bundleDescription}
                  onChange={(e) => setBundleDescription(e.target.value)}
                  placeholder="Describe what's included and why it's a great deal..."
                  rows={3}
                  className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-chaos-purple outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 mb-2 block">Discount Type</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'fixed')}
                    className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-chaos-purple outline-none"
                  >
                    <option value="percentage">Percentage Off</option>
                    <option value="fixed">Fixed Amount Off</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm text-gray-400 mb-2 block">
                    Discount Value {discountType === 'percentage' ? '(%)' : '($)'}
                  </label>
                  <input
                    type="number"
                    value={discountValue}
                    onChange={(e) => setDiscountValue(parseFloat(e.target.value))}
                    min="0"
                    max={discountType === 'percentage' ? "50" : "200"}
                    className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-chaos-purple outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Selected Products */}
          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold flex items-center gap-2">
                <Package className="w-5 h-5 text-chaos-cyan" />
                Bundle Products ({selectedProducts.length})
              </h3>
              <button
                onClick={() => setShowProductSelector(!showProductSelector)}
                className="bg-chaos-purple hover:bg-chaos-red px-4 py-2 rounded-lg font-bold text-sm transition-all flex items-center gap-2"
              >
                {showProductSelector ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {showProductSelector ? 'Close' : 'Add Products'}
              </button>
            </div>

            {/* Product Selector */}
            {showProductSelector && (
              <div className="mb-4 max-h-64 overflow-y-auto bg-chaos-darker rounded-lg p-4 border border-gray-800">
                <div className="grid grid-cols-1 gap-2">
                  {PRODUCTS.map((product) => (
                    <label
                      key={product.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        selectedProducts.includes(product.id)
                          ? 'bg-chaos-purple/20 border-2 border-chaos-purple'
                          : 'bg-chaos-dark border border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedProducts.includes(product.id)}
                        onChange={() => toggleProduct(product.id)}
                        className="w-5 h-5 accent-chaos-purple"
                      />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm">{product.name}</p>
                        <p className="text-xs text-gray-500">{product.category}</p>
                      </div>
                      <span className="font-bold">${product.price}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Selected Products List */}
            {selectedProductDetails.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No products selected</p>
                <p className="text-xs mt-1">Add at least 2 products to create a bundle</p>
              </div>
            ) : (
              <div className="space-y-2">
                {selectedProductDetails.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 bg-chaos-darker rounded-lg p-3"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="font-bold text-sm">{product.name}</p>
                      <p className="text-xs text-gray-500">{product.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">${product.price}</p>
                    </div>
                    <button
                      onClick={() => removeProduct(product.id)}
                      className="p-2 hover:bg-red-500/20 rounded transition-all"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bundle Preview & Summary */}
        <div className="space-y-6">
          {/* Price Summary */}
          <div className="bg-chaos-dark border-2 border-chaos-purple/50 rounded-lg p-6 sticky top-4">
            <h3 className="font-bold mb-4 text-chaos-purple">Bundle Summary</h3>
            
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Products:</span>
                <span className="font-bold">{selectedProducts.length} items</span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Original Total:</span>
                <span className="font-bold">
                  ${selectedProducts.reduce((sum, id) => {
                    const product = PRODUCTS.find((p) => p.id === id);
                    return sum + (product?.price || 0);
                  }, 0).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between text-chaos-red">
                <span>Discount:</span>
                <span className="font-bold">
                  - ${getSavings().toFixed(2)}
                  {discountType === 'percentage' && ` (${discountValue}%)`}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3 flex justify-between text-lg">
                <span className="font-bold">Bundle Price:</span>
                <span className="font-bold neon-text-purple">
                  ${getBundlePrice().toFixed(2)}
                </span>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3 text-center">
                <p className="text-green-400 font-bold">
                  Save ${getSavings().toFixed(2)}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {((getSavings() / selectedProducts.reduce((sum, id) => {
                    const product = PRODUCTS.find((p) => p.id === id);
                    return sum + (product?.price || 0);
                  }, 0)) * 100).toFixed(0)}% off regular price
                </p>
              </div>
            </div>

            <button
              onClick={handleSave}
              disabled={selectedProducts.length < 2 || !bundleName}
              className="w-full mt-6 bg-gradient-to-r from-chaos-purple to-chaos-red hover:from-chaos-red hover:to-chaos-purple disabled:from-gray-700 disabled:to-gray-800 text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Create Bundle
            </button>
          </div>

          {/* Quick Suggestions */}
          <div className="bg-chaos-dark border border-gray-800 rounded-lg p-4">
            <h4 className="font-bold text-sm mb-3">Popular Combos</h4>
            <div className="space-y-2 text-xs">
              <button className="w-full text-left p-2 bg-chaos-darker hover:bg-chaos-purple/10 rounded transition-all">
                Hoodie + Joggers (15% off)
              </button>
              <button className="w-full text-left p-2 bg-chaos-darker hover:bg-chaos-purple/10 rounded transition-all">
                Complete Outfit (20% off)
              </button>
              <button className="w-full text-left p-2 bg-chaos-darker hover:bg-chaos-purple/10 rounded transition-all">
                Accessories Pack (10% off)
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
