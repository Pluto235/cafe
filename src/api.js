async function jsonFetch(url, init = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(init.headers || {}) },
    ...init,
  });
  const ct = res.headers.get('content-type') || '';
  const data = ct.includes('application/json') ? await res.json() : await res.text();
  if (!res.ok) {
    const msg = (data && typeof data === 'object' && data.error) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
}

export const api = {
  createOrder(payload) {
    return jsonFetch('/api/orders', { method: 'POST', body: JSON.stringify(payload) });
  },
  listWishes(limit = 12) {
    return jsonFetch(`/api/wishes?limit=${limit}`);
  },
  postWish(text) {
    return jsonFetch('/api/wishes', { method: 'POST', body: JSON.stringify({ text }) });
  },
  listOrders(auth) {
    return jsonFetch('/api/orders/admin', { headers: { Authorization: auth } });
  },
  updateOrder(id, status, auth) {
    return jsonFetch(`/api/orders/admin/${id}`, {
      method: 'PATCH',
      headers: { Authorization: auth },
      body: JSON.stringify({ status }),
    });
  },
};
