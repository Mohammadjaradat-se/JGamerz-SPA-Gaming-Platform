import { getFeedPosts, createPost } from "../services/feedService.js";
import { getPostComments, addComment } from "../services/commentService.js";
import { toggleLike } from "../services/likeService.js";
import { deletePost } from "../services/postService.js";
import { getUser } from "../utils/auth.js";
import {
    avatarHtml,
    buildCommentRow,
    buildFeedEmpty,
    buildFeedError,
    buildFeedLoading,
    buildPostCard,
    esc,
    resolveImg,
    formatDate,
} from "../components/feedPostCard.js";
import { initCommunity } from "../pages/community.js";
import { getUserProfileById, getUserPostsById } from "../services/profileService.js";




let currentUser = null;
let selectedImageFile = null;
let selectedImageUrl = null;
let attachedPostsContainer = null;
const State = { posts: [], };

export async function Feed() {
    currentUser = getUser();
    const postsHtml = await buildPostsHtml();

    return /* html */ `
    <main class="fd-page">
      <header class="fd-page-header">
        <p class="fd-page-header__eyebrow">JGamerz Network</p>
        <h1 class="fd-page-header__title">Squad Feed</h1>
      </header>

      <section class="fd-layout" aria-label="Gaming social feed">
        <div class="fd-feed">
          ${buildComposer()}
          <div class="fd-posts" id="fd-posts">
            ${postsHtml}
          </div>
        </div>
      </section>
      ${buildProfilePreviewModal()}
    </main>
  `;
}

export function initFeed() {

    currentUser = getUser();

    selectedImageFile = null;

    revokeSelectedImageUrl();

    attachComposerLogic();

    attachFeedActions();

    attachProfileModalEvents();
}

function buildComposer() {
    return /* html */ `
    <form class="fd-composer" id="fd-composer" autocomplete="off" novalidate>
      <div class="fd-composer__top">
        ${avatarHtml(
        currentUser?.profile_image || currentUser?.profileImage,
        currentUser?.username || currentUser?.name || "User",
        "fd-avatar",
    )}
        <textarea
          class="fd-composer__textarea"
          id="fd-composer-text"
          name="content"
          placeholder="Share a clip, callout, win, or hot take..."
          maxlength="2000"
        ></textarea>
      </div>

      <div class="fd-composer__preview" id="fd-composer-preview">
        <img class="fd-composer__preview-img" id="fd-composer-preview-img" alt="Selected post image preview" />
        <button class="fd-composer__preview-remove" id="fd-composer-remove-image" type="button" aria-label="Remove selected image">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <div class="fd-composer__bottom">
        <div class="fd-composer__tools">
          <label class="fd-composer__upload-btn" for="fd-composer-image" aria-label="Upload image" title="Upload image">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          </label>
          <input class="fd-composer__file-input" id="fd-composer-image" name="image" type="file" accept="image/*" />
          <p class="fd-composer__error" id="fd-composer-error" role="alert"></p>
        </div>

        <button class="fd-btn fd-btn--primary" id="fd-composer-submit" type="button">
          Post
        </button>
      </div>
    </form>
  `;
}

function buildProfilePreviewModal() {
    return `
        <div class="fd-profile-modal hidden" id="fd-profile-modal">

            <div class="fd-profile-modal__overlay"></div>

            <div class="fd-profile-modal__content">

    <button
        class="fd-profile-modal__close"
        id="fd-profile-modal-close"
    >
        ✕
    </button>

    <div
        class="fd-profile-modal__cover"
        id="fd-profile-cover"
    ></div>

    <div class="fd-profile-modal__body">

        <div
            class="fd-profile-modal__avatar"
            id="fd-profile-avatar"
        ></div>

        <h2 id="fd-profile-username"></h2>

        <p id="fd-profile-bio"></p>

        <button
            class="fd-btn fd-btn--primary"
            id="fd-profile-message-btn"
        >
            Message
        </button>

        <div
            class="fd-profile-posts"
            id="fd-profile-posts"
        ></div>

        

    </div>

</div>

        </div>
    `;
}

