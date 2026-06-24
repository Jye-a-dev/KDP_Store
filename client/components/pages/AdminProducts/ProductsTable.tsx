import { Product, Category } from "@/types/api";
import { formatVNDFull } from "@/components/pages/admin/helpers";
import AdminPagination from "@/components/pages/admin/AdminPagination";
import CategoryChips from "./CategoryChips";
import ProductsTableControls from "./ProductsTableControls";

interface ProductsTableProps {
  products: Product[];
  categories: Category[];
  isLoading: boolean;
  search: string;
  publishedFilter: string;
  selectedCategory: string;
  viewMode: "table" | "grouped";
  sortBy: "created_at" | "name" | "price" | "stock";
  sortOrder: "ASC" | "DESC";
  page: number;
  totalPages: number;
  total: number;
  onSearchChange: (value: string) => void;
  onPublishedFilterChange: (value: string) => void;
  onSelectedCategoryChange: (value: string) => void;
  onViewModeChange: (mode: "table" | "grouped") => void;
  onSortChange: (field: "created_at" | "name" | "price" | "stock") => void;
  onEdit: (product: Product) => void;
  onDelete: (id: number, name: string) => void;
  onPageChange: (page: number) => void;
}

export default function ProductsTable({
  products,
  categories,
  isLoading,
  search,
  publishedFilter,
  selectedCategory,
  viewMode,
  sortBy,
  sortOrder,
  page,
  totalPages,
  total,
  onSearchChange,
  onPublishedFilterChange,
  onSelectedCategoryChange,
  onViewModeChange,
  onSortChange,
  onEdit,
  onDelete,
  onPageChange,
}: ProductsTableProps) {

  const getCategoryName = (categoryId: number) =>
    categories.find((c) => c.id === categoryId)?.name ?? "—";

  const getProductImage = (product: Product) => {
    if (Array.isArray(product.images_2d)) {
      return product.images_2d[0] || "/placeholder.jpg";
    }
    if (typeof product.images_2d === "string" && product.images_2d.trim()) {
      if (product.images_2d.startsWith("[")) {
        try {
          const parsed = JSON.parse(product.images_2d);
          if (Array.isArray(parsed)) return parsed[0] || "/placeholder.jpg";
        } catch {
          // ignore
        }
      }
      const urls = product.images_2d.split(",").map(u => u.trim());
      return urls[0] || "/placeholder.jpg";
    }
    return "/placeholder.jpg";
  };

  const renderSortHeader = (label: string, field: "created_at" | "name" | "price" | "stock") => {
    const isSorted = sortBy === field;
    return (
      <th
        onClick={() => onSortChange(field)}
        className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555] cursor-pointer hover:text-[#111111] select-none transition-colors"
      >
        <div className="flex items-center gap-1">
          <span>{label}</span>
          {isSorted ? (
            <span className="text-[#111111] font-extrabold">{sortOrder === "ASC" ? "▲" : "▼"}</span>
          ) : (
            <span className="text-[#ccc] group-hover:text-[#aaa] transition-colors">↕</span>
          )}
        </div>
      </th>
    );
  };

  // Group products by category
  const getGroupedData = () => {
    const getDescendantCategoryIds = (catId: number): number[] => {
      const ids: number[] = [catId];
      const checkChildren = (parentId: number) => {
        categories.forEach(c => {
          if (c.parent_id === parentId) {
            ids.push(c.id);
            checkChildren(c.id);
          }
        });
      };
      checkChildren(catId);
      return ids;
    };

    // If selectedCategory is set, show that category and all its descendants
    const targetCats = selectedCategory
      ? categories.filter(c => getDescendantCategoryIds(Number(selectedCategory)).includes(c.id))
      : categories;

    const groups = targetCats.map((cat) => {
      const catProducts = products.filter((p) => p.category_id === cat.id);
      return {
        category: cat,
        products: catProducts,
      };
    }).filter((g) => g.products.length > 0);

    // Uncategorized products
    const uncategorized = products.filter(
      (p) => !categories.some((c) => c.id === p.category_id)
    );

    if (uncategorized.length > 0 && !selectedCategory) {
      groups.push({
        category: {
          id: 0, parent_id: null, name: "Danh mục khác / Chưa phân loại",
          slug: "",
          show_on_navbar: false
        },
        products: uncategorized
      });
    }

    return groups;
  };

  const groupedData = getGroupedData();

  return (
    <div className="space-y-6">
      {/* Category Chips Selector */}
      <CategoryChips
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectedCategoryChange={onSelectedCategoryChange}
      />

      {/* Main Container */}
      <div className="bg-white border-2 border-[#111111] rounded-2xl shadow-[4px_4px_0px_#111111] overflow-hidden">
        {/* Table/Group Controls Header */}
        <ProductsTableControls
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
          publishedFilter={publishedFilter}
          onPublishedFilterChange={onPublishedFilterChange}
          search={search}
          onSearchChange={onSearchChange}
        />

        {/* Loading Spinner */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-[#111111] border-t-[#F8DE22] rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 gap-2">
            <span className="text-5xl">📦</span>
            <p className="text-[14px] font-extrabold text-[#111111]">Không tìm thấy sản phẩm nào</p>
            <p className="text-[12px] text-[#555]">Thử thay đổi bộ lọc hoặc thêm sản phẩm mới.</p>
          </div>
        ) : viewMode === "table" ? (
          /* ==================== FLAT TABLE VIEW ==================== */
          <>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#111111]/10 bg-[#f7f9fa]">
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555]">
                      Ảnh
                    </th>
                    {renderSortHeader("Sản Phẩm", "name")}
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555]">
                      Danh Mục
                    </th>
                    {renderSortHeader("Giá Bán", "price")}
                    {renderSortHeader("Tồn Kho", "stock")}
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555]">
                      Tình Trạng
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555]">
                      Trạng Thái
                    </th>
                    <th className="px-4 py-3.5 text-left text-[10px] font-extrabold uppercase tracking-widest text-[#555]">
                      Hành Động
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product, i) => (
                    <tr
                      key={product.id}
                      className={`border-b border-[#111111]/5 hover:bg-[#f7f9fa]/50 transition-colors ${i === products.length - 1 ? "border-none" : ""
                        }`}
                    >
                      {/* Thumbnail Image */}
                      <td className="px-4 py-3.5">
                        <div className="w-12 h-12 rounded-lg border-2 border-[#111111] overflow-hidden bg-[#f7f9fa] shrink-0 shadow-[1px_1px_0px_#111111]">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </td>

                      {/* Product Name & SKU */}
                      <td className="px-4 py-3.5">
                        <p className="text-[12px] font-extrabold text-[#111111] max-w-48 truncate">
                          {product.name}
                        </p>
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#aaa] border border-[#111111]/10 px-1 py-0.2 rounded mt-0.5 inline-block">
                          {product.sku}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 text-[11px] font-bold text-[#111111]">
                        <span className="bg-[#03AED2]/10 text-[#03AED2] border border-[#03AED2]/20 px-2 py-0.5 rounded-md">
                          {getCategoryName(product.category_id)}
                        </span>
                      </td>

                      {/* Prices */}
                      <td className="px-4 py-3.5">
                        <p className="text-[12px] font-extrabold text-[#111111]">
                          {formatVNDFull(Number(product.price))}
                        </p>
                        {product.original_price && Number(product.original_price) > 0 && (
                          <p className="text-[10px] font-semibold text-[#888] line-through">
                            {formatVNDFull(Number(product.original_price))}
                          </p>
                        )}
                      </td>

                      {/* Stock Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-[#111111] ${product.stock <= 0
                            ? "bg-[#D12052]/20 text-[#D12052]"
                            : product.stock <= 5
                              ? "bg-[#F8DE22]/30 text-[#e6b800]"
                              : "bg-green-50 text-green-700"
                            }`}
                        >
                          {product.stock <= 0 ? "Hết hàng" : `${product.stock} chiếc`}
                        </span>
                      </td>

                      {/* Condition (Secondhand Info) */}
                      <td className="px-4 py-3.5">
                        <span className="text-[11px] font-extrabold text-[#111111] bg-purple-50 border border-purple-200 px-2 py-0.5 rounded-md">
                          {product.condition || "95% Mới"}
                        </span>
                      </td>

                      {/* Publish Status */}
                      <td className="px-4 py-3.5">
                        <span
                          className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#111111] ${product.is_published
                            ? "text-green-700 bg-green-50"
                            : "text-[#555] bg-[#f7f9fa]"
                            }`}
                        >
                          {product.is_published ? "Hiển thị" : "Ẩn"}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-4 py-3.5">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => onEdit(product)}
                            className="px-3 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111] hover:bg-[#e6c51f] transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(product.id, product.name)}
                            className="px-3 py-1 bg-[#D12052] text-white border-2 border-[#111111] rounded-lg text-[10px] font-extrabold uppercase cursor-pointer shadow-[1px_1px_0px_#111111] hover:bg-[#b0163f] transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AdminPagination page={page} totalPages={totalPages} total={total} onPageChange={onPageChange} />
          </>
        ) : (
          /* ==================== GROUPED CATEGORY VIEW ==================== */
          <div className="p-6 space-y-8 max-h-[70vh] overflow-y-auto bg-[#f7f9fa]">
            {groupedData.map(({ category, products: groupProducts }) => (
              <div key={category.id} className="space-y-4">
                {/* Category Section Title Banner */}
                <div className="flex items-center justify-between border-2 border-[#111111] bg-white px-4 py-2.5 rounded-xl shadow-[3px_3px_0px_#111111]">
                  <h3 className="text-[13px] font-extrabold uppercase text-[#111111] tracking-wider">
                    📂 {category.name}
                  </h3>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#03AED2] text-white border border-[#111111] shadow-[1px_1px_0px_#111111]">
                    {groupProducts.length} sản phẩm
                  </span>
                </div>

                {/* Product Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {groupProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-white border-2 border-[#111111] rounded-xl p-3.5 shadow-[3px_3px_0px_#111111] hover:-translate-y-1 hover:shadow-[5px_5px_0px_#111111] transition-all duration-300 flex flex-col justify-between"
                    >
                      <div>
                        {/* Thumbnail image and badges */}
                        <div className="relative aspect-square w-full bg-[#f7f9fa] border-2 border-[#111111] rounded-lg overflow-hidden mb-3">
                          <img
                            src={getProductImage(product)}
                            alt={product.name}
                            className="object-cover w-full h-full"
                          />
                          {/* Condition tag */}
                          <span className="absolute top-1.5 left-1.5 bg-[#03AED2] text-white border border-[#111111] text-[8px] font-extrabold uppercase px-1 py-0.2 rounded shadow-[1px_1px_0px_#111111]">
                            {product.condition || "95% Mới"}
                          </span>
                          {/* Status Badge */}
                          <span
                            className={`absolute top-1.5 right-1.5 border border-[#111111] text-[8px] font-extrabold uppercase px-1 py-0.2 rounded shadow-[1px_1px_0px_#111111] ${product.is_published ? "bg-[#F8DE22] text-[#111111]" : "bg-white text-[#555]"
                              }`}
                          >
                            {product.is_published ? "Mở" : "Ẩn"}
                          </span>
                        </div>

                        {/* SKU & Name */}
                        <span className="text-[9px] font-bold text-[#888] tracking-wider uppercase">
                          {product.sku}
                        </span>
                        <h4 className="text-[12px] font-extrabold text-[#111111] line-clamp-2 min-h-8 mt-0.5 mb-1.5">
                          {product.name}
                        </h4>

                        {/* Prices */}
                        <div className="flex items-baseline gap-1.5 mb-2.5">
                          <span className="text-[13px] font-extrabold text-[#111111]">
                            {formatVNDFull(Number(product.price))}
                          </span>
                          {product.original_price && Number(product.original_price) > 0 && (
                            <span className="text-[10px] font-semibold text-[#888] line-through">
                              {formatVNDFull(Number(product.original_price))}
                            </span>
                          )}
                        </div>

                        {/* Stock */}
                        <div className="flex items-center gap-1 mb-3.5">
                          <span className="text-[9px] font-extrabold uppercase text-[#666]">Tồn kho:</span>
                          <span
                            className={`text-[9.5px] font-extrabold px-2 py-0.2 rounded-full border border-[#111111] ${product.stock <= 0
                              ? "bg-[#D12052]/20 text-[#D12052]"
                              : product.stock <= 5
                                ? "bg-[#F8DE22]/30 text-[#e6b800]"
                                : "bg-green-50 text-green-700"
                              }`}
                          >
                            {product.stock <= 0 ? "Hết" : `${product.stock} chiếc`}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 border-t border-[#111111]/10 pt-2.5 mt-auto">
                        <button
                          type="button"
                          onClick={() => onEdit(product)}
                          className="flex-1 py-1 bg-[#F8DE22] border-2 border-[#111111] rounded-lg text-[9.5px] font-extrabold uppercase cursor-pointer hover:bg-[#e6c51f] transition-colors shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.2 active:translate-y-0.2 active:shadow-[0.5px_0.5px_0px_#111111] text-center"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(product.id, product.name)}
                          className="flex-1 py-1 bg-[#D12052] text-white border-2 border-[#111111] rounded-lg text-[9.5px] font-extrabold uppercase cursor-pointer hover:bg-[#b0163f] transition-colors shadow-[1.5px_1.5px_0px_#111111] active:translate-x-0.2 active:translate-y-0.2 active:shadow-[0.5px_0.5px_0px_#111111] text-center"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
