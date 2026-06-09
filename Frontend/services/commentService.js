import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../utils/auth.js";

/* =========================================
   GET COMMENTS
========================================= */

export async function getPostComments(postId) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
    });

    return await response.json();
  } catch (error) {
    console.log("GET COMMENTS ERROR:", error);

    return [];
  }
}

/* =========================================
   ADD COMMENT
========================================= */

export async function addComment(postId, commentData) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/comments/${postId}`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",

        Authorization: `Bearer ${getToken()}`,
      },

      body: JSON.stringify(commentData),
    });

    return await response.json();
  } catch (error) {
    console.log("ADD COMMENT ERROR:", error);

    return null;
  }
}