async function renderFeedPosts() {
    const postsContainer = document.getElementById("fd-posts");
    if (!postsContainer) return;

    postsContainer.innerHTML = buildFeedLoading();
    postsContainer.innerHTML = await buildPostsHtml();
}

async function buildPostsHtml() {
    try {
        const posts = await getFeedPosts();
        State.posts = posts;
        console.log(posts);
        return Array.isArray(posts) && posts.length
            ? posts.map((post) => buildPostCard(post, currentUser?.id)).join("")
            : buildFeedEmpty();
    } catch (error) {
        return buildFeedError(error.message);
    }
}

function attachComposerLogic() {
    const form = document.getElementById("fd-composer");
    const textarea = document.getElementById("fd-composer-text");
    const imageInput = document.getElementById("fd-composer-image");
    const removeImageBtn = document.getElementById("fd-composer-remove-image");
    const submitBtn = document.getElementById("fd-composer-submit");

    if (!form || !textarea || !imageInput || !removeImageBtn || !submitBtn) return;

    imageInput.addEventListener("change", handleImageSelection);
    removeImageBtn.addEventListener("click", clearSelectedImage);
    form.addEventListener("submit", handleCreatePost);
    submitBtn.addEventListener("click", handleCreatePost);
}

function attachFeedActions() {
    const postsContainer = document.getElementById("fd-posts");
    if (!postsContainer || attachedPostsContainer === postsContainer) return;

    attachedPostsContainer = postsContainer;
    postsContainer.addEventListener("click", handleFeedClick);
    postsContainer.addEventListener("keydown", handleFeedKeydown);
}

function attachProfileModalEvents() {

    const modal =
        document.getElementById(
            "fd-profile-modal"
        );

    if (!modal) return;

    const overlay =
        modal.querySelector(
            ".fd-profile-modal__overlay"
        );

    const closeBtn =
        document.getElementById(
            "fd-profile-modal-close"
        );

    function closeModal() {
        modal.classList.add("hidden");
        document.body.style.overflow = "";
    }

    overlay?.addEventListener(
        "click",
        closeModal
    );

    closeBtn?.addEventListener(
        "click",
        closeModal
    );
}

async function handleCreatePost(event) {
    event.preventDefault();
    event.stopPropagation();

    const textarea = document.getElementById("fd-composer-text");
    const submitBtn = document.getElementById("fd-composer-submit");
    const content = textarea?.value.trim() || "";
    const hasText = content.length > 0;
    const hasImage = Boolean(selectedImageFile);

    if (!hasText && !hasImage) {
        showComposerError("Add text or an image before posting.");
        textarea?.focus();
        return;
    }

    setComposerBusy(true);
    showComposerError("");

    try {
        const scrollY = window.scrollY;
        const newPost = await createPost(content, selectedImageFile);
        prependPost(newPost, scrollY);
        await refreshFeedAfterCreate(newPost, scrollY);
        textarea.value = "";
        clearSelectedImage();
    } catch (error) {
        showComposerError(error.message || "Failed to create post.");
    } finally {
        setComposerBusy(false);
        submitBtn?.focus({ preventScroll: true });
    }
}

function handleImageSelection(event) {
    const file = event.target.files?.[0] || null;
    if (!file) {
        clearSelectedImage();
        return;
    }

    if (!file.type.startsWith("image/")) {
        showComposerError("Please choose an image file.");
        clearSelectedImage();
        return;
    }

    selectedImageFile = file;
    revokeSelectedImageUrl();
    selectedImageUrl = URL.createObjectURL(file);

    const preview = document.getElementById("fd-composer-preview");
    const previewImg = document.getElementById("fd-composer-preview-img");
    if (preview && previewImg) {
        previewImg.src = selectedImageUrl;
        preview.classList.add("visible");
    }

    showComposerError("");
}

