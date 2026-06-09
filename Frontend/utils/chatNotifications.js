const UNREAD_STORAGE_PREFIX = "jgamerz_chat_unread";

function getUnreadStorageKey() {
    try {
        const user = JSON.parse(localStorage.getItem("user") || "null");

        return user?.id
            ? `${UNREAD_STORAGE_PREFIX}:${user.id}`
            : UNREAD_STORAGE_PREFIX;
    } catch {
        return UNREAD_STORAGE_PREFIX;
    }
}

function loadUnreadMap(storageKey) {
    try {
        const stored = JSON.parse(localStorage.getItem(storageKey) || "{}");

        if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
            return {};
        }

        return Object.fromEntries(
            Object.entries(stored)
                .map(([userId, count]) => [String(userId), Number(count) || 0])
                .filter(([, count]) => count > 0)
        );
    } catch {
        return {};
    }
}

function persistUnreadMap(unreadMap) {
    try {
        localStorage.setItem(getUnreadStorageKey(), JSON.stringify(unreadMap));
    } catch {
        // Keep realtime unread state in memory if storage is unavailable.
    }
}

export function ensureUnreadMap() {
    const storageKey = getUnreadStorageKey();

    if (
        !window.globalUnreadMap ||
        window.globalUnreadMapStorageKey !== storageKey
    ) {
        window.globalUnreadMap = loadUnreadMap(storageKey);
        window.globalUnreadMapStorageKey = storageKey;
    }

    return window.globalUnreadMap;
}

export function getChatUnreadCount() {
    const unreadMap = ensureUnreadMap();

    return Object.values(unreadMap).reduce(
        (total, count) => total + (Number(count) || 0),
        0
    );
}

export function notifyChatUnreadChanged() {
    window.dispatchEvent(
        new CustomEvent("chat-unread-updated", {
            detail: {
                count: getChatUnreadCount(),
            },
        })
    );
}

export function addUnreadChatMessage(message, currentUser) {
    const senderId = String(message?.sender_id || "");
    const currentUserId = String(currentUser?.id || "");

    if (!senderId || senderId === currentUserId) return;
    //if (window.currentPage === "community") return;

    const unreadMap = ensureUnreadMap();
    unreadMap[senderId] = (Number(unreadMap[senderId]) || 0) + 1;

    persistUnreadMap(unreadMap);
    notifyChatUnreadChanged();
}

export function clearChatUnread(userId) {
    const unreadMap = ensureUnreadMap();

    if (userId) {
        delete unreadMap[String(userId)];
    } else {
        Object.keys(unreadMap).forEach((key) => delete unreadMap[key]);
    }

    persistUnreadMap(unreadMap);
    notifyChatUnreadChanged();
}
