// Auth utilities (already exist in project — do NOT redefine)
import { requireAuth, getUser } from "../utils/auth.js";
import { API_BASE_URL } from "../config/api.js";
import { socket } from "../utils/socket.js";
// Services
import { getUsers, searchUsers } from "../services/community.service.js";
import { toggleFriend } from "../services/friend.service.js";
import {
    getProfile,
    getUserPosts,
} from "../services/community_profile_service.js";
import { sendMessage, getConversation } from "../services/chat.service.js";
import { clearChatUnread } from "../utils/chatNotifications.js";

// ─── Font Injection (matches marketplace.js pattern) ─────────────────────────
(function injectFonts() {
    if (document.getElementById("jg-community-fonts")) return;
    const link = document.createElement("link");
    link.id = "jg-community-fonts";
    link.rel = "stylesheet";
    link.href =
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=Inter:wght@300;400;500;600&display=swap";
    document.head.appendChild(link);
})();

// ─── State ────────────────────────────────────────────────────────────────────
const State = {
    currentUser: null, // logged-in user object
    allUsers: [], // full user list (members tab)
    activeChatUser: null, // { id, username, profile_image }
    chatUsersList: [], // users shown in chat sidebar
    lastMessages: [], // cached messages for active convo
    onlineUsers: [],
    activeTab: "members",

    unreadMap: {},
};

let chatUsersListPromise = null;
let globalMessageListenerInitialized = false;

function getUserUnreadCount(userId) {
    return Number(window.globalUnreadMap?.[String(userId)] || 0);
}

function syncChatUsersUnread() {
    State.chatUsersList = State.chatUsersList.map((user) => ({
        ...user,
        unread_count: getUserUnreadCount(user.id),
    }));

    return State.chatUsersList;
}

function hasConversationList() {
    return Boolean($("#cm-conv-list"));
}

