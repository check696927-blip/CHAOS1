import { useState } from "react";
import { X, Ruler, User } from "lucide-react";
import { SizeGuide } from "@/types";

interface SizeGuideModalProps {
  open: boolean;
  onClose: () => void;
  sizeGuide: SizeGuide;
  productName: string;
}

const bodyTypes = [
  { id: "slim", label: "Slim/Athletic", description: "Size down for fitted look" },
  { id: "average", label: "Average Build", description: "True to size" },
  { id: "broad", label: "Broad/Muscular", description: "Size up for comfort" }
];

export const SizeGuideModal = ({ open, onClose, sizeGuide, productName }: SizeGuideModalProps) => {
  const [selectedBodyType, setSelectedBodyType] = useState("average");
  const [unit, setUnit] = useState<"cm" | "in">("cm");

  if (!open) return null;

  const isClothing = sizeGuide.type === 'clothing';

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-chaos-dark border-2 border-chaos-purple/50 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-chaos-purple/20 to-chaos-red/20 p-6 border-b border-chaos-purple/30 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Ruler className="w-6 h-6 text-chaos-purple" />
            <div>
              <h2 className="font-chaos text-2xl neon-text-purple">SIZE GUIDE</h2>
              <p className="text-sm text-gray-400 mt-1">{productName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-chaos-purple/20 rounded-lg transition-all"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-6 space-y-6">
          {/* Unit Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-chaos-cyan" />
              <span className="font-neon text-sm">Select Your Build</span>
            </div>
            <div className="flex gap-2 bg-chaos-darker rounded-lg p-1">
              <button
                onClick={() => setUnit("cm")}
                className={`px-4 py-2 rounded-md font-bold text-xs transition-all ${
                  unit === "cm"
                    ? "bg-chaos-purple text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                CM
              </button>
              <button
                onClick={() => setUnit("in")}
                className={`px-4 py-2 rounded-md font-bold text-xs transition-all ${
                  unit === "in"
                    ? "bg-chaos-purple text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                INCHES
              </button>
            </div>
          </div>

          {/* Body Type Selection */}
          {isClothing && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {bodyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedBodyType(type.id)}
                  className={`p-4 rounded-lg border-2 transition-all text-left ${
                    selectedBodyType === type.id
                      ? "border-chaos-purple bg-chaos-purple/10"
                      : "border-gray-700 hover:border-gray-600"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">{type.label}</p>
                  <p className="text-xs text-gray-400">{type.description}</p>
                </button>
              ))}
            </div>
          )}

          {/* Fit Recommendation */}
          {sizeGuide.fitRecommendation && (
            <div className="bg-chaos-purple/10 border border-chaos-purple/30 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-2 text-chaos-purple">Fit Recommendation</h3>
              <p className="text-sm text-gray-300">{sizeGuide.fitRecommendation}</p>
            </div>
          )}

          {/* Size Chart */}
          <div className="overflow-x-auto">
            <table className="w-full border border-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-chaos-darker">
                <tr>
                  <th className="p-3 text-left font-neon text-sm">Size</th>
                  {isClothing ? (
                    <>
                      <th className="p-3 text-center font-neon text-sm">Chest/Bust</th>
                      <th className="p-3 text-center font-neon text-sm">Waist</th>
                      <th className="p-3 text-center font-neon text-sm">Hips</th>
                      <th className="p-3 text-center font-neon text-sm">Length</th>
                    </>
                  ) : (
                    <>
                      <th className="p-3 text-center font-neon text-sm">Diameter</th>
                      <th className="p-3 text-center font-neon text-sm">Circumference</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {sizeGuide.measurements.map((measurement, index) => (
                  <tr key={index} className="border-t border-gray-800 hover:bg-chaos-purple/5">
                    <td className="p-3 font-bold">{measurement.size}</td>
                    {isClothing ? (
                      <>
                        <td className="p-3 text-center">{measurement.bust || '-'}</td>
                        <td className="p-3 text-center">{measurement.waist || '-'}</td>
                        <td className="p-3 text-center">{measurement.hips || '-'}</td>
                        <td className="p-3 text-center">{measurement.length || '-'}</td>
                      </>
                    ) : (
                      <>
                        <td className="p-3 text-center">{measurement.diameter || '-'}</td>
                        <td className="p-3 text-center">{measurement.circumference || '-'}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Model Stats */}
          {sizeGuide.modelStats && (
            <div className="bg-chaos-dark border border-gray-800 rounded-lg p-4">
              <h3 className="font-bold text-sm mb-3 text-chaos-cyan">Model Reference</h3>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-gray-400">Height</p>
                  <p className="font-bold">{sizeGuide.modelStats.height}</p>
                </div>
                <div>
                  <p className="text-gray-400">Weight</p>
                  <p className="font-bold">{sizeGuide.modelStats.weight}</p>
                </div>
                <div>
                  <p className="text-gray-400">Wearing</p>
                  <p className="font-bold text-chaos-purple">{sizeGuide.modelStats.size}</p>
                </div>
              </div>
            </div>
          )}

          {/* How to Measure Guide */}
          <div className="bg-chaos-darker border border-gray-800 rounded-lg p-4">
            <h3 className="font-bold text-sm mb-3">How to Measure</h3>
            <div className="space-y-2 text-xs text-gray-400">
              {isClothing ? (
                <>
                  <p>• <span className="text-white">Chest/Bust:</span> Measure around the fullest part</p>
                  <p>• <span className="text-white">Waist:</span> Measure around your natural waistline</p>
                  <p>• <span className="text-white">Hips:</span> Measure around the fullest part</p>
                  <p>• <span className="text-white">Length:</span> From shoulder seam to bottom hem</p>
                </>
              ) : (
                <>
                  <p>• <span className="text-white">Ring Size:</span> Measure the inner diameter of a ring that fits well</p>
                  <p>• <span className="text-white">Circumference:</span> Wrap a string around your finger and measure</p>
                  <p>• <span className="text-white">Tip:</span> Measure at the end of the day when fingers are largest</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-chaos-darker border-t border-gray-800 p-4 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-chaos-purple to-chaos-red hover:from-chaos-red hover:to-chaos-purple px-6 py-3 rounded-lg font-bold transition-all"
          >
            Got It
          </button>
        </div>
      </div>
    </div>
  );
};
