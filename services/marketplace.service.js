import { API_BASE_URL } from "../config/api.js";
import { showToast } from "../utils/toast.js";
import { getToken } from "../utils/auth.js";

// ─────────────────────────────────────────────
// ENDPOINTS
// ─────────────────────────────────────────────

const MARKETPLACE_ENDPOINT = `${API_BASE_URL}/api/marketplace`;

// ─────────────────────────────────────────────
// GET ALL MARKETPLACE LISTINGS
// ─────────────────────────────────────────────

export async function getListings() {
    try {
        const response = await fetch(MARKETPLACE_ENDPOINT);

        if (!response.ok) {
            const errorText = await response.text();
            console.log(errorText);

            throw new Error(errorText);
        }

        return await response.json();
    } catch (error) {
        console.error("GET LISTINGS ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// CREATE NEW LISTING
// ─────────────────────────────────────────────

export async function createListing(formData) {
    try {
        const token = getToken();

        console.log("TOKEN:", token);

        console.log("SENDING REQUEST...");

        const response = await fetch(MARKETPLACE_ENDPOINT, {
            method: "POST",

            headers: {
                Authorization: `Bearer ${token}`,
            },

            body: formData,
        });

        console.log("RESPONSE STATUS:", response.status);

        const data = await response.json();

        console.log("RESPONSE DATA:", data);

        if (!response.ok) {
            throw new Error(data.message);
        }

        return data;
    } catch (error) {
        console.error("CREATE LISTING ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// DELETE LISTING
// ─────────────────────────────────────────────

export async function deleteListing(id) {
    try {
        const token = getToken();

        const response = await fetch(`${MARKETPLACE_ENDPOINT}/${id}`, {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to delete listing");
        }

        return true;
    } catch (error) {
        console.error("DELETE LISTING ERROR:", error);

        return false;
    }
}

// ─────────────────────────────────────────────
// GET MY LISTINGS
// ─────────────────────────────────────────────

export async function getMyListings() {
    try {
        const token = getToken();

        const response = await fetch(`${MARKETPLACE_ENDPOINT}/my-listings`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch my listings");
        }

        return await response.json();
    } catch (error) {
        console.error("MY LISTINGS ERROR:", error);

        throw error;
    }
}

// ─────────────────────────────────────────────
// SEARCH LISTINGS
// ─────────────────────────────────────────────

export async function searchListings(query) {
    try {
        const response = await fetch(
            `${MARKETPLACE_ENDPOINT}/search?q=${encodeURIComponent(query)}`,
        );

        if (!response.ok) {
            throw new Error("Search failed");
        }

        return await response.json();
    } catch (error) {
        console.error("SEARCH ERROR:", error);

        return [];
    }
}