async function handleChatUnreadUpdated() {
    if (State.chatUsersList.length === 0 && hasConversationList()) {
        await ensureChatUsersList();
    }

    syncChatUsersUnread();
    renderConvList(State.chatUsersList);
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

function formatTime(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(isoString) {
    if (!isoString) return "";
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function initial(str = "") {
    return (str[0] || "?").toUpperCase();
}

function escHtml(str = "") {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;");
}

function fullImage(path = "") {
    if (!path) return "";

    if (path.startsWith("http")) {
        return path;
    }

    return `${API_BASE_URL}${path}`;
}

// ─── HTML Builders ────────────────────────────────────────────────────────────

/** Render avatar img or letter fallback */
function avatarImg(src, username, cls, fallbackCls, size) {
    if (src) {
        return `<img src="${escHtml(fullImage(src))}" alt="${escHtml(username)}" class="${cls}" loading="lazy" />`;
    }
    const style = size
        ? `width:${size}px;height:${size}px;font-size:${Math.round(size * 0.35)}px;`
        : "";
    return `<div class="${fallbackCls}" style="${style}">${initial(username)}</div>`;
}

/** Cover image or gradient fallback */
function coverImg(src, cls, fallbackCls) {
    if (src)
        return `<img src="${escHtml(fullImage(src))}" alt="cover" class="${cls}" loading="lazy" />`;
    return `<div class="${fallbackCls}"></div>`;
}

/** User card HTML */
function buildUserCard(user) {
    const isFriend = user.is_friend || false;
    return `
    <article class="cm-user-card" data-user-id="${user.id}" tabindex="0" role="button"
      aria-label="View ${escHtml(user.username)}'s profile">
      <div class="cm-card-cover">
        ${coverImg(user.cover_image, "cm-card-cover-img", "cm-card-cover-fallback")}
      </div>
      <div class="cm-card-avatar-wrap">
        ${avatarImg(user.profile_image, user.username, "cm-card-avatar", "cm-avatar-fallback")}
      </div>
      <div class="cm-card-body">
        <h3 class="cm-card-username">${escHtml(user.username)}</h3>
        <p class="cm-card-bio">${escHtml(user.bio || "No bio yet.")}</p>
        <div class="cm-card-actions">
          <button
            class="cm-btn cm-btn-friend ${isFriend ? "cm-btn--danger" : "cm-btn--ghost"}"
            data-action="friend"
            data-user-id="${user.id}"
            data-is-friend="${isFriend}"
          >
            ${friendBtnContent(isFriend)}
          </button>
          <button
            class="cm-btn cm-btn--icon"
            data-action="chat"
            data-user-id="${user.id}"
            data-username="${escHtml(user.username)}"
            data-avatar="${escHtml(user.profile_image || "")}"
            title="Chat"
            aria-label="Chat with ${escHtml(user.username)}"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>
      </div>
    </article>
  `;
}

function friendBtnContent(isFriend) {
    if (isFriend) {
        return `
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
      Friends
    `;
    }
    return `
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
    Add Friend
  `;
}

/** Loading state */
function buildLoadingState(msg = "Loading…") {
    return `<div class="cm-state"><div class="cm-spinner"></div><p>${msg}</p></div>`;
}

/** Error state */
function buildErrorState(msg = "Something went wrong.") {
    return `
    <div class="cm-state cm-state--error">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/>
        <line x1="12" y1="16" x2="12.01" y2="16"/>
      </svg>
      <p>${escHtml(msg)}</p>
    </div>
  `;
}

/** Empty state */
function buildEmptyState(msg = "Nothing here yet.") {
    return `
    <div class="cm-state">
      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <p>${escHtml(msg)}</p>
    </div>
  `;
}

/** Post card */
function buildPostCard(post, user) {
    const likesCount = post.likes_count ?? post.likes ?? 0;
    return `
    <div class="cm-post">
      <div class="cm-post-header">
        ${avatarImg(user.profile_image, user.username, "cm-post-avatar", "cm-post-avatar-fallback")}
        <div class="cm-post-meta">
          <span class="cm-post-author">${escHtml(user.username)}</span>
          <span class="cm-post-time">${formatDate(post.created_at)}</span>
        </div>
      </div>
      <p class="cm-post-content">${escHtml(post.content || "")}</p>
      ${post.image ? `<img src="${escHtml(fullImage(post.image))}" class="cm-post-image" alt="post image" loading="lazy" />` : ""}
      <div class="cm-post-likes">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="#e87070" stroke="none">
          <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
        </svg>
        ${likesCount} like${likesCount !== 1 ? "s" : ""}
      </div>
    </div>
  `;
}

/** Conversation list item */
function buildConvItem(user) {

    console.log(
        "CONV USER:",
        user
    );

    const isOnline =

        (window.onlineUsers || []).includes(
            user.id.toString()
        )
console.log(
        "BADGE CHECK:",
        user.username,
        user.unread_count
    );
    return `
    <div class="cm-conv-item"
        data-user-id="${user.id}"
        data-username="${escHtml(user.username)}"
        data-avatar="${escHtml(user.profile_image || "")}">

      ${avatarImg(
        user.profile_image,
        user.username,
        "cm-conv-avatar",
        "cm-conv-avatar-fallback",
    )}

      <div class="cm-conv-info">

       <div class="cm-conv-name-row">

    <div class="cm-conv-name">
        ${escHtml(user.username)}
    </div>

    <div class="
        cm-status-dot
        ${window.onlineUsers?.includes(String(user.id))
            ? "online"
            : "offline"
        }
    ">
    </div>

</div>
     

        

        <div class="cm-conv-preview">
            ${escHtml(
            user.last_message ||
            "Click to open chat"
        )}
        </div>

      </div>

      ${Number(user.unread_count || 0) > 0
            ? `
                <div class="cm-conv-badge">
                    ${user.unread_count}
                </div>
              `
            : ""
        }

    </div>
  `;
}

/** Message bubble */
function buildMessageBubble(msg, currentUserId, partnerUser) {
    const isSent = String(msg.sender_id) === String(currentUserId);
    const avatarSrc = isSent
        ? State.currentUser?.profile_image || ""
        : partnerUser?.profile_image || "";
    const name = isSent ? State.currentUser?.username : partnerUser?.username;

    return `
    <div class="cm-msg-row ${isSent ? "cm-msg-row--sent" : "cm-msg-row--recv"}">
      ${avatarImg(avatarSrc, name, "cm-msg-avatar", "cm-msg-avatar", 28)}
      <div>
        <div class="cm-msg-bubble">${escHtml(msg.message || msg.content || "")}</div>
        <span class="cm-msg-time">${formatTime(msg.created_at)}</span>
        ${isSent
            ? `
            <span class="cm-msg-status">
                ${msg.seen ? "Seen" : "Sent"}
            </span>
          `
            : ""
        }
      </div>
    </div>
  `;
}

// ─── Page HTML Template ────────────────────────────────────────────────────────
export function CommunityPage() {
    return `
    <div class="community-page">

      <!-- Header -->
      <header class="cm-header">
        <p class="cm-header__eyebrow">JGamerz Platform</p>
        <h1 class="cm-header__title">Community Hub</h1>
        <p class="cm-header__sub">Connect with fellow gamers. Make friends. Start conversations.</p>
      </header>

      <!-- Tabs -->
      <nav class="cm-tabs" role="tablist">
        <button class="cm-tab active" role="tab" data-tab="members" aria-selected="true">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          Members
        </button>
        <button class="cm-tab" role="tab" data-tab="chat" aria-selected="false">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="display:inline;vertical-align:middle;margin-right:6px;">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
        </button>
      </nav>

      <!-- Members Panel -->
      <section class="cm-panel active" id="panel-members" role="tabpanel">
        <div class="cm-members-controls">
          <div class="cm-search-wrap">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              id="cm-members-search"
              class="cm-search"
              type="text"
              placeholder="Search gamers…"
              autocomplete="off"
            />
          </div>
          <span class="cm-members-count" id="cm-members-count"></span>
        </div>
        <div id="cm-members-grid" class="cm-grid"></div>
      </section>

      <!-- Chat Panel -->
      <section class="cm-panel" id="panel-chat" role="tabpanel">
        <div class="cm-chat">
          <!-- Sidebar -->
          <aside class="cm-chat-sidebar">
            <div class="cm-chat-sidebar-header">
              <div class="cm-chat-sidebar-title">Conversations</div>
              <div class="cm-chat-search-wrap">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
                <input id="cm-chat-search" class="cm-chat-search" type="text" placeholder="Find a user…" autocomplete="off" />
              </div>
            </div>
            <div id="cm-conv-list" class="cm-conv-list"></div>
          </aside>

          <!-- Chat main -->
          <main class="cm-chat-main" id="cm-chat-main">
            <div class="cm-chat-empty" id="cm-chat-empty">
              <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <div class="cm-chat-empty-title">No conversation selected</div>
              <p>Pick a user from the sidebar to start chatting.</p>
            </div>
          </main>
        </div>
      </section>

      <!-- Profile Modal -->
      <div class="cm-modal-overlay" id="cm-profile-modal" role="dialog" aria-modal="true" aria-labelledby="cm-modal-username">
        <div class="cm-modal" id="cm-modal-panel">
          <!-- Dynamically populated -->
        </div>
      </div>

    </div>
  `;
}

// ─── Init ─────────────────────────────────────────────────────────────────────
export function initCommunity() {
    window.removeEventListener("chat-unread-updated", handleChatUnreadUpdated);
    window.addEventListener("chat-unread-updated", handleChatUnreadUpdated);

    // ── Auth guard ─────────────────────────

    if (!localStorage.getItem("token")) {

        navigate("auth");

        return;
    }

    State.currentUser = getUser();
    if (socket.connected) {

        socket.emit(
            "register_user",
            State.currentUser.id
        );
    }

    socket.off("connect");

    socket.on(
        "connect",

        () => {

            socket.emit(
                "register_user",
                State.currentUser.id
            );
        }
    );

    socket.off("online_users");

    socket.on(

        "online_users",

        (users) => {

            console.log(
                "ONLINE USERS EVENT:",
                users
            );

            window.onlineUsers = users;

            renderConvList(
                State.chatUsersList
            );

            if (State.activeChatUser) {

                renderChatMainArea(
                    State.activeChatUser
                );

                renderMessages(
                    State.lastMessages,
                    State.activeChatUser
                );
            }
        }
    );
    if (!globalMessageListenerInitialized) {
    window.addEventListener(
        "global-message",

        (event) => {

            const message =
    event.detail;

if (
    State.chatUsersList.length === 0 &&
    hasConversationList()
) {

    ensureChatUsersList()
        .then(() => {

            updateConversationOrder(
                message
            );
        });

} else {

    updateConversationOrder(
        message
    );
    }
            // إذا المحادثة مفتوحة
            if (
                hasConversationList() &&
                State.activeChatUser &&
                String(
                    State.activeChatUser.id
                ) ===
                String(message.sender_id)
            ) {

                State.lastMessages = [

                    ...State.lastMessages,

                    message
                ];

                renderMessages(
                    State.lastMessages,
                    State.activeChatUser
                );

                socket.emit(
                    "messages_seen",
                    {
                        senderId:
                            message.sender_id
                    }
                );

                clearChatUnread(message.sender_id);
            }
        }
    );
        globalMessageListenerInitialized = true;
    }

    socket.off("messages_seen");

    socket.on(
        "messages_seen",

        () => {

            console.log(
                "MESSAGES SEEN EVENT"
            );

            State.lastMessages =
                State.lastMessages.map(
                    (m) => ({
                        ...m,
                        seen: true
                    })
                );

            if (State.activeChatUser) {

                renderMessages(
                    State.lastMessages,
                    State.activeChatUser
                );
            }
        }
    );

    if (!State.currentUser) return;
    // ── Tab switching ────────────────────────────────────────────────────────────
    $$(".cm-tab").forEach((tab) => {
        tab.addEventListener("click", () => switchTab(tab.dataset.tab));
    });

    // ── Members tab init ─────────────────────────────────────────────────────────
    loadMembers();
    const openChatUser = localStorage.getItem("openChatUser");

    if (openChatUser) {
        localStorage.removeItem("openChatUser");

        openRequestedChat(openChatUser);
    }

    // Live search with debounce
    let searchTimer;
    $("#cm-members-search").addEventListener("input", (e) => {
        clearTimeout(searchTimer);
        searchTimer = setTimeout(() => handleMemberSearch(e.target.value), 300);
    });

    // ── Grid delegation (friend toggle, chat open, card click) ───────────────────
    $("#cm-members-grid").addEventListener("click", (e) => {
        // Intercept action buttons first so they don't bubble to card
        const friendBtn = e.target.closest("[data-action='friend']");
        const chatBtn = e.target.closest("[data-action='chat']");
        const card = e.target.closest(".cm-user-card");

        if (friendBtn) {
            e.stopPropagation();
            handleFriendToggle(friendBtn);
            return;
        }

        if (chatBtn) {
            e.stopPropagation();
            switchTab("chat");
            openChatWithUser({
                id: chatBtn.dataset.userId,
                username: chatBtn.dataset.username,
                profile_image: chatBtn.dataset.avatar,
            });
            return;
        }

        if (card) {
            openProfileModal(card.dataset.userId);
        }
    });

    // Keyboard accessibility on cards
    $("#cm-members-grid").addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            const card = e.target.closest(".cm-user-card");
            if (card) {
                e.preventDefault();
                openProfileModal(card.dataset.userId);
            }
        }
    });

    // ── Profile modal delegation ─────────────────────────────────────────────────
    $("#cm-profile-modal").addEventListener("click", (e) => {
        // Close on backdrop click
        if (e.target === $("#cm-profile-modal")) {
            closeProfileModal();
            return;
        }
        if (e.target.closest("[data-action='close-modal']")) {
            closeProfileModal();
            return;
        }
        const friendBtn = e.target.closest("[data-action='modal-friend']");
        const chatBtn = e.target.closest("[data-action='modal-chat']");

        if (friendBtn) handleFriendToggle(friendBtn);
        if (chatBtn) {
            closeProfileModal();
            switchTab("chat");
            openChatWithUser({
                id: chatBtn.dataset.userId,
                username: chatBtn.dataset.username,
                profile_image: chatBtn.dataset.avatar,
            });
        }
    });

    // ESC closes modal
    let escListenerAdded = false;
    if (!escListenerAdded) {
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape") {
                closeProfileModal();
            }
        });

        escListenerAdded = true;
    }

    // ── Chat sidebar delegation ──────────────────────────────────────────────────
    $("#cm-conv-list").addEventListener("click", (e) => {
        const item = e.target.closest(".cm-conv-item");
        if (!item) return;
        openChatWithUser({
            id: item.dataset.userId,
            username: item.dataset.username,
            profile_image: item.dataset.avatar,
        });
    });

    // Chat sidebar search
    let chatSearchTimer;
    $("#cm-chat-search").addEventListener("input", (e) => {
        clearTimeout(chatSearchTimer);
        chatSearchTimer = setTimeout(() => filterConvList(e.target.value), 250);
    });
}

