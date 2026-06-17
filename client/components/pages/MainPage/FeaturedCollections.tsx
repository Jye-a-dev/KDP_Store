"use client";

interface Category {
  id: number;
  parent_id: number | null;
  name: string;
  slug: string;
}

// Fallback images per category index
const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=600&q=80",
];

interface FeaturedCollectionsProps {
  categories: Category[];
  handleCategorySelect: (catId: number | null) => void;
}

export default function FeaturedCollections({
  categories,
  handleCategorySelect,
}: FeaturedCollectionsProps) {
  // Show only root-level categories (no parent), up to 4
  const featured = categories.filter((c) => c.parent_id === null).slice(0, 4);

  if (featured.length === 0) return null;

  return (
    <section className="w-full bg-white py-12 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-[26px] md:text-[30px] font-extrabold uppercase relative inline-block z-10">
          Bộ sưu tập tiêu điểm
          <span className="absolute -z-10 bottom-0.5 -left-1.25 -right-1.25 h-3 bg-[#F8DE22]" />
        </h2>
      </div>

      <div
        className={`grid grid-cols-1 gap-6 px-[5%] w-full ${
          featured.length === 1
            ? "md:grid-cols-1"
            : featured.length === 2
            ? "md:grid-cols-2"
            : featured.length >= 4
            ? "md:grid-cols-4"
            : "md:grid-cols-3"
        }`}
      >
        {featured.map((cat, i) => (
          <div
            key={cat.id}
            onClick={() => handleCategorySelect(cat.id)}
            className="group relative h-60 md:h-80 bg-[#f7f9fa] overflow-hidden cursor-pointer border-2 border-[#111111]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]}
              alt={cat.name}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 group-hover:rotate-1"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-5 md:p-6 text-left">
              <h3 className="text-white uppercase text-[18px] md:text-[20px] font-bold mb-1">
                {cat.name}
              </h3>
              <span className="text-[#F8DE22] text-[11px] md:text-[12px] uppercase font-bold">
                Xem bộ sưu tập &rarr;
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
