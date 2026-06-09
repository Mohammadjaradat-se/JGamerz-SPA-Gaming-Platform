import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../utils/auth.js";

/* =========================================
   TOGGLE LIKE
========================================= */

export async function toggleLike(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/likes/${postId}`, {
            method: "POST",

            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log("LIKE ERROR:", error);

        return null;
    }
}
