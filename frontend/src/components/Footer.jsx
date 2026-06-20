import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Shield, Instagram, Mail, Facebook } from "lucide-react";
import { toast } from "sonner";
import { subscribeNewsletter } from "../lib/api";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      await subscribeNewsletter(email);
      toast.success("Locked in. Watch your inbox.");
      setEmail("");
    } catch {
      toast.error("Could not subscribe. Try again.");
    }
    setLoading(false);
  };

  return (
    <footer
      data-testid="site-footer"
      className="relative bg-[#0A0C10] border-t border-[#222631] mt-24"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10 pt-16 pb-10">
        {/* Newsletter */}
        <div className="border border-[#222631] p-6 md:p-10 mb-16 corners bg-[#12151C]/60 relative">
          <div className="grid md:grid-cols-2 gap-6 items-center">
            <div>
              <div className="label mb-2">/01 — Intel drop</div>
              <h3 className="font-display text-3xl md:text-4xl uppercase leading-none">
                Join the <span className="text-[#FF4500]">roster</span>
              </h3>
              <p className="text-[#9BA1B0] mt-3 max-w-md">
                Get drop notifications, restocks, and exclusive unit gear before
                the yard sees it.
              </p>
            </div>
            <form onSubmit={submit} className="flex gap-2 w-full">
              <input
                data-testid="newsletter-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="OFFICER@DEPT.GOV"
                className="flex-1 bg-[#0A0C10] border border-[#222631] focus:border-[#FF4500] outline-none px-4 py-3 font-mono text-sm tracking-wider uppercase"
              />
              <button
                data-testid="newsletter-submit-btn"
                disabled={loading}
                className="bg-[#FF4500] hover:bg-[#E63E00] disabled:opacity-60 px-6 py-3 font-mono uppercase tracking-widest text-xs font-bold"
              >
                {loading ? "..." : "Enlist"}
              </button>
            </form>
          </div>
        </div>

        {/* Links */}
        <div className="grid md:grid-cols-4 gap-10 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-6 h-6 text-[#FF4500]" />
              <span className="font-display text-2xl uppercase">
                A Yard Apparel
              </span>
            </div>
            <p className="text-[#9BA1B0] text-sm leading-relaxed max-w-md">
              Built by the line, for the line. Apparel honoring the men and
              women working California's toughest yards. Designed at Mule Creek
              State Prison.
            </p>
            <div className="flex gap-3 mt-5">
              <a
                data-testid="social-instagram"
                href="#"
                aria-label="Instagram"
                className="w-10 h-10 border border-[#222631] hover:border-[#FF4500] flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                data-testid="social-facebook"
                href="#"
                aria-label="Facebook"
                className="w-10 h-10 border border-[#222631] hover:border-[#FF4500] flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                data-testid="social-email"
                href="mailto:hello@ayardapparel.com"
                aria-label="Email"
                className="w-10 h-10 border border-[#222631] hover:border-[#FF4500] flex items-center justify-center transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <div className="label mb-4">Shop</div>
            <ul className="space-y-2 text-sm">
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=tshirt">Tees</Link>
              </li>
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=hoodie">Hoodies</Link>
              </li>
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=hat">Hats</Link>
              </li>
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=sticker">Stickers</Link>
              </li>
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=patch">Patches</Link>
              </li>
              <li>
                <Link className="text-[#9BA1B0] hover:text-white" to="/shop?category=coin">Coins</Link>
              </li>
            </ul>
          </div>

          <div>
            <div className="label mb-4">Units</div>
            <ul className="space-y-2 text-sm">
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/shop?design=dumpster_fire">A Yard</Link></li>
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/shop?design=b_yard">B Yard</Link></li>
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/shop?design=c_yard">C Yard</Link></li>
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/shop?design=isu">ISU</Link></li>
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/shop?unit=Medical">Medical</Link></li>
              <li><Link className="text-[#9BA1B0] hover:text-white" to="/about">Our Story</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#222631] pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#8C92A0]">
            Five buildings · One mission · MCSP
          </div>
          <div className="text-xs text-[#8C92A0] font-mono">
            © {new Date().getFullYear()} A YARD APPAREL · Not affiliated with CDCR
          </div>
        </div>
      </div>
    </footer>
  );
}
