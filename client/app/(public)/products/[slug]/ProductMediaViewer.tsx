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
  const currentIdx = images.indexOf(mainImage);
  const activeIndex = currentIdx === -1 ? 0 : currentIdx;

  const handlePrev = () => {
    if (images.length <= 1) return;
    const prevIdx = (activeIndex - 1 + images.length) % images.length;
    setMainImage(images[prevIdx]);
  };

  const handleNext = () => {
    if (images.length <= 1) return;
    const nextIdx = (activeIndex + 1) % images.length;
    setMainImage(images[nextIdx]);
  };

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
            {/* Carousel Container */}
            <div className="relative w-full overflow-hidden rounded-xl border-2 border-[#111111] bg-white p-2 flex items-center justify-center group h-80 md:h-96 shadow-[4px_4px_0px_#111111]">
              <div 
                className="flex w-full h-full transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {images.length > 0 ? (
                  images.map((img, idx) => (
                    <div key={idx} className="min-w-full h-full flex items-center justify-center p-2 select-none">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${productName} ${idx + 1}`}
                        className="max-h-full max-w-full object-contain"
                        draggable={false}
                      />
                    </div>
                  ))
                ) : (
                  <div className="min-w-full h-full flex items-center justify-center p-2 select-none">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80"
                      alt={productName}
                      className="max-h-full max-w-full object-contain"
                      draggable={false}
                    />
                  </div>
                )}
              </div>

              {/* Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={handlePrev}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white text-[#111111] w-8 h-8 rounded-full border-2 border-[#111111] flex items-center justify-center font-black shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-[calc(-50%+0.5px)] active:shadow-[1px_1px_0px_#111111] hover:bg-[#F8DE22] transition-all cursor-pointer select-none z-10"
                  >
                    &larr;
                  </button>
                  <button
                    onClick={handleNext}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white text-[#111111] w-8 h-8 rounded-full border-2 border-[#111111] flex items-center justify-center font-black shadow-[2px_2px_0px_#111111] active:translate-x-0.5 active:translate-y-[calc(-50%+0.5px)] active:shadow-[1px_1px_0px_#111111] hover:bg-[#F8DE22] transition-all cursor-pointer select-none z-10"
                  >
                    &rarr;
                  </button>
                </>
              )}

              {/* Slider Dots/Indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 bg-[#111111]/10 px-2 py-1 rounded-full backdrop-blur-sm z-10">
                  {images.map((_, idx) => (
                    <div
                      key={idx}
                      onClick={() => setMainImage(images[idx])}
                      className={`w-2 h-2 rounded-full cursor-pointer transition-all ${
                        activeIndex === idx ? "bg-[#111111] scale-125" : "bg-gray-400 hover:bg-gray-600"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnails list */}
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
                        ? "border-[#D12052] scale-105 shadow-[2px_2px_0px_#111111]"
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
