from fastapi import FastAPI, APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from emergentintegrations.payments.stripe.checkout import (
    StripeCheckout,
    CheckoutSessionRequest,
)
import os
import logging
import uuid
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / ".env")

mongo_url = os.environ["MONGO_URL"]
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ["DB_NAME"]]

STRIPE_API_KEY = os.environ.get("STRIPE_API_KEY", "")

app = FastAPI(title="A Yard Apparel API")
api_router = APIRouter(prefix="/api")


# ---------- MODELS ----------
class Product(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    slug: str
    name: str
    category: str  # tshirt, hoodie, hat, sticker, patch, coin, tumbler
    unit: str  # A Yard, B Yard, ... ISU, Medical, Control Booths
    design: str  # design line key (dumpster_fire, mental_health, b_yard, ...)
    price: float
    description: str
    image: str
    accent: str  # color hex
    sizes: List[str] = []
    colors: List[str] = []
    badge: Optional[str] = None  # e.g. "BESTSELLER", "NEW"
    featured: bool = False


class CartItemIn(BaseModel):
    product_id: str
    quantity: int = 1
    size: Optional[str] = None
    color: Optional[str] = None


class CheckoutRequest(BaseModel):
    items: List[CartItemIn]
    origin_url: str
    customer_name: str
    customer_email: str
    address_line1: str
    address_line2: Optional[str] = ""
    city: str
    state: str
    zip_code: str
    country: str = "USA"
    notes: Optional[str] = ""


class OrderRecord(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    session_id: Optional[str] = None
    items: List[Dict]
    subtotal: float
    shipping: float
    total: float
    customer: Dict
    payment_status: str = "pending"
    status: str = "pending"
    created_at: str = Field(
        default_factory=lambda: datetime.now(timezone.utc).isoformat()
    )


# ---------- PRODUCT SEED ----------
SIZES = ["S", "M", "L", "XL", "2XL", "3XL"]
COLORS = ["Black", "Charcoal", "OD Green"]

DESIGNS = [
    {
        "design": "dumpster_fire",
        "design_name": "Dumpster Fire Response Team",
        "unit": "A Yard Custody",
        "accent": "#FF4500",
        "image": "/stickers/sticker1.png",
        "tagline": "Built on discipline. United as one.",
    },
    {
        "design": "mental_health",
        "design_name": "Mental Health Team",
        "unit": "MCSP Mental Health",
        "accent": "#8B5FBF",
        "image": "/stickers/sticker2.png",
        "tagline": "Strength in Mind. Support in Action.",
    },
    {
        "design": "b_yard",
        "design_name": "B Yard Brotherhood",
        "unit": "B Yard",
        "accent": "#D4AF37",
        "image": "/stickers/sticker1.png",
        "tagline": "Hold the line.",
    },
    {
        "design": "c_yard",
        "design_name": "C Yard Crew",
        "unit": "C Yard",
        "accent": "#3DA9FC",
        "image": "/stickers/sticker1.png",
        "tagline": "Watchful. Ready.",
    },
    {
        "design": "d_yard",
        "design_name": "D Yard Detail",
        "unit": "D Yard",
        "accent": "#2EC4B6",
        "image": "/stickers/sticker1.png",
        "tagline": "Vigilance never sleeps.",
    },
    {
        "design": "e_yard",
        "design_name": "E Yard Echo",
        "unit": "E Yard",
        "accent": "#E63946",
        "image": "/stickers/sticker1.png",
        "tagline": "Five buildings. One mission.",
    },
    {
        "design": "isu",
        "design_name": "ISU - Investigative Services",
        "unit": "ISU",
        "accent": "#C9CDD4",
        "image": "/stickers/sticker1.png",
        "tagline": "Quiet professionals.",
    },
    {
        "design": "control_booths",
        "design_name": "Control Booth Operators",
        "unit": "Control Booths",
        "accent": "#F4A261",
        "image": "/stickers/sticker1.png",
        "tagline": "Eyes on the yard.",
    },
    {
        "design": "a_yard_medical",
        "design_name": "A Yard Medical",
        "unit": "Medical",
        "accent": "#06D6A0",
        "image": "/stickers/sticker2.png",
        "tagline": "First in. Last out.",
    },
    {
        "design": "tta",
        "design_name": "TTA - Triage & Treatment",
        "unit": "Medical",
        "accent": "#EF476F",
        "image": "/stickers/sticker2.png",
        "tagline": "Code 3 ready.",
    },
    {
        "design": "yard_clinics",
        "design_name": "Yard Clinics",
        "unit": "Medical",
        "accent": "#118AB2",
        "image": "/stickers/sticker2.png",
        "tagline": "Care behind the wall.",
    },
]

# Item variants per design with category, price, sizes
ITEM_TEMPLATES = [
    {"category": "tshirt", "label": "Tee", "price": 34.0, "sizes": SIZES, "colors": COLORS},
    {"category": "hoodie", "label": "Hoodie", "price": 64.0, "sizes": SIZES, "colors": COLORS},
    {"category": "hat", "label": "Flexfit Hat", "price": 28.0, "sizes": ["S/M", "L/XL"], "colors": ["Black", "Charcoal"]},
    {"category": "beanie", "label": "Beanie", "price": 22.0, "sizes": ["One Size"], "colors": ["Black", "Charcoal"]},
    {"category": "sticker", "label": "Sticker", "price": 6.0, "sizes": ["3in"], "colors": []},
    {"category": "patch", "label": "Velcro Patch", "price": 12.0, "sizes": ["3in"], "colors": []},
    {"category": "coin", "label": "Challenge Coin", "price": 25.0, "sizes": ["1.75in"], "colors": []},
    {"category": "tumbler", "label": "20oz Tumbler", "price": 32.0, "sizes": ["20oz"], "colors": ["Black", "Stainless"]},
]


def build_seed_products() -> List[Product]:
    products: List[Product] = []
    for d in DESIGNS:
        is_featured_design = d["design"] in ("dumpster_fire", "mental_health")
        for tpl in ITEM_TEMPLATES:
            slug = f"{d['design']}-{tpl['category']}"
            badge = None
            if d["design"] == "dumpster_fire" and tpl["category"] == "tshirt":
                badge = "BESTSELLER"
            elif d["design"] == "mental_health" and tpl["category"] == "hoodie":
                badge = "NEW"
            p = Product(
                slug=slug,
                name=f"{d['design_name']} {tpl['label']}",
                category=tpl["category"],
                unit=d["unit"],
                design=d["design"],
                price=tpl["price"],
                description=f"{d['tagline']} Premium {tpl['label'].lower()} repping the {d['design_name']} crest. Heavyweight, built for shift work, designed by the line — for the line.",
                image=d["image"],
                accent=d["accent"],
                sizes=tpl["sizes"],
                colors=tpl["colors"],
                badge=badge,
                featured=is_featured_design and tpl["category"] in ("tshirt", "hoodie"),
            )
            products.append(p)
    return products


@app.on_event("startup")
async def seed_data():
    count = await db.products.count_documents({})
    if count == 0:
        prods = [p.model_dump() for p in build_seed_products()]
        await db.products.insert_many(prods)
        logging.info(f"Seeded {len(prods)} products")


# ---------- PRODUCT ROUTES ----------
@api_router.get("/")
async def root():
    return {"message": "A Yard Apparel API", "status": "operational"}


@api_router.get("/products", response_model=List[Product])
async def list_products(
    category: Optional[str] = None,
    unit: Optional[str] = None,
    design: Optional[str] = None,
    featured: Optional[bool] = None,
):
    q: Dict = {}
    if category:
        q["category"] = category
    if unit:
        q["unit"] = unit
    if design:
        q["design"] = design
    if featured is not None:
        q["featured"] = featured
    docs = await db.products.find(q, {"_id": 0}).to_list(500)
    return docs


@api_router.get("/products/filters")
async def product_filters():
    cats = await db.products.distinct("category")
    units = await db.products.distinct("unit")
    designs = await db.products.distinct("design")
    return {"categories": cats, "units": units, "designs": designs}


@api_router.get("/products/{slug}", response_model=Product)
async def get_product(slug: str):
    doc = await db.products.find_one({"slug": slug}, {"_id": 0})
    if not doc:
        raise HTTPException(404, "Product not found")
    return doc


# ---------- CHECKOUT ----------
SHIPPING_FLAT = 7.99


async def _calc_totals(items: List[CartItemIn]):
    line_items = []
    subtotal = 0.0
    for it in items:
        prod = await db.products.find_one({"id": it.product_id}, {"_id": 0})
        if not prod:
            raise HTTPException(400, f"Invalid product {it.product_id}")
        qty = max(1, int(it.quantity))
        line_total = round(float(prod["price"]) * qty, 2)
        subtotal += line_total
        line_items.append({
            "product_id": prod["id"],
            "name": prod["name"],
            "slug": prod["slug"],
            "price": prod["price"],
            "quantity": qty,
            "size": it.size,
            "color": it.color,
            "line_total": line_total,
            "image": prod["image"],
        })
    subtotal = round(subtotal, 2)
    shipping = SHIPPING_FLAT if subtotal > 0 else 0.0
    total = round(subtotal + shipping, 2)
    return line_items, subtotal, shipping, total


@api_router.post("/checkout/quote")
async def checkout_quote(payload: Dict):
    items = [CartItemIn(**i) for i in payload.get("items", [])]
    line_items, subtotal, shipping, total = await _calc_totals(items)
    return {"items": line_items, "subtotal": subtotal, "shipping": shipping, "total": total}


@api_router.post("/checkout/session")
async def create_checkout_session(payload: CheckoutRequest, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")

    line_items, subtotal, shipping, total = await _calc_totals(payload.items)
    if total <= 0:
        raise HTTPException(400, "Cart is empty")

    origin = payload.origin_url.rstrip("/")
    success_url = f"{origin}/success?session_id={{CHECKOUT_SESSION_ID}}"
    cancel_url = f"{origin}/checkout"

    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)

    order_id = str(uuid.uuid4())
    metadata = {
        "order_id": order_id,
        "customer_email": payload.customer_email,
        "source": "a_yard_apparel",
    }

    req = CheckoutSessionRequest(
        amount=float(total),
        currency="usd",
        success_url=success_url,
        cancel_url=cancel_url,
        metadata=metadata,
    )
    session = await stripe_checkout.create_checkout_session(req)

    # Persist pending transaction + order
    now = datetime.now(timezone.utc).isoformat()
    await db.payment_transactions.insert_one({
        "id": str(uuid.uuid4()),
        "session_id": session.session_id,
        "order_id": order_id,
        "amount": float(total),
        "currency": "usd",
        "metadata": metadata,
        "payment_status": "initiated",
        "status": "initiated",
        "created_at": now,
        "updated_at": now,
    })

    order = OrderRecord(
        id=order_id,
        session_id=session.session_id,
        items=line_items,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        customer={
            "name": payload.customer_name,
            "email": payload.customer_email,
            "address_line1": payload.address_line1,
            "address_line2": payload.address_line2,
            "city": payload.city,
            "state": payload.state,
            "zip_code": payload.zip_code,
            "country": payload.country,
            "notes": payload.notes,
        },
        payment_status="pending",
        status="pending",
    )
    await db.orders.insert_one(order.model_dump())

    return {"url": session.url, "session_id": session.session_id, "order_id": order_id}


@api_router.get("/checkout/status/{session_id}")
async def checkout_status(session_id: str, request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    status = await stripe_checkout.get_checkout_status(session_id)

    tx = await db.payment_transactions.find_one({"session_id": session_id}, {"_id": 0})
    already_paid = tx and tx.get("payment_status") == "paid"

    new_payment_status = status.payment_status
    new_status = status.status
    now = datetime.now(timezone.utc).isoformat()

    if not already_paid:
        await db.payment_transactions.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": new_payment_status,
                "status": new_status,
                "updated_at": now,
            }},
        )
        await db.orders.update_one(
            {"session_id": session_id},
            {"$set": {
                "payment_status": new_payment_status,
                "status": "paid" if new_payment_status == "paid" else new_status,
                "updated_at": now,
            }},
        )

    order = await db.orders.find_one({"session_id": session_id}, {"_id": 0})
    return {
        "session_id": session_id,
        "status": new_status,
        "payment_status": new_payment_status,
        "amount_total": status.amount_total,
        "currency": status.currency,
        "order": order,
    }


