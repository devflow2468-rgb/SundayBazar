import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { ProductCard } from "../components/ProductCard";
import api from "../services/api";
import { Filter, SlidersHorizontal } from "lucide-react";

export const ProductsPage = ({ categories = [] }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const search = searchParams.get("search") || "";
  const selectedCat = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/products?limit=50`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (selectedCat) url += `&category=${encodeURIComponent(selectedCat)}`;
        if (sort === "price-asc") url += `&sort=price-asc`;
        if (sort === "price-desc") url += `&sort=price-desc`;
        if (sort === "rating") url += `&sort=rating`;

        const res = await api.get(url);
        if (res.data.success) {
          setProducts(res.data.data);
          setTotal(res.data.total);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [search, selectedCat, sort]);

  const handleCategorySelect = (slug) => {
    const next = new URLSearchParams(searchParams);
    if (slug) {
      next.set("category", slug);
    } else {
      next.delete("category");
    }
    setSearchParams(next);
  };

  const handleSortChange = (e) => {
    const next = new URLSearchParams(searchParams);
    next.set("sort", e.target.value);
    setSearchParams(next);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Filter and title header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-borderSoft shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-800">
            {search ? `Search results for "${search}"` : selectedCat ? `Category: ${selectedCat.replace("-", " ")}` : "Sunday Bazar Catalog"}
          </h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Showing {products.length} of {total} products
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-3">
          <label className="text-xs font-semibold text-gray-500 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Sort by:
          </label>
          <select
            value={sort}
            onChange={handleSortChange}
            className="text-xs sm:text-sm font-semibold bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-[#1B9425]"
          >
            <option value="newest">Newest Arrivals</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Category Pills / Sidebar */}
        <aside className="lg:w-60 flex-shrink-0">
          <div className="bg-white p-4 rounded-xl border border-borderSoft shadow-sm sticky top-24">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5 pb-2 border-b border-gray-100">
              <Filter className="w-4 h-4 text-[#1B9425]" /> Filter Categories
            </h3>

            <div className="flex flex-wrap lg:flex-col gap-1.5">
              <button
                onClick={() => handleCategorySelect("")}
                className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition ${
                  !selectedCat
                    ? "bg-[#1B9425] text-white"
                    : "text-slate-600 hover:bg-emerald-50 hover:text-[#1B9425]"
                }`}
              >
                All Categories
              </button>
              {categories.map((c) => (
                <button
                  key={c._id}
                  onClick={() => handleCategorySelect(c.slug)}
                  className={`text-left text-xs font-semibold px-3 py-2 rounded-lg transition ${
                    selectedCat === c.slug
                      ? "bg-[#1B9425] text-white"
                      : "text-slate-600 hover:bg-emerald-50 hover:text-[#1B9425]"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Cards */}
        <main className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl h-64 animate-pulse border border-gray-100" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-borderSoft">
              <p className="text-base font-semibold text-slate-700">Koi product nahi mila!</p>
              <p className="text-xs text-gray-500 mt-1">Try another search or select a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
              {products.map((prod) => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
