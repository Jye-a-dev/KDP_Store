"use client";

interface ProductMediaViewerProps {
  activeTab: "2d" | "3d";
  setActiveTab: (tab: "2d" | "3d") => void;
  isFurniture: boolean;
  productName: string;
  mainImage: string;
  setMainImage: (img: string) => void;
  images: string[];
  modelUrl: string;
}

export default function ProductMediaViewer({
  activeTab,
  setActiveTab,
  isFurniture,
  productName,
  mainImage,
  setMainImage,
  images,
  modelUrl,
}: ProductMediaViewerProps) {
  return (
    <div className="w-full md:w-1/2 bg-[#f7f9fa] border-b-2 md:border-b-0 md:border-r-2 border-[#111111] relative flex flex-col justify-between p-6">
      {/* Header Actions */}
      <div className="flex gap-2 mb-4 z-10">
        <button
          onClick={() => setActiveTab("2d")}
          className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
            activeTab === "2d" ? "bg-[#111111] text-white" : "bg-white text-[#111111]"
          }`}
        >
          Hình Ảnh 2D
        </button>
        {isFurniture && (
          <button
            onClick={() => setActiveTab("3d")}
            className={`px-3 py-1.5 rounded-lg border-2 border-[#111111] text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
              activeTab === "3d" ? "bg-[#111111] text-white" : "bg-white text-[#111111]"
            }`}
          >
            Trải Nghiệm 3D Interactive
          </button>
        )}
      </div>

      {/* Media Content */}
      <div className="flex-1 flex items-center justify-center min-h-87.5 md:min-h-112.5">
        {activeTab === "2d" ? (
          <div className="w-full flex flex-col items-center gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={
                mainImage ||
                "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
              }
              alt={productName}
              className="max-h-80 object-contain rounded-xl border border-gray-200 bg-white p-2"
            />
            {images.length > 1 && (
              <div className="flex gap-2 flex-wrap justify-center">
                {images.map((img, idx) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={idx}
                    src={img}
                    alt="Thumbnail"
                    onClick={() => setMainImage(img)}
                    className={`w-12 h-12 object-cover rounded-lg border-2 cursor-pointer transition-all ${
                      mainImage === img
                        ? "border-[#D12052] scale-105"
                        : "border-[#111111] opacity-75 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="w-full h-full min-h-87.5 flex items-center justify-center">
            {/* @ts-ignore */}
            <model-viewer
              src={modelUrl}
              camera-controls
              auto-rotate
              ar
              shadow-intensity="1"
              style={{ width: "100%", height: "400px", outline: "none" }}
              className="bg-transparent"
            >
              {/* @ts-ignore */}
            </model-viewer>
          </div>
        )}
      </div>

      {isFurniture && activeTab === "3d" && (
        <p className="text-[10px] text-gray-500 text-center font-bold uppercase mt-2">
          💡 Giữ chuột trái và kéo để xoay mô hình • Cuộn để phóng to
        </p>
      )}
    </div>
  );
}
