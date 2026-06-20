import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronLeft, Lock, Truck } from "lucide-react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { createStripeSession, createManualOrder } from "../lib/api";

const US_STATES = [
  "AL","AK","AZ","AR","CA","CO","CT","DE","FL","GA","HI","ID","IL","IN","IA","KS","KY","LA","ME","MD","MA","MI","MN","MS","MO","MT","NE","NV","NH","NJ","NM","NY","NC","ND","OH","OK","OR","PA","RI","SC","SD","TN","TX","UT","VT","VA","WA","WV","WI","WY"
];

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [method, setMethod] = useState("stripe");
  const [form, setForm] = useState({
    customer_name: "",
    customer_email: "",
    address_line1: "",
    address_line2: "",
    city: "",
    state: "CA",
    zip_code: "",
    country: "USA",
    notes: "",
  });

  const shipping = subtotal > 75 || subtotal === 0 ? 0 : 7.99;
  const total = subtotal + shipping;

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const isValid =
    form.customer_name &&
    form.customer_email &&
    form.address_line1 &&
    form.city &&
    form.state &&
    form.zip_code;

  if (items.length === 0) {
    return (
      <div className="bg-[#0A0C10] text-white min-h-[80vh] flex items-center justify-center px-5">
        <div className="text-center max-w-md">
          <div className="font-display text-4xl uppercase mb-3">Empty rack</div>
          <p className="text-[#9BA1B0] mb-6">
            You don't have any gear staged. Head to the shop to build your loadout.
          </p>
          <Link
            data-testid="checkout-empty-shop-btn"
            to="/shop"
            className="bg-[#FF4500] hover:bg-[#E63E00] px-6 py-3 font-mono uppercase tracking-widest text-sm inline-block"
          >
            Shop the line
          </Link>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid) {
      toast.error("Fill all required shipping fields");
      return;
    }
    setSubmitting(true);
    const payload = {
      ...form,
      items: items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
        size: i.size || null,
        color: i.color || null,
      })),
      origin_url: window.location.origin,
    };
    try {
      if (method === "stripe") {
        const res = await createStripeSession(payload);
        if (res.url) {
          window.location.href = res.url;
        } else {
          toast.error("Could not start checkout");
          setSubmitting(false);
        }
      } else {
        const res = await createManualOrder(payload);
        clear();
        toast.success("Order placed. We'll email you to confirm.");
        navigate(`/success?manual=1&order_id=${res.order_id}`);
      }
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.detail || "Checkout failed. Try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#0A0C10] text-white min-h-screen">
      <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
        <Link
          to="/shop"
          className="inline-flex items-center gap-1 text-xs font-mono uppercase tracking-[0.25em] text-[#9BA1B0] hover:text-white"
        >
          <ChevronLeft className="w-3 h-3" /> Continue shopping
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-10 pb-16">
        <div className="label mb-2">/ Final muster</div>
        <h1 className="font-display text-5xl sm:text-6xl uppercase leading-none mb-10">
          Checkout
        </h1>

        <form
          data-testid="checkout-form"
          onSubmit={handleSubmit}
          className="grid lg:grid-cols-[1fr_400px] gap-10"
        >
          {/* Shipping */}
          <div className="space-y-6">
            <Section title="01 — Officer details">
              <Field label="Full name" required>
                <input
                  data-testid="checkout-name"
                  required
                  value={form.customer_name}
                  onChange={update("customer_name")}
                  className={inputCls}
                  placeholder="Sgt. J. Smith"
                />
              </Field>
              <Field label="Email" required>
                <input
                  data-testid="checkout-email"
                  required
                  type="email"
                  value={form.customer_email}
                  onChange={update("customer_email")}
                  className={inputCls}
                  placeholder="officer@dept.gov"
                />
              </Field>
            </Section>

            <Section title="02 — Shipping address">
              <Field label="Address" required>
                <input
                  data-testid="checkout-address1"
                  required
                  value={form.address_line1}
                  onChange={update("address_line1")}
                  className={inputCls}
                  placeholder="4001 Hwy 104"
                />
              </Field>
              <Field label="Apt / Unit (optional)">
                <input
                  data-testid="checkout-address2"
                  value={form.address_line2}
                  onChange={update("address_line2")}
                  className={inputCls}
                  placeholder="Apt 4B"
                />
              </Field>
              <div className="grid sm:grid-cols-3 gap-4">
                <Field label="City" required>
                  <input
                    data-testid="checkout-city"
                    required
                    value={form.city}
                    onChange={update("city")}
                    className={inputCls}
                    placeholder="Ione"
                  />
                </Field>
                <Field label="State" required>
                  <select
                    data-testid="checkout-state"
                    required
                    value={form.state}
                    onChange={update("state")}
                    className={inputCls}
                  >
                    {US_STATES.map((s) => (
                      <option key={s} value={s} className="bg-[#0A0C10]">
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="ZIP" required>
                  <input
                    data-testid="checkout-zip"
                    required
                    value={form.zip_code}
                    onChange={update("zip_code")}
                    className={inputCls}
                    placeholder="95640"
                  />
                </Field>
              </div>
              <Field label="Notes (optional)">
                <textarea
                  data-testid="checkout-notes"
                  value={form.notes}
                  onChange={update("notes")}
                  className={`${inputCls} h-20 resize-none`}
                  placeholder="Gate code, delivery preferences, etc."
                />
              </Field>
            </Section>

            <Section title="03 — Payment method">
              <div className="grid sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  data-testid="payment-method-stripe"
                  onClick={() => setMethod("stripe")}
                  className={`text-left p-4 border transition-colors ${
                    method === "stripe"
                      ? "border-[#FF4500] bg-[#FF4500]/10"
                      : "border-[#222631] hover:border-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Lock className="w-4 h-4 text-[#FF4500]" />
                    <span className="font-display uppercase text-lg">Stripe</span>
                  </div>
                  <p className="text-xs text-[#9BA1B0]">
                    Pay securely with card. Encrypted by Stripe.
                  </p>
                </button>
                <button
                  type="button"
                  data-testid="payment-method-manual"
                  onClick={() => setMethod("manual")}
                  className={`text-left p-4 border transition-colors ${
                    method === "manual"
                      ? "border-[#FF4500] bg-[#FF4500]/10"
                      : "border-[#222631] hover:border-white"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Truck className="w-4 h-4 text-[#FF4500]" />
                    <span className="font-display uppercase text-lg">Reserve</span>
                  </div>
                  <p className="text-xs text-[#9BA1B0]">
                    Reserve order. We'll contact you to confirm payment.
                  </p>
                </button>
              </div>
            </Section>
          </div>

          {/* Order summary */}
          <aside className="bg-[#12151C] border border-[#222631] p-6 h-fit sticky top-24">
            <div className="font-display text-2xl uppercase mb-4">Loadout</div>
            <ul className="divide-y divide-[#222631] mb-4">
              {items.map((it) => (
                <li
                  key={it._key}
                  className="py-3 flex gap-3"
                  data-testid={`summary-item-${it._key}`}
                >
                  <div
                    className="w-14 h-14 shrink-0 border border-[#222631] bg-[#0A0C10] relative"
                    style={{
                      background: `radial-gradient(circle, ${it.accent}33 0%, #0A0C10 70%)`,
                    }}
                  >
                    <img
                      src={it.image}
                      alt={it.name}
                      className="absolute inset-0 w-full h-full object-contain p-1.5"
                    />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4500] text-white text-[10px] flex items-center justify-center font-mono">
                      {it.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-display uppercase truncate">{it.name}</div>
                    <div className="text-[10px] font-mono uppercase tracking-widest text-[#9BA1B0]">
                      {it.size}{it.color ? ` · ${it.color}` : ""}
                    </div>
                  </div>
                  <div className="text-sm font-mono">
                    ${(it.price * it.quantity).toFixed(2)}
                  </div>
                </li>
              ))}
            </ul>
            <div className="space-y-2 border-t border-[#222631] pt-3">
              <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} testid="summary-subtotal" />
              <Row label="Shipping" value={shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`} />
              <div className="border-t border-[#222631] pt-3 flex justify-between">
                <span className="font-display uppercase text-lg">Total</span>
                <span data-testid="summary-total" className="font-mono text-lg font-bold">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
            <button
              data-testid="checkout-submit-btn"
              type="submit"
              disabled={submitting || !isValid}
              className="w-full mt-6 bg-[#FF4500] hover:bg-[#E63E00] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 font-mono uppercase tracking-widest text-sm font-bold"
            >
              {submitting ? "Processing..." : method === "stripe" ? "Pay with Stripe →" : "Reserve order →"}
            </button>
            <p className="text-[10px] font-mono uppercase tracking-widest text-[#9BA1B0] text-center mt-3">
              <Lock className="w-3 h-3 inline mr-1" /> Encrypted checkout
            </p>
          </aside>
        </form>
      </div>
    </div>
  );
}

const inputCls =
  "w-full bg-[#0A0C10] border border-[#222631] focus:border-[#FF4500] focus:ring-1 focus:ring-[#FF4500] outline-none px-4 py-3 text-sm text-white font-mono tracking-wide";

function Section({ title, children }) {
  return (
    <div className="border border-[#222631] bg-[#12151C] p-6">
      <div className="label mb-5">{title}</div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="text-[10px] font-mono uppercase tracking-widest text-[#9BA1B0] block mb-2">
        {label} {required && <span className="text-[#FF4500]">*</span>}
      </span>
      {children}
    </label>
  );
}

function Row({ label, value, testid }) {
  return (
    <div className="flex justify-between text-sm text-[#9BA1B0]">
      <span>{label}</span>
      <span data-testid={testid} className="font-mono text-white">{value}</span>
    </div>
  );
}
