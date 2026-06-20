"""
Backend API tests for A Yard Apparel.
Covers: products, filters, slug lookup, manual order, Stripe checkout session,
checkout status, newsletter.
"""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://thin-blue-line-co.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ----- Health -----
def test_root(session):
    r = session.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data.get("status") == "operational"


# ----- Products -----
def test_products_list_count_88(session):
    r = session.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list)
    assert len(data) == 88, f"Expected 88 products, got {len(data)}"
    # ensure no mongo _id leaked
    assert "_id" not in data[0]
    assert "slug" in data[0]
    assert "price" in data[0]


def test_products_filters_endpoint(session):
    r = session.get(f"{API}/products/filters")
    assert r.status_code == 200
    data = r.json()
    assert "categories" in data
    assert "units" in data
    assert "designs" in data
    assert "tshirt" in data["categories"]
    assert "dumpster_fire" in data["designs"]


def test_filter_by_category_tshirt(session):
    r = session.get(f"{API}/products", params={"category": "tshirt"})
    assert r.status_code == 200
    items = r.json()
    # 11 designs x 1 tshirt category = 11
    assert len(items) == 11
    for it in items:
        assert it["category"] == "tshirt"


def test_filter_by_design_dumpster_fire(session):
    r = session.get(f"{API}/products", params={"design": "dumpster_fire"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 8  # 8 templates
    for it in items:
        assert it["design"] == "dumpster_fire"


def test_filter_by_unit_medical(session):
    r = session.get(f"{API}/products", params={"unit": "Medical"})
    assert r.status_code == 200
    items = r.json()
    # 3 medical designs x 8 templates = 24
    assert len(items) == 24
    for it in items:
        assert it["unit"] == "Medical"


def test_filter_combined(session):
    r = session.get(f"{API}/products", params={"design": "dumpster_fire", "category": "tshirt"})
    assert r.status_code == 200
    items = r.json()
    assert len(items) == 1
    assert items[0]["slug"] == "dumpster_fire-tshirt"
    assert items[0]["badge"] == "BESTSELLER"


def test_get_product_by_slug(session):
    r = session.get(f"{API}/products/dumpster_fire-tshirt")
    assert r.status_code == 200
    data = r.json()
    assert data["slug"] == "dumpster_fire-tshirt"
    assert data["category"] == "tshirt"
    assert data["design"] == "dumpster_fire"
    assert data["price"] == 34.0


def test_get_product_invalid_slug(session):
    r = session.get(f"{API}/products/does-not-exist")
    assert r.status_code == 404


# ----- Manual order -----
def test_manual_order_success(session):
    # Get a real product id
    r = session.get(f"{API}/products/dumpster_fire-tshirt")
    pid = r.json()["id"]

    payload = {
        "items": [{"product_id": pid, "quantity": 2, "size": "L", "color": "Black"}],
        "origin_url": BASE_URL,
        "customer_name": "TEST Officer",
        "customer_email": "test_officer@example.com",
        "address_line1": "1 Mule Creek Rd",
        "city": "Ione",
        "state": "CA",
        "zip_code": "95640",
        "notes": "TEST manual order",
    }
    r = session.post(f"{API}/orders/manual", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "order_id" in data
    assert data["total"] == round(34.0 * 2 + 7.99, 2)

    # GET the order back
    r2 = session.get(f"{API}/orders/{data['order_id']}")
    assert r2.status_code == 200
    o = r2.json()
    assert o["payment_status"] == "awaiting_manual"
    assert o["customer"]["email"] == "test_officer@example.com"
    assert len(o["items"]) == 1


def test_manual_order_invalid_product(session):
    payload = {
        "items": [{"product_id": "bogus-id", "quantity": 1}],
        "origin_url": BASE_URL,
        "customer_name": "TEST",
        "customer_email": "t@example.com",
        "address_line1": "x",
        "city": "x",
        "state": "CA",
        "zip_code": "00000",
    }
    r = session.post(f"{API}/orders/manual", json=payload)
    assert r.status_code == 400


# ----- Checkout quote -----
def test_checkout_quote(session):
    r = session.get(f"{API}/products/mental_health-hoodie")
    pid = r.json()["id"]
    r = session.post(f"{API}/checkout/quote", json={"items": [{"product_id": pid, "quantity": 1}]})
    assert r.status_code == 200
    data = r.json()
    assert data["subtotal"] == 64.0
    assert data["shipping"] == 7.99
    assert data["total"] == 71.99


# ----- Stripe checkout session -----
def test_stripe_checkout_session(session):
    r = session.get(f"{API}/products/dumpster_fire-tshirt")
    pid = r.json()["id"]
    payload = {
        "items": [{"product_id": pid, "quantity": 1, "size": "M", "color": "Black"}],
        "origin_url": BASE_URL,
        "customer_name": "TEST Stripe",
        "customer_email": "test_stripe@example.com",
        "address_line1": "1 Yard Way",
        "city": "Ione",
        "state": "CA",
        "zip_code": "95640",
    }
    r = session.post(f"{API}/checkout/session", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert "url" in data and data["url"].startswith("http")
    assert "session_id" in data and data["session_id"]
    # Status endpoint
    sid = data["session_id"]
    r2 = session.get(f"{API}/checkout/status/{sid}")
    assert r2.status_code == 200, r2.text
    sd = r2.json()
    assert sd["session_id"] == sid
    assert "payment_status" in sd
    assert "status" in sd


# ----- Newsletter -----
def test_newsletter_subscribe(session):
    r = session.post(f"{API}/newsletter", json={"email": "TEST_newsletter@example.com"})
    assert r.status_code == 200
    assert r.json().get("ok") is True