// ─── Tab Logic ─────────────────────────────────────────────────────────────────

function switchTab(tabName) {
    State.activeTab = tabName;

    $$(".cm-tab").forEach((t) => {
        const isActive = t.dataset.tab === tabName;
        t.classList.toggle("active", isActive);
        t.setAttribute("aria-selected", isActive);
    });

    $$(".cm-panel").forEach((p) => {
        p.classList.toggle("active", p.id === `panel-${tabName}`);
    });

    if (tabName === "chat") {
        if (State.chatUsersList.length === 0) {
            ensureChatUsersList();
        } else {
            syncChatUsersUnread();
            renderConvList(State.chatUsersList);
        }
    }
}

// ─── Members ───────────────────────────────────────────────────────────────────

async function loadMembers() {
    const grid = $("#cm-members-grid");
    grid.innerHTML = buildLoadingState("Loading members…");

    try {
        const users = await getUsers();
        // Exclude current user
        State.allUsers = users.filter(
            (u) => String(u.id) !== String(State.currentUser?.id),
        );
        renderMembersGrid(State.allUsers);
    } catch (err) {
        grid.innerHTML = buildErrorState(err.message || "Failed to load members.");
    }
}

function renderMembersGrid(users) {
    const grid = $("#cm-members-grid");
    const count = $("#cm-members-count");

    if (users.length === 0) {
        grid.innerHTML = buildEmptyState("No members found.");
        count.textContent = "";
        return;
    }

    grid.innerHTML = users.map(buildUserCard).join("");
    count.textContent = `${users.length} gamer${users.length !== 1 ? "s" : ""}`;
}

