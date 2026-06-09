// services/community.service.js

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
// GET ALL USERS
// ─────────────────────────────────────────────

export async function getUsers() {
    try {
        const res = await fetch(`${API_BASE_URL}/api/users`, {
            method: "GET",

            headers: authHeaders(),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));

            throw new Error(err.message || `Failed to load users (${res.status})`);
        }

        return await res.json();
    } catch (error) {
        console.error("GET USERS ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// SEARCH USERS
// ─────────────────────────────────────────────

export async function searchUsers(username) {
    try {
        const encoded = encodeURIComponent((username || "").trim());

        const res = await fetch(`${API_BASE_URL}/api/users/search/${encoded}`, {
            method: "GET",

            headers: authHeaders(),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));

            throw new Error(err.message || `Search failed (${res.status})`);
        }

        return await res.json();
    } catch (error) {
        console.error("SEARCH USERS ERROR:", error);

        throw error;
    }
}
