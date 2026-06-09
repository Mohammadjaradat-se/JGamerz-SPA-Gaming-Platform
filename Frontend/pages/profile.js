import { getUser } from "../utils/auth.js";
import {
    updateUserProfile
} from "../services/profileService.js";
import { deletePost } from "../services/postService.js";
import { getPostComments, addComment } from "../services/commentService.js";
import { getUserPosts } from "../services/postService.js";
import { toggleLike } from "../services/likeService.js";
import { getFeedPosts } from "../services/feedService.js";
import { API_BASE_URL } from "../config/api.js";
import { refreshNavbar } from "../components/navbar.js";

const BASE_URL =
    API_BASE_URL.replace("/api", "");

function isPostLiked(post) {
    return String(post?.is_liked) === "true" || post?.is_liked === true;
}

async function hydrateProfilePostLikes(posts) {
    try {
        const feedPosts = await getFeedPosts();
        const feedPostById = new Map(
            (feedPosts || []).map((post) => [
                String(post.id),
                post,
            ])
        );

        return posts.map((post) => {
            const feedPost = feedPostById.get(String(post.id));

            return {
                ...post,
                is_liked: feedPost?.is_liked ?? post.is_liked,
            };
        });
    } catch (error) {
        console.log("HYDRATE PROFILE LIKES ERROR:", error);

        return posts;
    }
}

