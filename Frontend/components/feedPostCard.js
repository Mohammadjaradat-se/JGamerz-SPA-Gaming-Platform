// components/feedPostCard.js
// ─── Feed Post Card Component ─────────────────────────────────────────────────
// Pure rendering functions; zero DOM side-effects.
// Imported by feed.js to keep the page file clean.

import { API_BASE_URL } from "../config/api.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** HTML-encode to prevent XSS */
export function esc(str = "") {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Format ISO date → readable string */
export function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

/** Resolve image src — handles relative /uploads/ paths */
export function resolveImg(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
}

/** Avatar HTML: image or letter fallback */
export function avatarHtml(profileImage, username, cls = "fd-avatar") {
  const src = resolveImg(profileImage);
  if (src) {
    return `<img class="${cls}" src="${esc(src)}" alt="${esc(username)}" loading="lazy" />`;
  }
  return `<div class="${cls} fd-avatar--fallback">${(username || "?")[0].toUpperCase()}</div>`;
}

// ─── Comment HTML ─────────────────────────────────────────────────────────────

/** Single comment row */
export function buildCommentRow(comment) {
  const src = resolveImg(comment.profile_image);

  return /* html */ `
    <div class="fd-comment">

      <div
        class="fd-comment__clickable"
        data-action="open-profile-preview"
        data-user-id="${comment.user_id}"
      >

        ${src
      ? `
            <img
              class="fd-comment__avatar"
              src="${esc(src)}"
              alt="${esc(comment.username)}"
              loading="lazy"
            />
          `
      : `
            <div class="fd-comment__avatar fd-avatar--fallback">
              ${(comment.username || "?")[0].toUpperCase()}
            </div>
          `
    }

        <div class="fd-comment__body">
          <span class="fd-comment__author">
            ${esc(comment.username || "User")}
          </span>

          <p class="fd-comment__text">
            ${esc(comment.content || comment.comment || "")}
          </p>
        </div>

      </div>

    </div>
  `;
}

/** Comment section HTML (collapsed by default) */
export function buildCommentSection(postId) {
  return /* html */ `
    <div class="fd-comments" id="fd-comments-${postId}" style="display:none;">
      <div class="fd-comments__list" id="fd-comments-list-${postId}">
        <!-- Comments rendered dynamically -->
      </div>
      <div class="fd-comments__input-row">
        <input
          class="fd-comments__input"
          id="fd-comment-input-${postId}"
          type="text"
          placeholder="Add a comment…"
          autocomplete="off"
          maxlength="500"
        />
        <button class="fd-comments__send" data-action="send-comment" data-post-id="${postId}" aria-label="Send comment">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  `;
}

// ─── Post Card HTML ───────────────────────────────────────────────────────────

/**
 * Build a complete post card HTML string.
 * @param {Object} post        - post object from API
 * @param {number} currentUserId - logged-in user id for delete visibility
 */
export function buildPostCard(post, currentUserId) {
  const postImg = resolveImg(post.image);
  const isOwner = String(post.user_id) === String(currentUserId);
  const isLiked =
    String(post.is_liked) === "true" ||
    post.is_liked === true;
  const likesCount = parseInt(post.likes_count, 10) || 0;

  return /* html */ `
    <article class="fd-card" data-post-id="${post.id}" id="fd-post-${post.id}">

      <!-- ── Card Header: Avatar + Meta + Delete ── -->
      <div class="fd-card__header">
         <div
              class="fd-card__user"
              data-action="open-profile-preview"
              data-user-id="${post.user_id}">
          ${avatarHtml(post.profile_image, post.username)}
          <div class="fd-card__meta">
            <span class="fd-card__username">${esc(post.username || "Unknown")}</span>
            <span class="fd-card__time">${formatDate(post.created_at)}</span>
          </div>
        </div>
        ${isOwner ? /* html */ `
          <button
            class="fd-card__delete"
            data-action="delete-post"
            data-post-id="${post.id}"
            aria-label="Delete post"
            title="Delete post"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
              <polyline points="3 6 5 6 21 6"/>
              <path d="M19 6l-1 14H6L5 6"/>
              <path d="M10 11v6M14 11v6"/>
              <path d="M9 6V4h6v2"/>
            </svg>
          </button>
        ` : ""}
      </div>

      <!-- ── Post Content ── -->
      ${post.content ? /* html */ `
        <p class="fd-card__content">${esc(post.content)}</p>
      ` : ""}

      <!-- ── Optional Post Image ── -->
      ${postImg ? /* html */ `
        <div class="fd-card__img-wrap">
          <img class="fd-card__img" src="${esc(postImg)}" alt="Post image" loading="lazy" />
        </div>
      ` : ""}

      <!-- ── Actions: Like + Comments ── -->
      <div class="fd-card__actions">
        <button
          class="fd-action-btn fd-like-btn ${isLiked ? "fd-like-btn--active" : ""}"
          data-action="toggle-like"
          data-post-id="${post.id}"
          aria-label="${isLiked ? "Unlike post" : "Like post"}"
          aria-pressed="${isLiked}"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="${isLiked ? "currentColor" : "none"}"
            stroke="currentColor" stroke-width="2">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
          <span class="fd-like-count" data-post-id="${post.id}">${likesCount}</span>
        </button>

        <button
          class="fd-action-btn fd-comments-toggle"
          data-action="toggle-comments"
          data-post-id="${post.id}"
          aria-expanded="false"
          aria-label="Toggle comments"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Comments
        </button>
      </div>

      <!-- ── Collapsible Comments Section ── -->
      ${buildCommentSection(post.id)}

    </article>
  `;
}

// ─── Empty / Loading / Error states ──────────────────────────────────────────

export function buildFeedEmpty() {
  return /* html */ `
    <div class="fd-state">
      <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" opacity=".3">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
      <p class="fd-state__title">No posts yet</p>
      <p class="fd-state__sub">Be the first to post something!</p>
    </div>
  `;
}

export function buildFeedLoading() {
  return /* html */ `
    <div class="fd-state">
      <div class="fd-spinner"></div>
      <p class="fd-state__sub">Loading feed…</p>
    </div>
  `;
}

export function buildFeedError(msg = "Failed to load feed.") {
  return /* html */ `
    <div class="fd-state fd-state--error">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" opacity=".5">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p class="fd-state__title">Something went wrong</p>
      <p class="fd-state__sub">${esc(msg)}</p>
    </div>
  `;
}
