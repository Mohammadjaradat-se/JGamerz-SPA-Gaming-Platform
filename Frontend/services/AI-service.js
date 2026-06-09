import { API_BASE_URL } from "../config/api.js";

// ─────────────────────────────────────────────
// SEND MESSAGE TO AI
// ─────────────────────────────────────────────

export async function sendAIMessage(message) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/ai/chat`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify({
                message,
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to get AI response");
        }

        const data = await response.json();

        return data.reply;
    } catch (error) {
        console.error("AI SERVICE ERROR:", error);

        return "AI Assistant is currently unavailable.";
    }
}
