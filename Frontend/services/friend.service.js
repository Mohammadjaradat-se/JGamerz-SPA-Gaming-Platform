// services/friend.service.js

import { API_BASE_URL } from "../config/api.js";

import { getToken } from "../utils/auth.js";

// ─────────────────────────────────────────────
// AUTH HEADERS
// ─────────────────────────────────────────────

function authHeaders() {
  const token = getToken();

  return {
    Authorization: token ? `Bearer ${token}` : "",

    "Content-Type": "application/json",
  };
}

// ─────────────────────────────────────────────
// TOGGLE FRIEND
// ─────────────────────────────────────────────

export async function toggleFriend(userId) {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const res = await fetch(`${API_BASE_URL}/api/friends/${userId}`, {
      method: "POST",

      headers: authHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(err.message || `Friend toggle failed (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("TOGGLE FRIEND ERROR:", error);

    throw error;
  }
}