async function handleMemberSearch(query) {
    const grid = $("#cm-members-grid");

    if (!query.trim()) {
        renderMembersGrid(State.allUsers);
        return;
    }

    grid.innerHTML = buildLoadingState("Searching…");

    try {
        const results = await searchUsers(query);
        const filtered = results.filter(
            (u) => String(u.id) !== String(State.currentUser?.id),
        );
        renderMembersGrid(filtered);
    } catch {
        // Fallback: client-side filter if API search fails
        const q = query.toLowerCase();
        const fallback = State.allUsers.filter((u) =>
            (u.username || "").toLowerCase().includes(q),
        );
        renderMembersGrid(fallback);
    }
}

// ─── Friend Toggle ─────────────────────────────────────────────────────────────

async function handleFriendToggle(btn) {
    const userId = btn.dataset.userId;
    const isFriend = btn.dataset.isFriend === "true";

    // Optimistic update
    applyFriendState(btn, !isFriend);

    try {
        const res = await toggleFriend(userId);
        applyFriendState(btn, res.is_friend);
    } catch {
        // Revert on failure
        applyFriendState(btn, isFriend);
    }
}

function applyFriendState(btn, isFriend) {
    const userId = btn.dataset.userId;

    // تحديث الـ state
    const user = State.allUsers.find((u) => String(u.id) === String(userId));

    if (user) {
        user.is_friend = isFriend;
    }

    // تحديث كل الأزرار لنفس المستخدم
    const allButtons = document.querySelectorAll(`[data-user-id="${userId}"]`);

    allButtons.forEach((button) => {
        if (
            button.dataset.action === "friend" ||
            button.dataset.action === "modal-friend"
        ) {
            button.dataset.isFriend = isFriend;

            button.className = `cm-btn cm-btn-friend ${isFriend ? "cm-btn--danger" : "cm-btn--ghost"
                }`;

            button.innerHTML = friendBtnContent(isFriend);
        }
    });
}
// ─── Profile Modal ─────────────────────────────────────────────────────────────

