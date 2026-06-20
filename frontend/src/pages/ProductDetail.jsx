import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { fetchProduct, fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";
import { useCart } from "../context/CartContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [qty, setQty] = useState(1);
  const { addItem } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    setProduct(null);
    fetchProduct(slug).then((p) => {
      setProduct(p);
      setSize(p.sizes?.[0] || "");
      setColor(p.colors?.[0] || "");
    });
  }, [slug]);

  useEffect(() => {
    if (product?.design) {
      fetchProducts({ design: product.design }).then((all) => {
        setRelated(all.filter((p) => p.slug !== product.slug).slice(0, 4));
      });
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-[#9BA1B0] font-mono uppercase tracking-widest">
        Loading…
      </div>
    );
  }

  const handleAdd = () => {
    if (product.sizes?.length > 0 && !size) {
      toast.error("Select a size");
      return;
    }
    addItem(product, { size, color, quantity: qty });
    toast.success(`Added to loadout: ${product.name}`);
  };

  const handleBuyNow = () => {
    if (product.sizes?.length > 0 && !size) {
      toast.error("Select a size");
      return;
    }
    addItem(product, { size, color, quantity: qty });
    navigate("/checkout");
  };

  return (
    <div className="bg-[#0A0C10] text-white">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
        <Link
          data-testid="back-to-shop"
          to="/shop"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.25em] text-[#9BA1B0] hover:text-white"
        >
          <ChevronLeft className="w-3 h-3" /> Back to shop
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-20">
        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="relative">
            <div
              data-testid="product-image-wrap"
              className="relative aspect-square bg-[#12151C] border border-[#222631] brushed overflow-hidden"
            >
              <div
                className="absolute inset-0"
                style={{
                  background: `radial-gradient(circle at 50% 50%, ${product.accent}33 0%, transparent 65%)`,
                }}
              />
              <img
                src={product.image}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-contain p-10"
              />
              {product.badge && (
                <div className="absolute top-4 left-4 bg-[#FF4500] text-white text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-1">
                  {product.badge}
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div>
            <div
              className="label mb-3"
              style={{ color: product.accent }}
            >
              {product.unit}
            </div>
            <h1
              data-testid="product-name"
              className="font-display text-4xl sm:text-5xl uppercase leading-none"
            >
              {product.name}
            </h1>
            <div
              data-testid="product-price"
              className="font-mono text-2xl mt-4 font-semibold"
            >
              ${product.price.toFixed(2)}
            </div>
            <p className="text-[#9BA1B0] mt-6 leading-relaxed">
              {product.description}
            </p>

            {/* Size */}
            {product.sizes?.length > 0 && (
              <div className="mt-8">
                <div className="label mb-3">Size</div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      data-testid={`size-option-${s.replace(/[/\s]/g, "-")}`}
                      onClick={() => setSize(s)}
                      className={`px-4 py-2 border font-mono text-xs uppercase tracking-widest transition-colors ${
                        size === s
                          ? "border-[#FF4500] bg-[#FF4500]/10 text-white"
                          : "border-[#222631] text-[#9BA1B0] hover:border-white hover:text-white"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color */}
            {product.colors?.length > 0 && (
              <div className="mt-6">
                <div className="label mb-3">Color · {color}</div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c}
                      data-testid={`color-option-${c.replace(/\s/g, "-")}`}
                      onClick={() => setColor(c)}
                      className={`px-4 py-2 border font-mono text-xs uppercase tracking-widest transition-colors ${
                        color === c
                          ? "border-white bg-white/5 text-white"
                          : "border-[#222631] text-[#9BA1B0] hover:border-[#8C92A0]"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mt-6">
              <div className="label mb-3">Quantity</div>
              <div className="inline-flex border border-[#222631]">
                <button
                  data-testid="qty-minus"
                  onClick={() => setQty((v) => Math.max(1, v - 1))}
                  className="px-4 py-2 hover:bg-[#12151C]"
                >
                  −
                </button>
                <span className="px-6 py-2 font-mono">{qty}</span>
                <button
                  data-testid="qty-plus"
                  onClick={() => setQty((v) => v + 1)}
                  className="px-4 py-2 hover:bg-[#12151C]"
                >
                  +
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button
                data-testid="add-to-cart-btn"
                onClick={handleAdd}
                className="flex-1 bg-[#FF4500] hover:bg-[#E63E00] text-white py-4 font-mono uppercase tracking-widest text-sm font-bold inline-flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> Add to loadout
              </button>
              <button
                data-testid="buy-now-btn"
                onClick={handleBuyNow}
                className="flex-1 border border-white hover:bg-white hover:text-[#0A0C10] py-4 font-mono uppercase tracking-widest text-sm transition-colors"
              >
                Buy now
              </button>
            </div>

            {/* Perks */}
            <div className="mt-10 grid grid-cols-3 gap-3 border-t border-[#222631] pt-6">
              {[
                { i: Truck, l: "Free $75+" },
                { i: Shield, l: "Heavyweight" },
                { i: RotateCcw, l: "30-day swap" },
              ].map(({ i: Icon, l }, idx) => (
                <div key={idx} className="flex flex-col items-center text-center gap-1">
                  <Icon className="w-5 h-5 text-[#FF4500]" />
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BA1B0]">
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-24">
            <div className="label mb-3">From the same crest</div>
            <h2 className="font-display text-3xl sm:text-4xl uppercase mb-8">
              More from {product.unit}
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
