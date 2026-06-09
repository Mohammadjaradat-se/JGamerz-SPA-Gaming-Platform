// services/profile.service.js

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
// GET USER PROFILE
// ─────────────────────────────────────────────

export async function getProfile(userId) {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const res = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
      method: "GET",

      headers: authHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(err.message || `Failed to load profile (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("GET PROFILE ERROR:", error);

    throw error;
  }
}

// ─────────────────────────────────────────────
// GET USER POSTS
// ─────────────────────────────────────────────

export async function getUserPosts(userId) {
  try {
    if (!userId) {
      throw new Error("Invalid user ID");
    }

    const res = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`, {
      method: "GET",

      headers: authHeaders(),
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));

      throw new Error(err.message || `Failed to load posts (${res.status})`);
    }

    return await res.json();
  } catch (error) {
    console.error("GET USER POSTS ERROR:", error);

    throw error;
  }
}