async function openProfileModal(userId) {
    const overlay = $("#cm-profile-modal");
    const panel = $("#cm-modal-panel");

    panel.innerHTML = buildLoadingState("Loading profile…");
    overlay.classList.add("open");
    document.body.style.overflow = "hidden";
    overlay.onclick = (event) => {
        const closeBtn = event.target.closest('[data-action="close-modal"]');

        if (closeBtn || event.target === overlay) {
            closeProfileModal();
        }
    };

    try {
        const [profile, posts] = await Promise.all([
            getProfile(userId),
            getUserPosts(userId),
        ]);
        panel.innerHTML = buildProfileModalContent(profile, posts);
    } catch (err) {
        panel.innerHTML = `
      close" data-action="close-modal" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6"<button class="cm-modal- x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      ${buildErrorState(err.message)}
    `;
    }
}

function buildProfileModalContent(user, posts) {
    const originalUser = State.allUsers.find(
        (u) => String(u.id) === String(user.id),
    );
    const isFriend = originalUser?.is_friend || false;
    const postsHtml = posts.length
        ? posts.map((p) => buildPostCard(p, user)).join("")
        : `<div class="cm-state" style="padding:32px 0;"><p>No posts yet.</p></div>`;

    return `
    <div class="cm-modal-cover">
      ${coverImg(user.cover_image, "cm-modal-cover-img", "cm-modal-cover-fallback")}
      <button class="cm-modal-close" data-action="close-modal" aria-label="Close modal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
    </div>

    <div class="cm-modal-avatar-wrap">
      ${avatarImg(user.profile_image, user.username, "cm-modal-avatar", "cm-modal-avatar-fallback")}
      <div class="cm-modal-header-actions">
        <button
          class="cm-btn cm-btn-friend ${isFriend ? "cm-btn--danger" : "cm-btn--ghost"}"
          data-action="modal-friend"
          data-user-id="${user.id}"
          data-is-friend="${isFriend}"
        >
          ${friendBtnContent(isFriend)}
        </button>
        <button
          class="cm-btn cm-btn--primary"
          data-action="modal-chat"
          data-user-id="${user.id}"
          data-username="${escHtml(user.username)}"
          data-avatar="${escHtml(user.profile_image || "")}"
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          Chat
        </button>
      </div>
    </div>

    <div class="cm-modal-info">
      <h2 class="cm-modal-username" id="cm-modal-username">${escHtml(user.username)}</h2>
      <p class="cm-modal-bio">${escHtml(user.bio || "This gamer has no bio yet.")}</p>
    </div>

    <div class="cm-modal-posts">
      <p class="cm-modal-posts-title">Posts</p>
      <div class="cm-posts-list">${postsHtml}</div>
    </div>
  `;
}

