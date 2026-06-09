// services/feedService.js
// ─── Feed Service ─────────────────────────────────────────────────────────────
// Handles: getFeedPosts, createPost
// Reuses:  commentService, likeService, postService for all shared actions.

import { API_BASE_URL } from "../config/api.js";
import { getToken } from "../utils/auth.js";

// ─── Auth header helper ───────────────────────────────────────────────────────
function authHeaders() {
  return { Authorization: `Bearer ${getToken()}` };
}

// ─── Fetch full feed ──────────────────────────────────────────────────────────
/**
 * GET /posts
 * Returns all posts for the feed (including likes, profile images, usernames).
 * @returns {Promise<Array>}
 */
export async function getFeedPosts() {
  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "GET",
    headers: { ...authHeaders() },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to load feed (${res.status})`);
  }

  return res.json();
}

// ─── Create a new post ────────────────────────────────────────────────────────
/**
 * POST /posts
 * Sends multipart/form-data (content + optional image file).
 * @param {string}    content  - post text
 * @param {File|null} imageFile - optional image file object
 * @returns {Promise<Object>} newly created post object from server
 */
export async function createPost(content, imageFile = null) {
  const body = new FormData();
  const trimmedContent = content?.trim() || "";

  body.append("content", trimmedContent);

  if (imageFile) {
    body.append("image", imageFile);
  }

  const res = await fetch(`${API_BASE_URL}/api/posts`, {
    method: "POST",
    headers: { ...authHeaders() }, // NOTE: do NOT set Content-Type; browser sets it with boundary
    body,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Failed to create post (${res.status})`);
  }

  return res.json();
}
