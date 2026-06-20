import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Filter, X } from "lucide-react";
import { fetchProducts, fetchProductFilters } from "../lib/api";
import ProductCard from "../components/ProductCard";

const CATEGORY_LABELS = {
  tshirt: "Tees",
  hoodie: "Hoodies",
  hat: "Hats",
  beanie: "Beanies",
  sticker: "Stickers",
  patch: "Patches",
  coin: "Coins",
  tumbler: "Tumblers",
};

const DESIGN_LABELS = {
  dumpster_fire: "A Yard / Dumpster Fire Response",
  mental_health: "Mental Health Team",
  b_yard: "B Yard",
  c_yard: "C Yard",
  d_yard: "D Yard",
  e_yard: "E Yard",
  isu: "ISU",
  control_booths: "Control Booths",
  a_yard_medical: "A Yard Medical",
  tta: "TTA",
  yard_clinics: "Yard Clinics",
};

export default function Shop() {
  const [params, setParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({ categories: [], units: [], designs: [] });
  const [loading, setLoading] = useState(true);
  const [mobileFilters, setMobileFilters] = useState(false);

  const category = params.get("category") || "";
  const design = params.get("design") || "";
  const unit = params.get("unit") || "";

  useEffect(() => {
    fetchProductFilters().then(setFilters).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const q = {};
    if (category) q.category = category;
    if (design) q.design = design;
    if (unit) q.unit = unit;
    fetchProducts(q)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [category, design, unit]);

  const setParam = (key, val) => {
    const next = new URLSearchParams(params);
    if (!val) next.delete(key);
    else next.set(key, val);
    setParams(next);
  };

  const clearAll = () => setParams(new URLSearchParams());

  const activeCount = [category, design, unit].filter(Boolean).length;

  const heading = useMemo(() => {
    if (design && DESIGN_LABELS[design]) return DESIGN_LABELS[design];
    if (category && CATEGORY_LABELS[category]) return CATEGORY_LABELS[category];
    if (unit) return unit;
    return "All Gear";
  }, [design, category, unit]);

  return (
    <div className="bg-[#0A0C10] text-white min-h-screen">
      {/* Page Header */}
      <section className="border-b border-[#222631] relative overflow-hidden">
        <div className="absolute inset-0 tactical-stripes opacity-20" />
        <div className="relative max-w-7xl mx-auto px-5 md:px-10 py-16 md:py-20">
          <div className="label mb-3">/ Shop · Field gear</div>
          <h1
            data-testid="shop-heading"
            className="font-display text-5xl sm:text-7xl uppercase leading-none"
          >
            {heading}
          </h1>
          <p className="text-[#9BA1B0] mt-4 max-w-xl">
            Browse the full loadout. Filter by unit, category, or crest. Built
            heavyweight, made for shift.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
        <div className="flex md:hidden mb-6">
          <button
            data-testid="mobile-filter-toggle"
            onClick={() => setMobileFilters(true)}
            className="flex items-center gap-2 border border-[#222631] px-4 py-2 font-mono text-xs uppercase tracking-widest"
          >
            <Filter className="w-3 h-3" /> Filters {activeCount > 0 && `(${activeCount})`}
          </button>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-10">
          {/* Sidebar */}
          <aside
            className={`${
              mobileFilters
                ? "fixed inset-0 z-50 bg-[#0A0C10] p-6 overflow-y-auto"
                : "hidden md:block"
            }`}
            data-testid="filters-sidebar"
          >
            {mobileFilters && (
              <div className="flex justify-between items-center mb-6">
                <div className="font-display text-2xl uppercase">Filters</div>
                <button
                  data-testid="mobile-filter-close"
                  onClick={() => setMobileFilters(false)}
                >
                  <X />
                </button>
              </div>
            )}

            {activeCount > 0 && (
              <button
                data-testid="clear-filters-btn"
                onClick={clearAll}
                className="mb-6 text-[10px] font-mono uppercase tracking-[0.25em] text-[#FF4500] hover:underline"
              >
                Clear all ({activeCount})
              </button>
            )}

            <FilterGroup
              label="Category"
              testid="filter-category"
              options={filters.categories.map((c) => ({
                value: c,
                label: CATEGORY_LABELS[c] || c,
              }))}
              value={category}
              onChange={(v) => setParam("category", v)}
            />

            <FilterGroup
              label="Crest"
              testid="filter-design"
              options={filters.designs.map((d) => ({
                value: d,
                label: DESIGN_LABELS[d] || d,
              }))}
              value={design}
              onChange={(v) => setParam("design", v)}
            />

            <FilterGroup
              label="Unit"
              testid="filter-unit"
              options={filters.units.map((u) => ({ value: u, label: u }))}
              value={unit}
              onChange={(v) => setParam("unit", v)}
            />
          </aside>

          {/* Products grid */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <div className="label">
                {loading ? "Loading..." : `${products.length} item${products.length !== 1 ? "s" : ""}`}
              </div>
            </div>

            {loading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-square bg-[#12151C] border border-[#222631] animate-pulse"
                  />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div
                data-testid="shop-empty-state"
                className="border border-dashed border-[#222631] p-12 text-center"
              >
                <div className="font-display text-2xl uppercase mb-2">
                  No gear matches that filter
                </div>
                <p className="text-[#9BA1B0] text-sm">
                  Try clearing filters or selecting a different crest.
                </p>
              </div>
            ) : (
              <div
                data-testid="products-grid"
                className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
              >
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ label, options, value, onChange, testid }) {
  return (
    <div className="mb-8">
      <div className="label mb-3">{label}</div>
      <div className="space-y-1.5">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              data-testid={`${testid}-${opt.value}`}
              onClick={() => onChange(active ? "" : opt.value)}
              className={`w-full text-left px-3 py-2 border text-xs font-mono uppercase tracking-wider transition-colors ${
                active
                  ? "border-[#FF4500] bg-[#FF4500]/10 text-white"
                  : "border-[#222631] text-[#9BA1B0] hover:border-[#8C92A0] hover:text-white"
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