export async function ProfilePage() {
    const user = getUser();
    if (!user) {
        return `
        <div class="empty-profile">
            No user found.
        </div>
    `;
    }

    let posts = [];

    try {
        posts = await getUserPosts(user.id);
        posts = await hydrateProfilePostLikes(posts);
    } catch (error) {
        console.log("GET POSTS ERROR:", error);

        posts = [];
    }


    return `

    <section class="profile-page">

        <div class="profile-layout">

            <!-- LEFT SIDEBAR -->
            <aside class="profile-sidebar left-sidebar">

                <div class="sidebar-card">

                    <h3>Player Stats</h3>

                    <div class="stat-item">
                        <span>🎮 Games</span>
                        <strong>248</strong>
                    </div>

                    <div class="stat-item">
                        <span>🏆 Wins</span>
                        <strong>67</strong>
                    </div>

                    <div class="stat-item">
                        <span>⭐ Rank</span>
                        <strong>Diamond</strong>
                    </div>

                    <div class="stat-item">
                        <span>🔥 Level</span>
                        <strong>72</strong>
                    </div>

                </div>

                <div class="sidebar-card">

                    <h3>Favorite Games</h3>

                    <div class="game-tag">Valorant</div>
                    <div class="game-tag">FC26</div>
                    <div class="game-tag">CS2</div>
                    <div class="game-tag">GTA V</div>

                </div>

            </aside>

            <!-- MAIN CONTENT -->
            <div class="profile-main">

                <!-- PROFILE HEADER -->
                <div class="profile-header">

                    <!-- Cover -->
                    <div class="profile-cover">

                        <img
                            src="${user?.cover_image
            ? `${BASE_URL}${user.cover_image}`
            : "assets/default-cover.jpg"}"
                            class="cover-img"
                        >

                    </div>

                    <!-- INFO -->
                    <div class="profile-info">

                        <div class="profile-avatar-wrapper">

                            <img
                                src="${user?.profile_image
            ? `${BASE_URL}${user.profile_image}`
            : "assets/default-avatar.jpg"}"                    
                              class="profile-avatar"
                            >

                            <div class="online-status"></div>

                        </div>

                        <div class="profile-user-data">

                            <h1 class="profile-username">
                                ${user?.username || "Unknown User"}
                            </h1>

                            <p class="profile-tag">
                                @${user?.username || "unknown"}
                            </p>

                            <p class="profile-bio">
                                ${user?.bio || "No bio yet."}
                            </p>

                        </div>

                          
                            <button class="edit-profile-btn">

                            <i class="bi bi-pencil-square"></i>

                             Edit Profile

                               </button>
                               

                    </div>

                </div>

                <!-- POSTS -->
                <div class="profile-posts">

                    <div class="posts-header">
                        <h2>Posts</h2>
                    </div>

                    <div class="posts-list">

                        ${posts
            .map(
                (post) => `

        <div class="post-card">

            <!-- POST HEADER -->

            <div class="post-top">

                <div class="post-user">

                    <img
                        src="${user?.profile_image
                        ? `${BASE_URL}${user.profile_image}`
                        : "assets/default-avatar.jpg"}"
                        class="post-avatar"
                    >

                    <div>

                        <h4>
                            ${user?.username || "Unknown User"}
                        </h4>

                        <span>
                            ${new Date(post.created_at).toLocaleDateString()}
                        </span>

                    </div>

                </div>

                <!-- DELETE -->

                  
                    <button class="delete-post-btn" data-post-id="${post.id}">

                              <i class="bi bi-x-lg"></i>

                                 </button>
                                  

                   

            </div>

            <!-- CONTENT -->

            <p class="post-content">

                ${post.content}

            </p>

            <!-- IMAGE -->

            ${post.image
                        ? `
    <img
        src="${BASE_URL}${post.image}"
        class="post-image"
    >
`
                        : ""
                    }

            <!-- STATS -->

            <div class="post-stats">

                <!-- LIKE -->

                <div
                    class="post-stat ${isPostLiked(post) ? "post-stat--liked" : ""}"
                    aria-pressed="${isPostLiked(post)}"
                >

                    <i class="bi bi-hand-thumbs-up-fill"></i>

                    <span>${post.likes_count}</span>

                </div>

                <!-- COMMENT BUTTON -->

                <button
                    class="toggle-comments-btn"
                    data-post-id="${post.id}"
                >

                    <i class="bi bi-chat-dots-fill"></i>

                   

                </button>

            </div>

            <!-- COMMENTS SECTION -->

            <div
                class="comments-section hidden"
                id="comments-${post.id}"
            >

                <!-- COMMENTS LIST -->

                <div class="comments-list">

                </div>

                <!-- ADD COMMENT -->

                <div class="add-comment-box">

                    <input
                        type="text"
                        class="comment-input"
                        placeholder="Write a comment..."
                    >

                    <button
                        class="add-comment-btn"
                        data-post-id="${post.id}"
                    >

                        Post

                    </button>

                </div>

            </div>

        </div>

    `,
            )
            .join("")}

                    </div>

                </div>

            </div>

            <!-- RIGHT SIDEBAR -->
            <aside class="profile-sidebar right-sidebar">

                <div class="sidebar-card">

                    <h3>Activity</h3>

                    <p class="activity-item">
                        🟢 Online Now
                    </p>

                    <p class="activity-item">
                        🎯 Last Match: 2h ago
                    </p>

                    <p class="activity-item">
                        🚀 Joined Tournament
                    </p>

                </div>

                <div class="sidebar-card">

                    <h3>Gaming Quote</h3>

                    <p class="quote-text">
                        "Legends never quit. They respawn stronger."
                    </p>

                </div>

            </aside>

        </div>

        <!-- EDIT PROFILE MODAL -->
        <div class="edit-profile-modal hidden">

            <div class="edit-modal-content">

                <button class="close-modal-btn">
                    <i class="bi bi-x-lg"></i>
                </button>

                <h2>Edit Profile</h2>

                <div class="edit-input-group">

                    <label>Username</label>

                    <input
                        type="text"
                        id="edit-username"
                        value="${user?.username || ""}"
                    >
                    <small class="input-error" id="username-error"></small>


                </div>

                <div class="edit-input-group">

                    <label>Bio</label>

                    <textarea id="edit-bio">${user?.bio || ""}</textarea>
                    <small class="input-error" id="bio-error"></small>

                </div>

                <div class="edit-input-group">

                    <label>Profile Image URL</label>

 <label class="custom-upload">

    <i class="bi bi-upload"></i>
    Upload Profile Image

    <input
        type="file"
        id="edit-profile-image"
        accept="image/*"
        hidden
    >

</label>
<img
    id="profile-preview"
    class="image-preview"
   src="${user?.profile_image
            ? `${BASE_URL}${user.profile_image}`
            : "assets/default-avatar.jpg"}"

>
<button
    type="button"
    class="remove-profile-image-btn"
>
    <i class="bi bi-trash3"></i>
    Remove Current Photo
</button>

                </div>

                <div class="edit-input-group">

                    <label>Cover Image URL</label>
                    <label class="custom-upload">

    <i class="bi bi-image"></i>
    Upload Cover Image

    <input
        type="file"
        id="edit-cover-image"
        accept="image/*"
        hidden
    >

</label>


<img
    id="cover-preview"
    class="cover-preview"
    src="${user?.cover_image
            ? `${BASE_URL}${user.cover_image}`
            : "assets/default-cover.jpg"}"
>

                     

                </div>

                <button class="save-profile-btn">
                    Save Changes
                </button>

            </div>

        </div>

    </section>

    `;
}

