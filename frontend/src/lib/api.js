import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
export const API_BASE = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

export const fetchProducts = async (filters = {}) => {
  const { data } = await api.get("/products", { params: filters });
  return data;
};

export const fetchProductFilters = async () => {
  const { data } = await api.get("/products/filters");
  return data;
};

export const fetchProduct = async (slug) => {
  const { data } = await api.get(`/products/${slug}`);
  return data;
};

export const quoteCheckout = async (items) => {
  const { data } = await api.post("/checkout/quote", { items });
  return data;
};

export const createStripeSession = async (payload) => {
  const { data } = await api.post("/checkout/session", payload);
  return data;
};

export const createManualOrder = async (payload) => {
  const { data } = await api.post("/orders/manual", payload);
  return data;
};

export const getCheckoutStatus = async (sessionId) => {
  const { data } = await api.get(`/checkout/status/${sessionId}`);
  return data;
};

export const subscribeNewsletter = async (email) => {
  const { data } = await api.post("/newsletter", { email });
  return data;
};