@api_router.post("/webhook/stripe")
async def stripe_webhook(request: Request):
    if not STRIPE_API_KEY:
        raise HTTPException(500, "Stripe not configured")
    body = await request.body()
    sig = request.headers.get("Stripe-Signature", "")
    host_url = str(request.base_url)
    webhook_url = f"{host_url.rstrip('/')}/api/webhook/stripe"
    stripe_checkout = StripeCheckout(api_key=STRIPE_API_KEY, webhook_url=webhook_url)
    try:
        resp = await stripe_checkout.handle_webhook(body, sig)
    except Exception as e:
        logging.exception("webhook error")
        return JSONResponse({"received": False, "error": str(e)}, status_code=400)

    if resp.session_id:
        now = datetime.now(timezone.utc).isoformat()
        await db.payment_transactions.update_one(
            {"session_id": resp.session_id},
            {"$set": {
                "payment_status": resp.payment_status,
                "status": resp.payment_status,
                "updated_at": now,
            }},
        )
        await db.orders.update_one(
            {"session_id": resp.session_id},
            {"$set": {
                "payment_status": resp.payment_status,
                "status": "paid" if resp.payment_status == "paid" else "pending",
                "updated_at": now,
            }},
        )
    return {"received": True}


# ---------- ORDER ----------
@api_router.post("/orders/manual")
async def create_manual_order(payload: CheckoutRequest):
    """Order without payment — saved for manual fulfillment."""
    line_items, subtotal, shipping, total = await _calc_totals(payload.items)
    if total <= 0:
        raise HTTPException(400, "Cart is empty")
    order = OrderRecord(
        items=line_items,
        subtotal=subtotal,
        shipping=shipping,
        total=total,
        customer={
            "name": payload.customer_name,
            "email": payload.customer_email,
            "address_line1": payload.address_line1,
            "address_line2": payload.address_line2,
            "city": payload.city,
            "state": payload.state,
            "zip_code": payload.zip_code,
            "country": payload.country,
            "notes": payload.notes,
        },
        payment_status="awaiting_manual",
        status="pending",
    )
    await db.orders.insert_one(order.model_dump())
    return {"order_id": order.id, "total": total}


@api_router.get("/orders/{order_id}")
async def get_order(order_id: str):
    order = await db.orders.find_one({"id": order_id}, {"_id": 0})
    if not order:
        raise HTTPException(404, "Order not found")
    return order


# ---------- NEWSLETTER ----------
class NewsletterIn(BaseModel):
    email: str


@api_router.post("/newsletter")
async def subscribe(payload: NewsletterIn):
    await db.newsletter.insert_one({
        "id": str(uuid.uuid4()),
        "email": payload.email,
        "created_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True}


# ---------- APP WIRING ----------
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get("CORS_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
