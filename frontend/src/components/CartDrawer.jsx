import React from "react";
import { useNavigate } from "react-router-dom";
import { X, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "../context/CartContext";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "./ui/sheet";

export default function CartDrawer() {
  const {
    items,
    removeItem,
    updateQty,
    subtotal,
    drawerOpen,
    setDrawerOpen,
    count,
  } = useCart();
  const navigate = useNavigate();

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.99;
  const total = subtotal + shipping;

  return (
    <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
      <SheetContent
        data-testid="cart-drawer"
        className="bg-[#0A0C10] border-l border-[#222631] text-white w-full sm:max-w-md p-0 flex flex-col"
      >
        <SheetHeader className="px-6 py-5 border-b border-[#222631] flex flex-row items-center justify-between">
          <SheetTitle className="font-display text-2xl uppercase tracking-tight text-white">
            Loadout <span className="text-[#FF4500]">/ {count}</span>
          </SheetTitle>
          <SheetDescription className="sr-only">
            Your cart with selected gear ready for checkout
          </SheetDescription>
          <button
            data-testid="cart-drawer-close"
            onClick={() => setDrawerOpen(false)}
            className="border border-[#222631] hover:border-[#FF4500] p-2"
            aria-label="Close cart"
          >
            <X className="w-4 h-4" />
          </button>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div
              data-testid="cart-empty-state"
              className="flex flex-col items-center justify-center h-full text-center py-16"
            >
              <ShoppingBag className="w-12 h-12 text-[#3A4150] mb-4" />
              <div className="font-display text-2xl uppercase">Empty rack</div>
              <p className="text-[#9BA1B0] text-sm mt-2 max-w-xs">
                No gear staged yet. Build out your loadout from the shop.
              </p>
              <button
                data-testid="cart-empty-shop-btn"
                onClick={() => {
                  setDrawerOpen(false);
                  navigate("/shop");
                }}
                className="mt-6 bg-[#FF4500] hover:bg-[#E63E00] px-6 py-3 font-mono uppercase text-xs tracking-widest"
              >
                Shop the line
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-[#222631]">
              {items.map((it) => (
                <li
                  data-testid={`cart-item-${it._key}`}
                  key={it._key}
                  className="py-4 flex gap-3"
                >
                  <div
                    className="w-20 h-20 shrink-0 border border-[#222631] bg-[#12151C] relative"
                    style={{
                      background: `radial-gradient(circle, ${it.accent}33 0%, #0A0C10 70%)`,
                    }}
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="absolute inset-0 w-full h-full object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-display text-sm uppercase truncate">
                      {it.name}
                    </div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#9BA1B0] mt-1">
                      {it.size && <span>{it.size}</span>}
                      {it.color && (
                        <span> · {it.color}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-[#222631]">
                        <button
                          data-testid={`cart-qty-minus-${it._key}`}
                          onClick={() => updateQty(it._key, it.quantity - 1)}
                          className="p-1.5 hover:bg-[#12151C]"
                          aria-label="Decrease"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="font-mono text-xs px-3">{it.quantity}</span>
                        <button
                          data-testid={`cart-qty-plus-${it._key}`}
                          onClick={() => updateQty(it._key, it.quantity + 1)}
                          className="p-1.5 hover:bg-[#12151C]"
                          aria-label="Increase"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                      <div className="font-mono text-sm">
                        ${(it.price * it.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <button
                    data-testid={`cart-remove-${it._key}`}
                    onClick={() => removeItem(it._key)}
                    className="self-start text-[#9BA1B0] hover:text-[#FF4500]"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-[#222631] p-6 space-y-3 bg-[#0A0C10]">
            <div className="flex justify-between text-sm text-[#9BA1B0]">
              <span>Subtotal</span>
              <span data-testid="cart-subtotal" className="font-mono text-white">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between text-sm text-[#9BA1B0]">
              <span>Shipping</span>
              <span className="font-mono text-white">
                {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
              </span>
            </div>
            <div className="flex justify-between border-t border-[#222631] pt-3">
              <span className="font-display uppercase text-lg">Total</span>
              <span
                data-testid="cart-total"
                className="font-mono text-lg font-bold"
              >
                ${total.toFixed(2)}
              </span>
            </div>
            <button
              data-testid="cart-checkout-btn"
              onClick={() => {
                setDrawerOpen(false);
                navigate("/checkout");
              }}
              className="w-full bg-[#FF4500] hover:bg-[#E63E00] text-white py-4 font-mono uppercase tracking-widest text-sm font-bold"
            >
              Checkout →
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
