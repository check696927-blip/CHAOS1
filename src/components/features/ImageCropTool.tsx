import { useState, useRef } from "react";
import { Upload, Crop, Save, Download, Trash2, Grid, CheckCircle, AlertCircle } from "lucide-react";
import { ImageCropData } from "@/types";

export const ImageCropTool = () => {
  const [images, setImages] = useState<ImageCropData[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropSettings, setCropSettings] = useState({
    removeWhitespace: true,
    removeFloor: true,
    aspectRatio: '3:4',
    quality: 90
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: ImageCropData[] = Array.from(files).map((file) => ({
      id: `img-${Date.now()}-${Math.random()}`,
      originalUrl: URL.createObjectURL(file),
      status: 'pending'
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const processSingleImage = (imageId: string) => {
    setImages((prev) =>
      prev.map((img) =>
        img.id === imageId
          ? { ...img, status: 'processing' as const }
          : img
      )
    );

    // Simulate processing
    setTimeout(() => {
      setImages((prev) =>
        prev.map((img) =>
          img.id === imageId
            ? {
                ...img,
                status: 'completed' as const,
                croppedUrl: img.originalUrl, // In real implementation, this would be the processed image
                cropArea: {
                  x: 0,
                  y: 10,
                  width: 100,
                  height: 85
                }
              }
            : img
        )
      );
    }, 2000);
  };

  const processBatch = () => {
    images.forEach((img) => {
      if (img.status === 'pending') {
        processSingleImage(img.id);
      }
    });
  };

  const removeImage = (imageId: string) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId));
    if (selectedImage === imageId) {
      setSelectedImage(null);
    }
  };

  const downloadProcessed = (imageId: string) => {
    const image = images.find((img) => img.id === imageId);
    if (image?.croppedUrl) {
      // In real implementation, trigger download
      console.log('Download:', imageId);
    }
  };

  const saveToAssets = () => {
    const completed = images.filter((img) => img.status === 'completed');
    console.log('Saving to assets:', completed);
    alert(`${completed.length} images ready to save to /assets/products/`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-neon text-2xl font-bold">Product Image Cropper</h2>
          <p className="text-sm text-gray-400 mt-1">Batch process and optimize product photos</p>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept="image/*"
          multiple
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="bg-chaos-purple hover:bg-chaos-red px-6 py-3 rounded-lg font-bold transition-all flex items-center gap-2"
        >
          <Upload className="w-5 h-5" />
          Upload Images
        </button>
      </div>

      {/* Crop Settings */}
      <div className="bg-chaos-dark border border-chaos-red/30 rounded-lg p-6">
        <h3 className="font-bold mb-4">Auto-Crop Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cropSettings.removeWhitespace}
              onChange={(e) => setCropSettings({ ...cropSettings, removeWhitespace: e.target.checked })}
              className="w-5 h-5 accent-chaos-purple"
            />
            <span className="text-sm">Remove Whitespace</span>
          </label>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={cropSettings.removeFloor}
              onChange={(e) => setCropSettings({ ...cropSettings, removeFloor: e.target.checked })}
              className="w-5 h-5 accent-chaos-purple"
            />
            <span className="text-sm">Remove Floor</span>
          </label>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Aspect Ratio</label>
            <select
              value={cropSettings.aspectRatio}
              onChange={(e) => setCropSettings({ ...cropSettings, aspectRatio: e.target.value })}
              className="w-full bg-chaos-darker border border-gray-700 rounded px-3 py-2 text-sm"
            >
              <option value="3:4">3:4 (Product)</option>
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Wide)</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="text-sm text-gray-400 mb-2 block">Quality: {cropSettings.quality}%</label>
            <input
              type="range"
              min="60"
              max="100"
              value={cropSettings.quality}
              onChange={(e) => setCropSettings({ ...cropSettings, quality: parseInt(e.target.value) })}
              className="w-full accent-chaos-purple"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={processBatch}
            disabled={images.length === 0}
            className="bg-gradient-to-r from-chaos-purple to-chaos-red hover:from-chaos-red hover:to-chaos-purple disabled:from-gray-700 disabled:to-gray-800 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2"
          >
            <Crop className="w-4 h-4" />
            Process All ({images.filter(img => img.status === 'pending').length})
          </button>

          <button
            onClick={saveToAssets}
            disabled={!images.some(img => img.status === 'completed')}
            className="bg-chaos-cyan hover:bg-chaos-cyan/80 disabled:bg-gray-700 px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 text-black"
          >
            <Save className="w-4 h-4" />
            Save to Assets ({images.filter(img => img.status === 'completed').length})
          </button>
        </div>
      </div>

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="bg-chaos-dark border-2 border-dashed border-gray-700 rounded-lg p-12 text-center">
          <Upload className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No images uploaded</p>
          <p className="text-sm text-gray-600">Click "Upload Images" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className={`bg-chaos-dark border rounded-lg overflow-hidden ${
                selectedImage === image.id ? 'border-chaos-purple' : 'border-gray-800'
              }`}
            >
              {/* Image Preview */}
              <div
                className="relative aspect-[3/4] bg-gray-900 cursor-pointer"
                onClick={() => setSelectedImage(image.id)}
              >
                <img
                  src={image.croppedUrl || image.originalUrl}
                  alt="Product"
                  className="w-full h-full object-contain"
                />
                
                {/* Status Overlay */}
                <div className="absolute top-2 right-2">
                  {image.status === 'pending' && (
                    <div className="bg-yellow-500 text-black text-xs px-2 py-1 rounded font-bold">
                      PENDING
                    </div>
                  )}
                  {image.status === 'processing' && (
                    <div className="bg-chaos-purple text-white text-xs px-2 py-1 rounded font-bold animate-pulse">
                      PROCESSING...
                    </div>
                  )}
                  {image.status === 'completed' && (
                    <div className="bg-green-500 text-black text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      DONE
                    </div>
                  )}
                  {image.status === 'error' && (
                    <div className="bg-red-500 text-white text-xs px-2 py-1 rounded font-bold flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      ERROR
                    </div>
                  )}
                </div>

                {/* Comparison Toggle */}
                {image.croppedUrl && (
                  <div className="absolute bottom-2 left-2 bg-black/70 text-xs px-2 py-1 rounded">
                    Before/After
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="p-3 flex gap-2">
                {image.status === 'pending' && (
                  <button
                    onClick={() => processSingleImage(image.id)}
                    className="flex-1 bg-chaos-purple hover:bg-chaos-red px-3 py-2 rounded text-xs font-bold transition-all"
                  >
                    Process
                  </button>
                )}
                {image.status === 'completed' && (
                  <button
                    onClick={() => downloadProcessed(image.id)}
                    className="flex-1 bg-chaos-cyan hover:bg-chaos-cyan/80 text-black px-3 py-2 rounded text-xs font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Download className="w-3 h-3" />
                    Download
                  </button>
                )}
                <button
                  onClick={() => removeImage(image.id)}
                  className="bg-red-500/20 hover:bg-red-500/40 text-red-500 p-2 rounded transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
