import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../utils/auth.js";

/* =========================================
   GET CURRENT USER PROFILE
========================================= */

export async function getCurrentUserProfile() {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log("GET PROFILE ERROR:", error);

        return null;
    }
}

/* =========================================
   UPDATE PROFILE
========================================= */

export async function updateUserProfile(formData) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/profile`, {
            method: "PATCH",

            headers: {
                Authorization: `Bearer ${getToken()}`,
            },

            body: formData,
        });

        return await response.json();
    } catch (error) {
        console.log("UPDATE PROFILE ERROR:", error);

        return null;
    }
}
export async function getUserProfileById(userId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );

        return await response.json();

    } catch (error) {

        console.log("GET USER PROFILE ERROR:", error);

        return null;
    }
}

export async function getUserPostsById(userId) {
    try {

        const response = await fetch(
            `${API_BASE_URL}/api/users/${userId}/posts`,
            {
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                },
            }
        );

        return await response.json();

    } catch (error) {

        console.log(
            "GET USER POSTS ERROR:",
            error
        );

        return [];
    }
}
