import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Flame, Brain, Crosshair, Shield, Award, Zap } from "lucide-react";
import { fetchProducts } from "../lib/api";
import ProductCard from "../components/ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [allDesigns, setAllDesigns] = useState([]);

  useEffect(() => {
    fetchProducts({ featured: true }).then(setFeatured).catch(() => {});
    fetchProducts({ category: "tshirt" }).then(setAllDesigns).catch(() => {});
  }, []);

  return (
    <div className="bg-[#0A0C10] text-white">
      {/* ============ HERO ============ */}
      <section
        data-testid="hero-section"
        className="relative min-h-[92vh] overflow-hidden grain"
      >
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1766521723068-78bf96e98939?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2NjZ8MHwxfHNlYXJjaHwzfHxwcmlzb24lMjB3YXRjaHRvd2VyJTIwbmlnaHR8ZW58MHx8fHwxNzgxOTgyMzkyfDA&ixlib=rb-4.1.0&q=85"
            alt=""
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C10] via-[#0A0C10]/70 to-[#0A0C10]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0A0C10] via-transparent to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-5 md:px-10 pt-32 md:pt-40 pb-20">
          <div
            data-testid="hero-eyebrow"
            className="inline-flex items-center gap-2 border border-[#FF4500]/40 bg-[#FF4500]/10 px-3 py-1.5 mb-6"
          >
            <span className="w-1.5 h-1.5 bg-[#FF4500] animate-pulse" />
            <span className="font-mono text-[11px] uppercase tracking-[0.3em] text-[#FF4500]">
              Mule Creek · A Yard · Level IV
            </span>
          </div>
          <h1
            data-testid="hero-headline"
            className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.85] tracking-tight max-w-5xl"
          >
            BUILT BY <span className="text-[#FF4500]">THE LINE</span>.<br />
            FOR THE LINE.
          </h1>
          <p
            data-testid="hero-subtext"
            className="mt-6 text-[#9BA1B0] text-lg max-w-xl leading-relaxed"
          >
            Apparel honoring the men and women working the toughest yards in
            California. Forged at Mule Creek State Prison. Worn by the brothers
            and sisters of the watch.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link
              data-testid="hero-shop-cta"
              to="/shop"
              className="bg-[#FF4500] hover:bg-[#E63E00] px-8 py-4 font-mono uppercase tracking-widest text-sm font-bold inline-flex items-center gap-2"
            >
              Shop the line <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              data-testid="hero-story-cta"
              to="/about"
              className="border border-[#8C92A0] hover:border-white hover:bg-white/5 px-8 py-4 font-mono uppercase tracking-widest text-sm inline-flex items-center"
            >
              Our story
            </Link>
          </div>

          {/* Tactical stat strip */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px bg-[#222631] border border-[#222631] max-w-3xl">
            {[
              { v: "5", l: "Buildings" },
              { v: "1", l: "Mission" },
              { v: "11+", l: "Unit Designs" },
              { v: "24/7", l: "On the line" },
            ].map((s, i) => (
              <div key={i} className="bg-[#0A0C10] p-4">
                <div className="font-display text-3xl text-[#FF4500]">{s.v}</div>
                <div className="label mt-1">{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom marquee */}
        <div className="absolute bottom-0 left-0 right-0 border-y border-[#222631] bg-[#0A0C10]/90 overflow-hidden z-10">
          <div className="flex animate-marquee whitespace-nowrap py-3">
            {Array.from({ length: 2 }).map((_, k) => (
              <div key={k} className="flex shrink-0">
                {[
                  "FIVE BUILDINGS",
                  "ONE MISSION",
                  "A YARD CUSTODY",
                  "BUILT ON DISCIPLINE",
                  "UNITED AS ONE",
                  "EXPECT THE UNEXPECTED",
                  "STRENGTH IN MIND",
                  "SUPPORT IN ACTION",
                ].map((t, j) => (
                  <span
                    key={j}
                    className="font-display text-2xl uppercase tracking-tight mx-8 text-white/70"
                  >
                    {t}{" "}
                    <span className="text-[#FF4500] mx-2">✦</span>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ BENTO FEATURED STICKERS ============ */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-20 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <div className="label mb-3">/02 — Flagship crests</div>
            <h2 className="font-display text-4xl sm:text-6xl uppercase leading-none">
              The Originals
            </h2>
            <p className="text-[#9BA1B0] mt-4 max-w-lg">
              The two crests that started it all. Designed for and earned by the
              officers and clinicians of A Yard.
            </p>
          </div>
          <Link
            data-testid="originals-shop-link"
            to="/shop"
            className="font-mono text-xs uppercase tracking-[0.25em] text-[#FF4500] hover:underline"
          >
            View all designs →
          </Link>
        </div>

        <div className="grid md:grid-cols-3 grid-rows-2 gap-4 md:gap-6 md:h-[600px]">
          {/* Dumpster fire - spans 2 cols */}
          <Link
            data-testid="bento-dumpster-fire"
            to="/shop?design=dumpster_fire"
            className="md:col-span-2 md:row-span-2 relative bg-[#12151C] border border-[#222631] hover:border-[#FF4500] transition-colors overflow-hidden group"
          >
            <div className="absolute inset-0 brushed opacity-60" />
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 70% 50%, rgba(255,69,0,0.25) 0%, transparent 60%)",
              }}
            />
            <div className="absolute inset-0 tactical-stripes opacity-30" />
            <img
              src="/stickers/sticker1.png"
              alt="Dumpster Fire Response Team"
              className="absolute right-0 top-1/2 -translate-y-1/2 w-[80%] md:w-[60%] object-contain sticker-glow group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 p-8 md:p-12 h-full flex flex-col justify-between">
              <div>
                <Flame className="w-8 h-8 text-[#FF4500] mb-4" />
                <div className="label text-[#FF4500]">A Yard Custody</div>
                <h3 className="font-display text-4xl md:text-6xl uppercase leading-none mt-4 max-w-md">
                  Dumpster Fire Response Team
                </h3>
                <p className="text-[#9BA1B0] mt-4 max-w-sm">
                  Built on discipline. United as one. Expect the unexpected.
                </p>
              </div>
              <div className="flex items-center gap-2 font-mono uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                Shop the crest <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Mental Health */}
          <Link
            data-testid="bento-mental-health"
            to="/shop?design=mental_health"
            className="relative bg-[#12151C] border border-[#222631] hover:border-[#8B5FBF] transition-colors overflow-hidden group"
          >
            <div className="absolute inset-0 brushed opacity-60" />
            <div
              className="absolute inset-0 opacity-50"
              style={{
                background:
                  "radial-gradient(circle at 50% 50%, rgba(139,95,191,0.3) 0%, transparent 60%)",
              }}
            />
            <img
              src="/stickers/sticker2.png"
              alt="Mental Health Team"
              className="absolute right-0 bottom-0 w-[80%] object-contain sticker-glow-purple group-hover:scale-105 transition-transform duration-700"
            />
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
              <Brain className="w-6 h-6 text-[#8B5FBF] mb-3" />
              <div className="label" style={{ color: "#8B5FBF" }}>Mental Health</div>
              <h3 className="font-display text-3xl uppercase leading-none mt-3">
                Strength in Mind
              </h3>
              <div className="mt-auto pt-6 flex items-center gap-2 font-mono uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                View → 
              </div>
            </div>
          </Link>

          {/* ISU */}
          <Link
            data-testid="bento-isu"
            to="/shop?design=isu"
            className="relative bg-[#12151C] border border-[#222631] hover:border-white transition-colors overflow-hidden group"
          >
            <div className="absolute inset-0 brushed opacity-60" />
            <div className="absolute inset-0 tactical-stripes opacity-20" />
            <div className="relative z-10 p-6 md:p-8 h-full flex flex-col">
              <Crosshair className="w-6 h-6 text-[#C9CDD4] mb-3" />
              <div className="label">ISU</div>
              <h3 className="font-display text-3xl uppercase leading-none mt-3">
                Quiet Professionals
              </h3>
              <p className="text-[#9BA1B0] text-sm mt-3">
                Investigative Services. Low signature.
              </p>
              <div className="mt-auto pt-6 flex items-center gap-2 font-mono uppercase text-xs tracking-widest group-hover:gap-4 transition-all">
                View → 
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ============ FEATURED PRODUCTS ============ */}
      {featured.length > 0 && (
        <section className="bg-[#0A0C10] border-y border-[#222631]">
          <div className="max-w-7xl mx-auto px-5 md:px-10 py-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <div className="label mb-3">/03 — Field tested</div>
                <h2 className="font-display text-4xl sm:text-5xl uppercase">
                  Best in the rack
                </h2>
              </div>
              <Link
                data-testid="featured-all-link"
                to="/shop"
                className="font-mono text-xs uppercase tracking-[0.25em] text-[#9BA1B0] hover:text-white"
              >
                All gear →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.slice(0, 4).map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ YARDS NAV ============ */}
      <section className="max-w-7xl mx-auto px-5 md:px-10 py-20">
        <div className="mb-10">
          <div className="label mb-3">/04 — Shop by unit</div>
          <h2 className="font-display text-4xl sm:text-5xl uppercase">
            Find your <span className="text-[#FF4500]">house</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { d: "dumpster_fire", l: "A Yard", c: "#FF4500" },
            { d: "b_yard", l: "B Yard", c: "#D4AF37" },
            { d: "c_yard", l: "C Yard", c: "#3DA9FC" },
            { d: "d_yard", l: "D Yard", c: "#2EC4B6" },
            { d: "e_yard", l: "E Yard", c: "#E63946" },
            { d: "isu", l: "ISU", c: "#C9CDD4" },
            { d: "control_booths", l: "Control", c: "#F4A261" },
            { d: "mental_health", l: "Mental Health", c: "#8B5FBF" },
            { d: "tta", l: "TTA", c: "#EF476F" },
            { d: "yard_clinics", l: "Yard Clinics", c: "#118AB2" },
          ].map((u) => (
            <Link
              key={u.d}
              data-testid={`unit-tile-${u.d}`}
              to={`/shop?design=${u.d}`}
              className="group border border-[#222631] hover:border-white bg-[#12151C] aspect-[4/3] p-5 flex flex-col justify-between transition-colors relative overflow-hidden"
            >
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: `radial-gradient(circle at 80% 20%, ${u.c}33 0%, transparent 70%)`,
                }}
              />
              <div className="relative z-10">
                <div
                  className="w-3 h-3 mb-3"
                  style={{ background: u.c }}
                />
                <div className="font-display text-xl uppercase leading-none">
                  {u.l}
                </div>
              </div>
              <div className="relative z-10 font-mono text-[10px] uppercase tracking-[0.25em] text-[#9BA1B0] group-hover:text-white">
                Enter →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ============ VALUE PROPS ============ */}
      <section className="bg-[#12151C] border-y border-[#222631]">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-16 grid md:grid-cols-3 gap-px bg-[#222631]">
          {[
            {
              icon: Shield,
              title: "Heavyweight Build",
              text: "Premium fabric weights. Designed to hold up to shift work and beyond.",
            },
            {
              icon: Award,
              title: "Made by the Watch",
              text: "Every design is conceived inside the yard, by the officers and clinicians who walk it.",
            },
            {
              icon: Zap,
              title: "Fast Mobilization",
              text: "Orders ship in 3–5 business days. Free shipping over $75.",
            },
          ].map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="bg-[#12151C] p-8">
                <Icon className="w-7 h-7 text-[#FF4500] mb-4" />
                <h3 className="font-display text-2xl uppercase mb-2">{v.title}</h3>
                <p className="text-[#9BA1B0] text-sm leading-relaxed">{v.text}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ============ CALL TO ACTION ============ */}
      <section className="relative max-w-7xl mx-auto px-5 md:px-10 py-24">
        <div className="relative border border-[#222631] p-10 md:p-16 corners bg-[#12151C] overflow-hidden">
          <div className="absolute inset-0 tactical-stripes opacity-30" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="label mb-3 text-[#FF4500]">/ Five Buildings · One Mission</div>
              <h2 className="font-display text-4xl sm:text-6xl uppercase leading-none">
                Rep your house.<br />
                <span className="text-[#FF4500]">Wear your watch.</span>
              </h2>
            </div>
            <div>
              <p className="text-[#9BA1B0] mb-6">
                Whether you're working the line at Mule Creek or any yard in the
                state, this gear was built for you. Pick your crest. Hold the
                line.
              </p>
              <Link
                data-testid="cta-shop-btn"
                to="/shop"
                className="bg-[#FF4500] hover:bg-[#E63E00] px-8 py-4 font-mono uppercase tracking-widest text-sm font-bold inline-flex items-center gap-2"
              >
                Shop the line <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
