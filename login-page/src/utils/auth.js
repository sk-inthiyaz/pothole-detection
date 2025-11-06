// Lightweight auth helpers for the frontend
export function isAuthenticated() {
  try {
    return Boolean(localStorage.getItem('authToken'));
  } catch {
    return false;
  }
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}
