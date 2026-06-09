import { socket } from "./socket.js";
import {
    addUnreadChatMessage,
    ensureUnreadMap,
    notifyChatUnreadChanged
} from "./chatNotifications.js";

export const onlineUsers = [];

export function initRealtime(user) {

    if (!user) return;

    ensureUnreadMap();
    notifyChatUnreadChanged();

    // register user
    if (socket.connected) {

        socket.emit(
            "register_user",
            user.id
        );
    }

    socket.off("connect");

    socket.on(
        "connect",

        () => {

            socket.emit(
                "register_user",
                user.id
            );
        }
    );

    // online users
    socket.off("online_users");

    socket.on(
        "online_users",

        (users) => {

            console.log(
                "GLOBAL ONLINE USERS:",
                users
            );

            window.onlineUsers = users;

            window.dispatchEvent(
                new CustomEvent(
                    "online-users-updated",
                    {
                        detail: users
                    }
                )
            );
        }
    );

    // global messages
    socket.off("receive_message");

    socket.on(
        "receive_message",

        (message) => {

            console.log(
                "GLOBAL MESSAGE:",
                message
            );

            addUnreadChatMessage(message, user);

            // dispatch global event
            window.dispatchEvent(
                new CustomEvent(
                    "global-message",
                    {
                        detail: message
                    }
                )
            );
        }
    );

    // seen event
    socket.off("messages_seen");

    socket.on(
        "messages_seen",

        () => {

            console.log(
                "GLOBAL SEEN EVENT"
            );

            window.dispatchEvent(
                new CustomEvent(
                    "global-messages-seen"
                )
            );
        }
    );
}

