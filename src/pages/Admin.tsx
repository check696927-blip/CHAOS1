import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PRODUCTS } from "@/constants/products";
import { Package, DollarSign, TrendingUp, ExternalLink, Lock, Eye, EyeOff, Edit, Trash2, Plus, BarChart3, Crop, PackagePlus, Shield } from "lucide-react";
import { AdminAnalytics } from "@/components/features/AdminAnalytics";
import { ImageCropTool } from "@/components/features/ImageCropTool";
import { BundleCreator } from "@/components/features/BundleCreator";
import { generateValidationReport } from "@/lib/adminProductValidation";

const ADMIN_PASSWORD = "CHAOS2026"; // Change this to your secure password

const Admin = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"inventory" | "analytics" | "crop" | "bundles" | "validation">("inventory");
  const [validationReport, setValidationReport] = useState<ReturnType<typeof generateValidationReport> | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError("");
      // Generate validation report on login
      setValidationReport(generateValidationReport(PRODUCTS));
    } else {
      setError("Incorrect password");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-chaos-darker flex items-center justify-center p-4">
        <div className="bg-chaos-dark border-2 border-chaos-red/30 rounded-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <Lock className="w-16 h-16 text-chaos-red mx-auto mb-4 neon-box-glow" />
            <h1 className="font-chaos text-3xl neon-text-red mb-2">ADMIN ACCESS</h1>
            <p className="text-gray-400 text-sm">Enter password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin Password"
                className="w-full bg-chaos-darker border border-gray-700 rounded-lg px-4 py-3 text-white focus:border-chaos-purple outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-chaos-purple"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-chaos-red to-chaos-purple hover:from-chaos-purple hover:to-chaos-pink text-white font-bold py-3 rounded-lg transition-all neon-box-glow"
            >
              UNLOCK ADMIN
            </button>

            <button
              type="button"
              onClick={() => navigate("/")}
              className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-lg transition-all"
            >
              Back to Store
            </button>
          </form>
        </div>
      </div>
    );
  }

  const totalInventory = PRODUCTS.reduce((sum, p) => sum + (p.supplyChain?.inventoryCount || 0), 0);
  const avgProfitMargin = PRODUCTS.reduce((sum, p) => sum + (p.supplyChain?.profitMargin || 0), 0) / PRODUCTS.length;
  const lowStockItems = PRODUCTS.filter(p => (p.supplyChain?.inventoryCount || 0) < (p.supplyChain?.reorderLevel || 0)).length;

  return (
    <div className="min-h-screen bg-chaos-darker text-white">
      {/* Header */}
      <div className="bg-chaos-dark border-b-2 border-chaos-red/30 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-chaos text-3xl neon-text-red mb-2">ADMIN DASHBOARD</h1>
            <p className="text-gray-400 text-sm">Supply Chain & Inventory Management</p>
          </div>
          <button
            onClick={() => navigate("/")}
            className="bg-chaos-purple hover:bg-chaos-red px-6 py-3 rounded-lg font-bold transition-all"
          >
            Back to Store
          </button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-3 font-bold transition-all relative whitespace-nowrap ${
              activeTab === "inventory"
                ? "text-chaos-purple"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Inventory
            {activeTab === "inventory" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chaos-purple"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 font-bold transition-all relative whitespace-nowrap ${
              activeTab === "analytics"
                ? "text-chaos-purple"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <BarChart3 className="w-5 h-5 inline mr-2" />
            Analytics
            {activeTab === "analytics" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chaos-purple"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("crop")}
            className={`px-6 py-3 font-bold transition-all relative whitespace-nowrap ${
              activeTab === "crop"
                ? "text-chaos-purple"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Crop className="w-5 h-5 inline mr-2" />
            Image Cropper
            {activeTab === "crop" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chaos-purple"></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab("bundles")}
            className={`px-6 py-3 font-bold transition-all relative whitespace-nowrap ${
              activeTab === "bundles"
                ? "text-chaos-purple"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <PackagePlus className="w-5 h-5 inline mr-2" />
            Bundles
            {activeTab === "bundles" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chaos-purple"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab("validation");
              setValidationReport(generateValidationReport(PRODUCTS));
            }}
            className={`px-6 py-3 font-bold transition-all relative whitespace-nowrap ${
              activeTab === "validation"
                ? "text-chaos-purple"
                : "text-gray-500 hover:text-white"
            }`}
          >
            <Shield className="w-5 h-5 inline mr-2" />
            Validation
            {activeTab === "validation" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-chaos-purple"></div>
            )}
          </button>
        </div>

        {activeTab === "analytics" ? (
          <AdminAnalytics />
        ) : activeTab === "crop" ? (
          <ImageCropTool />
        ) : activeTab === "bundles" ? (
          <BundleCreator />
        ) : activeTab === "validation" && validationReport ? (
          <div className="space-y-6">
            <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
              <h3 className="font-neon text-2xl font-bold mb-6 neon-text-purple">
                📋 Product Catalog Validation Report
              </h3>

              {/* Summary Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <div className="bg-chaos-darker border border-gray-700 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-white mb-2">
                    {validationReport.totalProducts}
                  </div>
                  <div className="text-sm text-gray-400">Total Products</div>
                </div>
                <div className="bg-chaos-darker border border-green-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {validationReport.validProducts}
                  </div>
                  <div className="text-sm text-gray-400">Valid ✓</div>
                </div>
                <div className="bg-chaos-darker border border-red-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">
                    {validationReport.invalidProducts}
                  </div>
                  <div className="text-sm text-gray-400">Invalid ✗</div>
                </div>
                <div className="bg-chaos-darker border border-yellow-500/30 rounded-lg p-4 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {validationReport.productsWithWarnings}
                  </div>
                  <div className="text-sm text-gray-400">Warnings ⚠</div>
                </div>
              </div>

              {/* Critical Issues */}
              {validationReport.criticalIssues.length > 0 && (
                <div className="bg-red-500/10 border-2 border-red-500/30 rounded-lg p-6 mb-6">
                  <h4 className="font-bold text-lg text-red-400 mb-4 flex items-center gap-2">
                    <span>🚨</span> Critical Issues ({validationReport.criticalIssues.length})
                  </h4>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {validationReport.criticalIssues.map((issue, index) => (
                      <div key={index} className="bg-chaos-darker border border-red-500/20 rounded p-3">
                        <div className="font-bold text-white mb-1">{issue.productName}</div>
                        <div className="text-sm text-gray-400 mb-1">ID: {issue.productId}</div>
                        <div className="text-sm text-red-300">{issue.issue}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recommendations */}
              {validationReport.recommendations.length > 0 && (
                <div className="bg-chaos-cyan/10 border-2 border-chaos-cyan/30 rounded-lg p-6">
                  <h4 className="font-bold text-lg text-chaos-cyan mb-4 flex items-center gap-2">
                    <span>💡</span> Recommendations
                  </h4>
                  <ul className="space-y-2">
                    {validationReport.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <span className="text-chaos-cyan">•</span>
                        <span>{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {validationReport.invalidProducts === 0 && validationReport.productsWithWarnings === 0 && (
                <div className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-8 text-center">
                  <div className="text-6xl mb-4">✅</div>
                  <h4 className="font-bold text-2xl text-green-400 mb-2">
                    All Products Validated Successfully!
                  </h4>
                  <p className="text-gray-400">
                    Your product catalog meets all validation requirements. All products are ready for publishing.
                  </p>
                </div>
              )}
            </div>

            {/* Validation Rules Reference */}
            <div className="bg-chaos-dark border border-chaos-purple/30 rounded-lg p-6">
              <h4 className="font-neon text-xl font-bold mb-4 neon-text-red">
                📜 Validation Rules Enforced
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">One product type per listing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Parent + variant structure required</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Unique variant IDs/SKUs</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Individual variant stock quantities</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">1:1 image-to-variant mapping</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">No negative inventory</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Auto-disable at zero stock</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✓</span>
                    <span className="text-gray-300">Variant-only inventory deduction</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <Package className="w-12 h-12 text-chaos-purple" />
              <div>
                <p className="text-gray-400 text-sm">Total Inventory</p>
                <p className="text-3xl font-bold neon-text-purple">{totalInventory}</p>
              </div>
            </div>
          </div>

          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-12 h-12 text-chaos-cyan" />
              <div>
                <p className="text-gray-400 text-sm">Avg Profit Margin</p>
                <p className="text-3xl font-bold neon-text-cyan">{avgProfitMargin.toFixed(0)}%</p>
              </div>
            </div>
          </div>

          <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
            <div className="flex items-center gap-4">
              <DollarSign className="w-12 h-12 text-chaos-red" />
              <div>
                <p className="text-gray-400 text-sm">Low Stock Alerts</p>
                <p className="text-3xl font-bold neon-text-red">{lowStockItems}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg overflow-hidden">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="font-neon text-xl font-bold">Product Inventory</h2>
            <button className="bg-chaos-purple hover:bg-chaos-red px-4 py-2 rounded-lg font-bold transition-all flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Product
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-chaos-darker">
                <tr>
                  <th className="text-left p-4 font-neon text-sm">Product</th>
                  <th className="text-left p-4 font-neon text-sm">Source</th>
                  <th className="text-left p-4 font-neon text-sm">Cost</th>
                  <th className="text-left p-4 font-neon text-sm">Price</th>
                  <th className="text-left p-4 font-neon text-sm">Margin</th>
                  <th className="text-left p-4 font-neon text-sm">Stock</th>
                  <th className="text-left p-4 font-neon text-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {PRODUCTS.map((product) => {
                  const supply = product.supplyChain;
                  const profit = supply ? product.price - supply.supplierCost : 0;
                  const margin = supply ? supply.profitMargin : 0;
                  const isLowStock = supply && supply.inventoryCount < supply.reorderLevel;

                  return (
                    <tr key={product.id} className="border-t border-gray-800 hover:bg-chaos-darker/50">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded" />
                          <div>
                            <p className="font-bold text-sm">{product.name}</p>
                            <p className="text-xs text-gray-500">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        {supply ? (
                          <a
                            href={supply.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-chaos-purple hover:text-chaos-cyan transition-colors"
                          >
                            <span className="capitalize text-sm">{supply.source}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-600 text-sm">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="text-sm">${supply?.supplierCost.toFixed(2) || '-'}</span>
                      </td>
                      <td className="p-4">
                        <span className="font-bold neon-text-purple">${product.price}</span>
                      </td>
                      <td className="p-4">
                        <span className={`font-bold ${margin > 50 ? 'text-green-400' : margin > 30 ? 'text-chaos-cyan' : 'text-gray-400'}`}>
                          {margin > 0 ? `${margin}%` : '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        {supply ? (
                          <div>
                            <span className={`font-bold ${isLowStock ? 'text-chaos-red' : 'text-white'}`}>
                              {supply.inventoryCount}
                            </span>
                            <span className="text-gray-500 text-xs ml-2">/ {supply.reorderLevel}</span>
                            {isLowStock && (
                              <div className="text-xs text-chaos-red mt-1">⚠️ Low Stock</div>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-600">-</span>
                        )}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <button className="p-2 hover:bg-chaos-purple/20 rounded transition-all">
                            <Edit className="w-4 h-4 text-chaos-purple" />
                          </button>
                          <button className="p-2 hover:bg-red-500/20 rounded transition-all">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;
