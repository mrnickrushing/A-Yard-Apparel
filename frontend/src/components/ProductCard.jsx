import React from "react";
import { Link } from "react-router-dom";

const CATEGORY_LABEL = {
  tshirt: "TEE",
  hoodie: "HOODIE",
  hat: "HAT",
  beanie: "BEANIE",
  sticker: "STICKER",
  patch: "PATCH",
  coin: "COIN",
  tumbler: "TUMBLER",
};

export default function ProductCard({ product }) {
  return (
    <Link
      data-testid={`product-card-${product.slug}`}
      to={`/shop/${product.slug}`}
      className="group block bg-[#12151C] border border-[#222631] hover:border-[#FF4500]/70 transition-colors relative"
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden brushed">
        <div
          className="absolute inset-0 opacity-50"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${product.accent}26 0%, transparent 60%)`,
          }}
        />
        <img
          src={product.image}
          alt={product.name}
          className="absolute inset-0 w-full h-full object-contain p-8 transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        {product.badge && (
          <div
            data-testid={`product-badge-${product.slug}`}
            className="absolute top-3 left-3 bg-[#FF4500] text-white text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1"
          >
            {product.badge}
          </div>
        )}
        <div className="absolute top-3 right-3 border border-[#3A4150] bg-[#0A0C10]/80 text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1">
          {CATEGORY_LABEL[product.category] || product.category}
        </div>
      </div>

      {/* Info */}
      <div className="p-4 border-t border-[#222631]">
        <div
          className="text-[10px] font-mono uppercase tracking-[0.25em] mb-2"
          style={{ color: product.accent }}
        >
          {product.unit}
        </div>
        <div className="font-display text-xl uppercase leading-tight mb-3 group-hover:text-[#FF4500] transition-colors">
          {product.name}
        </div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-base font-semibold">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#9BA1B0] group-hover:text-white">
            View →
          </span>
        </div>
      </div>
    </Link>
  );
}
