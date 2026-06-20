# A Yard Apparel — Product Requirements Document

## Original Problem Statement
> "I need you to make a new github git and im trying to build a webpage for a clothing line business that is for law enforcement, but more specifically CDCR. Here is two pictures of stickers that were made. They are stickers that were made for officers at Mule Creek State Prison on A yard which is a level 4 yard that has been rough with lots of attempted murders and stabbings and code 2 and code 3 riots. we are making this clothing line to get some comradery on the yard with the officers. i need a FULL BLOWN WEBSITE that stays with the awesome theme of these stickers. I want to be able to order from the website as well. I really need the page to be VISUALLY STUNNING AND AMAZING. This is the first website i will be building and selling for my business so it needs to be completely laced up and amazing."

## User Choices (gathered Feb 2026)
- **Brand name**: A Yard Apparel
- **Product types**: T-shirts, Hoodies, Hats, Beanies, Stickers, Patches, Challenge Coins, Tumblers
- **Payments**: Both — Stripe checkout + manual reserve flow
- **Crests / designs to feature**: Dumpster Fire Response Team (A Yard custody), Mental Health Team, B Yard, C Yard, D Yard, E Yard, ISU, Control Booths, A Yard Medical, TTA, Yard Clinics
- **GitHub repo**: `mrnickrushing/A-Yard-Apparel.git` (user owns it; project is push-ready)

## Architecture
- **Frontend**: React 19 + Tailwind + Shadcn UI, react-router-dom 7
- **Backend**: FastAPI + Motor (MongoDB) + emergentintegrations Stripe Checkout
- **DB**: MongoDB (products, orders, payment_transactions, newsletter)
- **Payment**: Stripe (sk_test_emergent test key) + manual "Reserve" flow
- **Design system**: Gritty tactical / military aesthetic — gunmetal dark palette, fire orange (#FF4500) & purple (#8B5FBF) accents, Anton display font, IBM Plex Mono labels, grain texture, sharp 1px borders, no border-radius.

## Personas
1. **Active CDCR officer (primary)**: works the line at MCSP or another yard, wants gear that reps their unit/crest with respect & pride. Mobile-first, in-out browsing.
2. **Retired officer / supporter**: buying as a gift or memento. Wants quality + story.
3. **Clinician / medical staff**: Mental Health Team, TTA, A Yard Medical. Wants designs that honor their role.

## Implemented (Feb 2026 — Day 1)
- ✅ Full backend (server.py): products, filters, single product, checkout/quote, checkout/session (Stripe), checkout/status, webhook/stripe, manual orders, newsletter, auto-seeding of 88 products (11 designs × 8 categories).
- ✅ Home (hero, marquee, bento featured crests, featured products, units grid, value props, CTA)
- ✅ Shop with filters (category, crest, unit) + URL-state filters
- ✅ Product detail with size/color/qty + add-to-cart + buy-now
- ✅ Cart drawer with localStorage persistence
- ✅ Checkout (Stripe + manual reserve), Success page with polling
- ✅ About / Story page
- ✅ Header (with mobile menu), Footer (newsletter + social), Toaster
- ✅ Tactical theme: Anton display font, grain, brushed metal, corners, marquee, tactical stripes
- ✅ Two original sticker images converted from HEIC → PNG, rendered prominently in bento + product cards
- ✅ 100% E2E backend + frontend tests passing

## Pending / Backlog
- **P1**: Real product photography (currently sticker art is the hero — fine for launch, but mockup tees would lift conversion)
- **P1**: Push to GitHub repo `mrnickrushing/A-Yard-Apparel.git` (user can do this from Emergent UI or main agent on request)
- **P1**: Connect real Stripe live key for production sales
- **P2**: Order tracking / customer accounts (currently guest-checkout only)
- **P2**: Admin dashboard to manage products/inventory/orders
- **P2**: Bulk / unit-discount pricing (groups of 5+ for crew orders)
- **P2**: Discount codes (e.g. ROLLCALL10)
- **P3**: Real product imagery (apparel mockups), social proof / customer photos
- **P3**: Wholesale / unit bulk order request form

## Next Tasks
1. Real garment mockup photos for shirts/hoodies
2. Push to GitHub repo
3. Switch to live Stripe key when ready to launch
4. Add admin order management
