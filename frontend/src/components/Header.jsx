import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";

const navLinks = [
  { to: "/shop", label: "Shop" },
  { to: "/shop?design=dumpster_fire", label: "A Yard" },
  { to: "/shop?unit=Medical", label: "Medical" },
  { to: "/shop?unit=ISU", label: "ISU" },
  { to: "/about", label: "Story" },
];

export default function Header() {
  const { count, setDrawerOpen } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      {/* Tactical top bar */}
      <div
        data-testid="top-banner"
        className="w-full bg-[#FF4500] text-black text-[11px] font-mono uppercase tracking-[0.25em] py-1.5 text-center"
      >
        Free shipping on orders over $75 · Five Buildings · One Mission
      </div>

      <header
        data-testid="site-header"
        className="sticky top-0 z-40 w-full bg-[#0A0C10]/85 backdrop-blur-xl border-b border-[#222631]"
      >
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between">
          <Link
            data-testid="logo-home-link"
            to="/"
            className="flex items-center gap-2 group"
          >
            <Shield className="w-6 h-6 text-[#FF4500] group-hover:rotate-[8deg] transition-transform" />
            <span className="font-display text-2xl uppercase tracking-tight">
              A Yard <span className="text-[#FF4500]">Apparel</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <NavLink
                key={l.label}
                data-testid={`nav-link-${l.label.toLowerCase().replace(/\s/g, "-")}`}
                to={l.to}
                className={({ isActive }) =>
                  `text-xs font-mono uppercase tracking-[0.2em] transition-colors ${
                    isActive ? "text-white" : "text-[#9BA1B0] hover:text-white"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              data-testid="open-cart-btn"
              onClick={() => setDrawerOpen(true)}
              className="relative flex items-center gap-2 px-3 py-2 border border-[#222631] hover:border-[#FF4500] transition-colors"
              aria-label="Open cart"
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="font-mono text-xs tracking-wider">
                CART
              </span>
              {count > 0 && (
                <span
                  data-testid="cart-count-badge"
                  className="absolute -top-2 -right-2 bg-[#FF4500] text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center"
                >
                  {count}
                </span>
              )}
            </button>
            <button
              data-testid="mobile-menu-toggle"
              className="md:hidden p-2 border border-[#222631]"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            data-testid="mobile-menu"
            className="md:hidden border-t border-[#222631] bg-[#0A0C10]"
          >
            <div className="px-5 py-4 flex flex-col gap-3">
              {navLinks.map((l) => (
                <button
                  key={l.label}
                  data-testid={`mobile-nav-${l.label.toLowerCase()}`}
                  onClick={() => {
                    setMobileOpen(false);
                    navigate(l.to);
                  }}
                  className="text-left text-sm font-mono uppercase tracking-[0.2em] text-[#9BA1B0] hover:text-white py-2 border-b border-[#222631]/50"
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