function prependPost(post, scrollY = window.scrollY) {
    const postsContainer = document.getElementById("fd-posts");
    if (!postsContainer || !post) return;

    const existingState = postsContainer.querySelector(".fd-state");
    if (existingState) postsContainer.innerHTML = "";

    postsContainer.insertAdjacentHTML(
        "afterbegin",
        buildPostCard(post, currentUser?.id),
    );

    State.posts = [post, ...State.posts.filter((item) => item.id !== post.id)];
    window.scrollTo({ top: scrollY });
}

async function refreshFeedAfterCreate(createdPost, scrollY) {
    const postsContainer = document.getElementById("fd-posts");
    if (!postsContainer || !createdPost) return;

    try {
        const refreshedPosts = await getFeedPosts();
        State.posts = [
            createdPost,
            ...refreshedPosts.filter((post) => String(post.id) !== String(createdPost.id)),
        ];

        postsContainer.innerHTML = State.posts
            .map((post) => buildPostCard(post, currentUser?.id))
            .join("");
    } catch (error) {
        console.log("FEED REFRESH AFTER CREATE FAILED:", error);
    }

    window.scrollTo({ top: scrollY });
}

async function handleFeedClick(event) {

    const actionButton =
        event.target.closest(
            "[data-action], .fd-card__user"
        );

    if (
        actionButton.dataset.action ===
        "open-profile-preview"
    ) {

        const userId =
            actionButton.dataset.userId;

        await openProfilePreview(userId);
    }

    if (!actionButton) return;



    const postId =
        actionButton.dataset.postId;

    if (!postId) return;

    if (
        actionButton.dataset.action ===
        "toggle-comments"
    ) {

        await handleToggleComments(
            postId,
            actionButton
        );
    }

    if (
        actionButton.dataset.action ===
        "send-comment"
    ) {

        await handleAddComment(
            postId,
            actionButton
        );
    }

    if (
        actionButton.dataset.action ===
        "toggle-like"
    ) {

        await handleLike(
            postId,
            actionButton
        );
    }

    if (
        actionButton.dataset.action ===
        "delete-post"
    ) {

        await handleDeletePost(
            postId,
            actionButton
        );
    }
}
async function handleFeedKeydown(event) {
    if (event.key !== "Enter") return;

    const input = event.target.closest(".fd-comments__input");
    if (!input) return;

    event.preventDefault();
    const postId = input.id.replace("fd-comment-input-", "");
    const sendButton = document.querySelector(
        `[data-action="send-comment"][data-post-id="${cssEscape(postId)}"]`,
    );
    if (sendButton) await handleAddComment(postId, sendButton);
}

async function handleToggleComments(postId, button) {
    const section = document.getElementById(`fd-comments-${postId}`);
    const list = document.getElementById(`fd-comments-list-${postId}`);
    if (!section || !list) return;

    const isOpen = section.style.display !== "none";
    if (isOpen) {
        section.style.display = "none";
        button.classList.remove("open");
        button.setAttribute("aria-expanded", "false");
        return;
    }

    section.style.display = "block";
    button.classList.add("open");
    button.setAttribute("aria-expanded", "true");

    if (list.dataset.loaded === "true") return;

    list.innerHTML = `<p class="fd-comments__empty">Loading comments...</p>`;

    try {
        const comments = await getPostComments(postId);
        list.innerHTML =
            Array.isArray(comments) && comments.length
                ? comments.map(buildCommentRow).join("")
                : `<p class="fd-comments__empty">No comments yet.</p>`;
        list.dataset.loaded = "true";
    } catch (error) {
        list.innerHTML = `<p class="fd-comments__empty">${esc(error.message || "Failed to load comments.")}</p>`;
    }
}

