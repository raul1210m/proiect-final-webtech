const KEY = "dissertation_auth";

export function saveAuth(auth) {
  localStorage.setItem(KEY, JSON.stringify(auth));
}

export function loadAuth() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function clearAuth() {
  localStorage.removeItem(KEY);
}