export function initProfile() {
    const profileId =
        localStorage.getItem(
            "selectedProfileId"
        );
    const user = getUser();

    const editBtn = document.querySelector(".edit-profile-btn");

    const modal = document.querySelector(".edit-profile-modal");

    const closeBtn = document.querySelector(".close-modal-btn");

    const saveBtn = document.querySelector(".save-profile-btn");

    // INPUTS

    const usernameInput = document.querySelector("#edit-username");

    const bioInput = document.querySelector("#edit-bio");

    const profileImageInput = document.querySelector("#edit-profile-image");

    const coverImageInput = document.querySelector("#edit-cover-image");

    if (!editBtn || !modal || !closeBtn || !saveBtn) return;

    /* =========================
                      OPEN MODAL
                ========================= */

    editBtn.addEventListener("click", () => {
        modal.classList.remove("hidden");
    });

    /* =========================
                      CLOSE MODAL
                ========================= */

    closeBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    /* =========================================
           TOGGLE COMMENTS
        ========================================= */

    const toggleButtons = document.querySelectorAll(".toggle-comments-btn");
    toggleButtons.forEach((button) => {

        button.addEventListener(
            "click",

            async () => {

                const postId =
                    button.dataset.postId;

                const commentsSection =
                    document.querySelector(
                        `#comments-${postId}`
                    );
                console.log(commentsSection);
                // SHOW / HIDE
                commentsSection.classList.toggle(
                    "hidden"
                );

                if (
                    commentsSection.style.display ===
                    "block"
                ) {

                    commentsSection.style.display =
                        "none";

                    return;
                }

                commentsSection.style.display =
                    "block";

                // إذا already loaded
                if (
                    commentsSection.dataset.loaded ===
                    "true"
                ) {
                    return;
                }

                // FETCH COMMENTS
                const comments =
                    await getPostComments(postId);

                // RENDER COMMENTS
                renderComments(postId, comments);

                // SAVE STATE
                commentsSection.dataset.loaded =
                    "true";
            },
        );
    });

    const usernameError = document.querySelector("#username-error");

    const bioError = document.querySelector("#bio-error");

    let profileImageFile = null;

    let coverImageFile = null;

    let removeProfileImage = false;

    profileImageInput.addEventListener(
        "change",

        () => {
            const file = profileImageInput.files[0];

            if (!file) return;

            profileImageFile = file;

            // PREVIEW

            const imageUrl = URL.createObjectURL(file);

            document.querySelector("#profile-preview").src = imageUrl;
        },
    );

    coverImageInput.addEventListener(
        "change",

        () => {
            const file = coverImageInput.files[0];

            if (!file) return;

            coverImageFile = file;

            // PREVIEW

            const imageUrl = URL.createObjectURL(file);

            document.querySelector("#cover-preview").src = imageUrl;
        },
    );

    const removeProfileBtn =
        document.querySelector(
            ".remove-profile-image-btn"
        );

    removeProfileBtn.addEventListener(
        "click",

        () => {

            removeProfileImage = true;

            profileImageFile = null;

            profileImageInput.value = "";

            document.querySelector(
                "#profile-preview"
            ).src =
                "assets/default-avatar.jpg";
        }
    );

    saveBtn.addEventListener(
        "click",

        async () => {
            const username = usernameInput.value.trim();

            const bio = bioInput.value.trim();

            /* =========================
                                             RESET ERRORS
                                          ========================= */

            usernameError.textContent = "";

            bioError.textContent = "";

            usernameInput.classList.remove("input-invalid");

            bioInput.classList.remove("input-invalid");

            /* =========================
                                             VALIDATION
                                          ========================= */

            let isValid = true;

            // USERNAME REGEX

            const usernameRegex = /^[A-Za-z_][A-Za-z0-9_]{2,20}$/;

            if (!usernameRegex.test(username)) {
                usernameError.textContent =
                    "Username must start with a letter or underscore and contain no spaces.";

                usernameInput.classList.add("input-invalid");

                isValid = false;
            }

            // BIO LENGTH

            if (bio.length > 100) {
                bioError.textContent = "Bio cannot exceed 100 characters.";

                bioInput.classList.add("input-invalid");

                isValid = false;
            }

            /* =========================
                                             STOP IF INVALID
                                          ========================= */

            if (!isValid) return;


            try {

                /* =========================
                   CREATE FORMDATA
                ========================= */

                const formData = new FormData();

                formData.append("username", username);

                formData.append("bio", bio);

                if (removeProfileImage) {

                    formData.append(
                        "remove_profile_image",
                        "true"
                    );
                }

                if (profileImageFile) {

                    formData.append(
                        "profile_image",
                        profileImageFile
                    );
                }

                if (coverImageFile) {

                    formData.append(
                        "cover_image",
                        coverImageFile
                    );
                }

                /* =========================
                   UPDATE PROFILE API
                ========================= */

                const updatedUser =
                    await updateUserProfile(formData);

                console.log(
                    "UPDATED USER:",
                    updatedUser
                );

                /* =========================
                   MERGE USER DATA
                ========================= */

                const currentUser = getUser();

                const mergedUser = {
                    ...currentUser,
                    ...updatedUser,
                };

                if (removeProfileImage) {
                    mergedUser.profile_image = null;
                }

                /* =========================
                   UPDATE LOCAL STORAGE
                ========================= */

                localStorage.setItem(
                    "user",
                    JSON.stringify(mergedUser)
                );

                /* =========================
                   CLOSE MODAL
                ========================= */

                modal.classList.add("hidden");

                /* =========================
                   UPDATE UI
                ========================= */

                // USERNAME

                document.querySelector(
                    ".profile-username"
                ).textContent =
                    mergedUser.username;

                // TAG

                document.querySelector(
                    ".profile-tag"
                ).textContent =
                    `@${mergedUser.username}`;

                // BIO

                document.querySelector(
                    ".profile-bio"
                ).textContent =
                    mergedUser.bio;

                /* =========================
                   PROFILE IMAGE
                ========================= */

                const profileImage =
                    mergedUser.profile_image
                        ? `${BASE_URL}${mergedUser.profile_image}`
                        : "assets/default-avatar.jpg";

                // MAIN AVATAR

                document.querySelector(
                    ".profile-avatar"
                ).src = profileImage;

                // POSTS AVATARS

                document
                    .querySelectorAll(".post-avatar")
                    .forEach((img) => {

                        img.src = profileImage;
                    });

                refreshNavbar();
                /* =========================
                   COVER IMAGE
                ========================= */

                if (mergedUser.cover_image) {

                    document.querySelector(
                        ".cover-img"
                    ).src =
                        `${BASE_URL}${mergedUser.cover_image}`;
                }

            } catch (error) {

                console.log(
                    "SAVE PROFILE ERROR:",
                    error
                );
            }
        },
    );




    /* =========================================
           ADD COMMENT
        ========================================= */

    const addCommentButtons = document.querySelectorAll(".add-comment-btn");

    addCommentButtons.forEach((button) => {
        button.addEventListener(
            "click",

            async () => {
                const postId = button.dataset.postId;

                const commentsSection = document.querySelector(`#comments-${postId}`);

                const input = commentsSection.querySelector(".comment-input");

                const content = input.value.trim();

                // EMPTY COMMENT

                if (!content) return;

                // SEND TO API

                const newComment = await addComment(postId, {
                    content,
                });

                // CLEAR INPUT

                input.value = "";

                // REFETCH COMMENTS

                const comments = await getPostComments(postId);

                renderComments(postId, comments);
            },
        );
    });

    /* =========================================
   LIKE POSTS
========================================= */

    const likeButtons =
        document.querySelectorAll(".post-stat");

    likeButtons.forEach((button) => {

        button.addEventListener(
            "click",

            async () => {

                const postCard =
                    button.closest(".post-card");

                const postId =
                    postCard
                        .querySelector(".toggle-comments-btn")
                        .dataset.postId;

                const result =
                    await toggleLike(postId);

                if (!result) return;

                button.querySelector("span")
                    .textContent =
                    result.likes_count || 0;

                const isLiked =
                    result.is_liked ?? !button.classList.contains("post-stat--liked");

                const isLikedActive =
                    String(isLiked) === "true" || isLiked === true;

                button.classList.toggle(
                    "post-stat--liked",
                    isLikedActive
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isLikedActive)
                );
            }
        );
    });

    /* =========================================
     DELETE POSTS
  ========================================= */

    const deleteButtons = document.querySelectorAll(".delete-post-btn");

    deleteButtons.forEach((button) => {
        button.addEventListener(
            "click",

            async () => {
                // POST CARD

                const postCard = button.closest(".post-card");

                // POST ID

                const postId = button.dataset.postId;

                // CONFIRM
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
                        confirmBtn.onclick = () => {
                            modal.classList.add(
                                "hidden"
                            );

                            resolve(true);
                        };

                        cancelBtn.onclick = () => {

                            modal.classList.add(
                                "hidden"
                            );

                            resolve(false);
                        };
                    });

                if (!confirmed) return;
                try {
                    // DELETE API

                    const result = await deletePost(postId);

                    // REMOVE FROM UI

                    postCard.remove();

                } catch (error) {
                    console.log("DELETE POST ERROR:", error);
                }
            },
        );
    });
}
function renderComments(postId, comments) {
    const commentsList = document.querySelector(
        `#comments-${postId} .comments-list`,
    );

    if (!commentsList) return;

    commentsList.innerHTML = "";

    comments.forEach((comment) => {
        commentsList.innerHTML += `

            <div class="comment-item">

                <div class="comment-user">

                    ${comment.username || "Unknown"}
                </div>

                <div class="comment-content">

                    ${comment.content}

                </div>

            </div>

        `;
    });
}