async function handleAddComment(postId, button) {
    const input = document.getElementById(`fd-comment-input-${postId}`);
    const list = document.getElementById(`fd-comments-list-${postId}`);
    const content = input?.value.trim() || "";

    if (!input || !list || !content) {
        input?.focus();
        return;
    }

    button.disabled = true;

    try {
        const comment = await addComment(postId, { content });
        const emptyState = list.querySelector(".fd-comments__empty");
        if (emptyState) emptyState.remove();

        list.insertAdjacentHTML("beforeend", buildCommentRow(comment));
        list.dataset.loaded = "true";
        input.value = "";
        list.scrollTop = list.scrollHeight;
    } catch (error) {
        list.insertAdjacentHTML(
            "beforeend",
            `<p class="fd-comments__empty">${esc(error.message || "Failed to add comment.")}</p>`,
        );
    } finally {
        button.disabled = false;
        input.focus();
    }
}

async function handleLike(postId, button) {

    const countEl =
        button.querySelector(".fd-like-count");

    const icon =
        button.querySelector("svg");

    const wasLiked =
        button.classList.contains(
            "fd-like-btn--active"
        );

    const previousCount =
        Number.parseInt(
            countEl?.textContent || "0",
            10,
        ) || 0;

    // تحديث مباشر للواجهة
    setLikeState(
        button,
        icon,
        countEl,
        !wasLiked,
        previousCount + (wasLiked ? -1 : 1),
    );

    try {

        const result =
            await toggleLike(postId);
        const post =
            State.posts.find(
                (p) =>
                    String(p.id) ===
                    String(postId)
            );

        if (post) {

            post.is_liked =
                result.is_liked;

            post.likes_count =
                result.likes_count;
        }

        const nextLiked =
            result?.is_liked ??
            !wasLiked;

        const nextCount =
            result?.likes_count ??
            previousCount +
            (wasLiked ? -1 : 1);

        setLikeState(
            button,
            icon,
            countEl,
            Boolean(nextLiked),
            nextCount,
        );

    } catch (error) {

        // رجّع الحالة القديمة إذا فشل
        setLikeState(
            button,
            icon,
            countEl,
            wasLiked,
            previousCount,
        );
    }
}
async function handleDeletePost(postId, button) {
    const card = document.getElementById(`fd-post-${postId}`);
    if (!card) return;

    button.disabled = true;

    try {
        const modal =
            document.querySelector(
                ".delete-modal"
            );

        modal.querySelector("h3").textContent =
            "Delete Post";

        modal.querySelector("p").textContent =
            "Are you sure you want to delete this post?";

        const cancelBtn =
            document.querySelector(
                "#cancelDelete"
            );

        const confirmBtn =
            document.querySelector(
                "#confirmDeleteBtn"
            );

        modal.classList.remove(
            "hidden"
        );

        const confirmed =
            await new Promise((resolve) => {

                const closeModal = (isConfirmed) => {

                    modal.classList.add(
                        "hidden"
                    );

                    confirmBtn.onclick = null;
                    cancelBtn.onclick = null;

                    resolve(isConfirmed);
                };

                confirmBtn.onclick = () => {

                    closeModal(true);
                };

                cancelBtn.onclick = () => {

                    closeModal(false);
                };
            });

        if (!confirmed) {
            button.disabled = false;
            return;
        }

        await deletePost(postId);
        card.classList.add("fd-card--removing");
        window.setTimeout(() => {
            card.remove();
            showEmptyStateIfNeeded();
        }, 280);
    } catch (error) {
        document
            .querySelector(".delete-modal")
            ?.classList.add("hidden");

        button.disabled = false;
    }
}

