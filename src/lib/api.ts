import func2url from "../../backend/func2url.json";

const BASE = func2url.api;

export const api = {
  get: (action: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams({ action, ...params }).toString();
    return fetch(`${BASE}?${query}`).then((r) => r.json());
  },
  post: (action: string, body: object) =>
    fetch(`${BASE}?action=${action}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
  put: (action: string, params: Record<string, string> = {}) => {
    const query = new URLSearchParams({ action, ...params }).toString();
    return fetch(`${BASE}?${query}`, { method: "PUT" }).then((r) => r.json());
  },
};