function closeProfileModal() {
    const overlay = $("#cm-profile-modal");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
}

// ─── Chat ──────────────────────────────────────────────────────────────────────

async function ensureChatUsersList() {
    if (State.chatUsersList.length > 0) {
        return State.chatUsersList;
    }

    if (!chatUsersListPromise) {
        chatUsersListPromise = loadChatUsersList()
            .finally(() => {
                chatUsersListPromise = null;
            });
    }

    return chatUsersListPromise;
}

async function openRequestedChat(userId) {
    switchTab("chat");

    await ensureChatUsersList();

    const user = State.chatUsersList.find(
        (u) => String(u.id) === String(userId),
    );

    if (user) {
        await openChatWithUser(user);
    }
}

async function loadChatUsersList() {
    const listEl = $("#cm-conv-list");

    if (!listEl) {
        return [];
    }
    listEl.innerHTML = buildLoadingState("Loading users…");

    try {
        const users = await getUsers();
        State.chatUsersList = users
            .filter(
                (u) =>
                    String(u.id) !==
                    String(State.currentUser?.id)
            )
            .map((u) => ({

                ...u,

                unread_count: getUserUnreadCount(u.id),

                last_message: ""
            }));
        window.chatUsersLoaded = true;
        renderConvList(State.chatUsersList);
        return State.chatUsersList;
    } catch (err) {
        listEl.innerHTML = buildErrorState(err.message);
        return [];
    }
}

