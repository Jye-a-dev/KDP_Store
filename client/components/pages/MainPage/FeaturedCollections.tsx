"use client";

interface FeaturedCollectionsProps {
  furnitureCat: number | null;
  clothingCat: number | null;
  accessoriesCat: number | null;
  handleCategorySelect: (catId: number | null) => void;
}

export default function FeaturedCollections({
  furnitureCat,
  clothingCat,
  accessoriesCat,
  handleCategorySelect,
}: FeaturedCollectionsProps) {
  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-[26px] md:text-[30px] font-extrabold uppercase relative inline-block z-10">
          Bộ sưu tập tiêu điểm
          <span className="absolute -z-10 bottom-0.5 -left-1.25 -right-1.25 h-3 bg-[#F8DE22]" />
        </h2>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-[5%] w-full">
        {/* Card 1: Furniture */}
        <div 
          onClick={() => handleCategorySelect(furnitureCat)}
          className="group relative h-60 md:h-95 bg-[#f7f9fa] overflow-hidden cursor-pointer border-2 border-[#111111]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80" 
            alt="Oversize Hoodies"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-5 md:p-6 text-left">
            <h3 className="text-white uppercase text-[18px] md:text-[20px] font-bold mb-1">Interactive 3D Furniture</h3>
            <span className="text-[#F8DE22] text-[11px] md:text-[12px] uppercase font-bold">Xem bộ sưu tập &rarr;</span>
          </div>
        </div>

        {/* Card 2: Clothing */}
        <div 
          onClick={() => handleCategorySelect(clothingCat)}
          className="group relative h-60 md:h-95 bg-[#f7f9fa] overflow-hidden cursor-pointer border-2 border-[#111111]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80" 
            alt="Streetwear"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-5 md:p-6 text-left">
            <h3 className="text-white uppercase text-[18px] md:text-[20px] font-bold mb-1">Streetwear Apparel</h3>
            <span className="text-[#F8DE22] text-[11px] md:text-[12px] uppercase font-bold">Xem bộ sưu tập &rarr;</span>
          </div>
        </div>

        {/* Card 3: Accessories */}
        <div 
          onClick={() => handleCategorySelect(accessoriesCat)}
          className="group relative h-60 md:h-95 bg-[#f7f9fa] overflow-hidden cursor-pointer border-2 border-[#111111]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80" 
            alt="Accessories"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-5 md:p-6 text-left">
            <h3 className="text-white uppercase text-[18px] md:text-[20px] font-bold mb-1">Chunky & Jewelry Tech</h3>
            <span className="text-[#F8DE22] text-[11px] md:text-[12px] uppercase font-bold">Xem bộ sưu tập &rarr;</span>
          </div>
        </div>
      </div>
    </section>
  );
}
