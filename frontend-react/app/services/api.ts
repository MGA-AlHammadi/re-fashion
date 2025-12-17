"use client";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api";

function ensureToken(): string {
  if (globalThis.window === undefined) throw new Error("NO_TOKEN");
  const token = localStorage.getItem("token");
  if (!token) throw new Error("NO_TOKEN");
  return token;
}

export async function fetchFavorites() {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/favorites`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addFavorite(productId: number) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/favorites/${productId}`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function removeFavorite(productId: number) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/favorites/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function fetchCart() {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/cart`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function addToCart(productId: number, quantity = 1) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/cart`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ productId, quantity }) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateCartQuantity(productId: number, quantity: number) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/cart/${productId}`, { method: "PUT", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify(quantity) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function removeFromCart(productId: number) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/cart/${productId}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function fetchMessages() {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/messages`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function sendMessage(recipientId: number, content: string) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/messages`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify({ recipientId, content }) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchProfile() {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/profile`, { headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchProduct(id: number) {
  const res = await fetch(`${API_BASE}/products/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateProduct(id: number, body: any) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProduct(id: number) {
  const token = ensureToken();
  const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
  if (!res.ok) throw new Error(await res.text());
  return true;
}

export async function fetchProductsByCategory(name: string) {
  const res = await fetch(`${API_BASE}/products/category/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