async function openProfilePreview(userId) {

    const modal =
        document.getElementById(
            "fd-profile-modal"
        );

    if (!modal) return;

    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";

    try {

        const profile =
            await getUserProfileById(userId);

        const userPosts =
            await getUserPostsById(userId);

        const cover =
            document.getElementById(
                "fd-profile-cover"
            );

        cover.style.backgroundImage =
            profile.cover_image
                ? `url(${resolveImg(profile.cover_image)})`
                : "";

        const avatar =
            document.getElementById(
                "fd-profile-avatar"
            );

        const username =
            document.getElementById(
                "fd-profile-username"
            );

        const bio =
            document.getElementById(
                "fd-profile-bio"
            );

        const posts =
            document.getElementById(
                "fd-profile-posts"
            );

        avatar.innerHTML =
            avatarHtml(
                profile.profile_image,
                profile.username,
                "fd-avatar"
            );

        username.textContent =
            profile.username || "User";

        bio.textContent =
            profile.bio || "No bio yet.";

        posts.innerHTML =
            (userPosts || [])
                .map(post => `

            <div class="fd-preview-post">

                <div class="fd-preview-post__header">

                    ${avatarHtml(
                    profile.profile_image,
                    profile.username,
                    "fd-preview-post__avatar"
                )}

                    <div>

                        <div class="fd-preview-post__username">
                            ${esc(profile.username)}
                        </div>

                        <div class="fd-preview-post__time">
                            ${formatDate(post.created_at)}
                        </div>

                    </div>

                </div>

                ${post.content
                        ? `
                            <p class="fd-preview-post__content">
                                ${esc(post.content)}
                            </p>
                          `
                        : ""
                    }

                ${post.image
                        ? `
                            <img
                                class="fd-preview-post__image"
                                src="${resolveImg(post.image)}"
                                alt=""
                            />
                          `
                        : ""
                    }

                <div class="fd-preview-post__likes">

                    ❤️ ${post.likes_count || 0} likes

                </div>

            </div>

        `)
                .join("");

        const messageBtn =
            document.getElementById(
                "fd-profile-message-btn"
            );

        messageBtn.onclick = () => {

            const currentUser =
                getUser();

            // منع مراسلة نفسك
            if (
                currentUser?.id === Number(userId)
            ) {

                return;
            }

            document
                .getElementById(
                    "fd-profile-modal"
                )
                ?.classList.add("hidden");

            document.body.style.overflow = "";

            localStorage.setItem(
                "openChatUser",
                userId
            );

            navigate("community");
        };
    } catch (error) {

        console.log(error);
    }
}

function setLikeState(button, icon, countEl, isLiked, count) {
    const safeCount = Math.max(0, Number.parseInt(count, 10) || 0);
    button.classList.toggle("fd-like-btn--active", isLiked);
    button.setAttribute("aria-pressed", String(isLiked));
    button.setAttribute("aria-label", isLiked ? "Unlike post" : "Like post");

    if (icon) icon.setAttribute("fill", isLiked ? "currentColor" : "none");
    if (countEl) countEl.textContent = String(safeCount);
}

function clearSelectedImage() {
    selectedImageFile = null;
    revokeSelectedImageUrl();

    const imageInput = document.getElementById("fd-composer-image");
    const preview = document.getElementById("fd-composer-preview");
    const previewImg = document.getElementById("fd-composer-preview-img");

    if (imageInput) imageInput.value = "";
    if (previewImg) previewImg.removeAttribute("src");
    if (preview) preview.classList.remove("visible");
}

function revokeSelectedImageUrl() {
    if (!selectedImageUrl) return;
    URL.revokeObjectURL(selectedImageUrl);
    selectedImageUrl = null;
}

function setComposerBusy(isBusy) {
    const submitBtn = document.getElementById("fd-composer-submit");
    const textarea = document.getElementById("fd-composer-text");
    const imageInput = document.getElementById("fd-composer-image");

    if (submitBtn) {
        submitBtn.disabled = isBusy;
        submitBtn.textContent = isBusy ? "Posting..." : "Post";
    }

    if (textarea) textarea.disabled = isBusy;
    if (imageInput) imageInput.disabled = isBusy;
}

function showComposerError(message) {
    const errorEl = document.getElementById("fd-composer-error");
    if (!errorEl) return;

    errorEl.textContent = message;
    errorEl.classList.toggle("visible", Boolean(message));
}

function showEmptyStateIfNeeded() {
    const postsContainer = document.getElementById("fd-posts");
    if (!postsContainer || postsContainer.querySelector(".fd-card")) return;

    postsContainer.innerHTML = buildFeedEmpty();
}

function cssEscape(value) {
    if (window.CSS?.escape) return window.CSS.escape(value);
    return String(value).replace(/"/g, '\\"');
}