function renderConvList(users) {

    users = [...users];

    users.sort((a, b) => {

        return (
            Number(b.unread_count || 0) -
            Number(a.unread_count || 0)
        );
    });

    const listEl = $("#cm-conv-list");

    if (!listEl) {
        return;
    }
    

    if (users.length === 0) {

        listEl.innerHTML =
            buildEmptyState(
                "No users found."
            );

        return;
    }
    console.log(
        "RENDER ORDER:",
        users.map(u => ({
            name: u.username,
            unread: u.unread_count
        }))
    );
    listEl.innerHTML =
        users.map(
            buildConvItem
        ).join("");

    if (State.activeChatUser) {

        const active =
            listEl.querySelector(
                `[data-user-id="${State.activeChatUser.id}"]`
            );

        if (active) {
            active.classList.add("active");
        }
    }
}

function filterConvList(query) {
    const q = query.toLowerCase().trim();
    const filtered = q
        ? State.chatUsersList.filter((u) => u.username.toLowerCase().includes(q))
        : State.chatUsersList;
    renderConvList(filtered);
}

async function openChatWithUser(user) {

    State.activeChatUser = user;
    clearChatUnread(user.id);

    State.chatUsersList =
        State.chatUsersList.map(
            (u) => {

                if (
                    String(u.id) ===
                    String(user.id)
                ) {

                    return {

                        ...u,

                        unread_count: 0
                    };
                }

                return u;
            }
        );

    renderConvList(
        State.chatUsersList
    );
    // Mark active in sidebar
    $$(".cm-conv-item").forEach((el) => {
        el.classList.toggle("active", el.dataset.userId === String(user.id));
    });

    // Render chat UI
    renderChatMainArea(user);

    // Load messages
    $("#cm-messages-area").innerHTML = buildLoadingState(
        "Loading conversation...",
    );
    await refreshMessages();
    socket.emit(
        "messages_seen",
        {
            senderId: user.id
        }
    );
    await fetch(
        `${API_BASE_URL}/api/messages/seen/${user.id}`,
        {
            method: "PATCH",

            headers: {
                Authorization:
                    `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
}

function renderChatMainArea(user) {
    const main = $("#cm-chat-main");
    main.innerHTML = `
    <!-- Topbar -->
    <div class="cm-chat-topbar">
      ${avatarImg(user.profile_image, user.username, "cm-chat-topbar-avatar", "cm-chat-topbar-avatar", 36)}
      <div>
        <div class="cm-chat-topbar-name">${escHtml(user.username)}</div>
        <div class="cm-chat-topbar-status">
         ${(window.onlineUsers || []).includes(String(user.id)) ? "Online" : "Offline"
        }        
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div class="cm-messages" id="cm-messages-area"></div>

    <!-- Input bar -->
    <div class="cm-chat-input-bar">
      <input
        id="cm-chat-input"
        class="cm-chat-input"
        type="text"
        placeholder="Type a message…"
        autocomplete="off"
      />
      <button class="cm-send-btn" id="cm-send-btn" aria-label="Send message">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  `;

    // Wire up send
    const input = $("#cm-chat-input");
    const sendBtn = $("#cm-send-btn");

    sendBtn.addEventListener("click", () => handleSend(user));
    input.addEventListener("keydown", (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend(user);
        }
    });
}

async function refreshMessages() {
    if (!State.activeChatUser) return;
    try {
        const messages = await getConversation(State.activeChatUser.id);
        State.lastMessages = messages;
        renderMessages(messages, State.activeChatUser);
    } catch {
        // Non-fatal: keep last known messages
    }
}

function renderMessages(messages, partnerUser) {
    const area = $("#cm-messages-area");
    if (!area) return;

    if (!messages || messages.length === 0) {
        area.innerHTML = `
      <div class="cm-chat-empty" style="flex:1;">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        <div class="cm-chat-empty-title">No messages yet</div>
        <p>Send the first message!</p>
      </div>
    `;
        return;
    }

    // Only re-render if content changed (avoid scroll jump on polling)
    const newHtml = messages
        .map((m) => buildMessageBubble(m, State.currentUser?.id, partnerUser))
        .join("");

    // لا تعيد الرسم إذا المحتوى نفسه
    if (area.innerHTML === newHtml) {
        return;
    }

    const wasAtBottom =
        area.scrollHeight - area.clientHeight - area.scrollTop < 60;

    area.innerHTML = newHtml;

    if (wasAtBottom) {
        area.scrollTop = area.scrollHeight;
    }
}

async function handleSend(user) {
    const input = $("#cm-chat-input");
    if (!input) return;

    const text = input.value.trim();
    if (!text) return;

    input.value = "";
    const area = $("#cm-messages-area");

    if (area) {
        area.scrollTop = area.scrollHeight;
    }
    input.focus();

    // Optimistic render
    const optimistic = {

        sender_id: State.currentUser?.id,

        receiver_id: user.id,

        message: text,

        created_at: new Date().toISOString(),
    };

    State.lastMessages = [...State.lastMessages, optimistic];
    renderMessages(State.lastMessages, user);

    try {
        const savedMessage = await sendMessage(user.id, text);

        socket.emit("send_message", {
            receiverId: user.id,
            messageData: savedMessage,
        });
        updateConversationOrder(
            savedMessage
        );
        // Next poll will sync from server
    } catch (err) {
        // Remove optimistic message on failure
        State.lastMessages = State.lastMessages.filter((m) => m !== optimistic);
        renderMessages(State.lastMessages, user);
        console.error("[Chat] Send failed:", err.message);
    }

}
function updateConversationOrder(
    message
) {

    const otherUserId =

        String(message.sender_id) ===
            String(State.currentUser.id)

            ? String(message.receiver_id)

            : String(message.sender_id);
    console.log({
        currentUser:
            State.currentUser.id,

        sender:
            message.sender_id,

        receiver:
            message.receiver_id,

        otherUserId
    });

    const user =
        State.chatUsersList.find(
            (u) =>
                String(u.id) === otherUserId
        );

    if (!user) return;
    const updatedUser = {

        ...user
    };

    // update preview
    updatedUser.last_message =
        message.message;

    const isCurrentChatOpen =

        State.activeChatUser &&

        String(State.activeChatUser.id) ===
        otherUserId;

    if (!isCurrentChatOpen) {
        console.log(
        "UNREAD MAP:",
        window.globalUnreadMap,
        "OTHER:",
        otherUserId
    );

    updatedUser.unread_count = getUserUnreadCount(otherUserId);

console.log(
    "SETTING UNREAD:",
    otherUserId,
    updatedUser.unread_count
);
}

    const updatedUsers = [

        updatedUser,

        ...State.chatUsersList.filter(
            (u) =>
                String(u.id) !== otherUserId
        ),
    ];


    State.chatUsersList = [...updatedUsers];
    console.log(
        "UPDATED LIST:",
        State.chatUsersList
    );
    renderConvList(
        State.chatUsersList
    );
    console.log(
        "AFTER UPDATE:",
        State.chatUsersList
    );
}

