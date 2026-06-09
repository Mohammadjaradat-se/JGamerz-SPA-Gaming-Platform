import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../utils/auth.js";

/* =========================================
   GET USER POSTS
========================================= */

export async function getUserPosts(userId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/users/${userId}/posts`, {
            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log("GET POSTS ERROR:", error);

        return [];
    }
}

/* =========================================
   DELETE POST
========================================= */

export async function deletePost(postId) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/posts/${postId}`, {
            method: "DELETE",

            headers: {
                Authorization: `Bearer ${getToken()}`,
            },
        });

        return await response.json();
    } catch (error) {
        console.log("DELETE POST ERROR:", error);

        return null;
    }
}
