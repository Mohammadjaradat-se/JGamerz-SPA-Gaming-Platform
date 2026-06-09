// services/chat.service.js

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
// SEND MESSAGE
// ─────────────────────────────────────────────

export async function sendMessage(receiverId, message) {
    try {
        if (!receiverId) {
            throw new Error("Invalid receiver ID");
        }

        if (!message?.trim()) {
            throw new Error("Message cannot be empty");
        }

        const res = await fetch(`${API_BASE_URL}/api/messages/${receiverId}`, {
            method: "POST",

            headers: authHeaders(),

            body: JSON.stringify({
                message: message.trim(),
            }),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));

            throw new Error(err.message || `Failed to send message (${res.status})`);
        }

        return await res.json();
    } catch (error) {
        console.error("SEND MESSAGE ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// GET CONVERSATION
// ─────────────────────────────────────────────

export async function getConversation(receiverId) {
    try {
        if (!receiverId) {
            throw new Error("Invalid receiver ID");
        }

        const res = await fetch(`${API_BASE_URL}/api/messages/${receiverId}`, {
            method: "GET",

            headers: authHeaders(),
        });

        if (!res.ok) {
            const err = await res.json().catch(() => ({}));

            throw new Error(
                err.message || `Failed to load conversation (${res.status})`,
            );
        }

        return await res.json();
    } catch (error) {
        console.error("GET CONVERSATION ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// REALTIME PLACEHOLDER
// ─────────────────────────────────────────────

let _pollingInterval = null;

// ─────────────────────────────────────────────
// START POLLING
// ─────────────────────────────────────────────



// ─────────────────────────────────────────────
// STOP POLLING
// ─────────────────────────────────────────────


// ─────────────────────────────────────────────
// CLEANUP ON PAGE EXIT
// ─────────────────────────────────────────────


